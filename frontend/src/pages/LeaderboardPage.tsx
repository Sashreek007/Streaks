import { useState } from 'react';
import { Trophy, Flame, TrendingUp } from 'lucide-react';

// Mock data
const leaderboardData = [
  { rank: 1, name: 'Sarah Johnson', avatar: 'SJ', score: 12450, streak: 67, change: 2 },
  { rank: 2, name: 'Mike Chen', avatar: 'MC', score: 11200, streak: 45, change: -1 },
  { rank: 3, name: 'Emma Rodriguez', avatar: 'ER', score: 10890, streak: 52, change: 1 },
  { rank: 4, name: 'John Doe', avatar: 'JD', score: 9500, streak: 12, change: 0, isCurrentUser: true },
  { rank: 5, name: 'Alex Kim', avatar: 'AK', score: 9200, streak: 34, change: 3 },
  { rank: 6, name: 'Lisa Wang', avatar: 'LW', score: 8900, streak: 28, change: -2 },
  { rank: 7, name: 'Tom Brown', avatar: 'TB', score: 8500, streak: 19, change: 1 },
  { rank: 8, name: 'Amy Davis', avatar: 'AD', score: 8100, streak: 41, change: 0 },
  { rank: 9, name: 'Chris Lee', avatar: 'CL', score: 7800, streak: 23, change: -1 },
  { rank: 10, name: 'Dana White', avatar: 'DW', score: 7500, streak: 15, change: 2 },
];

const podiumColors = [
  'from-yellow-500 to-amber-600', // Gold
  'from-slate-400 to-slate-500',   // Silver
  'from-amber-700 to-amber-800',   // Bronze
];

export default function LeaderboardPage() {
  const [period, setPeriod] = useState<'weekly' | 'monthly' | 'allTime'>('weekly');

  const topThree = leaderboardData.slice(0, 3);
  const rest = leaderboardData.slice(3);

  return (
    <div className="p-6 lg:p-8 max-w-4xl mx-auto">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-2xl lg:text-3xl font-bold text-foreground">Leaderboard</h1>
        <p className="text-muted-foreground mt-1">See how you rank against others</p>
      </div>

      {/* Period Tabs */}
      <div className="flex gap-2 mb-8">
        {(['weekly', 'monthly', 'allTime'] as const).map((tab) => (
          <button
            key={tab}
            onClick={() => setPeriod(tab)}
            className={`px-4 py-2 rounded-lg text-sm font-medium capitalize transition-colors ${
              period === tab
                ? 'bg-primary text-primary-foreground'
                : 'bg-secondary text-secondary-foreground hover:bg-secondary/80'
            }`}
          >
            {tab === 'allTime' ? 'All Time' : tab}
          </button>
        ))}
      </div>

      {/* Podium */}
      <div className="flex items-end justify-center gap-4 mb-8">
        {/* 2nd Place */}
        <div className="text-center">
          <div className={`w-16 h-16 mx-auto rounded-full bg-gradient-to-br ${podiumColors[1]} flex items-center justify-center text-white font-bold text-xl mb-2`}>
            {topThree[1].avatar}
          </div>
          <p className="font-medium text-foreground">{topThree[1].name}</p>
          <p className="text-sm text-muted-foreground">{topThree[1].score.toLocaleString()} pts</p>
          <div className="h-20 w-24 bg-gradient-to-t from-slate-500 to-slate-400 rounded-t-lg mt-3 flex items-center justify-center">
            <span className="text-2xl font-bold text-white">2</span>
          </div>
        </div>

        {/* 1st Place */}
        <div className="text-center -mt-6">
          <div className="relative">
            <div className={`w-20 h-20 mx-auto rounded-full bg-gradient-to-br ${podiumColors[0]} flex items-center justify-center text-white font-bold text-2xl mb-2 ring-4 ring-yellow-400/50`}>
              {topThree[0].avatar}
            </div>
            <Trophy className="absolute -top-2 -right-2 w-6 h-6 text-yellow-400" />
          </div>
          <p className="font-medium text-foreground">{topThree[0].name}</p>
          <p className="text-sm text-muted-foreground">{topThree[0].score.toLocaleString()} pts</p>
          <div className="h-28 w-28 bg-gradient-to-t from-yellow-600 to-yellow-400 rounded-t-lg mt-3 flex items-center justify-center">
            <span className="text-3xl font-bold text-white">1</span>
          </div>
        </div>

        {/* 3rd Place */}
        <div className="text-center">
          <div className={`w-16 h-16 mx-auto rounded-full bg-gradient-to-br ${podiumColors[2]} flex items-center justify-center text-white font-bold text-xl mb-2`}>
            {topThree[2].avatar}
          </div>
          <p className="font-medium text-foreground">{topThree[2].name}</p>
          <p className="text-sm text-muted-foreground">{topThree[2].score.toLocaleString()} pts</p>
          <div className="h-16 w-24 bg-gradient-to-t from-amber-800 to-amber-600 rounded-t-lg mt-3 flex items-center justify-center">
            <span className="text-2xl font-bold text-white">3</span>
          </div>
        </div>
      </div>

      {/* Rest of Leaderboard */}
      <div className="bg-card border border-border rounded-xl overflow-hidden">
        {rest.map((user, index) => (
          <div
            key={user.rank}
            className={`flex items-center gap-4 p-4 ${
              index !== rest.length - 1 ? 'border-b border-border' : ''
            } ${user.isCurrentUser ? 'bg-primary/10' : ''}`}
          >
            <span className="w-8 text-center font-semibold text-muted-foreground">
              {user.rank}
            </span>

            <div className="w-10 h-10 rounded-full bg-secondary flex items-center justify-center text-secondary-foreground font-semibold">
              {user.avatar}
            </div>

            <div className="flex-1 min-w-0">
              <p className={`font-medium ${user.isCurrentUser ? 'text-primary' : 'text-foreground'}`}>
                {user.name} {user.isCurrentUser && '(You)'}
              </p>
              <div className="flex items-center gap-3 text-sm text-muted-foreground">
                <span>{user.score.toLocaleString()} pts</span>
                <span className="flex items-center gap-1 text-orange-500">
                  <Flame className="w-3.5 h-3.5" />
                  {user.streak}
                </span>
              </div>
            </div>

            <div className={`flex items-center gap-1 text-sm ${
              user.change > 0 ? 'text-green-500' : user.change < 0 ? 'text-red-500' : 'text-muted-foreground'
            }`}>
              {user.change !== 0 && (
                <TrendingUp className={`w-4 h-4 ${user.change < 0 ? 'rotate-180' : ''}`} />
              )}
              {user.change !== 0 && Math.abs(user.change)}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
