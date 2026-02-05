import { Router } from 'express';
import { z } from 'zod';
import prisma from '../lib/prisma.js';
import { authenticate } from '../middleware/auth.js';
import { validate } from '../middleware/validate.js';
import type { AuthenticatedRequest } from '../types/index.js';

const router = Router();

const createPostSchema = z.object({
  content: z.string().max(1000).optional(),
  postType: z.enum(['task_completion', 'streak_milestone', 'achievement', 'level_up', 'joined_community', 'custom']).default('custom'),
  imageUrl: z.string().url().optional(),
  visibility: z.enum(['private', 'friends', 'public']).default('public'),
});

const commentSchema = z.object({
  content: z.string().min(1).max(500),
});

// GET /api/feed - Get social feed
router.get('/', authenticate, async (req: AuthenticatedRequest, res, next) => {
  try {
    const userId = req.user!.id;
    const limit = parseInt(req.query.limit as string) || 20;
    const cursor = req.query.cursor as string;

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

    // Include own posts and friends' posts
    const posts = await prisma.post.findMany({
      where: {
        OR: [
          { userId }, // Own posts
          { userId: { in: friendIds }, visibility: { in: ['friends', 'public'] } },
          { visibility: 'public' },
        ],
        ...(cursor ? { createdAt: { lt: new Date(cursor) } } : {}),
      },
      include: {
        user: {
          select: {
            id: true,
            username: true,
            displayName: true,
            avatarUrl: true,
            currentStreak: true,
          },
        },
        taskCompletion: {
          include: {
            task: { select: { title: true, category: true } },
          },
        },
        community: { select: { id: true, name: true } },
        likes: {
          where: { userId },
          take: 1,
        },
        _count: { select: { comments: true } },
      },
      orderBy: { createdAt: 'desc' },
      take: limit + 1,
    });

    const hasMore = posts.length > limit;
    if (hasMore) posts.pop();

    const data = posts.map((p) => ({
      ...p,
      isLiked: p.likes.length > 0,
      commentsCount: p._count.comments,
      likes: undefined,
      _count: undefined,
    }));

    res.json({
      success: true,
      data: {
        posts: data,
        hasMore,
        nextCursor: hasMore ? posts[posts.length - 1].createdAt.toISOString() : null,
      },
    });
  } catch (error) {
    next(error);
  }
});

// POST /api/feed - Create post
router.post(
  '/',
  authenticate,
  validate(createPostSchema),
  async (req: AuthenticatedRequest, res, next) => {
    try {
      const userId = req.user!.id;

      const post = await prisma.post.create({
        data: {
          ...req.body,
          userId,
        },
        include: {
          user: {
            select: {
              id: true,
              username: true,
              displayName: true,
              avatarUrl: true,
              currentStreak: true,
            },
          },
        },
      });

      res.status(201).json({ success: true, data: post });
    } catch (error) {
      next(error);
    }
  }
);

// GET /api/feed/:id - Get single post
router.get('/:id', authenticate, async (req: AuthenticatedRequest, res, next) => {
  try {
    const id = req.params.id as string;
    const userId = req.user!.id;

    const post = await prisma.post.findUnique({
      where: { id },
      include: {
        user: {
          select: {
            id: true,
            username: true,
            displayName: true,
            avatarUrl: true,
            currentStreak: true,
          },
        },
        taskCompletion: {
          include: {
            task: { select: { title: true, category: true } },
          },
        },
        community: { select: { id: true, name: true } },
        likes: {
          where: { userId },
          take: 1,
        },
        comments: {
          include: {
            user: {
              select: {
                id: true,
                username: true,
                displayName: true,
                avatarUrl: true,
              },
            },
          },
          orderBy: { createdAt: 'asc' },
        },
      },
    });

    if (!post) {
      res.status(404).json({ success: false, error: 'Post not found' });
      return;
    }

    res.json({
      success: true,
      data: {
        ...post,
        isLiked: post.likes.length > 0,
        likes: undefined,
      },
    });
  } catch (error) {
    next(error);
  }
});

// POST /api/feed/:id/like - Like/unlike post
router.post('/:id/like', authenticate, async (req: AuthenticatedRequest, res, next) => {
  try {
    const id = req.params.id as string;
    const userId = req.user!.id;

    const existing = await prisma.postLike.findUnique({
      where: { postId_userId: { postId: id, userId } },
    });

    if (existing) {
      // Unlike
      await prisma.postLike.delete({
        where: { postId_userId: { postId: id, userId } },
      });

      await prisma.post.update({
        where: { id },
        data: { likesCount: { decrement: 1 } },
      });

      res.json({ success: true, data: { liked: false } });
    } else {
      // Like
      await prisma.postLike.create({
        data: { postId: id, userId },
      });

      await prisma.post.update({
        where: { id },
        data: { likesCount: { increment: 1 } },
      });

      // Notify post owner
      const post = await prisma.post.findUnique({
        where: { id },
        select: { userId: true },
      });

      if (post && post.userId !== userId) {
        await prisma.notification.create({
          data: {
            userId: post.userId,
            type: 'post_like',
            title: 'New Like',
            body: `${req.user!.username} liked your post`,
            referenceType: 'post',
            referenceId: id,
          },
        });
      }

      res.json({ success: true, data: { liked: true } });
    }
  } catch (error) {
    next(error);
  }
});

// POST /api/feed/:id/comments - Add comment
router.post(
  '/:id/comments',
  authenticate,
  validate(commentSchema),
  async (req: AuthenticatedRequest, res, next) => {
    try {
      const id = req.params.id as string;
      const userId = req.user!.id;
      const { content } = req.body;

      const post = await prisma.post.findUnique({
        where: { id },
        select: { userId: true },
      });

      if (!post) {
        res.status(404).json({ success: false, error: 'Post not found' });
        return;
      }

      const comment = await prisma.postComment.create({
        data: {
          postId: id,
          userId,
          content,
        },
        include: {
          user: {
            select: {
              id: true,
              username: true,
              displayName: true,
              avatarUrl: true,
            },
          },
        },
      });

      await prisma.post.update({
        where: { id },
        data: { commentsCount: { increment: 1 } },
      });

      // Notify post owner
      if (post.userId !== userId) {
        await prisma.notification.create({
          data: {
            userId: post.userId,
            type: 'post_comment',
            title: 'New Comment',
            body: `${req.user!.username} commented on your post`,
            referenceType: 'post',
            referenceId: id,
          },
        });
      }

      res.status(201).json({ success: true, data: comment });
    } catch (error) {
      next(error);
    }
  }
);

// DELETE /api/feed/:id - Delete post
router.delete('/:id', authenticate, async (req: AuthenticatedRequest, res, next) => {
  try {
    const id = req.params.id as string;
    const userId = req.user!.id;

    const post = await prisma.post.findFirst({
      where: { id, userId },
    });

    if (!post) {
      res.status(404).json({ success: false, error: 'Post not found' });
      return;
    }

    await prisma.post.delete({ where: { id } });

    res.json({ success: true, message: 'Post deleted' });
  } catch (error) {
    next(error);
  }
});

export default router;
