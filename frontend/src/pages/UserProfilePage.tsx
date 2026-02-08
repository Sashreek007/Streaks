import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Flame, Trophy, CheckCircle2, Zap, Star, TrendingUp, Award, Loader2, UserPlus, MessageSquare, ArrowLeft } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { usersApi, friendsApi, type TaskCompletion } from '../services/api';

interface UserProfile {
  id: string;
  username: string;
  displayName: string;
  avatarUrl: string | null;
  bio: string | null;
  level: number;
  totalXp: number | null;
  currentStreak: number | null;
  longestStreak: number | null;
  createdAt: string;
  stats: {
    tasksCompleted: number;
    squads: number;
    communities: number;
  };
}

interface Achievement {
  id: string;
  name: string;
  description: string;
  icon: string;
  earnedAt: string;
}

// Map icon names to Lucide components
const iconMap: Record<string, React.ComponentType<{ className?: string }>> = {
  flame: Flame,
  check: CheckCircle2,
  trophy: Trophy,
  star: Star,
  zap: Zap,
};

function getIconComponent(iconName: string) {
  return iconMap[iconName.toLowerCase()] || Trophy;
}

export default function UserProfilePage() {
  const { userId } = useParams<{ userId: string }>();
  const navigate = useNavigate();
  const { user: currentUser } = useAuth();
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [activity, setActivity] = useState<TaskCompletion[]>([]);
  const [achievements, setAchievements] = useState<Achievement[]>([]);
  const [activeTab, setActiveTab] = useState<'activity' | 'achievements'>('activity');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [sendingRequest, setSendingRequest] = useState(false);

  // Redirect to own profile if viewing self
  useEffect(() => {
    if (userId && currentUser && userId === currentUser.id) {
      navigate('/profile', { replace: true });
    }
  }, [userId, currentUser, navigate]);

  // Fetch user profile data
  useEffect(() => {
    async function fetchData() {
      if (!userId) return;

      setLoading(true);
      setError(null);

      try {
        const profileRes = await usersApi.getProfile(userId);

        if (!profileRes.success) {
          setError(profileRes.error || 'Failed to load profile');
          setLoading(false);
          return;
        }

        setProfile(profileRes.data as unknown as UserProfile);

        // Fetch activity and achievements
        const [activityRes, achievementsRes] = await Promise.all([
          usersApi.getActivity(userId, 10),
          usersApi.getAchievements(userId),
        ]);

        if (activityRes.success && activityRes.data) {
          setActivity(activityRes.data);
        }
        if (achievementsRes.success && achievementsRes.data) {
          setAchievements(achievementsRes.data as unknown as Achievement[]);
        }
      } catch (err) {
        console.error('Failed to fetch profile:', err);
        setError('Failed to load profile');
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, [userId]);

  const handleSendRequest = async () => {
    if (!userId) return;
    setSendingRequest(true);
    await friendsApi.sendRequest(userId);
    setSendingRequest(false);
  };

  // Get initials from display name
  const getInitials = (name: string) => {
    return name.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase();
  };

  // Format date for display
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
  };

  // Format time ago
  const formatTimeAgo = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 60) return `${diffMins}M AGO`;
    if (diffHours < 24) return `${diffHours}H AGO`;
    return `${diffDays}D AGO`;
  };

  if (loading) {
    return (
      <div className="p-6 lg:p-8 max-w-5xl mx-auto flex items-center justify-center min-h-[400px]">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  if (error || !profile) {
    return (
      <div className="p-6 lg:p-8 max-w-5xl mx-auto">
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 text-muted-foreground hover:text-foreground mb-6"
        >
          <ArrowLeft className="w-4 h-4" />
          Go Back
        </button>
        <div className="bg-card border border-border rounded-2xl p-8 text-center">
          <p className="text-xl font-bold text-foreground mb-2">Profile Not Found</p>
          <p className="text-muted-foreground">{error || 'This profile may be private or does not exist.'}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-4 lg:p-8 max-w-5xl mx-auto space-y-8">
      {/* Back button */}
      <button
        onClick={() => navigate(-1)}
        className="flex items-center gap-2 text-muted-foreground hover:text-foreground"
      >
        <ArrowLeft className="w-4 h-4" />
        Back
      </button>

      {/* Profile Card */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-card via-card to-primary/5 border border-border p-8 lg:p-10 shadow-2xl">
        <div className="absolute inset-0 bg-noise opacity-10 pointer-events-none" />
        <div className="absolute top-0 right-0 w-64 h-64 bg-primary/20 blur-[100px] rounded-full pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-48 h-48 bg-streak/10 blur-[80px] rounded-full pointer-events-none" />

        <div className="relative z-10 flex flex-col md:flex-row gap-8 items-start">
          {/* Avatar */}
          <div className="relative">
            <div className="w-28 h-28 lg:w-32 lg:h-32 rounded-2xl overflow-hidden bg-gradient-to-br from-primary to-success flex items-center justify-center text-white text-4xl font-black shadow-xl">
              {profile.avatarUrl ? (
                <img src={profile.avatarUrl} alt="Profile" className="w-full h-full object-cover" />
              ) : (
                getInitials(profile.displayName)
              )}
            </div>

            {/* Level badge */}
            <div className="absolute -bottom-2 -right-2 bg-achievement text-achievement-foreground px-3 py-1 rounded-full text-sm font-black shadow-lg flex items-center gap-1">
              <Star className="w-3 h-3" />
              LVL {profile.level}
            </div>
          </div>

          <div className="flex-1 space-y-4">
            <div>
              <div className="flex items-center gap-3 flex-wrap">
                <h1 className="text-3xl lg:text-4xl font-black text-foreground tracking-tight">{profile.displayName}</h1>
                <div className="px-3 py-1 bg-xp/10 border border-xp/20 text-xp text-xs font-bold uppercase tracking-widest rounded-full flex items-center gap-1">
                  <Award className="w-3 h-3" />
                  {profile.level >= 20 ? 'Elite' : profile.level >= 10 ? 'Veteran' : 'Rising'}
                </div>
              </div>
              <p className="text-muted-foreground font-medium text-sm mt-1">
                @{profile.username} • Member since {formatDate(profile.createdAt)}
              </p>
            </div>

            {/* Bio */}
            {profile.bio && (
              <p className="text-foreground/80 text-sm max-w-lg">{profile.bio}</p>
            )}

            {/* Action buttons */}
            <div className="flex gap-3 flex-wrap">
              <button
                onClick={handleSendRequest}
                disabled={sendingRequest}
                className="flex items-center gap-2 px-5 py-2.5 bg-primary text-primary-foreground rounded-xl font-bold hover:opacity-90 transition-all shadow-lg shadow-primary/20 disabled:opacity-50"
              >
                {sendingRequest ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <UserPlus className="w-4 h-4" />
                )}
                Add Friend
              </button>
              <button className="flex items-center gap-2 px-5 py-2.5 border border-border bg-secondary/50 text-foreground rounded-xl font-bold hover:bg-secondary transition-all">
                <MessageSquare className="w-4 h-4" />
                Message
              </button>
            </div>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mt-10 pt-8 border-t border-border/50">
          {profile.totalXp !== null && (
            <div className="bg-card/80 border border-border p-5 rounded-2xl hover:border-primary/30 transition-colors group">
              <div className="flex items-center gap-2 text-xs text-muted-foreground uppercase tracking-widest font-bold mb-2">
                <Zap className="w-4 h-4 text-xp" />
                Total XP
              </div>
              <div className="text-3xl font-black text-foreground group-hover:text-primary transition-colors">
                {profile.totalXp.toLocaleString()}
              </div>
            </div>
          )}

          {profile.currentStreak !== null && (
            <div className="bg-streak/10 border border-streak/20 p-5 rounded-2xl hover:border-streak/40 transition-colors group">
              <div className="flex items-center gap-2 text-xs text-streak uppercase tracking-widest font-bold mb-2">
                <Flame className="w-4 h-4 animate-streak-fire" />
                Active Streak
              </div>
              <div className="text-3xl font-black text-streak">
                {profile.currentStreak} <span className="text-base opacity-60">days</span>
              </div>
            </div>
          )}

          {profile.longestStreak !== null && (
            <div className="bg-success/10 border border-success/20 p-5 rounded-2xl hover:border-success/40 transition-colors group">
              <div className="flex items-center gap-2 text-xs text-success uppercase tracking-widest font-bold mb-2">
                <Trophy className="w-4 h-4" />
                Longest Streak
              </div>
              <div className="text-3xl font-black text-success">{profile.longestStreak}</div>
            </div>
          )}

          <div className="bg-primary/10 border border-primary/20 p-5 rounded-2xl hover:border-primary/40 transition-colors group">
            <div className="flex items-center gap-2 text-xs text-primary uppercase tracking-widest font-bold mb-2">
              <CheckCircle2 className="w-4 h-4" />
              Tasks Done
            </div>
            <div className="text-3xl font-black text-primary">{profile.stats.tasksCompleted}</div>
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
          {activity.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-muted-foreground">No activity yet.</p>
            </div>
          ) : (
            activity.map((item) => (
              <div
                key={item.id}
                className="bg-card border border-border p-5 rounded-2xl flex items-center gap-5 group hover:border-primary/30 transition-all hover:shadow-md"
              >
                <div className="w-12 h-12 flex items-center justify-center rounded-xl font-bold transition-colors bg-success/10 text-success group-hover:bg-success/20">
                  <CheckCircle2 className="w-6 h-6" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-bold text-foreground">
                    Completed: {item.task?.title || 'Task'}
                  </p>
                  <p className="text-xs text-muted-foreground mt-1">
                    {formatTimeAgo(item.completedAt)}
                  </p>
                </div>
                <div className="flex items-center gap-1.5 font-bold text-xp bg-xp/10 px-4 py-2 rounded-full text-sm">
                  <Zap className="w-4 h-4" />
                  +{item.xpEarned} XP
                </div>
              </div>
            ))
          )}
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2">
          {achievements.length === 0 ? (
            <div className="col-span-2 text-center py-12">
              <p className="text-muted-foreground">No achievements earned yet.</p>
            </div>
          ) : (
            achievements.map((achievement) => {
              const IconComponent = getIconComponent(achievement.icon);
              return (
                <div
                  key={achievement.id}
                  className="bg-primary/5 border border-primary/20 hover:border-primary/40 p-6 rounded-2xl flex items-center gap-5 transition-all hover:shadow-md"
                >
                  <div className="w-14 h-14 rounded-xl flex items-center justify-center bg-primary text-white shadow-lg">
                    <IconComponent className="w-7 h-7" />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <p className="font-bold text-foreground">{achievement.name}</p>
                      <CheckCircle2 className="w-4 h-4 text-success" />
                    </div>
                    <p className="text-sm text-muted-foreground mt-1">{achievement.description}</p>
                    <p className="text-xs text-primary mt-1">
                      Earned {formatDate(achievement.earnedAt)}
                    </p>
                  </div>
                </div>
              );
            })
          )}
        </div>
      )}
    </div>
  );
}
