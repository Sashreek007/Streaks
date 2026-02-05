import { Router } from 'express';
import prisma from '../lib/prisma.js';
import { authenticate } from '../middleware/auth.js';
import { decrypt } from '../lib/encryption.js';
import type { AuthenticatedRequest } from '../types/index.js';

const router = Router();

// GET /api/verification/queue - Get verification queue for squads/communities user moderates
router.get('/queue', authenticate, async (req: AuthenticatedRequest, res, next) => {
  try {
    const userId = req.user!.id;

    // Get squads/communities where user is mod+
    const [squadMemberships, communityMemberships] = await Promise.all([
      prisma.squadMember.findMany({
        where: {
          userId,
          role: { in: ['owner', 'admin', 'moderator'] },
        },
        select: { squadId: true },
      }),
      prisma.communityMember.findMany({
        where: {
          userId,
          role: { in: ['owner', 'admin', 'moderator'] },
        },
        select: { communityId: true },
      }),
    ]);

    const squadIds = squadMemberships.map((m) => m.squadId);
    const communityIds = communityMemberships.map((m) => m.communityId);

    const queue = await prisma.verificationQueue.findMany({
      where: {
        status: 'pending',
        OR: [
          { squadId: { in: squadIds } },
          { communityId: { in: communityIds } },
        ],
      },
      include: {
        completion: {
          include: {
            task: true,
            user: true,
          },
        },
        squad: true,
        community: true,
      },
      orderBy: [{ priority: 'desc' }, { createdAt: 'asc' }],
    });

    res.json({ success: true, data: queue });
  } catch (error) {
    next(error);
  }
});

// POST /api/verification/:id/approve - Approve verification
router.post('/:id/approve', authenticate, async (req: AuthenticatedRequest, res, next) => {
  try {
    const id = req.params.id as string;
    const userId = req.user!.id;

    const queueItem = await prisma.verificationQueue.findUnique({
      where: { id },
      include: {
        completion: {
          include: {
            task: true,
          },
        },
        squad: true,
        community: true,
      },
    });

    if (!queueItem) {
      res.status(404).json({ success: false, error: 'Not found' });
      return;
    }

    // Check permission
    const hasPermission = await checkVerificationPermission(
      userId,
      queueItem.squadId,
      queueItem.communityId
    );

    if (!hasPermission) {
      res.status(403).json({ success: false, error: 'Permission denied' });
      return;
    }

    // Calculate XP
    const baseXp = queueItem.completion.task.baseXp;
    const multiplier = queueItem.community?.xpMultiplier || 1;
    const totalXp = Math.floor(baseXp * multiplier) + queueItem.completion.streakBonus;

    // Update completion and user in transaction
    await prisma.$transaction([
      prisma.taskCompletion.update({
        where: { id: queueItem.completionId },
        data: {
          verificationStatus: 'verified',
          verifiedById: userId,
          verifiedAt: new Date(),
          xpEarned: totalXp,
        },
      }),
      prisma.verificationQueue.update({
        where: { id },
        data: { status: 'verified' },
      }),
      prisma.user.update({
        where: { id: queueItem.completion.userId },
        data: {
          totalXp: { increment: totalXp },
          lastActivityDate: new Date(),
        },
      }),
      prisma.xpTransaction.create({
        data: {
          userId: queueItem.completion.userId,
          amount: totalXp,
          source: 'task_completion',
          sourceId: queueItem.completionId,
          baseAmount: baseXp,
          communityMultiplier: multiplier,
          description: 'Task verified',
        },
      }),
      prisma.notification.create({
        data: {
          userId: queueItem.completion.userId,
          type: 'task_verified',
          title: 'Task Verified!',
          body: `Your task was verified. +${totalXp} XP`,
          referenceType: 'task_completion',
          referenceId: queueItem.completionId,
        },
      }),
    ]);

    res.json({ success: true, message: 'Approved' });
  } catch (error) {
    next(error);
  }
});

