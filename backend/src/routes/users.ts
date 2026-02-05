import { Router } from 'express';
import { z } from 'zod';
import prisma from '../lib/prisma.js';
import { authenticate } from '../middleware/auth.js';
import { validate } from '../middleware/validate.js';
import type { AuthenticatedRequest } from '../types/index.js';

const router = Router();

// Validation schemas
const updateProfileSchema = z.object({
  displayName: z.string().min(1).max(100).optional(),
  bio: z.string().max(500).optional(),
  avatarUrl: z.string().url().optional(),
});

const updateSettingsSchema = z.object({
  theme: z.enum(['dark', 'light']).optional(),
  pushEnabled: z.boolean().optional(),
  streakReminders: z.boolean().optional(),
  friendActivity: z.boolean().optional(),
  squadUpdates: z.boolean().optional(),
  communityUpdates: z.boolean().optional(),
  leaderboardChanges: z.boolean().optional(),
  emailDigest: z.boolean().optional(),
  profilePublic: z.boolean().optional(),
  showStreak: z.boolean().optional(),
  showScore: z.boolean().optional(),
  allowDms: z.boolean().optional(),
  showOnLeaderboard: z.boolean().optional(),
  reminderTime: z.string().regex(/^\d{2}:\d{2}$/).optional(),
  gracePeriodEnabled: z.boolean().optional(),
  gracePeriodHours: z.number().int().min(1).max(24).optional(),
  weekendMode: z.boolean().optional(),
});

// GET /api/users/:id - Get user profile
router.get('/:id', authenticate, async (req: AuthenticatedRequest, res, next) => {
  try {
    const { id } = req.params;
    const isOwnProfile = id === req.user!.id;

    const user = await prisma.user.findUnique({
      where: { id },
      select: {
        id: true,
        username: true,
        displayName: true,
        avatarUrl: true,
        bio: true,
        level: true,
        totalXp: true,
        currentStreak: true,
        longestStreak: true,
        createdAt: true,
        settings: {
          select: {
            profilePublic: true,
            showStreak: true,
            showScore: true,
          },
        },
        _count: {
          select: {
            tasks: true,
            squadMemberships: true,
            communityMemberships: true,
          },
        },
      },
    });

    if (!user) {
      res.status(404).json({ success: false, error: 'User not found' });
      return;
    }

    // Check privacy settings
    if (!isOwnProfile && !user.settings?.profilePublic) {
      res.status(403).json({ success: false, error: 'Profile is private' });
      return;
    }

    // Apply privacy settings
    const profile = {
      id: user.id,
      username: user.username,
      displayName: user.displayName,
      avatarUrl: user.avatarUrl,
      bio: user.bio,
      level: user.level,
      totalXp: isOwnProfile || user.settings?.showScore ? user.totalXp : null,
      currentStreak: isOwnProfile || user.settings?.showStreak ? user.currentStreak : null,
      longestStreak: isOwnProfile || user.settings?.showStreak ? user.longestStreak : null,
      createdAt: user.createdAt,
      stats: {
        tasksCompleted: user._count.tasks,
        squads: user._count.squadMemberships,
        communities: user._count.communityMemberships,
      },
    };

    res.json({ success: true, data: profile });
  } catch (error) {
    next(error);
  }
});

// PATCH /api/users/profile - Update own profile
router.patch(
  '/profile',
  authenticate,
  validate(updateProfileSchema),
  async (req: AuthenticatedRequest, res, next) => {
    try {
      const user = await prisma.user.update({
        where: { id: req.user!.id },
        data: req.body,
        select: {
          id: true,
          username: true,
          displayName: true,
          avatarUrl: true,
          bio: true,
        },
      });

      res.json({ success: true, data: user });
    } catch (error) {
      next(error);
    }
  }
);

// GET /api/users/settings - Get own settings
router.get('/settings', authenticate, async (req: AuthenticatedRequest, res, next) => {
  try {
    const settings = await prisma.userSettings.findUnique({
      where: { userId: req.user!.id },
    });

    if (!settings) {
      // Create default settings if not exist
      const newSettings = await prisma.userSettings.create({
        data: { userId: req.user!.id },
      });
      res.json({ success: true, data: newSettings });
      return;
    }

    res.json({ success: true, data: settings });
  } catch (error) {
    next(error);
  }
});

// PATCH /api/users/settings - Update settings
router.patch(
  '/settings',
  authenticate,
  validate(updateSettingsSchema),
  async (req: AuthenticatedRequest, res, next) => {
    try {
      const settings = await prisma.userSettings.upsert({
        where: { userId: req.user!.id },
        update: req.body,
        create: {
          userId: req.user!.id,
          ...req.body,
        },
      });

      res.json({ success: true, data: settings });
    } catch (error) {
      next(error);
    }
  }
);

// GET /api/users/:id/achievements - Get user achievements
router.get('/:id/achievements', authenticate, async (req, res, next) => {
  try {
    const { id } = req.params;

    const achievements = await prisma.userAchievement.findMany({
      where: { userId: id },
      include: {
        achievement: true,
      },
      orderBy: { earnedAt: 'desc' },
    });

    res.json({
      success: true,
      data: achievements.map((ua) => ({
        ...ua.achievement,
        earnedAt: ua.earnedAt,
      })),
    });
  } catch (error) {
    next(error);
  }
});

// GET /api/users/:id/activity - Get user activity
router.get('/:id/activity', authenticate, async (req, res, next) => {
  try {
    const { id } = req.params;
    const limit = parseInt(req.query.limit as string) || 20;

    const completions = await prisma.taskCompletion.findMany({
      where: {
        userId: id,
        verificationStatus: 'verified',
      },
      include: {
        task: {
          select: { title: true, category: true },
        },
      },
      orderBy: { completedAt: 'desc' },
      take: limit,
    });

    res.json({
      success: true,
      data: completions.map((c) => ({
        id: c.id,
        type: 'task_completion',
        title: c.task.title,
        category: c.task.category,
        xpEarned: c.xpEarned,
        completedAt: c.completedAt,
      })),
    });
  } catch (error) {
    next(error);
  }
});

export default router;
