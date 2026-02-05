import { Router } from 'express';
import { z } from 'zod';
import prisma from '../lib/prisma.js';
import { authenticate } from '../middleware/auth.js';
import { validate } from '../middleware/validate.js';
import type { AuthenticatedRequest } from '../types/index.js';

const router = Router();

// Validation schemas
const createTaskSchema = z.object({
  title: z.string().min(1).max(200),
  description: z.string().max(1000).optional(),
  category: z.string().max(50).optional(),
  priority: z.enum(['low', 'medium', 'high']).default('medium'),
  difficulty: z.enum(['easy', 'medium', 'hard', 'extreme']).default('medium'),
  frequency: z.enum(['daily', 'weekly', 'one-time']).default('daily'),
  dueDate: z.string().datetime().optional(),
  dueTime: z.string().regex(/^\d{2}:\d{2}$/).optional(),
  visibility: z.enum(['private', 'friends', 'squad', 'community', 'public']).default('private'),
  squadId: z.string().uuid().optional(),
  communityId: z.string().uuid().optional(),
  challengeId: z.string().uuid().optional(),
  requiresProof: z.boolean().default(false),
});

const updateTaskSchema = createTaskSchema.partial();

const completeTaskSchema = z.object({
  proofUrl: z.string().url().optional(),
  proofType: z.enum(['image', 'video', 'text']).optional(),
});

// XP multipliers by difficulty
const difficultyXp: Record<string, number> = {
  easy: 25,
  medium: 50,
  hard: 100,
  extreme: 200,
};

// GET /api/tasks - Get user's tasks
router.get('/', authenticate, async (req: AuthenticatedRequest, res, next) => {
  try {
    const { category, frequency, visibility, active } = req.query;

    const where: any = { userId: req.user!.id };

    if (category) where.category = category;
    if (frequency) where.frequency = frequency;
    if (visibility) where.visibility = visibility;
    if (active !== undefined) where.isActive = active === 'true';

    const tasks = await prisma.task.findMany({
      where,
      include: {
        squad: { select: { id: true, name: true } },
        community: { select: { id: true, name: true } },
        challenge: { select: { id: true, title: true } },
        _count: { select: { completions: true } },
      },
      orderBy: { createdAt: 'desc' },
    });

    res.json({ success: true, data: tasks });
  } catch (error) {
    next(error);
  }
});

// POST /api/tasks - Create task
router.post(
  '/',
  authenticate,
  validate(createTaskSchema),
  async (req: AuthenticatedRequest, res, next) => {
    try {
      const data = req.body;
      const baseXp = difficultyXp[data.difficulty] || 50;

      const task = await prisma.task.create({
        data: {
          ...data,
          userId: req.user!.id,
          baseXp,
          dueDate: data.dueDate ? new Date(data.dueDate) : undefined,
        },
        include: {
          squad: { select: { id: true, name: true } },
          community: { select: { id: true, name: true } },
        },
      });

      res.status(201).json({ success: true, data: task });
    } catch (error) {
      next(error);
    }
  }
);

// GET /api/tasks/:id - Get single task
router.get('/:id', authenticate, async (req: AuthenticatedRequest, res, next) => {
  try {
    const { id } = req.params;

    const task = await prisma.task.findFirst({
      where: {
        id,
        OR: [
          { userId: req.user!.id },
          { visibility: 'public' },
          {
            visibility: 'squad',
            squad: {
              members: { some: { userId: req.user!.id } },
            },
          },
          {
            visibility: 'community',
            community: {
              members: { some: { userId: req.user!.id } },
            },
          },
        ],
      },
      include: {
        squad: { select: { id: true, name: true } },
        community: { select: { id: true, name: true } },
        completions: {
          orderBy: { completedAt: 'desc' },
          take: 10,
        },
      },
    });

    if (!task) {
      res.status(404).json({ success: false, error: 'Task not found' });
      return;
    }

    res.json({ success: true, data: task });
  } catch (error) {
    next(error);
  }
});

// PATCH /api/tasks/:id - Update task
router.patch(
  '/:id',
  authenticate,
  validate(updateTaskSchema),
  async (req: AuthenticatedRequest, res, next) => {
    try {
      const { id } = req.params;

      // Check ownership
      const existing = await prisma.task.findFirst({
        where: { id, userId: req.user!.id },
      });

      if (!existing) {
        res.status(404).json({ success: false, error: 'Task not found' });
        return;
      }

      const data = req.body;
      if (data.difficulty) {
        data.baseXp = difficultyXp[data.difficulty];
      }

      const task = await prisma.task.update({
        where: { id },
        data: {
          ...data,
          dueDate: data.dueDate ? new Date(data.dueDate) : undefined,
        },
      });

      res.json({ success: true, data: task });
    } catch (error) {
      next(error);
    }
  }
);

