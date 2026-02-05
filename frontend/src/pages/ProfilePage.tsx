import { useState } from 'react';
import { Settings, Edit2, Flame, Trophy, CheckCircle2, Users, Calendar, TrendingUp } from 'lucide-react';

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
  { id: 1, type: 'task', title: 'Completed morning workout', time: '2 hours ago', points: 50 },
  { id: 2, type: 'streak', title: 'Reached 12-day streak!', time: '1 day ago', points: 100 },
  { id: 3, type: 'task', title: 'Read for 30 minutes', time: '1 day ago', points: 30 },
  { id: 4, type: 'badge', title: 'Earned Early Bird badge', time: '3 days ago', points: 200 },
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
    <div className="p-6 lg:p-8 max-w-4xl mx-auto">
      {/* Profile Header */}
      <div className="bg-card border border-border rounded-xl p-6 mb-6">
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-6">
          <div className="w-24 h-24 rounded-full bg-primary flex items-center justify-center text-primary-foreground text-3xl font-bold">
            {userData.avatar}
          </div>

          <div className="flex-1">
            <div className="flex items-center gap-3 mb-1">
              <h1 className="text-2xl font-bold text-foreground">{userData.name}</h1>
              <button className="p-1.5 text-muted-foreground hover:text-foreground hover:bg-secondary rounded-lg transition-colors">
                <Edit2 className="w-4 h-4" />
              </button>
            </div>
            <p className="text-muted-foreground mb-2">{userData.username}</p>
            <p className="text-sm text-foreground">{userData.bio}</p>
            <p className="text-xs text-muted-foreground mt-2 flex items-center gap-1">
              <Calendar className="w-3.5 h-3.5" />
              Joined {userData.joinedDate}
            </p>
          </div>

          <button className="flex items-center gap-2 px-4 py-2 bg-secondary text-secondary-foreground rounded-lg text-sm font-medium hover:bg-secondary/80 transition-colors">
            <Settings className="w-4 h-4" />
            Settings
          </button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-6 pt-6 border-t border-border">
          <div className="text-center">
            <p className="text-2xl font-bold text-foreground">{userData.stats.score.toLocaleString()}</p>
            <p className="text-sm text-muted-foreground">Total Score</p>
          </div>
          <div className="text-center">
            <p className="text-2xl font-bold text-orange-500 flex items-center justify-center gap-1">
              <Flame className="w-6 h-6" />
              {userData.stats.streak}
            </p>
            <p className="text-sm text-muted-foreground">Day Streak</p>
          </div>
          <div className="text-center">
            <p className="text-2xl font-bold text-foreground">{userData.stats.tasksCompleted}</p>
            <p className="text-sm text-muted-foreground">Tasks Done</p>
          </div>
          <div className="text-center">
            <p className="text-2xl font-bold text-foreground">{userData.stats.groups}</p>
            <p className="text-sm text-muted-foreground">Groups</p>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-4 mb-6 border-b border-border">
        <button
          onClick={() => setActiveTab('activity')}
          className={`pb-3 text-sm font-medium transition-colors ${
            activeTab === 'activity'
              ? 'text-foreground border-b-2 border-primary'
              : 'text-muted-foreground hover:text-foreground'
          }`}
        >
          Recent Activity
        </button>
        <button
          onClick={() => setActiveTab('achievements')}
          className={`pb-3 text-sm font-medium transition-colors ${
            activeTab === 'achievements'
              ? 'text-foreground border-b-2 border-primary'
              : 'text-muted-foreground hover:text-foreground'
          }`}
        >
          Achievements
        </button>
      </div>

      {/* Content */}
      {activeTab === 'activity' ? (
        <div className="space-y-3">
          {recentActivity.map((item) => (
            <div
              key={item.id}
              className="bg-card border border-border rounded-xl p-4 flex items-center gap-4"
            >
              <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                {item.type === 'task' && <CheckCircle2 className="w-5 h-5 text-green-500" />}
                {item.type === 'streak' && <Flame className="w-5 h-5 text-orange-500" />}
                {item.type === 'badge' && <Trophy className="w-5 h-5 text-yellow-500" />}
              </div>
              <div className="flex-1">
                <p className="font-medium text-foreground">{item.title}</p>
                <p className="text-xs text-muted-foreground">{item.time}</p>
              </div>
              <span className="flex items-center gap-1 text-sm text-green-500 font-medium">
                <TrendingUp className="w-4 h-4" />
                +{item.points}
              </span>
            </div>
          ))}
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2">
          {achievements.map((achievement) => (
            <div
              key={achievement.id}
              className={`bg-card border rounded-xl p-4 flex items-center gap-4 ${
                achievement.earned ? 'border-border' : 'border-border opacity-50'
              }`}
            >
              <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${
                achievement.earned ? 'bg-primary/10' : 'bg-muted'
              }`}>
                <achievement.icon className={`w-6 h-6 ${
                  achievement.earned ? 'text-primary' : 'text-muted-foreground'
                }`} />
              </div>
              <div>
                <p className="font-medium text-foreground">{achievement.name}</p>
                <p className="text-sm text-muted-foreground">{achievement.description}</p>
              </div>
              {achievement.earned && (
                <CheckCircle2 className="w-5 h-5 text-green-500 ml-auto" />
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
