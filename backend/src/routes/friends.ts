import { Router } from 'express';
import prisma from '../lib/prisma.js';
import { authenticate } from '../middleware/auth.js';
import type { AuthenticatedRequest } from '../types/index.js';

const router = Router();

// GET /api/friends - Get friends list
router.get('/', authenticate, async (req: AuthenticatedRequest, res, next) => {
  try {
    const userId = req.user!.id;

    const friendships = await prisma.friendship.findMany({
      where: {
        OR: [
          { requesterId: userId, status: 'accepted' },
          { addresseeId: userId, status: 'accepted' },
        ],
      },
      include: {
        requester: {
          select: {
            id: true,
            username: true,
            displayName: true,
            avatarUrl: true,
            currentStreak: true,
            totalXp: true,
            presence: { select: { status: true, lastSeen: true } },
          },
        },
        addressee: {
          select: {
            id: true,
            username: true,
            displayName: true,
            avatarUrl: true,
            currentStreak: true,
            totalXp: true,
            presence: { select: { status: true, lastSeen: true } },
          },
        },
      },
    });

    // Extract friend from each friendship
    const friends = friendships.map((f) => {
      const friend = f.requesterId === userId ? f.addressee : f.requester;
      return {
        ...friend,
        status: friend.presence?.status || 'offline',
        lastSeen: friend.presence?.lastSeen,
        friendshipId: f.id,
      };
    });

    res.json({ success: true, data: friends });
  } catch (error) {
    next(error);
  }
});

// GET /api/friends/requests - Get pending friend requests
router.get('/requests', authenticate, async (req: AuthenticatedRequest, res, next) => {
  try {
    const userId = req.user!.id;

    const [incoming, outgoing] = await Promise.all([
      prisma.friendship.findMany({
        where: { addresseeId: userId, status: 'pending' },
        include: {
          requester: {
            select: {
              id: true,
              username: true,
              displayName: true,
              avatarUrl: true,
              currentStreak: true,
            },
          },
        },
        orderBy: { createdAt: 'desc' },
      }),
      prisma.friendship.findMany({
        where: { requesterId: userId, status: 'pending' },
        include: {
          addressee: {
            select: {
              id: true,
              username: true,
              displayName: true,
              avatarUrl: true,
            },
          },
        },
        orderBy: { createdAt: 'desc' },
      }),
    ]);

    res.json({
      success: true,
      data: {
        incoming: incoming.map((r) => ({
          id: r.id,
          user: r.requester,
          createdAt: r.createdAt,
        })),
        outgoing: outgoing.map((r) => ({
          id: r.id,
          user: r.addressee,
          createdAt: r.createdAt,
        })),
      },
    });
  } catch (error) {
    next(error);
  }
});

// POST /api/friends/request/:userId - Send friend request
router.post('/request/:userId', authenticate, async (req: AuthenticatedRequest, res, next) => {
  try {
    const { userId: targetUserId } = req.params;
    const requesterId = req.user!.id;

    if (targetUserId === requesterId) {
      res.status(400).json({ success: false, error: 'Cannot friend yourself' });
      return;
    }

    // Check if user exists
    const targetUser = await prisma.user.findUnique({
      where: { id: targetUserId },
      select: { id: true, settings: { select: { allowDms: true } } },
    });

    if (!targetUser) {
      res.status(404).json({ success: false, error: 'User not found' });
      return;
    }

    // Check existing friendship
    const existing = await prisma.friendship.findFirst({
      where: {
        OR: [
          { requesterId, addresseeId: targetUserId },
          { requesterId: targetUserId, addresseeId: requesterId },
        ],
      },
    });

    if (existing) {
      if (existing.status === 'accepted') {
        res.status(400).json({ success: false, error: 'Already friends' });
        return;
      }
      if (existing.status === 'pending') {
        res.status(400).json({ success: false, error: 'Request already pending' });
        return;
      }
      if (existing.status === 'blocked') {
        res.status(400).json({ success: false, error: 'Cannot send request' });
        return;
      }
    }

    // Create friend request
    const friendship = await prisma.friendship.create({
      data: {
        requesterId,
        addresseeId: targetUserId,
        status: 'pending',
      },
    });

    // Create notification for target user
    await prisma.notification.create({
      data: {
        userId: targetUserId,
        type: 'friend_request',
        title: 'New Friend Request',
        body: `${req.user!.username} wants to be your friend`,
        referenceType: 'friendship',
        referenceId: friendship.id,
      },
    });

    res.status(201).json({ success: true, data: friendship });
  } catch (error) {
    next(error);
  }
});