// DELETE /api/tasks/:id - Delete task
router.delete('/:id', authenticate, async (req: AuthenticatedRequest, res, next) => {
  try {
    const { id } = req.params;

    const task = await prisma.task.findFirst({
      where: { id, userId: req.user!.id },
    });

    if (!task) {
      res.status(404).json({ success: false, error: 'Task not found' });
      return;
    }

    await prisma.task.delete({ where: { id } });

    res.json({ success: true, message: 'Task deleted' });
  } catch (error) {
    next(error);
  }
});

// POST /api/tasks/:id/complete - Complete task
router.post(
  '/:id/complete',
  authenticate,
  validate(completeTaskSchema),
  async (req: AuthenticatedRequest, res, next) => {
    try {
      const { id } = req.params;
      const { proofUrl, proofType } = req.body;

      // Get task
      const task = await prisma.task.findFirst({
        where: { id, userId: req.user!.id, isActive: true },
        include: {
          community: { select: { xpMultiplier: true } },
        },
      });

      if (!task) {
        res.status(404).json({ success: false, error: 'Task not found' });
        return;
      }

      // Check if already completed today
      const today = new Date();
      today.setHours(0, 0, 0, 0);

      const existingCompletion = await prisma.taskCompletion.findFirst({
        where: {
          taskId: id,
          completionDate: { gte: today },
        },
      });

      if (existingCompletion) {
        res.status(400).json({ success: false, error: 'Task already completed today' });
        return;
      }

      // Calculate streak
      const yesterday = new Date(today);
      yesterday.setDate(yesterday.getDate() - 1);

      const wasCompletedYesterday = task.lastCompletedDate
        ? task.lastCompletedDate >= yesterday
        : false;

      const newStreak = wasCompletedYesterday ? task.currentStreak + 1 : 1;
      const longestStreak = Math.max(task.longestStreak, newStreak);

      // Calculate XP
      const baseXp = task.baseXp;
      const streakBonus = Math.min(newStreak * 5, 100); // Max 100 bonus
      const multiplier = task.community?.xpMultiplier || 1;
      const multiplierBonus = Math.floor(baseXp * (multiplier - 1));
      const totalXp = baseXp + streakBonus + multiplierBonus;

      // Determine verification status
      const verificationStatus = task.requiresProof ? 'pending' : 'auto_verified';

      // Create completion
      const completion = await prisma.taskCompletion.create({
        data: {
          taskId: id,
          userId: req.user!.id,
          proofUrl,
          proofType,
          verificationStatus,
          xpEarned: verificationStatus === 'auto_verified' ? totalXp : 0,
          streakBonus,
          multiplierBonus,
        },
      });

      // Update task streak
      await prisma.task.update({
        where: { id },
        data: {
          currentStreak: newStreak,
          longestStreak,
          lastCompletedDate: new Date(),
        },
      });

      // If auto-verified, update user XP
      if (verificationStatus === 'auto_verified') {
        await prisma.$transaction([
          prisma.user.update({
            where: { id: req.user!.id },
            data: {
              totalXp: { increment: totalXp },
              currentStreak: { increment: newStreak > 1 ? 0 : 1 },
              lastActivityDate: new Date(),
            },
          }),
          prisma.xpTransaction.create({
            data: {
              userId: req.user!.id,
              amount: totalXp,
              source: 'task_completion',
              sourceId: completion.id,
              baseAmount: baseXp,
              streakMultiplier: newStreak,
              communityMultiplier: multiplier,
              description: `Completed: ${task.title}`,
            },
          }),
        ]);
      }

      // If requires proof, add to verification queue
      if (task.requiresProof && (task.squadId || task.communityId)) {
        await prisma.verificationQueue.create({
          data: {
            completionId: completion.id,
            squadId: task.squadId,
            communityId: task.communityId,
          },
        });
      }

      res.json({
        success: true,
        data: {
          completion,
          xpBreakdown: {
            base: baseXp,
            streakBonus,
            multiplierBonus,
            total: totalXp,
          },
          streak: newStreak,
        },
      });
    } catch (error) {
      next(error);
    }
  }
);

export default router;
