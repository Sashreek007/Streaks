import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Bell,
  Moon,
  Sun,
  Shield,
  Eye,
  EyeOff,
  Smartphone,
  Mail,
  Lock,
  Trash2,
  ChevronRight,
  Check,
  Flame,
  Users,
  Trophy,
  LogOut,
  Loader2
} from 'lucide-react';
import { useTheme } from '../context/ThemeContext';
import { useAuth } from '../context/AuthContext';
import { usersApi, type UserSettings } from '../services/api';

interface ToggleProps {
  enabled: boolean;
  onChange: () => void;
  disabled?: boolean;
}

function Toggle({ enabled, onChange, disabled }: ToggleProps) {
  return (
    <button
      onClick={onChange}
      disabled={disabled}
      className={`relative w-12 h-6 rounded-full transition-colors ${enabled ? 'bg-primary' : 'bg-secondary'
        } ${disabled ? 'opacity-50 cursor-not-allowed' : ''}`}
    >
      <div
        className={`absolute top-1 w-4 h-4 rounded-full bg-white transition-transform ${enabled ? 'left-7' : 'left-1'
          }`}
      />
    </button>
  );
}

export default function SettingsPage() {
  const navigate = useNavigate();
  const { theme, toggleTheme } = useTheme();
  const { logout } = useAuth();

  // Loading and saving states
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [hasChanges, setHasChanges] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);

  // Settings state (initialized with defaults)
  const [settings, setSettings] = useState<Partial<UserSettings>>({
    pushEnabled: true,
    streakReminders: true,
    friendActivity: true,
    squadUpdates: true,
    communityUpdates: true,
    leaderboardChanges: false,
    emailDigest: true,
    profilePublic: true,
    showStreak: true,
    showScore: true,
    allowDms: true,
    showOnLeaderboard: true,
    reminderTime: '09:00',
    gracePeriodEnabled: true,
    gracePeriodHours: 2,
    weekendMode: false,
  });

  // Fetch settings on mount
  useEffect(() => {
    async function fetchSettings() {
      setLoading(true);
      const res = await usersApi.getSettings();
      if (res.success && res.data) {
        setSettings(res.data);
      }
      setLoading(false);
    }
    fetchSettings();
  }, []);

  // Update a setting
  const updateSetting = <K extends keyof UserSettings>(key: K, value: UserSettings[K]) => {
    setSettings(prev => ({ ...prev, [key]: value }));
    setHasChanges(true);
    setSaveSuccess(false);
  };

  // Save settings to API
  const handleSave = async () => {
    setSaving(true);
    const res = await usersApi.updateSettings(settings);
    if (res.success) {
      setHasChanges(false);
      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 3000);
    }
    setSaving(false);
  };

  const handleLogout = async () => {
    await logout();
    navigate('/');
  };

  if (loading) {
    return (
      <div className="p-6 lg:p-8 max-w-3xl mx-auto flex items-center justify-center min-h-[400px]">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="p-4 lg:p-8 max-w-3xl mx-auto space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-black text-foreground tracking-tight">Settings</h1>
        <p className="text-muted-foreground mt-1">Manage your account and preferences</p>
      </div>

      {/* Appearance */}
      <section className="bg-card border border-border rounded-2xl overflow-hidden">
        <div className="p-4 border-b border-border bg-secondary/30">
          <div className="flex items-center gap-2">
            {theme === 'dark' ? <Moon className="w-5 h-5 text-primary" /> : <Sun className="w-5 h-5 text-achievement" />}
            <h2 className="font-bold text-foreground">Appearance</h2>
          </div>
        </div>

        <div className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium text-foreground">Dark Mode</p>
              <p className="text-sm text-muted-foreground">Use dark theme for the interface</p>
            </div>
            <Toggle enabled={theme === 'dark'} onChange={toggleTheme} />
          </div>
        </div>
      </section>

      {/* Notifications */}
      <section className="bg-card border border-border rounded-2xl overflow-hidden">
        <div className="p-4 border-b border-border bg-secondary/30">
          <div className="flex items-center gap-2">
            <Bell className="w-5 h-5 text-primary" />
            <h2 className="font-bold text-foreground">Notifications</h2>
          </div>
        </div>

        <div className="divide-y divide-border">
          <div className="p-4 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Smartphone className="w-5 h-5 text-muted-foreground" />
              <div>
                <p className="font-medium text-foreground">Push Notifications</p>
                <p className="text-sm text-muted-foreground">Receive notifications on your device</p>
              </div>
            </div>
            <Toggle
              enabled={settings.pushEnabled ?? true}
              onChange={() => updateSetting('pushEnabled', !settings.pushEnabled)}
            />
          </div>

          <div className="p-4 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Flame className="w-5 h-5 text-streak" />
              <div>
                <p className="font-medium text-foreground">Streak Reminders</p>
                <p className="text-sm text-muted-foreground">Get reminded to maintain your streak</p>
              </div>
            </div>
            <Toggle
              enabled={settings.streakReminders ?? true}
              onChange={() => updateSetting('streakReminders', !settings.streakReminders)}
            />
          </div>

          <div className="p-4 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Users className="w-5 h-5 text-muted-foreground" />
              <div>
                <p className="font-medium text-foreground">Friend Activity</p>
                <p className="text-sm text-muted-foreground">When friends complete tasks or reach milestones</p>
              </div>
            </div>
            <Toggle
              enabled={settings.friendActivity ?? true}
              onChange={() => updateSetting('friendActivity', !settings.friendActivity)}
            />
          </div>

          <div className="p-4 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Users className="w-5 h-5 text-muted-foreground" />
              <div>
                <p className="font-medium text-foreground">Squad Updates</p>
                <p className="text-sm text-muted-foreground">Activity in your squads</p>
              </div>
            </div>
            <Toggle
              enabled={settings.squadUpdates ?? true}
              onChange={() => updateSetting('squadUpdates', !settings.squadUpdates)}
            />
          </div>

          <div className="p-4 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Trophy className="w-5 h-5 text-achievement" />
              <div>
                <p className="font-medium text-foreground">Leaderboard Changes</p>
                <p className="text-sm text-muted-foreground">When your rank changes</p>
              </div>
            </div>
            <Toggle
              enabled={settings.leaderboardChanges ?? false}
              onChange={() => updateSetting('leaderboardChanges', !settings.leaderboardChanges)}
            />
          </div>

          <div className="p-4 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Mail className="w-5 h-5 text-muted-foreground" />
              <div>
                <p className="font-medium text-foreground">Weekly Email Digest</p>
                <p className="text-sm text-muted-foreground">Summary of your progress each week</p>
              </div>
            </div>
            <Toggle
              enabled={settings.emailDigest ?? true}
              onChange={() => updateSetting('emailDigest', !settings.emailDigest)}
            />
          </div>
        </div>
      </section>

      {/* Streak Settings */}
      <section className="bg-card border border-border rounded-2xl overflow-hidden">
        <div className="p-4 border-b border-border bg-secondary/30">
          <div className="flex items-center gap-2">
            <Flame className="w-5 h-5 text-streak" />
            <h2 className="font-bold text-foreground">Streak Settings</h2>
          </div>
        </div>

        <div className="divide-y divide-border">
          <div className="p-4 flex items-center justify-between">
            <div>
              <p className="font-medium text-foreground">Daily Reminder Time</p>
              <p className="text-sm text-muted-foreground">When to remind you about your streak</p>
            </div>
            <input
              type="time"
              value={settings.reminderTime ?? '09:00'}
              onChange={(e) => updateSetting('reminderTime', e.target.value)}
              className="bg-secondary text-foreground rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </div>

          <div className="p-4 flex items-center justify-between">
            <div>
              <p className="font-medium text-foreground">Streak Grace Period</p>
              <p className="text-sm text-muted-foreground">Get extra hours before losing your streak</p>
            </div>
            <Toggle
              enabled={settings.gracePeriodEnabled ?? true}
              onChange={() => updateSetting('gracePeriodEnabled', !settings.gracePeriodEnabled)}
            />
          </div>

          <div className="p-4 flex items-center justify-between">
            <div>
              <p className="font-medium text-foreground">Weekend Mode</p>
              <p className="text-sm text-muted-foreground">Weekends don't count towards streak breaks</p>
            </div>
            <Toggle
              enabled={settings.weekendMode ?? false}
              onChange={() => updateSetting('weekendMode', !settings.weekendMode)}
            />
          </div>
        </div>
      </section>

      {/* Privacy */}
      <section className="bg-card border border-border rounded-2xl overflow-hidden">
        <div className="p-4 border-b border-border bg-secondary/30">
          <div className="flex items-center gap-2">
            <Shield className="w-5 h-5 text-primary" />
            <h2 className="font-bold text-foreground">Privacy</h2>
          </div>
        </div>

        <div className="divide-y divide-border">
          <div className="p-4 flex items-center justify-between">
            <div className="flex items-center gap-3">
              {settings.profilePublic ? <Eye className="w-5 h-5 text-muted-foreground" /> : <EyeOff className="w-5 h-5 text-muted-foreground" />}
              <div>
                <p className="font-medium text-foreground">Public Profile</p>
                <p className="text-sm text-muted-foreground">Others can view your profile</p>
              </div>
            </div>
            <Toggle
              enabled={settings.profilePublic ?? true}
              onChange={() => updateSetting('profilePublic', !settings.profilePublic)}
            />
          </div>

          <div className="p-4 flex items-center justify-between">
            <div>
              <p className="font-medium text-foreground">Show Streak on Profile</p>
              <p className="text-sm text-muted-foreground">Display your current streak publicly</p>
            </div>
            <Toggle
              enabled={settings.showStreak ?? true}
              onChange={() => updateSetting('showStreak', !settings.showStreak)}
            />
          </div>

          <div className="p-4 flex items-center justify-between">
            <div>
              <p className="font-medium text-foreground">Show Score on Profile</p>
              <p className="text-sm text-muted-foreground">Display your total XP publicly</p>
            </div>
            <Toggle
              enabled={settings.showScore ?? true}
              onChange={() => updateSetting('showScore', !settings.showScore)}
            />
          </div>

          <div className="p-4 flex items-center justify-between">
            <div>
              <p className="font-medium text-foreground">Allow Direct Messages</p>
              <p className="text-sm text-muted-foreground">Let others send you messages</p>
            </div>
            <Toggle
              enabled={settings.allowDms ?? true}
              onChange={() => updateSetting('allowDms', !settings.allowDms)}
            />
          </div>

          <div className="p-4 flex items-center justify-between">
            <div>
              <p className="font-medium text-foreground">Show on Leaderboard</p>
              <p className="text-sm text-muted-foreground">Appear in public leaderboards</p>
            </div>
            <Toggle
              enabled={settings.showOnLeaderboard ?? true}
              onChange={() => updateSetting('showOnLeaderboard', !settings.showOnLeaderboard)}
            />
          </div>
        </div>
      </section>

      {/* Account */}
      <section className="bg-card border border-border rounded-2xl overflow-hidden">
        <div className="p-4 border-b border-border bg-secondary/30">
          <div className="flex items-center gap-2">
            <Lock className="w-5 h-5 text-primary" />
            <h2 className="font-bold text-foreground">Account</h2>
          </div>
        </div>

        <div className="divide-y divide-border">
          <button className="w-full p-4 flex items-center justify-between hover:bg-secondary/50 transition-colors text-left">
            <div>
              <p className="font-medium text-foreground">Change Password</p>
              <p className="text-sm text-muted-foreground">Update your password</p>
            </div>
            <ChevronRight className="w-5 h-5 text-muted-foreground" />
          </button>

          <button className="w-full p-4 flex items-center justify-between hover:bg-secondary/50 transition-colors text-left">
            <div>
              <p className="font-medium text-foreground">Connected Accounts</p>
              <p className="text-sm text-muted-foreground">Manage Google, GitHub connections</p>
            </div>
            <ChevronRight className="w-5 h-5 text-muted-foreground" />
          </button>

          <button className="w-full p-4 flex items-center justify-between hover:bg-secondary/50 transition-colors text-left">
            <div>
              <p className="font-medium text-foreground">Export Data</p>
              <p className="text-sm text-muted-foreground">Download all your data</p>
            </div>
            <ChevronRight className="w-5 h-5 text-muted-foreground" />
          </button>
        </div>
      </section>

      {/* Danger Zone */}
      <section className="bg-card border border-energy/30 rounded-2xl overflow-hidden">
        <div className="p-4 border-b border-energy/30 bg-energy/5">
          <div className="flex items-center gap-2">
            <Trash2 className="w-5 h-5 text-energy" />
            <h2 className="font-bold text-energy">Danger Zone</h2>
          </div>
        </div>

        <div className="divide-y divide-border">
          <button
            onClick={handleLogout}
            className="w-full p-4 flex items-center justify-between hover:bg-energy/5 transition-colors text-left group"
          >
            <div>
              <p className="font-medium text-foreground group-hover:text-energy transition-colors">Log Out</p>
              <p className="text-sm text-muted-foreground">Sign out of your account</p>
            </div>
            <LogOut className="w-5 h-5 text-muted-foreground group-hover:text-energy transition-colors" />
          </button>

          <button className="w-full p-4 flex items-center justify-between hover:bg-energy/5 transition-colors text-left group">
            <div>
              <p className="font-medium text-foreground group-hover:text-energy transition-colors">Delete Account</p>
              <p className="text-sm text-muted-foreground">Permanently delete your account and data</p>
            </div>
            <Trash2 className="w-5 h-5 text-muted-foreground group-hover:text-energy transition-colors" />
          </button>
        </div>
      </section>

      {/* Save Button */}
      <div className="flex justify-end gap-4 items-center">
        {saveSuccess && (
          <span className="text-success text-sm font-medium">Settings saved successfully!</span>
        )}
        <button
          onClick={handleSave}
          disabled={!hasChanges || saving}
          className={`flex items-center gap-2 px-6 py-3 rounded-xl font-bold transition-all shadow-lg ${hasChanges
            ? 'bg-primary text-primary-foreground hover:opacity-90 shadow-primary/20'
            : 'bg-secondary text-muted-foreground cursor-not-allowed shadow-none'
            }`}
        >
          {saving ? (
            <>
              <Loader2 className="w-5 h-5 animate-spin" />
              Saving...
            </>
          ) : (
            <>
              <Check className="w-5 h-5" />
              Save Changes
            </>
          )}
        </button>
      </div>
    </div>
  );
}
