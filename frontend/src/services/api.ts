// API Client for Streaks Backend

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';

// Types
export interface User {
  id: string;
  email: string;
  username: string;
  displayName: string;
  avatarUrl: string | null;
  bio: string | null;
  level: number;
  totalXp: number;
  currentStreak: number;
  longestStreak: number;
  createdAt: string;
  settings?: UserSettings;
}

export interface UserSettings {
  theme: 'dark' | 'light';
  pushEnabled: boolean;
  streakReminders: boolean;
  friendActivity: boolean;
  squadUpdates: boolean;
  communityUpdates: boolean;
  leaderboardChanges: boolean;
  emailDigest: boolean;
  profilePublic: boolean;
  showStreak: boolean;
  showScore: boolean;
  allowDms: boolean;
  showOnLeaderboard: boolean;
  reminderTime: string;
  gracePeriodEnabled: boolean;
  gracePeriodHours: number;
  weekendMode: boolean;
}

export interface Task {
  id: string;
  title: string;
  description: string | null;
  category: string;
  priority: 'low' | 'medium' | 'high';
  difficulty: 'easy' | 'medium' | 'hard';
  baseXp: number;
  frequency: 'daily' | 'weekly' | 'monthly' | 'one_time';
  dueDate: string | null;
  dueTime: string | null;
  visibility: 'private' | 'squad' | 'community';
  requiresProof: boolean;
  currentStreak: number;
  longestStreak: number;
  lastCompletedDate: string | null;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface TaskCompletion {
  id: string;
  taskId: string;
  userId: string;
  proofUrl: string | null;
  verificationStatus: 'pending' | 'verified' | 'rejected';
  xpEarned: number;
  completedAt: string;
  task?: Task;
}

export interface Friend {
  id: string;
  username: string;
  displayName: string;
  avatarUrl: string | null;
  currentStreak: number;
  totalXp: number;
  status: string;
  lastSeen: string | null;
  friendshipId: string;
}

export interface Squad {
  id: string;
  name: string;
  description: string | null;
  inviteCode: string;
  memberCount: number;
  verificationMode: 'manual' | 'ai' | 'hybrid';
  owner: { id: string; username: string; displayName: string };
  role?: string;
  joinedAt?: string;
}

export interface Community {
  id: string;
  name: string;
  description: string | null;
  category: string;
  isPublic: boolean;
  memberCount: number;
  streakMultiplier: number;
  streakThreshold: number;
  owner: { id: string; username: string; displayName: string };
  role?: string;
  joinedAt?: string;
}

export interface Post {
  id: string;
  content: string;
  imageUrl: string | null;
  likesCount: number;
  commentsCount: number;
  createdAt: string;
  author: {
    id: string;
    username: string;
    displayName: string;
    avatarUrl: string | null;
  };
  isLiked?: boolean;
}

export interface LeaderboardEntry {
  rank: number;
  user: {
    id: string;
    username: string;
    displayName: string;
    avatarUrl: string | null;
  };
  totalXp: number;
  currentStreak: number;
  weeklyXp?: number;
}

export interface Message {
  id: string;
  content: string;
  imageUrl: string | null;
  createdAt: string;
  sender: {
    id: string;
    username: string;
    displayName: string;
    avatarUrl: string | null;
  };
}

export interface Conversation {
  id: string;
  friend: {
    id: string;
    username: string;
    displayName: string;
    avatarUrl: string | null;
  };
  lastMessage: {
    content: string;
    createdAt: string;
    isOwn: boolean;
  } | null;
  hasUnread: boolean;
}

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  details?: { field: string; message: string }[];
}

// Token management
let authToken: string | null = localStorage.getItem('auth_token');

export function setAuthToken(token: string | null) {
  authToken = token;
  if (token) {
    localStorage.setItem('auth_token', token);
  } else {
    localStorage.removeItem('auth_token');
  }
}

export function getAuthToken(): string | null {
  return authToken;
}

// API Client
async function apiRequest<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<ApiResponse<T>> {
  const headers: HeadersInit = {
    'Content-Type': 'application/json',
    ...options.headers,
  };

  if (authToken) {
    (headers as Record<string, string>)['Authorization'] = `Bearer ${authToken}`;
  }

  try {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      ...options,
      headers,
      credentials: 'include', // Include cookies
    });

    const data = await response.json();

    if (!response.ok) {
      return {
        success: false,
        error: data.error || 'An error occurred',
        details: data.details,
      };
    }

    return data;
  } catch (error) {
    console.error('API request failed:', error);
    return {
      success: false,
      error: 'Network error. Please check your connection.',
    };
  }
}

