import passport from 'passport';
import { Strategy as GoogleStrategy } from 'passport-google-oauth20';
import { Strategy as GitHubStrategy } from 'passport-github2';
import prisma from '../lib/prisma.js';
import { env } from './env.js';

// Serialize user for session
passport.serializeUser((user: any, done) => {
  done(null, user.id);
});

// Deserialize user from session
passport.deserializeUser(async (id: string, done) => {
  try {
    const user = await prisma.user.findUnique({ where: { id } });
    done(null, user);
  } catch (error) {
    done(error, null);
  }
});

// Google OAuth Strategy
if (env.googleClientId && env.googleClientSecret) {
  passport.use(
    new GoogleStrategy(
      {
        clientID: env.googleClientId,
        clientSecret: env.googleClientSecret,
        callbackURL: `${env.apiUrl || 'http://localhost:3000'}/api/oauth/google/callback`,
        scope: ['profile', 'email'],
      },
      async (accessToken, refreshToken, profile, done) => {
        try {
          const email = profile.emails?.[0]?.value;
          const displayName = profile.displayName || profile.name?.givenName || 'User';
          const avatarUrl = profile.photos?.[0]?.value || null;

          if (!email) {
            return done(new Error('No email provided by Google'), undefined);
          }

          // Check if user exists with this OAuth connection
          let oauthConnection = await prisma.oAuthConnection.findUnique({
            where: {
              provider_providerUserId: {
                provider: 'google',
                providerUserId: profile.id,
              },
            },
            include: { user: true },
          });

          if (oauthConnection) {
            // User already connected, update tokens
            await prisma.oAuthConnection.update({
              where: { id: oauthConnection.id },
              data: {
                accessToken,
                refreshToken: refreshToken || undefined,
              },
            });
            return done(null, oauthConnection.user);
          }

          // Check if user exists with this email
          let user = await prisma.user.findUnique({
            where: { email },
          });

          if (user) {
            // Link existing account
            await prisma.oAuthConnection.create({
              data: {
                userId: user.id,
                provider: 'google',
                providerUserId: profile.id,
                accessToken,
                refreshToken: refreshToken || undefined,
              },
            });
          } else {
            // Create new user
            const username = email.split('@')[0].toLowerCase().replace(/[^a-z0-9_]/g, '') +
              Math.random().toString(36).substring(2, 6);

            user = await prisma.user.create({
              data: {
                email,
                username,
                displayName,
                avatarUrl,
                oauthConnections: {
                  create: {
                    provider: 'google',
                    providerUserId: profile.id,
                    accessToken,
                    refreshToken: refreshToken || undefined,
                  },
                },
              },
            });
          }

          return done(null, user);
        } catch (error) {
          return done(error as Error, undefined);
        }
      }
    )
  );
}

// GitHub OAuth Strategy
if (env.githubClientId && env.githubClientSecret) {
  passport.use(
    new GitHubStrategy(
      {
        clientID: env.githubClientId,
        clientSecret: env.githubClientSecret,
        callbackURL: `${env.apiUrl || 'http://localhost:3000'}/api/oauth/github/callback`,
        scope: ['user:email'],
      },
      async (accessToken: string, refreshToken: string, profile: any, done: any) => {
        try {
          const email = profile.emails?.[0]?.value || `${profile.username}@github.local`;
          const displayName = profile.displayName || profile.username || 'User';
          const avatarUrl = profile.photos?.[0]?.value || profile._json?.avatar_url || null;

          // Check if user exists with this OAuth connection
          let oauthConnection = await prisma.oAuthConnection.findUnique({
            where: {
              provider_providerUserId: {
                provider: 'github',
                providerUserId: profile.id.toString(),
              },
            },
            include: { user: true },
          });

          if (oauthConnection) {
            // User already connected, update tokens
            await prisma.oAuthConnection.update({
              where: { id: oauthConnection.id },
              data: {
                accessToken,
                refreshToken: refreshToken || undefined,
              },
            });
            return done(null, oauthConnection.user);
          }

          // Check if user exists with this email
          let user = await prisma.user.findUnique({
            where: { email },
          });

          if (user) {
            // Link existing account
            await prisma.oAuthConnection.create({
              data: {
                userId: user.id,
                provider: 'github',
                providerUserId: profile.id.toString(),
                accessToken,
                refreshToken: refreshToken || undefined,
              },
            });
          } else {
            // Create new user
            const username = (profile.username || email.split('@')[0])
              .toLowerCase()
              .replace(/[^a-z0-9_]/g, '')
              .substring(0, 20);

            user = await prisma.user.create({
              data: {
                email,
                username: username + Math.random().toString(36).substring(2, 6),
                displayName,
                avatarUrl,
                oauthConnections: {
                  create: {
                    provider: 'github',
                    providerUserId: profile.id.toString(),
                    accessToken,
                    refreshToken: refreshToken || undefined,
                  },
                },
              },
            });
          }

          return done(null, user);
        } catch (error) {
          return done(error as Error, undefined);
        }
      }
    )
  );
}

export default passport;
