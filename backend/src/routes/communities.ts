import { Router } from 'express';
import { z } from 'zod';
import prisma from '../lib/prisma.js';
import { authenticate, optionalAuth } from '../middleware/auth.js';
import { validate } from '../middleware/validate.js';
import { encrypt } from '../lib/encryption.js';
import type { AuthenticatedRequest } from '../types/index.js';

const router = Router();

const createCommunitySchema = z.object({
  name: z.string().min(1).max(100),
  description: z.string().max(1000).optional(),
  category: z.string().max(50).optional(),
  isPublic: z.boolean().default(true),
  xpMultiplier: z.number().min(1).max(2).default(1),
  streakThresholdPercent: z.number().int().min(1).max(100).default(70),
  verificationMode: z.enum(['manual', 'ai', 'hybrid']).default('manual'),
});

const updateCommunitySchema = createCommunitySchema.partial();

const createChallengeSchema = z.object({
  title: z.string().min(1).max(200),
  description: z.string().max(1000).optional(),
  category: z.string().max(50).optional(),
  difficulty: z.enum(['easy', 'medium', 'hard', 'extreme']).default('medium'),
  frequency: z.enum(['daily', 'weekly', 'one-time']).default('daily'),
  startsAt: z.string().datetime().optional(),
  endsAt: z.string().datetime().optional(),
  requiresProof: z.boolean().default(true),
  verificationInstructions: z.string().max(500).optional(),
});

// GET /api/communities - Get all public communities
router.get('/', optionalAuth, async (req: AuthenticatedRequest, res, next) => {
  try {
    const { category, search, joined } = req.query;
    const userId = req.user?.id;

    const where: any = {};

    if (joined === 'true' && userId) {
      where.members = { some: { userId } };
    } else if (joined !== 'true') {
      where.isPublic = true;
    }

    if (category) where.category = category;
    if (search) {
      where.OR = [
        { name: { contains: search, mode: 'insensitive' } },
        { description: { contains: search, mode: 'insensitive' } },
      ];
    }

    const communities = await prisma.community.findMany({
      where,
      include: {
        owner: { select: { id: true, username: true, displayName: true, avatarUrl: true } },
        _count: { select: { members: true, challenges: true } },
        members: userId ? { where: { userId }, take: 1 } : false,
      },
      orderBy: { memberCount: 'desc' },
      take: 50,
    });

    const data = communities.map((c) => ({
      ...c,
      memberCount: c._count.members,
      challengeCount: c._count.challenges,
      isJoined: userId ? c.members.length > 0 : false,
      members: undefined,
      _count: undefined,
    }));

    res.json({ success: true, data });
  } catch (error) {
    next(error);
  }
});

// POST /api/communities - Create community
router.post(
  '/',
  authenticate,
  validate(createCommunitySchema),
  async (req: AuthenticatedRequest, res, next) => {
    try {
      const userId = req.user!.id;

      const community = await prisma.community.create({
        data: {
          ...req.body,
          ownerId: userId,
          members: {
            create: { userId, role: 'owner' },
          },
        },
        include: {
          owner: { select: { id: true, username: true, displayName: true } },
        },
      });

      res.status(201).json({ success: true, data: community });
    } catch (error) {
      next(error);
    }
  }
);

// GET /api/communities/:id - Get community details
router.get('/:id', optionalAuth, async (req: AuthenticatedRequest, res, next) => {
  try {
    const id = req.params.id as string;
    const userId = req.user?.id;

    const community = await prisma.community.findUnique({
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
          take: 20,
        },
        challenges: {
          where: { isActive: true },
          orderBy: { createdAt: 'desc' },
          take: 10,
        },
        _count: { select: { members: true, challenges: true } },
      },
    });

    if (!community) {
      res.status(404).json({ success: false, error: 'Community not found' });
      return;
    }

    if (!community.isPublic) {
      const isMember = userId && community.members.some((m) => m.userId === userId);
      if (!isMember) {
        res.status(403).json({ success: false, error: 'Private community' });
        return;
      }
    }

    const isJoined = userId ? community.members.some((m) => m.userId === userId) : false;
    const userRole = userId ? community.members.find((m) => m.userId === userId)?.role : null;

    res.json({
      success: true,
      data: {
        ...community,
        memberCount: community._count.members,
        challengeCount: community._count.challenges,
        isJoined,
        userRole,
        _count: undefined,
      },
    });
  } catch (error) {
    next(error);
  }
});

// PATCH /api/communities/:id - Update community
router.patch(
  '/:id',
  authenticate,
  validate(updateCommunitySchema),
  async (req: AuthenticatedRequest, res, next) => {
    try {
      const id = req.params.id as string;
      const userId = req.user!.id;

      const membership = await prisma.communityMember.findUnique({
        where: { communityId_userId: { communityId: id, userId } },
      });

      if (!membership || !['owner', 'admin'].includes(membership.role)) {
        res.status(403).json({ success: false, error: 'Permission denied' });
        return;
      }

      const community = await prisma.community.update({
        where: { id },
        data: req.body,
      });

      res.json({ success: true, data: community });
    } catch (error) {
      next(error);
    }
  }
);