// Auth API
export const authApi = {
  register: (data: {
    email: string;
    username: string;
    displayName: string;
    password: string;
  }) =>
    apiRequest<{ user: User; token: string }>('/api/auth/register', {
      method: 'POST',
      body: JSON.stringify(data),
    }),

  login: (data: { email: string; password: string }) =>
    apiRequest<{ user: User; token: string }>('/api/auth/login', {
      method: 'POST',
      body: JSON.stringify(data),
    }),

  logout: () =>
    apiRequest<{ message: string }>('/api/auth/logout', {
      method: 'POST',
    }),

  me: () => apiRequest<User>('/api/auth/me'),
};

// Users API
export const usersApi = {
  getProfile: (id: string) => apiRequest<User>(`/api/users/${id}`),

  updateProfile: (data: {
    displayName?: string;
    bio?: string;
    avatarUrl?: string;
  }) =>
    apiRequest<User>('/api/users/profile', {
      method: 'PATCH',
      body: JSON.stringify(data),
    }),

  checkUsername: (username: string) =>
    apiRequest<{ available: boolean; reason: string | null }>(
      `/api/users/check-username/${encodeURIComponent(username)}`
    ),

  updateUsername: (username: string) =>
    apiRequest<User>('/api/users/username', {
      method: 'PATCH',
      body: JSON.stringify({ username }),
    }),

  getSettings: () => apiRequest<UserSettings>('/api/users/settings'),

  updateSettings: (data: Partial<UserSettings>) =>
    apiRequest<UserSettings>('/api/users/settings', {
      method: 'PATCH',
      body: JSON.stringify(data),
    }),

  getAchievements: (id: string) =>
    apiRequest<Array<{ id: string; name: string; description: string; icon: string; earnedAt: string }>>(
      `/api/users/${id}/achievements`
    ),

  getActivity: (id: string, limit = 20) =>
    apiRequest<TaskCompletion[]>(`/api/users/${id}/activity?limit=${limit}`),

  search: (query: string, limit = 20) =>
    apiRequest<Array<{
      id: string;
      username: string;
      displayName: string;
      avatarUrl: string | null;
      bio: string | null;
      level: number;
      totalXp: number | null;
      currentStreak: number | null;
    }>>(`/api/users/search?q=${encodeURIComponent(query)}&limit=${limit}`),
};

// Tasks API
export const tasksApi = {
  getAll: () => apiRequest<Task[]>('/api/tasks'),

  getOne: (id: string) => apiRequest<Task>(`/api/tasks/${id}`),

  create: (data: {
    title: string;
    description?: string;
    category: string;
    difficultyMultiplier?: number;
    deadline?: string;
    isRecurring?: boolean;
    recurringPattern?: string;
    squadId?: string;
    communityId?: string;
  }) =>
    apiRequest<Task>('/api/tasks', {
      method: 'POST',
      body: JSON.stringify(data),
    }),

  update: (
    id: string,
    data: {
      title?: string;
      description?: string;
      category?: string;
      difficultyMultiplier?: number;
      deadline?: string;
    }
  ) =>
    apiRequest<Task>(`/api/tasks/${id}`, {
      method: 'PATCH',
      body: JSON.stringify(data),
    }),

  delete: (id: string) =>
    apiRequest<{ message: string }>(`/api/tasks/${id}`, {
      method: 'DELETE',
    }),

  complete: (id: string, proofUrl?: string) =>
    apiRequest<{ completion: TaskCompletion; xpEarned: number; newLevel?: number }>(
      `/api/tasks/${id}/complete`,
      {
        method: 'POST',
        body: JSON.stringify({ proofUrl }),
      }
    ),

  getCompletions: (id: string) =>
    apiRequest<TaskCompletion[]>(`/api/tasks/${id}/completions`),
};

