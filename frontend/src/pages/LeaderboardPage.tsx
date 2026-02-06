import { useState, useEffect } from 'react';
import { Trophy, Flame, TrendingUp, Crown, Zap, Medal, Star, Loader2 } from 'lucide-react';
import { leaderboardApi } from '../services/api';
import type { LeaderboardEntry } from '../services/api';
import { useAuth } from '../context/AuthContext';

export default function LeaderboardPage() {
  const { user } = useAuth();
  const [period, setPeriod] = useState<'all' | 'weekly' | 'monthly'>('weekly');
  const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>([]);
  const [userRank, setUserRank] = useState<number | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchLeaderboard();
  }, [period]);

  const fetchLeaderboard = async () => {
    setIsLoading(true);
    const response = await leaderboardApi.getGlobal(period, 50);
    if (response.success && response.data) {
      setLeaderboard(response.data.leaderboard);
      setUserRank(response.data.userRank);
    }
    setIsLoading(false);
  };

  // Get initials from display name
  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(n => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  const topThree = leaderboard.slice(0, 3);
  const rest = leaderboard.slice(3);

  // Find current user in leaderboard
  const currentUserEntry = leaderboard.find(entry => entry.user.id === user?.id);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

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
        {(currentUserEntry || userRank) && (
          <div className="flex items-center gap-4 bg-gradient-to-r from-primary/20 via-primary/10 to-transparent rounded-2xl p-4 border border-primary/20">
            <div className="w-12 h-12 rounded-xl bg-primary flex items-center justify-center text-primary-foreground font-black text-lg">
              {user?.displayName ? getInitials(user.displayName) : 'U'}
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Your Rank</p>
              <p className="text-2xl font-black text-foreground">
                #{currentUserEntry?.rank || userRank || '—'}
              </p>
            </div>
            <div className="pl-4 border-l border-border">
              <p className="text-sm text-muted-foreground">Score</p>
              <p className="text-xl font-bold text-primary">
                {(currentUserEntry?.totalXp || user?.totalXp || 0).toLocaleString()}
              </p>
            </div>
          </div>
        )}
      </div>

      {/* Period Tabs */}
      <div className="flex gap-2 bg-secondary/50 p-1.5 rounded-xl w-fit">
        {(['weekly', 'monthly', 'all'] as const).map((tab) => (
          <button
            key={tab}
            onClick={() => setPeriod(tab)}
            className={`px-5 py-2.5 rounded-lg text-sm font-bold capitalize transition-all ${period === tab
              ? 'bg-primary text-primary-foreground shadow-lg'
              : 'text-muted-foreground hover:text-foreground'
              }`}
          >
            {tab === 'all' ? 'All Time' : tab}
          </button>
        ))}
      </div>

      {/* Empty State */}
      {leaderboard.length === 0 ? (
        <div className="text-center py-20 bg-card/50 border border-dashed border-border rounded-3xl">
          <Trophy className="w-12 h-12 mx-auto text-muted-foreground/30 mb-4" />
          <p className="text-muted-foreground">No rankings yet. Complete tasks to appear on the leaderboard!</p>
        </div>
      ) : (
        <>
          {/* Podium */}
          {topThree.length >= 3 && (
            <div className="relative py-8">
              {/* Background glow */}
              <div className="absolute inset-0 flex justify-center">
                <div className="w-64 h-64 bg-achievement/20 rounded-full blur-[100px]" />
              </div>

              <div className="relative flex items-end justify-center gap-3 md:gap-6">
                {/* 2nd Place */}
                <div className="text-center animate-fadeIn" style={{ animationDelay: '0.1s' }}>
                  <div className="relative mb-3">
                    <div className="w-16 md:w-20 h-16 md:h-20 mx-auto rounded-2xl bg-gradient-to-br from-slate-400 to-slate-600 flex items-center justify-center text-white font-black text-xl md:text-2xl shadow-lg overflow-hidden">
                      {topThree[1].user.avatarUrl ? (
                        <img src={topThree[1].user.avatarUrl} alt="" className="w-full h-full object-cover" />
                      ) : (
                        getInitials(topThree[1].user.displayName)
                      )}
                    </div>
                    <div className="absolute -top-2 -right-2 w-8 h-8 bg-slate-400 rounded-full flex items-center justify-center">
                      <Medal className="w-4 h-4 text-white" />
                    </div>
                  </div>
                  <p className="font-bold text-foreground text-sm md:text-base truncate max-w-[100px] mx-auto">
                    {topThree[1].user.displayName}
                  </p>
                  <p className="text-xs text-muted-foreground">{topThree[1].totalXp.toLocaleString()} pts</p>
                  <div className="flex items-center justify-center gap-1 mt-1 text-streak text-xs font-bold">
                    <Flame className="w-3 h-3" />
                    {topThree[1].currentStreak}
                  </div>
                  <div className="h-24 w-24 md:w-28 bg-gradient-to-t from-slate-600 to-slate-400 rounded-t-2xl mt-4 flex items-center justify-center shadow-xl">
                    <span className="text-3xl md:text-4xl font-black text-white/90">2</span>
                  </div>
                </div>

                {/* 1st Place */}
                <div className="text-center -mt-8 animate-fadeIn">
                  <div className="relative mb-3">
                    <div className="w-20 md:w-24 h-20 md:h-24 mx-auto rounded-2xl bg-gradient-to-br from-achievement via-yellow-400 to-achievement flex items-center justify-center text-white font-black text-2xl md:text-3xl shadow-xl ring-4 ring-achievement/30 overflow-hidden">
                      {topThree[0].user.avatarUrl ? (
                        <img src={topThree[0].user.avatarUrl} alt="" className="w-full h-full object-cover" />
                      ) : (
                        getInitials(topThree[0].user.displayName)
                      )}
                    </div>
                    <div className="absolute -top-4 left-1/2 -translate-x-1/2">
                      <Crown className="w-8 h-8 text-achievement drop-shadow-lg animate-bounce" />
                    </div>
                  </div>
                  <p className="font-black text-foreground text-base md:text-lg truncate max-w-[120px] mx-auto">
                    {topThree[0].user.displayName}
                  </p>
                  <p className="text-sm text-muted-foreground">{topThree[0].totalXp.toLocaleString()} pts</p>
                  <div className="flex items-center justify-center gap-1 mt-1 text-streak text-sm font-bold">
                    <Flame className="w-4 h-4" />
                    {topThree[0].currentStreak} day streak
                  </div>
                  <div className="h-32 md:h-36 w-28 md:w-32 bg-gradient-to-t from-amber-600 via-achievement to-yellow-400 rounded-t-2xl mt-4 flex items-center justify-center shadow-2xl relative overflow-hidden">
                    <div className="absolute inset-0 bg-noise opacity-20" />
                    <span className="text-4xl md:text-5xl font-black text-white relative z-10">1</span>
                  </div>
                </div>

                {/* 3rd Place */}
                <div className="text-center animate-fadeIn" style={{ animationDelay: '0.2s' }}>
                  <div className="relative mb-3">
                    <div className="w-16 md:w-20 h-16 md:h-20 mx-auto rounded-2xl bg-gradient-to-br from-amber-600 to-amber-800 flex items-center justify-center text-white font-black text-xl md:text-2xl shadow-lg overflow-hidden">
                      {topThree[2].user.avatarUrl ? (
                        <img src={topThree[2].user.avatarUrl} alt="" className="w-full h-full object-cover" />
                      ) : (
                        getInitials(topThree[2].user.displayName)
                      )}
                    </div>
                    <div className="absolute -top-2 -right-2 w-8 h-8 bg-amber-600 rounded-full flex items-center justify-center">
                      <Star className="w-4 h-4 text-white" />
                    </div>
                  </div>
                  <p className="font-bold text-foreground text-sm md:text-base truncate max-w-[100px] mx-auto">
                    {topThree[2].user.displayName}
                  </p>
                  <p className="text-xs text-muted-foreground">{topThree[2].totalXp.toLocaleString()} pts</p>
                  <div className="flex items-center justify-center gap-1 mt-1 text-streak text-xs font-bold">
                    <Flame className="w-3 h-3" />
                    {topThree[2].currentStreak}
                  </div>
                  <div className="h-20 w-24 md:w-28 bg-gradient-to-t from-amber-900 to-amber-600 rounded-t-2xl mt-4 flex items-center justify-center shadow-xl">
                    <span className="text-3xl md:text-4xl font-black text-white/90">3</span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Rest of Leaderboard */}
          {rest.length > 0 && (
            <div className="bg-card border border-border rounded-2xl overflow-hidden">
              <div className="p-4 border-b border-border bg-secondary/30">
                <div className="flex items-center gap-2 text-sm font-bold text-muted-foreground uppercase tracking-wide">
                  <Trophy className="w-4 h-4 text-achievement" />
                  Rankings
                </div>
              </div>

              {rest.map((entry, index) => {
                const isCurrentUser = entry.user.id === user?.id;
                return (
                  <div
                    key={entry.rank}
                    className={`flex items-center gap-4 p-4 transition-colors ${index !== rest.length - 1 ? 'border-b border-border' : ''
                      } ${isCurrentUser
                        ? 'bg-gradient-to-r from-primary/10 via-primary/5 to-transparent'
                        : 'hover:bg-secondary/30'
                      }`}
                  >
                    <span className={`w-10 h-10 flex items-center justify-center rounded-xl font-black text-lg ${isCurrentUser
                      ? 'bg-primary text-primary-foreground'
                      : 'bg-secondary text-muted-foreground'
                      }`}>
                      {entry.rank}
                    </span>

                    <div className={`w-12 h-12 rounded-xl flex items-center justify-center font-bold text-lg overflow-hidden ${isCurrentUser
                      ? 'bg-primary/20 text-primary'
                      : 'bg-secondary text-secondary-foreground'
                      }`}>
                      {entry.user.avatarUrl ? (
                        <img src={entry.user.avatarUrl} alt="" className="w-full h-full object-cover" />
                      ) : (
                        getInitials(entry.user.displayName)
                      )}
                    </div>

                    <div className="flex-1 min-w-0">
                      <p className={`font-bold ${isCurrentUser ? 'text-primary' : 'text-foreground'}`}>
                        {entry.user.displayName} {isCurrentUser && <span className="text-xs font-normal text-muted-foreground">(You)</span>}
                      </p>
                      <div className="flex items-center gap-4 mt-1">
                        <span className="text-sm text-muted-foreground font-medium">{entry.totalXp.toLocaleString()} pts</span>
                        <span className="flex items-center gap-1 text-sm text-streak font-bold">
                          <Flame className="w-3.5 h-3.5" />
                          {entry.currentStreak}
                        </span>
                        {entry.weeklyXp !== undefined && (
                          <span className="flex items-center gap-1 text-xs text-xp font-bold">
                            <Zap className="w-3 h-3" />
                            +{entry.weeklyXp} this week
                          </span>
                        )}
                      </div>
                    </div>

                    <div className="flex items-center gap-1 text-sm font-bold px-3 py-1.5 rounded-full text-muted-foreground bg-secondary">
                      <TrendingUp className="w-4 h-4" />
                      #{entry.rank}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </>
      )}
    </div>
  );
}
