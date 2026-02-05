import 'dotenv/config';
import { PrismaClient } from '../node_modules/.prisma/client/index.js';
import { PrismaPg } from '@prisma/adapter-pg';
import pg from 'pg';

// Use direct connection for seeding
const connectionString = process.env.DIRECT_URL || 'postgresql://postgres:postgres@localhost:51214/template1';
const pool = new pg.Pool({ connectionString });
const adapter = new PrismaPg(pool);

const prisma = new PrismaClient({ adapter });

async function main() {
  console.log('🌱 Seeding database...');

  // Seed Level Thresholds (Exponential curve)
  const levelThresholds = [
    { level: 1, xpRequired: 0, title: 'Novice' },
    { level: 2, xpRequired: 100, title: 'Novice' },
    { level: 3, xpRequired: 250, title: 'Novice' },
    { level: 4, xpRequired: 450, title: 'Beginner' },
    { level: 5, xpRequired: 700, title: 'Beginner' },
    { level: 6, xpRequired: 1000, title: 'Beginner' },
    { level: 7, xpRequired: 1400, title: 'Intermediate' },
    { level: 8, xpRequired: 1900, title: 'Intermediate' },
    { level: 9, xpRequired: 2500, title: 'Intermediate' },
    { level: 10, xpRequired: 3200, title: 'Intermediate' },
    { level: 11, xpRequired: 4000, title: 'Advanced' },
    { level: 12, xpRequired: 4900, title: 'Advanced' },
    { level: 13, xpRequired: 5900, title: 'Advanced' },
    { level: 14, xpRequired: 7000, title: 'Advanced' },
    { level: 15, xpRequired: 8200, title: 'Advanced' },
    { level: 16, xpRequired: 9500, title: 'Expert' },
    { level: 17, xpRequired: 11000, title: 'Expert' },
    { level: 18, xpRequired: 12700, title: 'Expert' },
    { level: 19, xpRequired: 14600, title: 'Expert' },
    { level: 20, xpRequired: 16700, title: 'Expert' },
    { level: 25, xpRequired: 27500, title: 'Master' },
    { level: 30, xpRequired: 42000, title: 'Master' },
    { level: 35, xpRequired: 60000, title: 'Grandmaster' },
    { level: 40, xpRequired: 82000, title: 'Grandmaster' },
    { level: 45, xpRequired: 108000, title: 'Legend' },
    { level: 50, xpRequired: 140000, title: 'Legend' },
    { level: 60, xpRequired: 220000, title: 'Mythic' },
    { level: 70, xpRequired: 330000, title: 'Mythic' },
    { level: 80, xpRequired: 480000, title: 'Immortal' },
    { level: 90, xpRequired: 680000, title: 'Immortal' },
    { level: 100, xpRequired: 1000000, title: 'Transcendent' },
  ];

  for (const threshold of levelThresholds) {
    await prisma.levelThreshold.upsert({
      where: { level: threshold.level },
      update: threshold,
      create: threshold,
    });
  }
  console.log('✅ Level thresholds seeded');

  // Seed Achievements
  const achievements = [
    // Streak Achievements
    {
      name: 'First Flame',
      description: 'Complete your first task',
      icon: 'flame',
      category: 'streak',
      criteria: { type: 'tasks_completed', value: 1 },
      xpReward: 50,
    },
    {
      name: 'Week Warrior',
      description: 'Maintain a 7-day streak',
      icon: 'calendar',
      category: 'streak',
      criteria: { type: 'streak', value: 7 },
      xpReward: 100,
    },
    {
      name: 'Fortnight Fighter',
      description: 'Maintain a 14-day streak',
      icon: 'calendar-check',
      category: 'streak',
      criteria: { type: 'streak', value: 14 },
      xpReward: 200,
    },
    {
      name: 'Monthly Master',
      description: 'Maintain a 30-day streak',
      icon: 'calendar-heart',
      category: 'streak',
      criteria: { type: 'streak', value: 30 },
      xpReward: 500,
    },
    {
      name: 'Quarterly Queen',
      description: 'Maintain a 90-day streak',
      icon: 'crown',
      category: 'streak',
      criteria: { type: 'streak', value: 90 },
      xpReward: 1000,
    },
    {
      name: 'Year of Dedication',
      description: 'Maintain a 365-day streak',
      icon: 'trophy',
      category: 'streak',
      criteria: { type: 'streak', value: 365 },
      xpReward: 5000,
      isHidden: true,
    },

    // Completion Achievements
    {
      name: 'Getting Started',
      description: 'Complete 10 tasks',
      icon: 'check-circle',
      category: 'completion',
      criteria: { type: 'tasks_completed', value: 10 },
      xpReward: 100,
    },
    {
      name: 'Productive',
      description: 'Complete 50 tasks',
      icon: 'check-circle-2',
      category: 'completion',
      criteria: { type: 'tasks_completed', value: 50 },
      xpReward: 250,
    },
    {
      name: 'Century Club',
      description: 'Complete 100 tasks',
      icon: 'award',
      category: 'completion',
      criteria: { type: 'tasks_completed', value: 100 },
      xpReward: 500,
    },
    {
      name: 'Task Master',
      description: 'Complete 500 tasks',
      icon: 'medal',
      category: 'completion',
      criteria: { type: 'tasks_completed', value: 500 },
      xpReward: 1500,
    },
    {
      name: 'Unstoppable',
      description: 'Complete 1000 tasks',
      icon: 'rocket',
      category: 'completion',
      criteria: { type: 'tasks_completed', value: 1000 },
      xpReward: 3000,
    },

    // Social Achievements
    {
      name: 'Team Player',
      description: 'Join your first squad',
      icon: 'users',
      category: 'social',
      criteria: { type: 'squads_joined', value: 1 },
      xpReward: 50,
    },
    {
      name: 'Community Member',
      description: 'Join 3 communities',
      icon: 'globe',
      category: 'social',
      criteria: { type: 'communities_joined', value: 3 },
      xpReward: 100,
    },
    {
      name: 'Social Butterfly',
      description: 'Have 10 friends',
      icon: 'heart',
      category: 'social',
      criteria: { type: 'friends_count', value: 10 },
      xpReward: 150,
    },
    {
      name: 'Networker',
      description: 'Have 50 friends',
      icon: 'network',
      category: 'social',
      criteria: { type: 'friends_count', value: 50 },
      xpReward: 500,
    },
    {
      name: 'Squad Leader',
      description: 'Create a squad',
      icon: 'crown',
      category: 'social',
      criteria: { type: 'squads_created', value: 1 },
      xpReward: 200,
    },

    // Leaderboard Achievements
    {
      name: 'Rising Star',
      description: 'Reach top 100 on the leaderboard',
      icon: 'star',
      category: 'special',
      criteria: { type: 'leaderboard_rank', value: 100 },
      xpReward: 200,
    },
    {
      name: 'Champion',
      description: 'Reach top 10 on the leaderboard',
      icon: 'trophy',
      category: 'special',
      criteria: { type: 'leaderboard_rank', value: 10 },
      xpReward: 1000,
    },
    {
      name: 'Number One',
      description: 'Reach #1 on the leaderboard',
      icon: 'crown',
      category: 'special',
      criteria: { type: 'leaderboard_rank', value: 1 },
      xpReward: 5000,
      isHidden: true,
    },

    // Special Achievements
    {
      name: 'Early Bird',
      description: 'Complete a task before 7 AM',
      icon: 'sunrise',
      category: 'special',
      criteria: { type: 'task_completed_before', value: 7 },
      xpReward: 50,
    },
    {
      name: 'Night Owl',
      description: 'Complete a task after 11 PM',
      icon: 'moon',
      category: 'special',
      criteria: { type: 'task_completed_after', value: 23 },
      xpReward: 50,
    },
    {
      name: 'Weekend Warrior',
      description: 'Complete tasks on 10 weekends',
      icon: 'sun',
      category: 'special',
      criteria: { type: 'weekend_completions', value: 10 },
      xpReward: 200,
    },
    {
      name: 'Perfectionist',
      description: 'Get 10 tasks verified on first try',
      icon: 'target',
      category: 'special',
      criteria: { type: 'first_try_verifications', value: 10 },
      xpReward: 300,
    },
    {
      name: 'Variety is the Spice',
      description: 'Complete tasks in 5 different categories',
      icon: 'palette',
      category: 'special',
      criteria: { type: 'categories_completed', value: 5 },
      xpReward: 150,
    },

    // XP Milestones
    {
      name: 'First Thousand',
      description: 'Earn 1,000 XP',
      icon: 'zap',
      category: 'special',
      criteria: { type: 'total_xp', value: 1000 },
      xpReward: 100,
    },
    {
      name: 'XP Hunter',
      description: 'Earn 10,000 XP',
      icon: 'bolt',
      category: 'special',
      criteria: { type: 'total_xp', value: 10000 },
      xpReward: 500,
    },
    {
      name: 'XP Legend',
      description: 'Earn 100,000 XP',
      icon: 'sparkles',
      category: 'special',
      criteria: { type: 'total_xp', value: 100000 },
      xpReward: 2000,
    },
  ];

  for (const achievement of achievements) {
    await prisma.achievement.upsert({
      where: {
        id: (await prisma.achievement.findFirst({
          where: { name: achievement.name }
        }))?.id || 'new-id'
      },
      update: achievement,
      create: achievement,
    });
  }
  console.log('✅ Achievements seeded');

  console.log('🎉 Seeding completed!');
}

main()
  .catch((e) => {
    console.error('Error seeding:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
