import { useState } from 'react';
import { Trophy, Flame, TrendingUp, Crown, Zap, Medal, Star } from 'lucide-react';

// Mock data
const leaderboardData = [
  { rank: 1, name: 'Sarah Johnson', avatar: 'SJ', score: 12450, streak: 67, change: 2, xpToday: 280 },
  { rank: 2, name: 'Mike Chen', avatar: 'MC', score: 11200, streak: 45, change: -1, xpToday: 150 },
  { rank: 3, name: 'Emma Rodriguez', avatar: 'ER', score: 10890, streak: 52, change: 1, xpToday: 200 },
  { rank: 4, name: 'John Doe', avatar: 'JD', score: 9500, streak: 12, change: 0, isCurrentUser: true, xpToday: 80 },
  { rank: 5, name: 'Alex Kim', avatar: 'AK', score: 9200, streak: 34, change: 3, xpToday: 120 },
  { rank: 6, name: 'Lisa Wang', avatar: 'LW', score: 8900, streak: 28, change: -2, xpToday: 90 },
  { rank: 7, name: 'Tom Brown', avatar: 'TB', score: 8500, streak: 19, change: 1, xpToday: 65 },
  { rank: 8, name: 'Amy Davis', avatar: 'AD', score: 8100, streak: 41, change: 0, xpToday: 110 },
  { rank: 9, name: 'Chris Lee', avatar: 'CL', score: 7800, streak: 23, change: -1, xpToday: 55 },
  { rank: 10, name: 'Dana White', avatar: 'DW', score: 7500, streak: 15, change: 2, xpToday: 75 },
];