// POST /api/communities/:id/join - Join community
router.post('/:id/join', authenticate, async (req: AuthenticatedRequest, res, next) => {
  try {
    const id = req.params.id as string;
    const userId = req.user!.id;

    const community = await prisma.community.findUnique({
      where: { id },
      select: { id: true, isPublic: true },
    });

    if (!community) {
      res.status(404).json({ success: false, error: 'Community not found' });
      return;
    }

    if (!community.isPublic) {
      res.status(403).json({ success: false, error: 'Private community' });
      return;
    }

    const existing = await prisma.communityMember.findUnique({
      where: { communityId_userId: { communityId: id, userId } },
    });

    if (existing) {
      res.status(400).json({ success: false, error: 'Already a member' });
      return;
    }

    await prisma.communityMember.create({
      data: { communityId: id, userId, role: 'member' },
    });

    await prisma.community.update({
      where: { id },
      data: { memberCount: { increment: 1 } },
    });

    // Create post about joining
    await prisma.post.create({
      data: {
        userId,
        postType: 'joined_community',
        communityId: id,
        visibility: 'public',
      },
    });

    res.json({ success: true, message: 'Joined community' });
  } catch (error) {
    next(error);
  }
});

// DELETE /api/communities/:id/leave - Leave community
router.delete('/:id/leave', authenticate, async (req: AuthenticatedRequest, res, next) => {
  try {
    const id = req.params.id as string;
    const userId = req.user!.id;

    const membership = await prisma.communityMember.findUnique({
      where: { communityId_userId: { communityId: id, userId } },
    });

    if (!membership) {
      res.status(404).json({ success: false, error: 'Not a member' });
      return;
    }

    if (membership.role === 'owner') {
      res.status(400).json({ success: false, error: 'Owner cannot leave' });
      return;
    }

    await prisma.communityMember.delete({
      where: { communityId_userId: { communityId: id, userId } },
    });

    await prisma.community.update({
      where: { id },
      data: { memberCount: { decrement: 1 } },
    });

    res.json({ success: true, message: 'Left community' });
  } catch (error) {
    next(error);
  }
});

// POST /api/communities/:id/challenges - Create challenge
router.post(
  '/:id/challenges',
  authenticate,
  validate(createChallengeSchema),
  async (req: AuthenticatedRequest, res, next) => {
    try {
      const id = req.params.id as string;
      const userId = req.user!.id;

      const membership = await prisma.communityMember.findUnique({
        where: { communityId_userId: { communityId: id, userId } },
      });

      if (!membership || !['owner', 'admin', 'moderator'].includes(membership.role)) {
        res.status(403).json({ success: false, error: 'Permission denied' });
        return;
      }

      const difficultyXp: Record<string, number> = {
        easy: 25,
        medium: 50,
        hard: 100,
        extreme: 200,
      };

      const challenge = await prisma.communityChallenge.create({
        data: {
          ...req.body,
          communityId: id,
          createdById: userId,
          baseXp: difficultyXp[req.body.difficulty] || 50,
          startsAt: req.body.startsAt ? new Date(req.body.startsAt) : undefined,
          endsAt: req.body.endsAt ? new Date(req.body.endsAt) : undefined,
        },
      });

      res.status(201).json({ success: true, data: challenge });
    } catch (error) {
      next(error);
    }
  }
);

// GET /api/communities/:id/challenges - Get community challenges
router.get('/:id/challenges', authenticate, async (req: AuthenticatedRequest, res, next) => {
  try {
    const id = req.params.id as string;
    const { active } = req.query;

    const challenges = await prisma.communityChallenge.findMany({
      where: {
        communityId: id,
        ...(active !== undefined ? { isActive: active === 'true' } : {}),
      },
      include: {
        createdBy: { select: { id: true, username: true, displayName: true } },
        _count: { select: { tasks: true } },
      },
      orderBy: { createdAt: 'desc' },
    });

    res.json({ success: true, data: challenges });
  } catch (error) {
    next(error);
  }
});

// GET /api/communities/:id/leaderboard - Community leaderboard
router.get('/:id/leaderboard', authenticate, async (req: AuthenticatedRequest, res, next) => {
  try {
    const id = req.params.id as string;

    const members = await prisma.communityMember.findMany({
      where: { communityId: id },
      include: {
        user: {
          select: {
            id: true,
            username: true,
            displayName: true,
            avatarUrl: true,
            totalXp: true,
            currentStreak: true,
          },
        },
      },
      orderBy: { user: { totalXp: 'desc' } },
      take: 100,
    });

    const leaderboard = members.map((m, index) => ({
      rank: index + 1,
      ...m.user,
      joinedAt: m.joinedAt,
    }));

    res.json({ success: true, data: leaderboard });
  } catch (error) {
    next(error);
  }
});

export default router;