// POST /api/friends/accept/:requestId - Accept friend request
router.post('/accept/:requestId', authenticate, async (req: AuthenticatedRequest, res, next) => {
  try {
    const { requestId } = req.params;
    const userId = req.user!.id;

    const friendship = await prisma.friendship.findFirst({
      where: {
        id: requestId,
        addresseeId: userId,
        status: 'pending',
      },
      include: {
        requester: { select: { username: true } },
      },
    });

    if (!friendship) {
      res.status(404).json({ success: false, error: 'Request not found' });
      return;
    }

    // Accept request
    const updated = await prisma.friendship.update({
      where: { id: requestId },
      data: { status: 'accepted' },
    });

    // Notify requester
    await prisma.notification.create({
      data: {
        userId: friendship.requesterId,
        type: 'friend_accepted',
        title: 'Friend Request Accepted',
        body: `${req.user!.username} accepted your friend request`,
        referenceType: 'user',
        referenceId: userId,
      },
    });

    res.json({ success: true, data: updated });
  } catch (error) {
    next(error);
  }
});

// POST /api/friends/reject/:requestId - Reject friend request
router.post('/reject/:requestId', authenticate, async (req: AuthenticatedRequest, res, next) => {
  try {
    const { requestId } = req.params;
    const userId = req.user!.id;

    const friendship = await prisma.friendship.findFirst({
      where: {
        id: requestId,
        addresseeId: userId,
        status: 'pending',
      },
    });

    if (!friendship) {
      res.status(404).json({ success: false, error: 'Request not found' });
      return;
    }

    await prisma.friendship.update({
      where: { id: requestId },
      data: { status: 'rejected' },
    });

    res.json({ success: true, message: 'Request rejected' });
  } catch (error) {
    next(error);
  }
});

// DELETE /api/friends/:friendshipId - Remove friend
router.delete('/:friendshipId', authenticate, async (req: AuthenticatedRequest, res, next) => {
  try {
    const { friendshipId } = req.params;
    const userId = req.user!.id;

    const friendship = await prisma.friendship.findFirst({
      where: {
        id: friendshipId,
        OR: [{ requesterId: userId }, { addresseeId: userId }],
        status: 'accepted',
      },
    });

    if (!friendship) {
      res.status(404).json({ success: false, error: 'Friendship not found' });
      return;
    }

    await prisma.friendship.delete({ where: { id: friendshipId } });

    res.json({ success: true, message: 'Friend removed' });
  } catch (error) {
    next(error);
  }
});

// GET /api/friends/suggestions - Get friend suggestions
router.get('/suggestions', authenticate, async (req: AuthenticatedRequest, res, next) => {
  try {
    const userId = req.user!.id;
    const limit = parseInt(req.query.limit as string) || 10;

    // Get existing friend IDs
    const existingFriendships = await prisma.friendship.findMany({
      where: {
        OR: [{ requesterId: userId }, { addresseeId: userId }],
      },
      select: { requesterId: true, addresseeId: true },
    });

    const excludeIds = new Set<string>([userId]);
    existingFriendships.forEach((f) => {
      excludeIds.add(f.requesterId);
      excludeIds.add(f.addresseeId);
    });

    // Get suggestions (users with similar communities/squads)
    const suggestions = await prisma.user.findMany({
      where: {
        id: { notIn: Array.from(excludeIds) },
        settings: { profilePublic: true },
      },
      select: {
        id: true,
        username: true,
        displayName: true,
        avatarUrl: true,
        currentStreak: true,
        _count: { select: { communityMemberships: true } },
      },
      orderBy: { totalXp: 'desc' },
      take: limit,
    });

    res.json({ success: true, data: suggestions });
  } catch (error) {
    next(error);
  }
});

export default router;
