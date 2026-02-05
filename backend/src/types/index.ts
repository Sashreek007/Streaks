import type { Request } from 'express';

// Extend Express Request with user
export interface AuthenticatedRequest extends Request {
  user?: {
    id: string;
    email: string;
    username: string;
  };
}

// API Response types
export interface ApiResponse<T = unknown> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

// Pagination
export interface PaginationParams {
  page?: number;
  limit?: number;
  cursor?: string;
}

export interface PaginatedResponse<T> {
  items: T[];
  total: number;
  page: number;
  limit: number;
  hasMore: boolean;
  nextCursor?: string;
}

// Socket events
export interface ServerToClientEvents {
  // Messages
  'message:new': (message: MessagePayload) => void;
  'message:typing': (data: { conversationId: string; userId: string; isTyping: boolean }) => void;

  // Notifications
  'notification:new': (notification: NotificationPayload) => void;

  // Presence
  'presence:update': (data: { userId: string; status: string }) => void;

  // Verification
  'verification:update': (data: { completionId: string; status: string }) => void;

  // Leaderboard
  'leaderboard:update': (data: { userId: string; rank: number; xp: number }) => void;
}

export interface ClientToServerEvents {
  // Messages
  'message:send': (data: { conversationId: string; content: string; imageUrl?: string }) => void;
  'message:typing': (data: { conversationId: string; isTyping: boolean }) => void;
  'message:read': (data: { conversationId: string }) => void;

  // Presence
  'presence:update': (data: { status: string }) => void;

  // Rooms
  'room:join': (roomId: string) => void;
  'room:leave': (roomId: string) => void;
}

// Payload types
export interface MessagePayload {
  id: string;
  conversationId: string;
  senderId: string;
  senderName: string;
  senderAvatar?: string;
  content: string;
  imageUrl?: string;
  createdAt: string;
}

export interface NotificationPayload {
  id: string;
  type: string;
  title: string;
  body?: string;
  referenceType?: string;
  referenceId?: string;
  createdAt: string;
}

// Verification
export type VerificationStatus = 'pending' | 'verified' | 'rejected' | 'auto_verified';

export interface VerificationResult {
  status: VerificationStatus;
  confidence?: number;
  reason?: string;
}

// AI Provider types
export type AIProvider = 'openai' | 'anthropic' | 'google';

export interface AIVerificationRequest {
  imageUrl: string;
  taskTitle: string;
  taskDescription?: string;
  verificationInstructions?: string;
}
