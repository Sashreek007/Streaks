import { useState } from 'react';
import { Settings, Edit2, Flame, Trophy, CheckCircle2, Users, Hash } from 'lucide-react';

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
  joinedDate: 'January 2024',
};

const recentActivity = [
  { id: 1, type: 'task', title: 'Completed morning workout', time: '2H AGO', points: 50 },
  { id: 2, type: 'streak', title: 'Reached 12-day streak!', time: '1D AGO', points: 100 },
  { id: 3, type: 'task', title: 'Read for 30 minutes', time: '1D AGO', points: 30 },
  { id: 4, type: 'badge', title: 'Earned Early Bird badge', time: '3D AGO', points: 200 },
];

const achievements = [
  { id: 1, name: 'First Streak', description: '7 days in a row', icon: Flame, earned: true },
  { id: 2, name: 'Team Player', description: 'Join 3 groups', icon: Users, earned: true },
  { id: 3, name: 'Century', description: 'Complete 100 tasks', icon: CheckCircle2, earned: true },
  { id: 4, name: 'Champion', description: 'Reach top 10', icon: Trophy, earned: false },
];

export default function ProfilePage() {
  const [activeTab, setActiveTab] = useState<'activity' | 'achievements'>('activity');

  return (
    <div className="p-4 lg:p-8 max-w-5xl mx-auto space-y-8">
      {/* Identity Card */}
      <div className="relative overflow-hidden rounded-3xl bg-black border border-white/10 p-8 lg:p-10 shadow-2xl">
        <div className="absolute inset-0 bg-noise opacity-20 pointer-events-none" />
        <div className="absolute top-0 right-0 w-64 h-64 bg-primary/20 blur-[100px] rounded-full pointer-events-none" />

        <div className="relative z-10 flex flex-col md:flex-row gap-8 items-start">
          {/* Avatar */}
          <div className="w-32 h-32 rounded-none bg-primary flex items-center justify-center text-primary-foreground text-4xl font-black shadow-[4px_4px_0px_0px_rgba(255,255,255,0.2)]">
            {userData.avatar}
          </div>

          <div className="flex-1 space-y-4">
            <div>
              <div className="flex items-center gap-3">
                <h1 className="text-4xl lg:text-5xl font-black text-white tracking-tighter uppercase">{userData.name}</h1>
                <div className="px-3 py-1 bg-red-500/10 border border-red-500/20 text-red-500 text-xs font-bold uppercase tracking-widest rounded-sm animate-pulse">
                  Operative
                </div>
              </div>
              <p className="text-muted-foreground font-mono text-sm mt-1">{userData.username} • EST. {userData.joinedDate}</p>
            </div>

            <div className="flex gap-4">
              <button className="flex items-center gap-2 px-6 py-2 bg-white text-black font-bold uppercase tracking-wide hover:bg-white/90 transition-colors">
                <Edit2 className="w-4 h-4" />
                Edit ID
              </button>
              <button className="flex items-center gap-2 px-6 py-2 border border-white/20 text-white font-bold uppercase tracking-wide hover:bg-white/10 transition-colors">
                <Settings className="w-4 h-4" />
                Config
              </button>
            </div>
          </div>
        </div>

        {/* Obsession Metrics */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mt-12 pt-8 border-t border-white/10">
          <div className="bg-white/5 border border-white/5 p-4 rounded-sm hover:bg-white/10 transition-colors group">
            <div className="text-xs text-muted-foreground uppercase tracking-widest font-mono mb-1">Total Score</div>
            <div className="text-3xl font-black text-white group-hover:text-primary transition-colors">{userData.stats.score.toLocaleString()}</div>
          </div>
          <div className="bg-red-500/10 border border-red-500/20 p-4 rounded-sm hover:bg-red-500/20 transition-colors group">
            <div className="text-xs text-red-400 uppercase tracking-widest font-mono mb-1 flex items-center gap-2">
              Active Streak <Flame className="w-3 h-3 animate-pulse" />
            </div>
            <div className="text-3xl font-black text-red-500">{userData.stats.streak} <span className="text-base opacity-50">DAYS</span></div>
          </div>
          <div className="bg-white/5 border border-white/5 p-4 rounded-sm hover:bg-white/10 transition-colors group">
            <div className="text-xs text-muted-foreground uppercase tracking-widest font-mono mb-1">Missions Done</div>
            <div className="text-3xl font-black text-white group-hover:text-primary transition-colors">{userData.stats.tasksCompleted}</div>
          </div>
          <div className="bg-white/5 border border-white/5 p-4 rounded-sm hover:bg-white/10 transition-colors group">
            <div className="text-xs text-muted-foreground uppercase tracking-widest font-mono mb-1">Squads</div>
            <div className="text-3xl font-black text-white group-hover:text-primary transition-colors">{userData.stats.groups}</div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-8 border-b border-border/40">
        <button
          onClick={() => setActiveTab('activity')}
          className={`pb-4 text-sm font-bold uppercase tracking-widest transition-all ${activeTab === 'activity'
            ? 'text-foreground border-b-2 border-primary translate-y-[1px]'
            : 'text-muted-foreground hover:text-foreground'
            }`}
        >
          Battle Log
        </button>
        <button
          onClick={() => setActiveTab('achievements')}
          className={`pb-4 text-sm font-bold uppercase tracking-widest transition-all ${activeTab === 'achievements'
            ? 'text-foreground border-b-2 border-primary translate-y-[1px]'
            : 'text-muted-foreground hover:text-foreground'
            }`}
        >
          Medals
        </button>
      </div>

      {/* Content */}
      {activeTab === 'activity' ? (
        <div className="space-y-4">
          {recentActivity.map((item) => (
            <div
              key={item.id}
              className="bg-card/50 border border-border/50 p-6 flex items-center gap-6 group hover:border-primary/30 transition-all hover:bg-card/80"
            >
              <div className="w-12 h-12 flex items-center justify-center bg-secondary/50 rounded-sm font-bold text-muted-foreground group-hover:bg-primary/10 group-hover:text-primary transition-colors decoration-slice">
                {item.type === 'task' && <CheckCircle2 className="w-6 h-6" />}
                {item.type === 'streak' && <Flame className="w-6 h-6" />}
                {item.type === 'badge' && <Trophy className="w-6 h-6" />}
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-3">
                  <span className="font-bold text-lg text-foreground uppercase">{item.title}</span>
                  <span className="text-[10px] font-mono text-muted-foreground px-2 py-1 bg-secondary rounded-sm uppercase">{item.time}</span>
                </div>
              </div>
              <div className="hidden sm:flex items-center gap-2 font-mono text-green-500 font-bold bg-green-500/5 px-4 py-2 rounded-sm">
                <Hash className="w-4 h-4" />
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
              className={`border p-6 flex items-center gap-5 transition-all ${achievement.earned
                ? 'bg-gradient-to-br from-card to-secondary/30 border-primary/20 hover:border-primary/50'
                : 'bg-muted/10 border-border opacity-60 grayscale'
                }`}
            >
              <div className={`w-14 h-14 rounded-sm flex items-center justify-center ${achievement.earned ? 'bg-primary text-primary-foreground shadow-lg shadow-primary/20' : 'bg-muted text-muted-foreground'
                }`}>
                <achievement.icon className="w-7 h-7" />
              </div>
              <div>
                <p className="font-bold text-foreground uppercase tracking-wide">{achievement.name}</p>
                <p className="text-sm text-muted-foreground mt-1">{achievement.description}</p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
