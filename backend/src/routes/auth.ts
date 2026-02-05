import { Router } from 'express';
import bcrypt from 'bcryptjs';
import { z } from 'zod';
import prisma from '../lib/prisma.js';
import { validate } from '../middleware/validate.js';
import { generateToken, authenticate } from '../middleware/auth.js';
import { authLimiter } from '../middleware/rateLimit.js';
import type { AuthenticatedRequest } from '../types/index.js';

const router = Router();

// Validation schemas
const registerSchema = z.object({
  email: z.string().email(),
  username: z.string().min(3).max(30).regex(/^[a-zA-Z0-9_]+$/),
  displayName: z.string().min(1).max(100),
  password: z.string().min(8),
});

const loginSchema = z.object({
  email: z.string().email(),
  password: z.string(),
});

// POST /api/auth/register
router.post(
  '/register',
  authLimiter,
  validate(registerSchema),
  async (req, res, next) => {
    try {
      const { email, username, displayName, password } = req.body;

      // Check if email or username already exists
      const existing = await prisma.user.findFirst({
        where: {
          OR: [{ email }, { username }],
        },
      });

      if (existing) {
        res.status(400).json({
          success: false,
          error: existing.email === email ? 'Email already registered' : 'Username taken',
        });
        return;
      }

      // Hash password
      const passwordHash = await bcrypt.hash(password, 12);

      // Create user with settings
      const user = await prisma.user.create({
        data: {
          email,
          username,
          displayName,
          passwordHash,
          settings: {
            create: {}, // Creates with defaults
          },
          presence: {
            create: { status: 'online' },
          },
        },
        select: {
          id: true,
          email: true,
          username: true,
          displayName: true,
          avatarUrl: true,
          level: true,
          totalXp: true,
          currentStreak: true,
          createdAt: true,
        },
      });

      // Generate token
      const token = generateToken({
        id: user.id,
        email: user.email,
        username: user.username,
      });

      // Set cookie
      res.cookie('token', token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
      });

      res.status(201).json({
        success: true,
        data: { user, token },
      });
    } catch (error) {
      next(error);
    }
  }
);

// POST /api/auth/login
router.post(
  '/login',
  authLimiter,
  validate(loginSchema),
  async (req, res, next) => {
    try {
      const { email, password } = req.body;

      // Find user
      const user = await prisma.user.findUnique({
        where: { email },
        select: {
          id: true,
          email: true,
          username: true,
          displayName: true,
          avatarUrl: true,
          passwordHash: true,
          level: true,
          totalXp: true,
          currentStreak: true,
        },
      });

      if (!user || !user.passwordHash) {
        res.status(401).json({
          success: false,
          error: 'Invalid email or password',
        });
        return;
      }

      // Verify password
      const isValid = await bcrypt.compare(password, user.passwordHash);

      if (!isValid) {
        res.status(401).json({
          success: false,
          error: 'Invalid email or password',
        });
        return;
      }

      // Update presence
      await prisma.userPresence.upsert({
        where: { userId: user.id },
        update: { status: 'online', lastSeen: new Date() },
        create: { userId: user.id, status: 'online' },
      });

      // Generate token
      const token = generateToken({
        id: user.id,
        email: user.email,
        username: user.username,
      });

      // Set cookie
      res.cookie('token', token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        maxAge: 7 * 24 * 60 * 60 * 1000,
      });

      // Remove passwordHash from response
      const { passwordHash: _, ...userData } = user;

      res.json({
        success: true,
        data: { user: userData, token },
      });
    } catch (error) {
      next(error);
    }
  }
);

// POST /api/auth/logout
router.post('/logout', authenticate, async (req: AuthenticatedRequest, res, next) => {
  try {
    // Update presence to offline
    if (req.user) {
      await prisma.userPresence.update({
        where: { userId: req.user.id },
        data: { status: 'offline', lastSeen: new Date() },
      });
    }

    // Clear cookie
    res.clearCookie('token');

    res.json({ success: true, message: 'Logged out' });
  } catch (error) {
    next(error);
  }
});

// GET /api/auth/me
router.get('/me', authenticate, async (req: AuthenticatedRequest, res, next) => {
  try {
    const user = await prisma.user.findUnique({
      where: { id: req.user!.id },
      select: {
        id: true,
        email: true,
        username: true,
        displayName: true,
        avatarUrl: true,
        bio: true,
        level: true,
        totalXp: true,
        currentStreak: true,
        longestStreak: true,
        createdAt: true,
        settings: true,
      },
    });

    if (!user) {
      res.status(404).json({ success: false, error: 'User not found' });
      return;
    }

    res.json({ success: true, data: user });
  } catch (error) {
    next(error);
  }
});

export default router;
