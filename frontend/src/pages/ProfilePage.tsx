import { useState } from 'react';
import { Settings, Edit2, Flame, Trophy, CheckCircle2, Users, Zap, Star, TrendingUp, Award } from 'lucide-react';

// Mock data
const userData = {
  name: 'John Doe',
  username: '@johndoe',
  bio: 'Building better habits, one day at a time. Fitness enthusiast and lifelong learner.',
  avatar: 'JD',
  stats: {
    score: 9500,
    streak: 12,
    tasksCompleted: 156,
    groups: 4,
  },
  level: 24,
  xpProgress: 65,
  joinedDate: 'January 2024',
};

const recentActivity = [
  { id: 1, type: 'task', title: 'Completed morning workout', time: '2H AGO', points: 50 },
  { id: 2, type: 'streak', title: 'Reached 12-day streak!', time: '1D AGO', points: 100 },
  { id: 3, type: 'task', title: 'Read for 30 minutes', time: '1D AGO', points: 30 },
  { id: 4, type: 'badge', title: 'Earned Early Bird badge', time: '3D AGO', points: 200 },
];

const achievements = [
  { id: 1, name: 'First Streak', description: '7 days in a row', icon: Flame, earned: true, color: 'streak' },
  { id: 2, name: 'Team Player', description: 'Join 3 groups', icon: Users, earned: true, color: 'primary' },
  { id: 3, name: 'Century', description: 'Complete 100 tasks', icon: CheckCircle2, earned: true, color: 'success' },
  { id: 4, name: 'Champion', description: 'Reach top 10', icon: Trophy, earned: false, color: 'achievement' },
];