// Friends API
export const friendsApi = {
  getAll: () => apiRequest<Friend[]>('/api/friends'),

  getRequests: () =>
    apiRequest<{
      incoming: Array<{ id: string; user: Friend; createdAt: string }>;
      outgoing: Array<{ id: string; user: Friend; createdAt: string }>;
    }>('/api/friends/requests'),

  sendRequest: (userId: string) =>
    apiRequest<{ id: string }>(`/api/friends/request/${userId}`, {
      method: 'POST',
    }),

  acceptRequest: (requestId: string) =>
    apiRequest<{ id: string }>(`/api/friends/accept/${requestId}`, {
      method: 'POST',
    }),

  rejectRequest: (requestId: string) =>
    apiRequest<{ message: string }>(`/api/friends/reject/${requestId}`, {
      method: 'POST',
    }),

  remove: (friendshipId: string) =>
    apiRequest<{ message: string }>(`/api/friends/${friendshipId}`, {
      method: 'DELETE',
    }),

  getSuggestions: (limit = 10) =>
    apiRequest<Friend[]>(`/api/friends/suggestions?limit=${limit}`),
};

// Messages API
export const messagesApi = {
  getConversations: () => apiRequest<Conversation[]>('/api/messages/conversations'),

  getMessages: (conversationId: string, limit = 50, cursor?: string) =>
    apiRequest<{ messages: Message[]; hasMore: boolean; nextCursor: string | null }>(
      `/api/messages/${conversationId}?limit=${limit}${cursor ? `&cursor=${cursor}` : ''}`
    ),

  send: (friendId: string, content: string, imageUrl?: string) =>
    apiRequest<{ message: Message; conversationId: string }>(
      `/api/messages/${friendId}`,
      {
        method: 'POST',
        body: JSON.stringify({ content, imageUrl }),
      }
    ),

  markRead: (conversationId: string) =>
    apiRequest<{ success: boolean }>(`/api/messages/${conversationId}/read`, {
      method: 'POST',
    }),

  deleteMessage: (messageId: string) =>
    apiRequest<{ message: string }>(`/api/messages/message/${messageId}`, {
      method: 'DELETE',
    }),

  editMessage: (messageId: string, content: string) =>
    apiRequest<Message>(`/api/messages/message/${messageId}`, {
      method: 'PATCH',
      body: JSON.stringify({ content }),
    }),

  replyToMessage: (messageId: string, content: string, imageUrl?: string) =>
    apiRequest<{ message: Message; conversationId: string }>(
      `/api/messages/reply/${messageId}`,
      {
        method: 'POST',
        body: JSON.stringify({ content, imageUrl }),
      }
    ),
};

// Squads API
export const squadsApi = {
  getAll: () => apiRequest<Squad[]>('/api/squads'),

  getOne: (id: string) => apiRequest<Squad & { members: Array<{ user: Friend; role: string }> }>(`/api/squads/${id}`),

  create: (data: {
    name: string;
    description?: string;
    verificationMode?: 'manual' | 'ai' | 'hybrid';
  }) =>
    apiRequest<Squad>('/api/squads', {
      method: 'POST',
      body: JSON.stringify(data),
    }),

  update: (
    id: string,
    data: {
      name?: string;
      description?: string;
      verificationMode?: 'manual' | 'ai' | 'hybrid';
    }
  ) =>
    apiRequest<Squad>(`/api/squads/${id}`, {
      method: 'PATCH',
      body: JSON.stringify(data),
    }),

  join: (inviteCode: string) =>
    apiRequest<Squad>(`/api/squads/join/${inviteCode}`, {
      method: 'POST',
    }),

  leave: (id: string) =>
    apiRequest<{ message: string }>(`/api/squads/${id}/leave`, {
      method: 'DELETE',
    }),

  regenerateInvite: (id: string) =>
    apiRequest<{ inviteCode: string }>(`/api/squads/${id}/regenerate-invite`, {
      method: 'POST',
    }),

  addMember: (squadId: string, userId: string) =>
    apiRequest<{ user: Friend; role: string }>(`/api/squads/${squadId}/add-member`, {
      method: 'POST',
      body: JSON.stringify({ userId }),
    }),

  removeMember: (squadId: string, memberId: string) =>
    apiRequest<{ message: string }>(`/api/squads/${squadId}/members/${memberId}`, {
      method: 'DELETE',
    }),

  updateMemberRole: (squadId: string, memberId: string, role: 'admin' | 'member') =>
    apiRequest<{ user: Friend; role: string }>(`/api/squads/${squadId}/members/${memberId}/role`, {
      method: 'PATCH',
      body: JSON.stringify({ role }),
    }),

  transferOwnership: (squadId: string, newOwnerId: string) =>
    apiRequest<{ message: string }>(`/api/squads/${squadId}/transfer-ownership`, {
      method: 'POST',
      body: JSON.stringify({ newOwnerId }),
    }),
};