// POST /api/verification/:id/reject - Reject verification
router.post('/:id/reject', authenticate, async (req: AuthenticatedRequest, res, next) => {
  try {
    const id = req.params.id as string;
    const { reason } = req.body;
    const userId = req.user!.id;

    const queueItem = await prisma.verificationQueue.findUnique({
      where: { id },
      include: {
        completion: true,
      },
    });

    if (!queueItem) {
      res.status(404).json({ success: false, error: 'Not found' });
      return;
    }

    const hasPermission = await checkVerificationPermission(
      userId,
      queueItem.squadId,
      queueItem.communityId
    );

    if (!hasPermission) {
      res.status(403).json({ success: false, error: 'Permission denied' });
      return;
    }

    await prisma.$transaction([
      prisma.taskCompletion.update({
        where: { id: queueItem.completionId },
        data: {
          verificationStatus: 'rejected',
          verifiedById: userId,
          verifiedAt: new Date(),
          rejectionReason: reason,
        },
      }),
      prisma.verificationQueue.update({
        where: { id },
        data: { status: 'rejected' },
      }),
      prisma.notification.create({
        data: {
          userId: queueItem.completion.userId,
          type: 'task_rejected',
          title: 'Task Not Verified',
          body: reason || 'Your task submission was not verified',
          referenceType: 'task_completion',
          referenceId: queueItem.completionId,
        },
      }),
    ]);

    res.json({ success: true, message: 'Rejected' });
  } catch (error) {
    next(error);
  }
});

// POST /api/verification/:id/ai-verify - Run AI verification
router.post('/:id/ai-verify', authenticate, async (req: AuthenticatedRequest, res, next) => {
  try {
    const id = req.params.id as string;
    const userId = req.user!.id;

    const queueItem = await prisma.verificationQueue.findUnique({
      where: { id },
      include: {
        completion: {
          include: {
            task: true,
          },
        },
        squad: {
          include: { aiSettings: true },
        },
        community: {
          include: { aiSettings: true },
        },
      },
    });

    if (!queueItem) {
      res.status(404).json({ success: false, error: 'Not found' });
      return;
    }

    const hasPermission = await checkVerificationPermission(
      userId,
      queueItem.squadId,
      queueItem.communityId
    );

    if (!hasPermission) {
      res.status(403).json({ success: false, error: 'Permission denied' });
      return;
    }

    // Get AI settings
    const aiSettings = queueItem.squad?.aiSettings || queueItem.community?.aiSettings;

    if (!aiSettings) {
      res.status(400).json({ success: false, error: 'AI verification not configured' });
      return;
    }

    if (!queueItem.completion.proofUrl) {
      res.status(400).json({ success: false, error: 'No proof image provided' });
      return;
    }

    // Decrypt API key
    const apiKey = decrypt(aiSettings.apiKeyEncrypted);

    // Run AI verification based on provider
    const result = await runAIVerification(
      aiSettings.provider,
      apiKey,
      aiSettings.model,
      queueItem.completion.proofUrl,
      queueItem.completion.task.title,
      queueItem.completion.task.description || undefined,
      aiSettings.verificationPrompt || undefined
    );

    // Update with AI confidence
    await prisma.taskCompletion.update({
      where: { id: queueItem.completionId },
      data: {
        aiConfidence: result.confidence,
      },
    });

    // Auto-approve if confidence exceeds threshold
    if (result.confidence >= aiSettings.confidenceThreshold) {
      // Trigger approval flow
      const approveRes = await fetch(`${req.protocol}://${req.get('host')}/api/verification/${id}/approve`, {
        method: 'POST',
        headers: {
          Authorization: req.headers.authorization!,
          'Content-Type': 'application/json',
        },
      });

      if (approveRes.ok) {
        res.json({
          success: true,
          data: {
            confidence: result.confidence,
            autoApproved: true,
            reason: result.reason,
          },
        });
        return;
      }
    }

    res.json({
      success: true,
      data: {
        confidence: result.confidence,
        autoApproved: false,
        reason: result.reason,
        threshold: aiSettings.confidenceThreshold,
      },
    });
  } catch (error) {
    next(error);
  }
});

