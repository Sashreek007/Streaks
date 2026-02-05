import { Router } from 'express';
import { z } from 'zod';
import crypto from 'crypto';
import prisma from '../lib/prisma.js';
import { authenticate } from '../middleware/auth.js';
import { validate } from '../middleware/validate.js';
import { encrypt } from '../lib/encryption.js';
import type { AuthenticatedRequest } from '../types/index.js';

const router = Router();

const createSquadSchema = z.object({
  name: z.string().min(1).max(100),
  description: z.string().max(500).optional(),
  verificationMode: z.enum(['manual', 'ai', 'hybrid']).default('manual'),
});

const updateSquadSchema = createSquadSchema.partial();

const aiSettingsSchema = z.object({
  provider: z.enum(['openai', 'anthropic', 'google']),
  apiKey: z.string().min(1),
  model: z.string().optional(),
  verificationPrompt: z.string().optional(),
  confidenceThreshold: z.number().min(0).max(1).default(0.7),
});

// Generate random invite code
function generateInviteCode(): string {
  return crypto.randomBytes(6).toString('base64url');
}

// GET /api/squads - Get user's squads
router.get('/', authenticate, async (req: AuthenticatedRequest, res, next) => {
  try {
    const memberships = await prisma.squadMember.findMany({
      where: { userId: req.user!.id },
      include: {
        squad: {
          include: {
            owner: {
              select: { id: true, username: true, displayName: true, avatarUrl: true },
            },
            _count: { select: { members: true } },
          },
        },
      },
    });

    const squads = memberships.map((m) => ({
      ...m.squad,
      memberCount: m.squad._count.members,
      role: m.role,
      joinedAt: m.joinedAt,
    }));

    res.json({ success: true, data: squads });
  } catch (error) {
    next(error);
  }
});

// POST /api/squads - Create squad
router.post(
  '/',
  authenticate,
  validate(createSquadSchema),
  async (req: AuthenticatedRequest, res, next) => {
    try {
      const { name, description, verificationMode } = req.body;
      const userId = req.user!.id;

      const squad = await prisma.squad.create({
        data: {
          name,
          description,
          verificationMode,
          ownerId: userId,
          inviteCode: generateInviteCode(),
          members: {
            create: { userId, role: 'owner' },
          },
        },
        include: {
          owner: { select: { id: true, username: true, displayName: true } },
        },
      });

      res.status(201).json({ success: true, data: squad });
    } catch (error) {
      next(error);
    }
  }
);

// GET /api/squads/:id - Get squad details
router.get('/:id', authenticate, async (req: AuthenticatedRequest, res, next) => {
  try {
    const { id } = req.params;
    const userId = req.user!.id;

    const squad = await prisma.squad.findUnique({
      where: { id },
      include: {
        owner: { select: { id: true, username: true, displayName: true, avatarUrl: true } },
        members: {
          include: {
            user: {
              select: {
                id: true,
                username: true,
                displayName: true,
                avatarUrl: true,
                currentStreak: true,
                totalXp: true,
              },
            },
          },
          orderBy: { user: { totalXp: 'desc' } },
        },
      },
    });

    if (!squad) {
      res.status(404).json({ success: false, error: 'Squad not found' });
      return;
    }

    // Check if user is member
    const isMember = squad.members.some((m) => m.userId === userId);

    if (!isMember) {
      res.status(403).json({ success: false, error: 'Not a member' });
      return;
    }

    res.json({ success: true, data: squad });
  } catch (error) {
    next(error);
  }
});

// PATCH /api/squads/:id - Update squad (owner/admin only)
router.patch(
  '/:id',
  authenticate,
  validate(updateSquadSchema),
  async (req: AuthenticatedRequest, res, next) => {
    try {
      const { id } = req.params;
      const userId = req.user!.id;

      // Check permission
      const membership = await prisma.squadMember.findUnique({
        where: { squadId_userId: { squadId: id, userId } },
      });

      if (!membership || !['owner', 'admin'].includes(membership.role)) {
        res.status(403).json({ success: false, error: 'Permission denied' });
        return;
      }

      const squad = await prisma.squad.update({
        where: { id },
        data: req.body,
      });

      res.json({ success: true, data: squad });
    } catch (error) {
      next(error);
    }
  }
);

