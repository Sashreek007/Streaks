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

const updateUsernameSchema = z.object({
  username: z.string()
    .min(3, 'Username must be at least 3 characters')
    .max(30, 'Username must be at most 30 characters')
    .regex(/^[a-z0-9_]+$/, 'Username can only contain lowercase letters, numbers, and underscores'),
});

// GET /api/users/search - Search for users by username or display name
router.get('/search', authenticate, async (req: AuthenticatedRequest, res, next) => {
  try {
    const query = (req.query.q as string || '').trim().toLowerCase();
    const limit = parseInt(req.query.limit as string) || 20;

    if (query.length < 2) {
      res.json({ success: true, data: [] });
      return;
    }

    const users = await prisma.user.findMany({
      where: {
        AND: [
          { id: { not: req.user!.id } }, // Exclude current user
          {
            OR: [
              { username: { contains: query, mode: 'insensitive' } },
              { displayName: { contains: query, mode: 'insensitive' } },
            ],
          },
        ],
      },
      select: {
        id: true,
        username: true,
        displayName: true,
        avatarUrl: true,
        bio: true,
        level: true,
        totalXp: true,
        currentStreak: true,
        settings: {
          select: {
            profilePublic: true,
            showStreak: true,
            showScore: true,
          },
        },
      },
      take: limit,
      orderBy: { totalXp: 'desc' },
    });

    // Apply privacy settings
    const results = users.map(user => ({
      id: user.id,
      username: user.username,
      displayName: user.displayName,
      avatarUrl: user.avatarUrl,
      bio: user.bio,
      level: user.level,
      totalXp: user.settings?.showScore !== false ? user.totalXp : null,
      currentStreak: user.settings?.showStreak !== false ? user.currentStreak : null,
    }));

    res.json({ success: true, data: results });
  } catch (error) {
    next(error);
  }
});

// GET /api/users/check-username/:username - Check if username is available
router.get('/check-username/:username', authenticate, async (req: AuthenticatedRequest, res, next) => {
  try {
    const username = (req.params.username as string).toLowerCase();

    // Validate username format
    if (!/^[a-z0-9_]+$/.test(username) || username.length < 3 || username.length > 30) {
      res.json({ success: true, data: { available: false, reason: 'Invalid username format' } });
      return;
    }

    // Check if username is taken (excluding current user)
    const existingUser = await prisma.user.findUnique({
      where: { username },
    });

    const available = !existingUser || existingUser.id === req.user!.id;

    res.json({
      success: true,
      data: {
        available,
        reason: available ? null : 'Username is already taken'
      }
    });
  } catch (error) {
    next(error);
  }
});

// PATCH /api/users/username - Update username (for OAuth users to set their username)
router.patch(
  '/username',
  authenticate,
  validate(updateUsernameSchema),
  async (req: AuthenticatedRequest, res, next) => {
    try {
      const { username } = req.body;
      const normalizedUsername = username.toLowerCase();

      // Check if username is already taken by another user
      const existingUser = await prisma.user.findUnique({
        where: { username: normalizedUsername },
      });

      if (existingUser && existingUser.id !== req.user!.id) {
        res.status(400).json({
          success: false,
          error: 'Username is already taken'
        });
        return;
      }

      // Update the username
      const updatedUser = await prisma.user.update({
        where: { id: req.user!.id },
        data: { username: normalizedUsername },
      });

      res.json({
        success: true,
        data: {
          id: updatedUser.id,
          username: updatedUser.username,
          displayName: updatedUser.displayName,
          email: updatedUser.email,
          avatarUrl: updatedUser.avatarUrl,
          bio: updatedUser.bio,
          level: updatedUser.level,
          totalXp: updatedUser.totalXp,
          currentStreak: updatedUser.currentStreak,
          longestStreak: updatedUser.longestStreak,
          createdAt: updatedUser.createdAt,
        },
      });
    } catch (error) {
      next(error);
    }
  }
);

// GET /api/users/:id - Get user profile
router.get('/:id', authenticate, async (req: AuthenticatedRequest, res, next) => {
  try {
    const id = req.params.id as string;
    const isOwnProfile = id === req.user!.id;

    const user = await prisma.user.findUnique({
      where: { id },
      include: {
        settings: true,
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
      });

      res.json({
        success: true,
        data: {
          id: user.id,
          username: user.username,
          displayName: user.displayName,
          avatarUrl: user.avatarUrl,
          bio: user.bio,
        }
      });
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
    const id = req.params.id as string;

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
    const id = req.params.id as string;
    const limit = parseInt(req.query.limit as string) || 20;

    const completions = await prisma.taskCompletion.findMany({
      where: {
        userId: id,
        verificationStatus: 'verified',
      },
      include: {
        task: true,
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
