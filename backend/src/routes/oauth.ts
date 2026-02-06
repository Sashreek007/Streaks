import { Router } from 'express';
import passport from '../config/passport.js';
import jwt from 'jsonwebtoken';
import { env } from '../config/env.js';
import type { User } from '@prisma/client';

const router = Router();

// Generate JWT token
function generateToken(user: User): string {
  return jwt.sign(
    { userId: user.id, email: user.email },
    env.jwtSecret,
    { expiresIn: env.jwtExpiresIn as jwt.SignOptions['expiresIn'] }
  );
}

// Google OAuth routes
router.get(
  '/google',
  passport.authenticate('google', {
    scope: ['profile', 'email'],
    session: false,
  })
);

router.get(
  '/google/callback',
  passport.authenticate('google', {
    session: false,
    failureRedirect: `${env.frontendUrl}/?error=google_auth_failed`,
  }),
  (req, res) => {
    const user = req.user as User;
    const token = generateToken(user);

    // Redirect to frontend with token
    res.redirect(`${env.frontendUrl}/oauth/callback?token=${token}`);
  }
);

// GitHub OAuth routes
router.get(
  '/github',
  passport.authenticate('github', {
    scope: ['user:email'],
    session: false,
  })
);

router.get(
  '/github/callback',
  passport.authenticate('github', {
    session: false,
    failureRedirect: `${env.frontendUrl}/?error=github_auth_failed`,
  }),
  (req, res) => {
    const user = req.user as User;
    const token = generateToken(user);

    // Redirect to frontend with token
    res.redirect(`${env.frontendUrl}/oauth/callback?token=${token}`);
  }
);

export default router;