// POST /api/squads/:id/ai-settings - Set AI verification settings
router.post(
  '/:id/ai-settings',
  authenticate,
  validate(aiSettingsSchema),
  async (req: AuthenticatedRequest, res, next) => {
    try {
      const { id } = req.params;
      const userId = req.user!.id;
      const { provider, apiKey, model, verificationPrompt, confidenceThreshold } = req.body;

      // Check permission
      const membership = await prisma.squadMember.findUnique({
        where: { squadId_userId: { squadId: id, userId } },
      });

      if (!membership || !['owner', 'admin'].includes(membership.role)) {
        res.status(403).json({ success: false, error: 'Permission denied' });
        return;
      }

      // Encrypt API key
      const apiKeyEncrypted = encrypt(apiKey);

      const settings = await prisma.squadAiSettings.upsert({
        where: { squadId: id },
        update: {
          provider,
          apiKeyEncrypted,
          model,
          verificationPrompt,
          confidenceThreshold,
        },
        create: {
          squadId: id,
          provider,
          apiKeyEncrypted,
          model,
          verificationPrompt,
          confidenceThreshold,
        },
      });

      res.json({
        success: true,
        data: {
          ...settings,
          apiKeyEncrypted: undefined, // Don't return encrypted key
        },
      });
    } catch (error) {
      next(error);
    }
  }
);

// POST /api/squads/join/:code - Join squad by invite code
router.post('/join/:code', authenticate, async (req: AuthenticatedRequest, res, next) => {
  try {
    const { code } = req.params;
    const userId = req.user!.id;

    const squad = await prisma.squad.findUnique({
      where: { inviteCode: code },
    });

    if (!squad) {
      res.status(404).json({ success: false, error: 'Invalid invite code' });
      return;
    }

    // Check if already member
    const existing = await prisma.squadMember.findUnique({
      where: { squadId_userId: { squadId: squad.id, userId } },
    });

    if (existing) {
      res.status(400).json({ success: false, error: 'Already a member' });
      return;
    }

    // Join squad
    await prisma.squadMember.create({
      data: { squadId: squad.id, userId, role: 'member' },
    });

    // Update member count
    await prisma.squad.update({
      where: { id: squad.id },
      data: { memberCount: { increment: 1 } },
    });

    res.json({ success: true, data: squad });
  } catch (error) {
    next(error);
  }
});

// DELETE /api/squads/:id/leave - Leave squad
router.delete('/:id/leave', authenticate, async (req: AuthenticatedRequest, res, next) => {
  try {
    const { id } = req.params;
    const userId = req.user!.id;

    const membership = await prisma.squadMember.findUnique({
      where: { squadId_userId: { squadId: id, userId } },
    });

    if (!membership) {
      res.status(404).json({ success: false, error: 'Not a member' });
      return;
    }

    if (membership.role === 'owner') {
      res.status(400).json({ success: false, error: 'Owner cannot leave. Transfer ownership first.' });
      return;
    }

    await prisma.squadMember.delete({
      where: { squadId_userId: { squadId: id, userId } },
    });

    await prisma.squad.update({
      where: { id },
      data: { memberCount: { decrement: 1 } },
    });

    res.json({ success: true, message: 'Left squad' });
  } catch (error) {
    next(error);
  }
});

// POST /api/squads/:id/regenerate-invite - Regenerate invite code
router.post('/:id/regenerate-invite', authenticate, async (req: AuthenticatedRequest, res, next) => {
  try {
    const { id } = req.params;
    const userId = req.user!.id;

    const membership = await prisma.squadMember.findUnique({
      where: { squadId_userId: { squadId: id, userId } },
    });

    if (!membership || !['owner', 'admin'].includes(membership.role)) {
      res.status(403).json({ success: false, error: 'Permission denied' });
      return;
    }

    const squad = await prisma.squad.update({
      where: { id },
      data: { inviteCode: generateInviteCode() },
    });

    res.json({ success: true, data: { inviteCode: squad.inviteCode } });
  } catch (error) {
    next(error);
  }
});

export default router;
