import { Router } from 'express';
import { z } from 'zod';
import prisma from '../lib/prisma.js';
import { authenticate } from '../middleware/auth.js';
import { validate } from '../middleware/validate.js';
import type { AuthenticatedRequest } from '../types/index.js';

const router = Router();

const sendMessageSchema = z.object({
  content: z.string().min(1).max(2000),
  imageUrl: z.string().url().optional(),
});

// GET /api/messages/conversations - Get all conversations
router.get('/conversations', authenticate, async (req: AuthenticatedRequest, res, next) => {
  try {
    const userId = req.user!.id;

    const participants = await prisma.conversationParticipant.findMany({
      where: { userId },
      include: {
        conversation: {
          include: {
            participants: {
              where: { userId: { not: userId } },
              include: {
                user: {
                  select: {
                    id: true,
                    username: true,
                    displayName: true,
                    avatarUrl: true,
                    presence: { select: { status: true } },
                  },
                },
              },
            },
            messages: {
              orderBy: { createdAt: 'desc' },
              take: 1,
            },
          },
        },
      },
      orderBy: { conversation: { updatedAt: 'desc' } },
    });

    const conversations = participants.map((p) => {
      const otherParticipant = p.conversation.participants[0];
      const lastMessage = p.conversation.messages[0];

      return {
        id: p.conversation.id,
        friend: otherParticipant?.user,
        lastMessage: lastMessage
          ? {
              content: lastMessage.content,
              createdAt: lastMessage.createdAt,
              isOwn: lastMessage.senderId === userId,
            }
          : null,
        lastReadAt: p.lastReadAt,
        hasUnread: lastMessage && p.lastReadAt
          ? lastMessage.createdAt > p.lastReadAt && lastMessage.senderId !== userId
          : !!lastMessage && lastMessage.senderId !== userId,
      };
    });

    res.json({ success: true, data: conversations });
  } catch (error) {
    next(error);
  }
});

// GET /api/messages/:conversationId - Get messages in conversation
router.get('/:conversationId', authenticate, async (req: AuthenticatedRequest, res, next) => {
  try {
    const conversationId = req.params.conversationId as string;
    const userId = req.user!.id;
    const limit = parseInt(req.query.limit as string) || 50;
    const cursor = req.query.cursor as string;

    // Verify user is participant
    const participant = await prisma.conversationParticipant.findUnique({
      where: {
        conversationId_userId: { conversationId, userId },
      },
    });

    if (!participant) {
      res.status(403).json({ success: false, error: 'Not a participant' });
      return;
    }

    const messages = await prisma.message.findMany({
      where: {
        conversationId,
        deletedAt: null,
        ...(cursor ? { createdAt: { lt: new Date(cursor) } } : {}),
      },
      include: {
        sender: {
          select: {
            id: true,
            username: true,
            displayName: true,
            avatarUrl: true,
          },
        },
      },
      orderBy: { createdAt: 'desc' },
      take: limit + 1,
    });

    const hasMore = messages.length > limit;
    if (hasMore) messages.pop();

    // Mark as read
    await prisma.conversationParticipant.update({
      where: {
        conversationId_userId: { conversationId, userId },
      },
      data: { lastReadAt: new Date() },
    });

    res.json({
      success: true,
      data: {
        messages: messages.reverse(),
        hasMore,
        nextCursor: hasMore ? messages[0].createdAt.toISOString() : null,
      },
    });
  } catch (error) {
    next(error);
  }
});

// POST /api/messages/:friendId - Send message (creates conversation if needed)
router.post(
  '/:friendId',
  authenticate,
  validate(sendMessageSchema),
  async (req: AuthenticatedRequest, res, next) => {
    try {
      const friendId = req.params.friendId as string;
      const { content, imageUrl } = req.body;
      const userId = req.user!.id;

      // Check if they are friends
      const friendship = await prisma.friendship.findFirst({
        where: {
          status: 'accepted',
          OR: [
            { requesterId: userId, addresseeId: friendId },
            { requesterId: friendId, addresseeId: userId },
          ],
        },
      });

      if (!friendship) {
        res.status(403).json({ success: false, error: 'Not friends' });
        return;
      }

      // Find or create conversation
      let conversation = await prisma.conversation.findFirst({
        where: {
          participants: {
            every: {
              userId: { in: [userId, friendId] },
            },
          },
        },
        include: {
          participants: true,
        },
      });

      if (!conversation || conversation.participants.length !== 2) {
        conversation = await prisma.conversation.create({
          data: {
            participants: {
              create: [{ userId }, { userId: friendId }],
            },
          },
          include: { participants: true },
        });
      }

      // Create message
      const message = await prisma.message.create({
        data: {
          conversationId: conversation.id,
          senderId: userId,
          content,
          imageUrl,
          messageType: imageUrl ? 'image' : 'text',
        },
        include: {
          sender: {
            select: {
              id: true,
              username: true,
              displayName: true,
              avatarUrl: true,
            },
          },
        },
      });

      // Update conversation timestamp
      await prisma.conversation.update({
        where: { id: conversation.id },
        data: { updatedAt: new Date() },
      });

      // Create notification for recipient
      await prisma.notification.create({
        data: {
          userId: friendId,
          type: 'message',
          title: 'New Message',
          body: `${req.user!.username}: ${content.slice(0, 50)}${content.length > 50 ? '...' : ''}`,
          referenceType: 'conversation',
          referenceId: conversation.id,
        },
      });

      res.status(201).json({
        success: true,
        data: {
          message,
          conversationId: conversation.id,
        },
      });
    } catch (error) {
      next(error);
    }
  }
);

