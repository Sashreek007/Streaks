import { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Settings, Edit2, Flame, Trophy, CheckCircle2, Users, Zap, Star, TrendingUp, Award, Camera, X, Upload, Loader2 } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { usersApi, type TaskCompletion } from '../services/api';

// Achievement type from API
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
  users: Users,
  check: CheckCircle2,
  trophy: Trophy,
  star: Star,
  zap: Zap,
};

function getIconComponent(iconName: string) {
  return iconMap[iconName.toLowerCase()] || Trophy;
}

export default function ProfilePage() {
  const navigate = useNavigate();
  const { user, refreshUser } = useAuth();
  const [activeTab, setActiveTab] = useState<'activity' | 'achievements'>('activity');
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // API data states
  const [activity, setActivity] = useState<TaskCompletion[]>([]);
  const [achievements, setAchievements] = useState<Achievement[]>([]);
  const [loading, setLoading] = useState(true);

  // Fetch activity and achievements
  useEffect(() => {
    async function fetchData() {
      if (!user) return;

      setLoading(true);
      try {
        const [activityRes, achievementsRes] = await Promise.all([
          usersApi.getActivity(user.id, 10),
          usersApi.getAchievements(user.id),
        ]);

        if (activityRes.success && activityRes.data) {
          setActivity(activityRes.data);
        }
        if (achievementsRes.success && achievementsRes.data) {
          setAchievements(achievementsRes.data as unknown as Achievement[]);
        }
      } catch (err) {
        console.error('Failed to fetch profile data:', err);
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, [user]);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Validate file type
      if (!file.type.startsWith('image/')) {
        alert('Please select an image file');
        return;
      }
      // Validate file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        alert('Image must be less than 5MB');
        return;
      }
      // Create preview
      const reader = new FileReader();
      reader.onload = () => {
        setPreviewUrl(reader.result as string);
        setShowUploadModal(true);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleUpload = async () => {
    if (!previewUrl) return;

    setIsUploading(true);

    // Update profile with the new avatar URL (base64 for now)
    // In a production app, you would upload to a storage service first
    const res = await usersApi.updateProfile({ avatarUrl: previewUrl });

    if (res.success) {
      await refreshUser();
    }

    setIsUploading(false);
    setShowUploadModal(false);
    setPreviewUrl(null);
  };

  const handleCancelUpload = () => {
    setShowUploadModal(false);
    setPreviewUrl(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  // Get initials from display name
  const getInitials = (name: string) => {
    return name.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase();
  };

  // Calculate XP progress to next level (using a simple formula)
  const calculateXpProgress = () => {
    if (!user) return 0;
    const xpForCurrentLevel = user.level * 1000; // Simplified formula
    const xpForNextLevel = (user.level + 1) * 1000;
    const xpInCurrentLevel = user.totalXp - (user.level * (user.level - 1) * 500);
    const xpNeeded = xpForNextLevel - xpForCurrentLevel;
    return Math.min(100, Math.max(0, (xpInCurrentLevel / xpNeeded) * 100));
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

  if (!user) {
    return (
      <div className="p-6 lg:p-8 max-w-5xl mx-auto flex items-center justify-center min-h-[400px]">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="p-4 lg:p-8 max-w-5xl mx-auto space-y-8">
      {/* Hidden file input */}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={handleFileSelect}
        className="hidden"
      />

      {/* Upload Modal */}
      {showUploadModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
          <div className="bg-card border border-border rounded-2xl p-6 max-w-md w-full shadow-2xl animate-fadeIn">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-bold text-foreground">Update Profile Picture</h3>
              <button
                onClick={handleCancelUpload}
                className="p-2 hover:bg-secondary rounded-lg transition-colors"
              >
                <X className="w-5 h-5 text-muted-foreground" />
              </button>
            </div>

            {/* Preview */}
            <div className="flex justify-center mb-6">
              <div className="relative">
                <div className="w-40 h-40 rounded-2xl overflow-hidden border-4 border-primary/20">
                  {previewUrl && (
                    <img
                      src={previewUrl}
                      alt="Preview"
                      className="w-full h-full object-cover"
                    />
                  )}
                </div>
              </div>
            </div>

            <p className="text-sm text-muted-foreground text-center mb-6">
              This is how your profile picture will appear to others.
            </p>

            <div className="flex gap-3">
              <button
                onClick={handleCancelUpload}
                className="flex-1 px-4 py-3 border border-border rounded-xl font-bold text-foreground hover:bg-secondary transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleUpload}
                disabled={isUploading}
                className="flex-1 px-4 py-3 bg-primary text-primary-foreground rounded-xl font-bold hover:opacity-90 transition-all disabled:opacity-50 flex items-center justify-center gap-2"
              >
                {isUploading ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    Uploading...
                  </>
                ) : (
                  <>
                    <Upload className="w-5 h-5" />
                    Save Photo
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Identity Card */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-card via-card to-primary/5 border border-border p-8 lg:p-10 shadow-2xl">
        <div className="absolute inset-0 bg-noise opacity-10 pointer-events-none" />
        <div className="absolute top-0 right-0 w-64 h-64 bg-primary/20 blur-[100px] rounded-full pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-48 h-48 bg-streak/10 blur-[80px] rounded-full pointer-events-none" />

        <div className="relative z-10 flex flex-col md:flex-row gap-8 items-start">
          {/* Avatar with Upload Button */}
          <div className="relative group">
            <div className="w-28 h-28 lg:w-32 lg:h-32 rounded-2xl overflow-hidden bg-gradient-to-br from-primary to-success flex items-center justify-center text-white text-4xl font-black shadow-xl">
              {user.avatarUrl ? (
                <img src={user.avatarUrl} alt="Profile" className="w-full h-full object-cover" />
              ) : (
                getInitials(user.displayName)
              )}
            </div>

            {/* Camera overlay button */}
            <button
              onClick={() => fileInputRef.current?.click()}
              className="absolute inset-0 rounded-2xl bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center cursor-pointer"
            >
              <div className="flex flex-col items-center gap-1 text-white">
                <Camera className="w-6 h-6" />
                <span className="text-xs font-bold">Change</span>
              </div>
            </button>

            {/* Level badge */}
            <div className="absolute -bottom-2 -right-2 bg-achievement text-achievement-foreground px-3 py-1 rounded-full text-sm font-black shadow-lg flex items-center gap-1">
              <Star className="w-3 h-3" />
              LVL {user.level}
            </div>
          </div>

          <div className="flex-1 space-y-4">
            <div>
              <div className="flex items-center gap-3 flex-wrap">
                <h1 className="text-3xl lg:text-4xl font-black text-foreground tracking-tight">{user.displayName}</h1>
                <div className="px-3 py-1 bg-xp/10 border border-xp/20 text-xp text-xs font-bold uppercase tracking-widest rounded-full flex items-center gap-1">
                  <Award className="w-3 h-3" />
                  {user.level >= 20 ? 'Elite' : user.level >= 10 ? 'Veteran' : 'Rising'}
                </div>
              </div>
              <p className="text-muted-foreground font-medium text-sm mt-1">
                @{user.username} • Member since {formatDate(user.createdAt)}
              </p>
            </div>

            {/* Bio */}
            {user.bio && (
              <p className="text-foreground/80 text-sm max-w-lg">{user.bio}</p>
            )}

            {/* XP Progress Bar */}
            <div className="max-w-md">
              <div className="flex items-center justify-between text-xs mb-2">
                <span className="text-muted-foreground font-medium">Level {user.level}</span>
                <span className="text-xp font-bold">{Math.round(calculateXpProgress())}% to Level {user.level + 1}</span>
              </div>
              <div className="h-3 bg-secondary rounded-full overflow-hidden">
                <div
                  className="h-full rounded-full bg-gradient-to-r from-xp via-primary to-success transition-all duration-500"
                  style={{ width: `${calculateXpProgress()}%` }}
                />
              </div>
            </div>

            <div className="flex gap-3 flex-wrap">
              <button
                onClick={() => fileInputRef.current?.click()}
                className="flex items-center gap-2 px-5 py-2.5 bg-primary text-primary-foreground rounded-xl font-bold hover:opacity-90 transition-all shadow-lg shadow-primary/20"
              >
                <Edit2 className="w-4 h-4" />
                Edit Profile
              </button>
              <button
                onClick={() => navigate('/settings')}
                className="flex items-center gap-2 px-5 py-2.5 border border-border bg-secondary/50 text-foreground rounded-xl font-bold hover:bg-secondary transition-all"
              >
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
            <div className="text-3xl font-black text-foreground group-hover:text-primary transition-colors">
              {user.totalXp.toLocaleString()}
            </div>
          </div>

          <div className="bg-streak/10 border border-streak/20 p-5 rounded-2xl hover:border-streak/40 transition-colors group">
            <div className="flex items-center gap-2 text-xs text-streak uppercase tracking-widest font-bold mb-2">
              <Flame className="w-4 h-4 animate-streak-fire" />
              Active Streak
            </div>
            <div className="text-3xl font-black text-streak">
              {user.currentStreak} <span className="text-base opacity-60">days</span>
            </div>
          </div>

          <div className="bg-success/10 border border-success/20 p-5 rounded-2xl hover:border-success/40 transition-colors group">
            <div className="flex items-center gap-2 text-xs text-success uppercase tracking-widest font-bold mb-2">
              <Trophy className="w-4 h-4" />
              Longest Streak
            </div>
            <div className="text-3xl font-black text-success">{user.longestStreak}</div>
          </div>

          <div className="bg-primary/10 border border-primary/20 p-5 rounded-2xl hover:border-primary/40 transition-colors group">
            <div className="flex items-center gap-2 text-xs text-primary uppercase tracking-widest font-bold mb-2">
              <Star className="w-4 h-4" />
              Level
            </div>
            <div className="text-3xl font-black text-primary">{user.level}</div>
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
      {loading ? (
        <div className="flex items-center justify-center py-12">
          <Loader2 className="w-8 h-8 animate-spin text-primary" />
        </div>
      ) : activeTab === 'activity' ? (
        <div className="space-y-4">
          {activity.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-muted-foreground">No activity yet. Complete some tasks to see your progress!</p>
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
              <p className="text-muted-foreground">No achievements earned yet. Keep completing tasks!</p>
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
