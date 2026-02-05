import type { Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { env } from '../config/env.js';
import prisma from '../lib/prisma.js';
import type { AuthenticatedRequest } from '../types/index.js';

interface JwtPayload {
  userId: string;
  email: string;
  username: string;
}

export async function authenticate(
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
) {
  try {
    // Get token from header or cookie
    const authHeader = req.headers.authorization;
    const token = authHeader?.startsWith('Bearer ')
      ? authHeader.slice(7)
      : req.cookies?.token;

    if (!token) {
      res.status(401).json({ success: false, error: 'Authentication required' });
      return;
    }

    // Verify token
    const decoded = jwt.verify(token, env.jwtSecret) as JwtPayload;

    // Check if user still exists
    const user = await prisma.user.findUnique({
      where: { id: decoded.userId },
      select: { id: true, email: true, username: true },
    });

    if (!user) {
      res.status(401).json({ success: false, error: 'User not found' });
      return;
    }

    // Attach user to request
    req.user = {
      id: user.id,
      email: user.email,
      username: user.username,
    };

    next();
  } catch (error) {
    if (error instanceof jwt.JsonWebTokenError) {
      res.status(401).json({ success: false, error: 'Invalid token' });
      return;
    }
    if (error instanceof jwt.TokenExpiredError) {
      res.status(401).json({ success: false, error: 'Token expired' });
      return;
    }
    next(error);
  }
}

// Optional auth - doesn't fail if no token, but attaches user if present
export async function optionalAuth(
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
) {
  try {
    const authHeader = req.headers.authorization;
    const token = authHeader?.startsWith('Bearer ')
      ? authHeader.slice(7)
      : req.cookies?.token;

    if (token) {
      const decoded = jwt.verify(token, env.jwtSecret) as JwtPayload;
      const user = await prisma.user.findUnique({
        where: { id: decoded.userId },
        select: { id: true, email: true, username: true },
      });

      if (user) {
        req.user = user;
      }
    }

    next();
  } catch {
    // Ignore token errors for optional auth
    next();
  }
}

// Generate JWT token
export function generateToken(user: { id: string; email: string; username: string }): string {
  return jwt.sign(
    {
      userId: user.id,
      email: user.email,
      username: user.username,
    },
    env.jwtSecret,
    { expiresIn: env.jwtExpiresIn }
  );
}