export default function LeaderboardPage() {
  const [period, setPeriod] = useState<'weekly' | 'monthly' | 'allTime'>('weekly');

  const topThree = leaderboardData.slice(0, 3);
  const rest = leaderboardData.slice(3);
  const currentUser = leaderboardData.find(u => u.isCurrentUser);

  return (
    <div className="p-4 lg:p-8 max-w-4xl mx-auto space-y-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-achievement font-bold uppercase tracking-widest text-xs mb-2">
            <Crown className="w-4 h-4" />
            Rankings
          </div>
          <h1 className="text-3xl lg:text-4xl font-black text-foreground tracking-tight">Leaderboard</h1>
          <p className="text-muted-foreground mt-1">Compete. Rise. Dominate.</p>
        </div>

        {/* Your Position Card */}
        {currentUser && (
          <div className="flex items-center gap-4 bg-gradient-to-r from-primary/20 via-primary/10 to-transparent rounded-2xl p-4 border border-primary/20">
            <div className="w-12 h-12 rounded-xl bg-primary flex items-center justify-center text-primary-foreground font-black text-lg">
              {currentUser.avatar}
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Your Rank</p>
              <p className="text-2xl font-black text-foreground">#{currentUser.rank}</p>
            </div>
            <div className="pl-4 border-l border-border">
              <p className="text-sm text-muted-foreground">Score</p>
              <p className="text-xl font-bold text-primary">{currentUser.score.toLocaleString()}</p>
            </div>
          </div>
        )}
      </div>

      {/* Period Tabs */}
      <div className="flex gap-2 bg-secondary/50 p-1.5 rounded-xl w-fit">
        {(['weekly', 'monthly', 'allTime'] as const).map((tab) => (
          <button
            key={tab}
            onClick={() => setPeriod(tab)}
            className={`px-5 py-2.5 rounded-lg text-sm font-bold capitalize transition-all ${period === tab
              ? 'bg-primary text-primary-foreground shadow-lg'
              : 'text-muted-foreground hover:text-foreground'
              }`}
          >
            {tab === 'allTime' ? 'All Time' : tab}
          </button>
        ))}
      </div>

      {/* Podium */}
      <div className="relative py-8">
        {/* Background glow */}
        <div className="absolute inset-0 flex justify-center">
          <div className="w-64 h-64 bg-achievement/20 rounded-full blur-[100px]" />
        </div>

        <div className="relative flex items-end justify-center gap-3 md:gap-6">
          {/* 2nd Place */}
          <div className="text-center animate-fadeIn" style={{ animationDelay: '0.1s' }}>
            <div className="relative mb-3">
              <div className="w-16 md:w-20 h-16 md:h-20 mx-auto rounded-2xl bg-gradient-to-br from-slate-400 to-slate-600 flex items-center justify-center text-white font-black text-xl md:text-2xl shadow-lg">
                {topThree[1].avatar}
              </div>
              <div className="absolute -top-2 -right-2 w-8 h-8 bg-slate-400 rounded-full flex items-center justify-center">
                <Medal className="w-4 h-4 text-white" />
              </div>
            </div>
            <p className="font-bold text-foreground text-sm md:text-base">{topThree[1].name}</p>
            <p className="text-xs text-muted-foreground">{topThree[1].score.toLocaleString()} pts</p>
            <div className="flex items-center justify-center gap-1 mt-1 text-streak text-xs font-bold">
              <Flame className="w-3 h-3" />
              {topThree[1].streak}
            </div>
            <div className="h-24 w-24 md:w-28 bg-gradient-to-t from-slate-600 to-slate-400 rounded-t-2xl mt-4 flex items-center justify-center shadow-xl">
              <span className="text-3xl md:text-4xl font-black text-white/90">2</span>
            </div>
          </div>

          {/* 1st Place */}
          <div className="text-center -mt-8 animate-fadeIn">
            <div className="relative mb-3">
              <div className="w-20 md:w-24 h-20 md:h-24 mx-auto rounded-2xl bg-gradient-to-br from-achievement via-yellow-400 to-achievement flex items-center justify-center text-white font-black text-2xl md:text-3xl shadow-xl ring-4 ring-achievement/30 animate-pulse-glow">
                {topThree[0].avatar}
              </div>
              <div className="absolute -top-4 left-1/2 -translate-x-1/2">
                <Crown className="w-8 h-8 text-achievement drop-shadow-lg animate-bounce" />
              </div>
            </div>
            <p className="font-black text-foreground text-base md:text-lg">{topThree[0].name}</p>
            <p className="text-sm text-muted-foreground">{topThree[0].score.toLocaleString()} pts</p>
            <div className="flex items-center justify-center gap-1 mt-1 text-streak text-sm font-bold">
              <Flame className="w-4 h-4 animate-streak-fire" />
              {topThree[0].streak} day streak
            </div>
            <div className="h-32 md:h-36 w-28 md:w-32 bg-gradient-to-t from-amber-600 via-achievement to-yellow-400 rounded-t-2xl mt-4 flex items-center justify-center shadow-2xl relative overflow-hidden">
              <div className="absolute inset-0 bg-noise opacity-20" />
              <span className="text-4xl md:text-5xl font-black text-white relative z-10">1</span>
            </div>
          </div>

          {/* 3rd Place */}
          <div className="text-center animate-fadeIn" style={{ animationDelay: '0.2s' }}>
            <div className="relative mb-3">
              <div className="w-16 md:w-20 h-16 md:h-20 mx-auto rounded-2xl bg-gradient-to-br from-amber-600 to-amber-800 flex items-center justify-center text-white font-black text-xl md:text-2xl shadow-lg">
                {topThree[2].avatar}
              </div>
              <div className="absolute -top-2 -right-2 w-8 h-8 bg-amber-600 rounded-full flex items-center justify-center">
                <Star className="w-4 h-4 text-white" />
              </div>
            </div>
            <p className="font-bold text-foreground text-sm md:text-base">{topThree[2].name}</p>
            <p className="text-xs text-muted-foreground">{topThree[2].score.toLocaleString()} pts</p>
            <div className="flex items-center justify-center gap-1 mt-1 text-streak text-xs font-bold">
              <Flame className="w-3 h-3" />
              {topThree[2].streak}
            </div>
            <div className="h-20 w-24 md:w-28 bg-gradient-to-t from-amber-900 to-amber-600 rounded-t-2xl mt-4 flex items-center justify-center shadow-xl">
              <span className="text-3xl md:text-4xl font-black text-white/90">3</span>
            </div>
          </div>
        </div>
      </div>

      {/* Rest of Leaderboard */}
      <div className="bg-card border border-border rounded-2xl overflow-hidden">
        <div className="p-4 border-b border-border bg-secondary/30">
          <div className="flex items-center gap-2 text-sm font-bold text-muted-foreground uppercase tracking-wide">
            <Trophy className="w-4 h-4 text-achievement" />
            Rankings
          </div>
        </div>

        {rest.map((user, index) => (
          <div
            key={user.rank}
            className={`flex items-center gap-4 p-4 transition-colors ${index !== rest.length - 1 ? 'border-b border-border' : ''
              } ${user.isCurrentUser
                ? 'bg-gradient-to-r from-primary/10 via-primary/5 to-transparent'
                : 'hover:bg-secondary/30'
              }`}
          >
            <span className={`w-10 h-10 flex items-center justify-center rounded-xl font-black text-lg ${user.isCurrentUser
              ? 'bg-primary text-primary-foreground'
              : 'bg-secondary text-muted-foreground'
              }`}>
              {user.rank}
            </span>

            <div className={`w-12 h-12 rounded-xl flex items-center justify-center font-bold text-lg ${user.isCurrentUser
              ? 'bg-primary/20 text-primary'
              : 'bg-secondary text-secondary-foreground'
              }`}>
              {user.avatar}
            </div>

            <div className="flex-1 min-w-0">
              <p className={`font-bold ${user.isCurrentUser ? 'text-primary' : 'text-foreground'}`}>
                {user.name} {user.isCurrentUser && <span className="text-xs font-normal text-muted-foreground">(You)</span>}
              </p>
              <div className="flex items-center gap-4 mt-1">
                <span className="text-sm text-muted-foreground font-medium">{user.score.toLocaleString()} pts</span>
                <span className="flex items-center gap-1 text-sm text-streak font-bold">
                  <Flame className="w-3.5 h-3.5" />
                  {user.streak}
                </span>
                <span className="flex items-center gap-1 text-xs text-xp font-bold">
                  <Zap className="w-3 h-3" />
                  +{user.xpToday} today
                </span>
              </div>
            </div>

            <div className={`flex items-center gap-1 text-sm font-bold px-3 py-1.5 rounded-full ${user.change > 0
              ? 'text-success bg-success/10'
              : user.change < 0
                ? 'text-energy bg-energy/10'
                : 'text-muted-foreground bg-secondary'
              }`}>
              {user.change !== 0 && (
                <TrendingUp className={`w-4 h-4 ${user.change < 0 ? 'rotate-180' : ''}`} />
              )}
              {user.change === 0 ? '-' : (user.change > 0 ? '+' : '') + user.change}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