export default function ProfilePage() {
  const [activeTab, setActiveTab] = useState<'activity' | 'achievements'>('activity');

  return (
    <div className="p-4 lg:p-8 max-w-5xl mx-auto space-y-8">
      {/* Identity Card */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-card via-card to-primary/5 border border-border p-8 lg:p-10 shadow-2xl">
        <div className="absolute inset-0 bg-noise opacity-10 pointer-events-none" />
        <div className="absolute top-0 right-0 w-64 h-64 bg-primary/20 blur-[100px] rounded-full pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-48 h-48 bg-streak/10 blur-[80px] rounded-full pointer-events-none" />

        <div className="relative z-10 flex flex-col md:flex-row gap-8 items-start">
          {/* Avatar with Level Ring */}
          <div className="relative">
            <div className="w-28 h-28 lg:w-32 lg:h-32 rounded-2xl bg-gradient-to-br from-primary to-success flex items-center justify-center text-white text-4xl font-black shadow-xl">
              {userData.avatar}
            </div>
            <div className="absolute -bottom-2 -right-2 bg-achievement text-achievement-foreground px-3 py-1 rounded-full text-sm font-black shadow-lg flex items-center gap-1">
              <Star className="w-3 h-3" />
              LVL {userData.level}
            </div>
          </div>

          <div className="flex-1 space-y-4">
            <div>
              <div className="flex items-center gap-3 flex-wrap">
                <h1 className="text-3xl lg:text-4xl font-black text-foreground tracking-tight">{userData.name}</h1>
                <div className="px-3 py-1 bg-xp/10 border border-xp/20 text-xp text-xs font-bold uppercase tracking-widest rounded-full flex items-center gap-1">
                  <Award className="w-3 h-3" />
                  Elite
                </div>
              </div>
              <p className="text-muted-foreground font-medium text-sm mt-1">{userData.username} • Member since {userData.joinedDate}</p>
            </div>

            {/* XP Progress Bar */}
            <div className="max-w-md">
              <div className="flex items-center justify-between text-xs mb-2">
                <span className="text-muted-foreground font-medium">Level {userData.level}</span>
                <span className="text-xp font-bold">{userData.xpProgress}% to Level {userData.level + 1}</span>
              </div>
              <div className="h-3 bg-secondary rounded-full overflow-hidden">
                <div
                  className="h-full rounded-full bg-gradient-to-r from-xp via-primary to-success transition-all duration-500"
                  style={{ width: `${userData.xpProgress}%` }}
                />
              </div>
            </div>

            <div className="flex gap-3 flex-wrap">
              <button className="flex items-center gap-2 px-5 py-2.5 bg-primary text-primary-foreground rounded-xl font-bold hover:opacity-90 transition-all shadow-lg shadow-primary/20">
                <Edit2 className="w-4 h-4" />
                Edit Profile
              </button>
              <button className="flex items-center gap-2 px-5 py-2.5 border border-border bg-secondary/50 text-foreground rounded-xl font-bold hover:bg-secondary transition-all">
                <Settings className="w-4 h-4" />
                Settings
              </button>
            </div>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mt-10 pt-8 border-t border-border/50">
          <div className="bg-card/80 border border-border p-5 rounded-2xl hover:border-primary/30 transition-colors group">
            <div className="flex items-center gap-2 text-xs text-muted-foreground uppercase tracking-widest font-bold mb-2">
              <Zap className="w-4 h-4 text-xp" />
              Total XP
            </div>
            <div className="text-3xl font-black text-foreground group-hover:text-primary transition-colors">{userData.stats.score.toLocaleString()}</div>
          </div>

          <div className="bg-streak/10 border border-streak/20 p-5 rounded-2xl hover:border-streak/40 transition-colors group">
            <div className="flex items-center gap-2 text-xs text-streak uppercase tracking-widest font-bold mb-2">
              <Flame className="w-4 h-4 animate-streak-fire" />
              Active Streak
            </div>
            <div className="text-3xl font-black text-streak">{userData.stats.streak} <span className="text-base opacity-60">days</span></div>
          </div>

          <div className="bg-success/10 border border-success/20 p-5 rounded-2xl hover:border-success/40 transition-colors group">
            <div className="flex items-center gap-2 text-xs text-success uppercase tracking-widest font-bold mb-2">
              <CheckCircle2 className="w-4 h-4" />
              Completed
            </div>
            <div className="text-3xl font-black text-success">{userData.stats.tasksCompleted}</div>
          </div>

          <div className="bg-primary/10 border border-primary/20 p-5 rounded-2xl hover:border-primary/40 transition-colors group">
            <div className="flex items-center gap-2 text-xs text-primary uppercase tracking-widest font-bold mb-2">
              <Users className="w-4 h-4" />
              Squads
            </div>
            <div className="text-3xl font-black text-primary">{userData.stats.groups}</div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 bg-secondary/50 p-1.5 rounded-xl w-fit">
        <button
          onClick={() => setActiveTab('activity')}
          className={`px-5 py-2.5 rounded-lg text-sm font-bold transition-all flex items-center gap-2 ${activeTab === 'activity'
            ? 'bg-primary text-primary-foreground shadow-lg'
            : 'text-muted-foreground hover:text-foreground'
            }`}
        >
          <TrendingUp className="w-4 h-4" />
          Activity
        </button>
        <button
          onClick={() => setActiveTab('achievements')}
          className={`px-5 py-2.5 rounded-lg text-sm font-bold transition-all flex items-center gap-2 ${activeTab === 'achievements'
            ? 'bg-primary text-primary-foreground shadow-lg'
            : 'text-muted-foreground hover:text-foreground'
            }`}
        >
          <Trophy className="w-4 h-4" />
          Achievements
        </button>
      </div>

      {/* Content */}
      {activeTab === 'activity' ? (
        <div className="space-y-4">
          {recentActivity.map((item) => (
            <div
              key={item.id}
              className="bg-card border border-border p-5 rounded-2xl flex items-center gap-5 group hover:border-primary/30 transition-all hover:shadow-md"
            >
              <div className={`w-12 h-12 flex items-center justify-center rounded-xl font-bold transition-colors ${item.type === 'task'
                ? 'bg-success/10 text-success group-hover:bg-success/20'
                : item.type === 'streak'
                  ? 'bg-streak/10 text-streak group-hover:bg-streak/20'
                  : 'bg-achievement/10 text-achievement group-hover:bg-achievement/20'
                }`}>
                {item.type === 'task' && <CheckCircle2 className="w-6 h-6" />}
                {item.type === 'streak' && <Flame className="w-6 h-6" />}
                {item.type === 'badge' && <Trophy className="w-6 h-6" />}
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-bold text-foreground">{item.title}</p>
                <p className="text-xs text-muted-foreground mt-1">{item.time}</p>
              </div>
              <div className="flex items-center gap-1.5 font-bold text-xp bg-xp/10 px-4 py-2 rounded-full text-sm">
                <Zap className="w-4 h-4" />
                +{item.points} XP
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2">
          {achievements.map((achievement) => (
            <div
              key={achievement.id}
              className={`border p-6 rounded-2xl flex items-center gap-5 transition-all ${achievement.earned
                ? `bg-${achievement.color}/5 border-${achievement.color}/20 hover:border-${achievement.color}/40 hover:shadow-md`
                : 'bg-muted/10 border-border opacity-50'
                }`}
            >
              <div className={`w-14 h-14 rounded-xl flex items-center justify-center ${achievement.earned
                ? achievement.color === 'streak'
                  ? 'bg-streak text-white shadow-lg'
                  : achievement.color === 'primary'
                    ? 'bg-primary text-white shadow-lg'
                    : achievement.color === 'success'
                      ? 'bg-success text-white shadow-lg'
                      : 'bg-achievement text-white shadow-lg'
                : 'bg-muted text-muted-foreground'
                }`}>
                <achievement.icon className="w-7 h-7" />
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <p className="font-bold text-foreground">{achievement.name}</p>
                  {achievement.earned && (
                    <CheckCircle2 className="w-4 h-4 text-success" />
                  )}
                </div>
                <p className="text-sm text-muted-foreground mt-1">{achievement.description}</p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
