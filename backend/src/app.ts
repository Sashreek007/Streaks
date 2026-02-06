import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import cookieParser from 'cookie-parser';
import passport from 'passport';
import { env } from './config/env.js';
import { apiLimiter } from './middleware/rateLimit.js';

// Import passport config (to register strategies)
import './config/passport.js';

// Route imports
import authRoutes from './routes/auth.js';
import userRoutes from './routes/users.js';
import taskRoutes from './routes/tasks.js';
import friendRoutes from './routes/friends.js';
import messageRoutes from './routes/messages.js';
import squadRoutes from './routes/squads.js';
import communityRoutes from './routes/communities.js';
import feedRoutes from './routes/feed.js';
import leaderboardRoutes from './routes/leaderboard.js';
import verificationRoutes from './routes/verification.js';
import oauthRoutes from './routes/oauth.js';

const app = express();

// Security middleware
app.use(helmet());
app.use(
  cors({
    origin: env.frontendUrl,
    credentials: true,
  })
);

// Body parsing
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// Rate limiting
app.use('/api', apiLimiter);

// Initialize Passport
app.use(passport.initialize());

// Health check
app.get('/health', (_req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/tasks', taskRoutes);
app.use('/api/friends', friendRoutes);
app.use('/api/messages', messageRoutes);
app.use('/api/squads', squadRoutes);
app.use('/api/communities', communityRoutes);
app.use('/api/feed', feedRoutes);
app.use('/api/leaderboard', leaderboardRoutes);
app.use('/api/verification', verificationRoutes);
app.use('/api/oauth', oauthRoutes);

// 404 handler
app.use((_req, res) => {
  res.status(404).json({ success: false, error: 'Not found' });
});

// Error handler
app.use((err: Error, _req: express.Request, res: express.Response, _next: express.NextFunction) => {
  console.error('Error:', err);

  res.status(500).json({
    success: false,
    error: env.isDev ? err.message : 'Internal server error',
  });
});

export default app;
