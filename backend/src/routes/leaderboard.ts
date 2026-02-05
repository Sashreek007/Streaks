import { Router } from 'express';
import prisma from '../lib/prisma.js';
import { authenticate } from '../middleware/auth.js';
import type { AuthenticatedRequest } from '../types/index.js';

const router = Router();

// GET /api/leaderboard - Get global leaderboard
router.get('/', authenticate, async (req: AuthenticatedRequest, res, next) => {
  try {
    const userId = req.user!.id;
    const period = (req.query.period as string) || 'weekly';
    const limit = parseInt(req.query.limit as string) || 100;

    let dateFilter: Date;
    const now = new Date();

    switch (period) {
      case 'daily':
        dateFilter = new Date(now.setHours(0, 0, 0, 0));
        break;
      case 'weekly':
        const weekAgo = new Date();
        weekAgo.setDate(weekAgo.getDate() - 7);
        dateFilter = weekAgo;
        break;
      case 'monthly':
        const monthAgo = new Date();
        monthAgo.setMonth(monthAgo.getMonth() - 1);
        dateFilter = monthAgo;
        break;
      case 'allTime':
      default:
        dateFilter = new Date(0); // Beginning of time
    }

    // Get users with their XP earned in the period
    const users = await prisma.user.findMany({
      where: {
        settings: {
          showOnLeaderboard: true,
        },
      },
      select: {
        id: true,
        username: true,
        displayName: true,
        avatarUrl: true,
        totalXp: true,
        currentStreak: true,
        xpTransactions: {
          where: {
            createdAt: { gte: dateFilter },
          },
          select: {
            amount: true,
          },
        },
      },
      orderBy: { totalXp: 'desc' },
      take: limit,
    });

    // Calculate period XP and rank
    const leaderboard = users.map((u, index) => {
      const periodXp = u.xpTransactions.reduce((sum, t) => sum + t.amount, 0);
      return {
        rank: index + 1,
        id: u.id,
        username: u.username,
        displayName: u.displayName,
        avatarUrl: u.avatarUrl,
        totalXp: u.totalXp,
        currentStreak: u.currentStreak,
        periodXp,
        isCurrentUser: u.id === userId,
      };
    });

    // Sort by period XP if not all-time
    if (period !== 'allTime') {
      leaderboard.sort((a, b) => b.periodXp - a.periodXp);
      leaderboard.forEach((u, i) => (u.rank = i + 1));
    }

    // Find current user's rank if not in top
    let currentUserRank = leaderboard.find((u) => u.isCurrentUser);

    if (!currentUserRank) {
      const userRank = await prisma.user.count({
        where: {
          totalXp: {
            gt: (await prisma.user.findUnique({ where: { id: userId } }))?.totalXp || 0,
          },
          settings: { showOnLeaderboard: true },
        },
      });

      const currentUser = await prisma.user.findUnique({
        where: { id: userId },
        select: {
          id: true,
          username: true,
          displayName: true,
          avatarUrl: true,
          totalXp: true,
          currentStreak: true,
        },
      });

      if (currentUser) {
        currentUserRank = {
          rank: userRank + 1,
          ...currentUser,
          periodXp: 0,
          isCurrentUser: true,
        };
      }
    }

    res.json({
      success: true,
      data: {
        leaderboard,
        currentUser: currentUserRank,
        period,
      },
    });
  } catch (error) {
    next(error);
  }
});

// GET /api/leaderboard/friends - Friends leaderboard
router.get('/friends', authenticate, async (req: AuthenticatedRequest, res, next) => {
  try {
    const userId = req.user!.id;

    // Get friend IDs
    const friendships = await prisma.friendship.findMany({
      where: {
        status: 'accepted',
        OR: [{ requesterId: userId }, { addresseeId: userId }],
      },
      select: { requesterId: true, addresseeId: true },
    });

    const friendIds = friendships.map((f) =>
      f.requesterId === userId ? f.addresseeId : f.requesterId
    );

    // Include self
    friendIds.push(userId);

    const friends = await prisma.user.findMany({
      where: {
        id: { in: friendIds },
      },
      select: {
        id: true,
        username: true,
        displayName: true,
        avatarUrl: true,
        totalXp: true,
        currentStreak: true,
      },
      orderBy: { totalXp: 'desc' },
    });

    const leaderboard = friends.map((f, index) => ({
      rank: index + 1,
      ...f,
      isCurrentUser: f.id === userId,
    }));

    res.json({ success: true, data: leaderboard });
  } catch (error) {
    next(error);
  }
});

// GET /api/leaderboard/squad/:squadId - Squad leaderboard
router.get('/squad/:squadId', authenticate, async (req: AuthenticatedRequest, res, next) => {
  try {
    const squadId = req.params.squadId as string;
    const userId = req.user!.id;

    // Verify membership
    const membership = await prisma.squadMember.findUnique({
      where: { squadId_userId: { squadId, userId } },
    });

    if (!membership) {
      res.status(403).json({ success: false, error: 'Not a member' });
      return;
    }

    const members = await prisma.squadMember.findMany({
      where: { squadId },
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
    });

    const leaderboard = members.map((m, index) => ({
      rank: index + 1,
      ...m.user,
      role: m.role,
      joinedAt: m.joinedAt,
      isCurrentUser: m.userId === userId,
    }));

    res.json({ success: true, data: leaderboard });
  } catch (error) {
    next(error);
  }
});

export default router;