// Communities API
export const communitiesApi = {
  getAll: (params?: { category?: string; search?: string }) => {
    const query = new URLSearchParams();
    if (params?.category) query.set('category', params.category);
    if (params?.search) query.set('search', params.search);
    return apiRequest<Community[]>(`/api/communities?${query}`);
  },

  getMy: () => apiRequest<Community[]>('/api/communities/my'),

  getOne: (id: string) => apiRequest<Community & { members: Array<{ user: Friend; role: string }> }>(`/api/communities/${id}`),

  create: (data: {
    name: string;
    description?: string;
    category: string;
    streakMultiplier?: number;
    streakThreshold?: number;
  }) =>
    apiRequest<Community>('/api/communities', {
      method: 'POST',
      body: JSON.stringify(data),
    }),

  update: (
    id: string,
    data: {
      name?: string;
      description?: string;
      streakMultiplier?: number;
      streakThreshold?: number;
    }
  ) =>
    apiRequest<Community>(`/api/communities/${id}`, {
      method: 'PATCH',
      body: JSON.stringify(data),
    }),

  join: (id: string) =>
    apiRequest<{ message: string }>(`/api/communities/${id}/join`, {
      method: 'POST',
    }),

  leave: (id: string) =>
    apiRequest<{ message: string }>(`/api/communities/${id}/leave`, {
      method: 'DELETE',
    }),

  getLeaderboard: (id: string) =>
    apiRequest<LeaderboardEntry[]>(`/api/communities/${id}/leaderboard`),
};

// Feed API
export const feedApi = {
  getPosts: (limit = 20, cursor?: string) =>
    apiRequest<{ posts: Post[]; hasMore: boolean; nextCursor: string | null }>(
      `/api/feed?limit=${limit}${cursor ? `&cursor=${cursor}` : ''}`
    ),

  createPost: (content: string, imageUrl?: string, taskCompletionId?: string) =>
    apiRequest<Post>('/api/feed', {
      method: 'POST',
      body: JSON.stringify({ content, imageUrl, taskCompletionId }),
    }),

  likePost: (id: string) =>
    apiRequest<{ liked: boolean }>(`/api/feed/${id}/like`, {
      method: 'POST',
    }),

  getComments: (id: string) =>
    apiRequest<Array<{ id: string; content: string; author: Friend; createdAt: string }>>(
      `/api/feed/${id}/comments`
    ),

  addComment: (id: string, content: string) =>
    apiRequest<{ id: string; content: string }>(`/api/feed/${id}/comments`, {
      method: 'POST',
      body: JSON.stringify({ content }),
    }),
};

// Leaderboard API
export const leaderboardApi = {
  getGlobal: (period: 'all' | 'weekly' | 'monthly' = 'all', limit = 100) =>
    apiRequest<{ leaderboard: LeaderboardEntry[]; userRank: number | null }>(
      `/api/leaderboard?period=${period}&limit=${limit}`
    ),

  getFriends: () =>
    apiRequest<LeaderboardEntry[]>('/api/leaderboard/friends'),

  getSquad: (squadId: string) =>
    apiRequest<LeaderboardEntry[]>(`/api/leaderboard/squad/${squadId}`),
};

// Verification API
export const verificationApi = {
  getQueue: () =>
    apiRequest<Array<{
      id: string;
      proofUrl: string;
      task: Task;
      user: Friend;
      submittedAt: string;
    }>>('/api/verification/queue'),

  approve: (id: string) =>
    apiRequest<{ message: string }>(`/api/verification/${id}/approve`, {
      method: 'POST',
    }),

  reject: (id: string, reason?: string) =>
    apiRequest<{ message: string }>(`/api/verification/${id}/reject`, {
      method: 'POST',
      body: JSON.stringify({ reason }),
    }),
};

export default {
  auth: authApi,
  users: usersApi,
  tasks: tasksApi,
  friends: friendsApi,
  messages: messagesApi,
  squads: squadsApi,
  communities: communitiesApi,
  feed: feedApi,
  leaderboard: leaderboardApi,
  verification: verificationApi,
};
