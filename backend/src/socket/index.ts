import { Server as HttpServer } from 'http';
import { Server, Socket } from 'socket.io';
import jwt from 'jsonwebtoken';
import { env } from '../config/env.js';
import prisma from '../lib/prisma.js';
import type {
  ServerToClientEvents,
  ClientToServerEvents,
} from '../types/index.js';

interface AuthenticatedSocket extends Socket<ClientToServerEvents, ServerToClientEvents> {
  userId?: string;
  username?: string;
}

// Map of userId to socket ids (user can have multiple connections)
const userSockets = new Map<string, Set<string>>();

export function setupSocketIO(server: HttpServer) {
  const io = new Server<ClientToServerEvents, ServerToClientEvents>(server, {
    cors: {
      origin: env.frontendUrl,
      credentials: true,
    },
  });

  // Authentication middleware
  io.use(async (socket: AuthenticatedSocket, next) => {
    try {
      const token = socket.handshake.auth.token || socket.handshake.query.token;

      if (!token) {
        return next(new Error('Authentication required'));
      }

      const decoded = jwt.verify(token as string, env.jwtSecret) as {
        userId: string;
        username: string;
      };

      const user = await prisma.user.findUnique({
        where: { id: decoded.userId },
        select: { id: true, username: true },
      });

      if (!user) {
        return next(new Error('User not found'));
      }

      socket.userId = user.id;
      socket.username = user.username;
      next();
    } catch (error) {
      next(new Error('Invalid token'));
    }
  });

  io.on('connection', async (socket: AuthenticatedSocket) => {
    const userId = socket.userId!;
    console.log(`User connected: ${userId}`);

    // Track socket
    if (!userSockets.has(userId)) {
      userSockets.set(userId, new Set());
    }
    userSockets.get(userId)!.add(socket.id);

    // Update presence to online
    await prisma.userPresence.upsert({
      where: { userId },
      update: { status: 'online', lastSeen: new Date() },
      create: { userId, status: 'online' },
    });

    // Broadcast online status to friends
    await broadcastPresence(io, userId, 'online');

    // Join user's personal room
    socket.join(`user:${userId}`);

    // Join rooms for squads and communities
    const [squadMemberships, communityMemberships] = await Promise.all([
      prisma.squadMember.findMany({
        where: { userId },
        select: { squadId: true },
      }),
      prisma.communityMember.findMany({
        where: { userId },
        select: { communityId: true },
      }),
    ]);

    squadMemberships.forEach((m) => socket.join(`squad:${m.squadId}`));
    communityMemberships.forEach((m) => socket.join(`community:${m.communityId}`));

    // Handle room joins
    socket.on('room:join', (roomId) => {
      socket.join(roomId);
    });

    socket.on('room:leave', (roomId) => {
      socket.leave(roomId);
    });

    // Handle presence updates
    socket.on('presence:update', async ({ status }) => {
      await prisma.userPresence.update({
        where: { userId },
        data: { status, lastSeen: new Date() },
      });
      await broadcastPresence(io, userId, status);
    });

    // Handle typing indicators
    socket.on('message:typing', ({ conversationId, isTyping }) => {
      socket.to(`conversation:${conversationId}`).emit('message:typing', {
        conversationId,
        userId,
        isTyping,
      });
    });

    // Handle message sending
    socket.on('message:send', async ({ conversationId, content, imageUrl }) => {
      try {
        // Verify participant
        const participant = await prisma.conversationParticipant.findUnique({
          where: { conversationId_userId: { conversationId, userId } },
        });

        if (!participant) return;

        // Create message
        const message = await prisma.message.create({
          data: {
            conversationId,
            senderId: userId,
            content,
            imageUrl,
            messageType: imageUrl ? 'image' : 'text',
          },
          include: {
            sender: {
              select: { id: true, username: true, displayName: true, avatarUrl: true },
            },
          },
        });

        // Update conversation
        await prisma.conversation.update({
          where: { id: conversationId },
          data: { updatedAt: new Date() },
        });

        // Emit to all participants
        io.to(`conversation:${conversationId}`).emit('message:new', {
          id: message.id,
          conversationId,
          senderId: userId,
          senderName: message.sender?.displayName || message.sender?.username || 'Unknown',
          senderAvatar: message.sender?.avatarUrl || undefined,
          content: message.content,
          imageUrl: message.imageUrl || undefined,
          createdAt: message.createdAt.toISOString(),
        });

        // Send notification to other participants
        const otherParticipants = await prisma.conversationParticipant.findMany({
          where: { conversationId, userId: { not: userId } },
        });

        for (const p of otherParticipants) {
          await sendNotification(io, p.userId, {
            id: message.id,
            type: 'message',
            title: 'New Message',
            body: `${socket.username}: ${content.slice(0, 50)}`,
            referenceType: 'conversation',
            referenceId: conversationId,
            createdAt: new Date().toISOString(),
          });
        }
      } catch (error) {
        console.error('Message send error:', error);
      }
    });

    // Handle read receipts
    socket.on('message:read', async ({ conversationId }) => {
      await prisma.conversationParticipant.update({
        where: { conversationId_userId: { conversationId, userId } },
        data: { lastReadAt: new Date() },
      });
    });

    // Handle disconnect
    socket.on('disconnect', async () => {
      console.log(`User disconnected: ${userId}`);

      // Remove socket from tracking
      const sockets = userSockets.get(userId);
      if (sockets) {
        sockets.delete(socket.id);
        if (sockets.size === 0) {
          userSockets.delete(userId);

          // Update presence to offline only if no more connections
          await prisma.userPresence.update({
            where: { userId },
            data: { status: 'offline', lastSeen: new Date() },
          });
          await broadcastPresence(io, userId, 'offline');
        }
      }
    });
  });

  return io;
}

// Helper to broadcast presence to friends
async function broadcastPresence(
  io: Server<ClientToServerEvents, ServerToClientEvents>,
  userId: string,
  status: string
) {
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

  friendIds.forEach((friendId) => {
    io.to(`user:${friendId}`).emit('presence:update', { userId, status });
  });
}

// Helper to send notification to user
export async function sendNotification(
  io: Server<ClientToServerEvents, ServerToClientEvents>,
  userId: string,
  notification: {
    id: string;
    type: string;
    title: string;
    body?: string;
    referenceType?: string;
    referenceId?: string;
    createdAt: string;
  }
) {
  io.to(`user:${userId}`).emit('notification:new', notification);
}

// Helper to check if user is online
export function isUserOnline(userId: string): boolean {
  return userSockets.has(userId) && userSockets.get(userId)!.size > 0;
}

// Get user's socket IDs
export function getUserSockets(userId: string): Set<string> | undefined {
  return userSockets.get(userId);
}