// POST /api/messages/:conversationId/read - Mark conversation as read
router.post('/:conversationId/read', authenticate, async (req: AuthenticatedRequest, res, next) => {
  try {
    const conversationId = req.params.conversationId as string;
    const userId = req.user!.id;

    await prisma.conversationParticipant.update({
      where: {
        conversationId_userId: { conversationId, userId },
      },
      data: { lastReadAt: new Date() },
    });

    res.json({ success: true });
  } catch (error) {
    next(error);
  }
});

// DELETE /api/messages/message/:messageId - Delete a message
router.delete('/message/:messageId', authenticate, async (req: AuthenticatedRequest, res, next) => {
  try {
    const messageId = req.params.messageId as string;
    const userId = req.user!.id;

    // Find the message and verify ownership
    const message = await prisma.message.findUnique({
      where: { id: messageId },
    });

    if (!message) {
      res.status(404).json({ success: false, error: 'Message not found' });
      return;
    }

    if (message.senderId !== userId) {
      res.status(403).json({ success: false, error: 'You can only delete your own messages' });
      return;
    }

    // Soft delete the message
    await prisma.message.update({
      where: { id: messageId },
      data: { deletedAt: new Date() },
    });

    res.json({ success: true, message: 'Message deleted' });
  } catch (error) {
    next(error);
  }
});

// PATCH /api/messages/message/:messageId - Edit a message
router.patch(
  '/message/:messageId',
  authenticate,
  validate(z.object({ content: z.string().min(1).max(2000) })),
  async (req: AuthenticatedRequest, res, next) => {
    try {
      const messageId = req.params.messageId as string;
      const userId = req.user!.id;
      const { content } = req.body;

      // Find the message and verify ownership
      const message = await prisma.message.findUnique({
        where: { id: messageId },
      });

      if (!message) {
        res.status(404).json({ success: false, error: 'Message not found' });
        return;
      }

      if (message.senderId !== userId) {
        res.status(403).json({ success: false, error: 'You can only edit your own messages' });
        return;
      }

      // Check if message is too old to edit (e.g., 15 minutes)
      const fifteenMinutesAgo = new Date(Date.now() - 15 * 60 * 1000);
      if (message.createdAt < fifteenMinutesAgo) {
        res.status(400).json({ success: false, error: 'Message is too old to edit' });
        return;
      }

      // Update the message
      const updatedMessage = await prisma.message.update({
        where: { id: messageId },
        data: {
          content,
          editedAt: new Date(),
        },
        include: {
          sender: {
            select: {
              id: true,
              username: true,
              displayName: true,
              avatarUrl: true,
            },
          },
        },
      });

      res.json({ success: true, data: updatedMessage });
    } catch (error) {
      next(error);
    }
  }
);

// POST /api/messages/reply/:messageId - Reply to a message
router.post(
  '/reply/:messageId',
  authenticate,
  validate(sendMessageSchema),
  async (req: AuthenticatedRequest, res, next) => {
    try {
      const replyToId = req.params.messageId as string;
      const { content, imageUrl } = req.body;
      const userId = req.user!.id;

      // Find the original message
      const originalMessage = await prisma.message.findUnique({
        where: { id: replyToId },
        include: {
          conversation: {
            include: {
              participants: true,
            },
          },
        },
      });

      if (!originalMessage) {
        res.status(404).json({ success: false, error: 'Original message not found' });
        return;
      }

      // Verify user is participant in the conversation
      const isParticipant = originalMessage.conversation.participants.some(p => p.userId === userId);
      if (!isParticipant) {
        res.status(403).json({ success: false, error: 'Not a participant in this conversation' });
        return;
      }

      // Create the reply message
      const message = await prisma.message.create({
        data: {
          conversationId: originalMessage.conversationId,
          senderId: userId,
          content,
          imageUrl,
          messageType: imageUrl ? 'image' : 'text',
          replyToId,
        },
        include: {
          sender: {
            select: {
              id: true,
              username: true,
              displayName: true,
              avatarUrl: true,
            },
          },
          replyTo: {
            select: {
              id: true,
              content: true,
              senderId: true,
              sender: {
                select: {
                  id: true,
                  displayName: true,
                },
              },
            },
          },
        },
      });

      // Update conversation timestamp
      await prisma.conversation.update({
        where: { id: originalMessage.conversationId },
        data: { updatedAt: new Date() },
      });

      res.status(201).json({
        success: true,
        data: {
          message,
          conversationId: originalMessage.conversationId,
        },
      });
    } catch (error) {
      next(error);
    }
  }
);

export default router;