// Helper function to check verification permission
async function checkVerificationPermission(
  userId: string,
  squadId: string | null,
  communityId: string | null
): Promise<boolean> {
  if (squadId) {
    const membership = await prisma.squadMember.findUnique({
      where: { squadId_userId: { squadId, userId } },
    });
    return membership?.role ? ['owner', 'admin', 'moderator'].includes(membership.role) : false;
  }

  if (communityId) {
    const membership = await prisma.communityMember.findUnique({
      where: { communityId_userId: { communityId, userId } },
    });
    return membership?.role ? ['owner', 'admin', 'moderator'].includes(membership.role) : false;
  }

  return false;
}

// AI verification implementation
async function runAIVerification(
  provider: string,
  apiKey: string,
  model: string | null,
  imageUrl: string,
  taskTitle: string,
  taskDescription?: string,
  customPrompt?: string
): Promise<{ confidence: number; reason: string }> {
  const prompt = customPrompt || `
    You are verifying if a user completed a task.
    Task: ${taskTitle}
    ${taskDescription ? `Description: ${taskDescription}` : ''}

    Analyze the provided image and determine if it shows evidence of completing this task.

    Respond with a JSON object containing:
    - confidence: a number between 0 and 1 indicating how confident you are that the task was completed
    - reason: a brief explanation of your assessment
  `;

  try {
    if (provider === 'openai') {
      const { default: OpenAI } = await import('openai');
      const openai = new OpenAI({ apiKey });

      const response = await openai.chat.completions.create({
        model: model || 'gpt-4o',
        messages: [
          {
            role: 'user',
            content: [
              { type: 'text', text: prompt },
              { type: 'image_url', image_url: { url: imageUrl } },
            ],
          },
        ],
        max_tokens: 300,
      });

      const content = response.choices[0]?.message?.content || '';
      const jsonMatch = content.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        return JSON.parse(jsonMatch[0]);
      }
    } else if (provider === 'anthropic') {
      const { default: Anthropic } = await import('@anthropic-ai/sdk');
      const anthropic = new Anthropic({ apiKey });

      // Fetch image and convert to base64
      const imageResponse = await fetch(imageUrl);
      const imageBuffer = await imageResponse.arrayBuffer();
      const base64Image = Buffer.from(imageBuffer).toString('base64');
      const mediaType = imageResponse.headers.get('content-type') || 'image/jpeg';

      const response = await anthropic.messages.create({
        model: model || 'claude-sonnet-4-20250514',
        max_tokens: 300,
        messages: [
          {
            role: 'user',
            content: [
              {
                type: 'image',
                source: {
                  type: 'base64',
                  media_type: mediaType as 'image/jpeg' | 'image/png' | 'image/gif' | 'image/webp',
                  data: base64Image,
                },
              },
              { type: 'text', text: prompt },
            ],
          },
        ],
      });

      const content = response.content[0];
      if (content.type === 'text') {
        const jsonMatch = content.text.match(/\{[\s\S]*\}/);
        if (jsonMatch) {
          return JSON.parse(jsonMatch[0]);
        }
      }
    } else if (provider === 'google') {
      const { GoogleGenerativeAI } = await import('@google/generative-ai');
      const genAI = new GoogleGenerativeAI(apiKey);
      const genModel = genAI.getGenerativeModel({ model: model || 'gemini-pro-vision' });

      // Fetch image
      const imageResponse = await fetch(imageUrl);
      const imageBuffer = await imageResponse.arrayBuffer();
      const base64Image = Buffer.from(imageBuffer).toString('base64');
      const mimeType = imageResponse.headers.get('content-type') || 'image/jpeg';

      const result = await genModel.generateContent([
        prompt,
        {
          inlineData: {
            mimeType,
            data: base64Image,
          },
        },
      ]);

      const content = result.response.text();
      const jsonMatch = content.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        return JSON.parse(jsonMatch[0]);
      }
    }
  } catch (error) {
    console.error('AI verification error:', error);
  }

  return { confidence: 0, reason: 'AI verification failed' };
}

export default router;
