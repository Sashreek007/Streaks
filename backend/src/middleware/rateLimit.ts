import rateLimit from 'express-rate-limit';
import { env } from '../config/env.js';

// General API rate limit
export const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: env.isProd ? 500 : 1000, // Increased from 100 to 500 for production
  message: {
    success: false,
    error: 'Too many requests, please try again later.',
  },
  standardHeaders: true,
  legacyHeaders: false,
});

// Stricter limit for auth endpoints
export const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: env.isProd ? 5 : 100, // 5 attempts per 15 min in prod
  message: {
    success: false,
    error: 'Too many login attempts, please try again later.',
  },
  standardHeaders: true,
  legacyHeaders: false,
});

// Rate limit for file uploads
export const uploadLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hour
  max: env.isProd ? 50 : 500, // 50 uploads per hour
  message: {
    success: false,
    error: 'Upload limit reached, please try again later.',
  },
  standardHeaders: true,
  legacyHeaders: false,
});
