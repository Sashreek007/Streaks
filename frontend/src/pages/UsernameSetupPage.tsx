import { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { Flame, Check, X, Loader2, AtSign } from 'lucide-react';
import { usersApi } from '../services/api';
import { useAuth } from '../context/AuthContext';

export default function UsernameSetupPage() {
  const navigate = useNavigate();
  const { user, refreshUser } = useAuth();
  const [username, setUsername] = useState('');
  const [isChecking, setIsChecking] = useState(false);
  const [isAvailable, setIsAvailable] = useState<boolean | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Debounced username check
  const checkUsername = useCallback(async (value: string) => {
    if (value.length < 3) {
      setIsAvailable(null);
      setError(value.length > 0 ? 'Username must be at least 3 characters' : null);
      return;
    }

    if (!/^[a-z0-9_]+$/.test(value)) {
      setIsAvailable(false);
      setError('Only lowercase letters, numbers, and underscores allowed');
      return;
    }

    setIsChecking(true);
    setError(null);

    try {
      const res = await usersApi.checkUsername(value);

      setIsChecking(false);
      if (res.success && res.data) {
        setIsAvailable(res.data.available);
        setError(res.data.available ? null : res.data.reason);
      } else {
        setError(res.error || 'Too many requests, please try again later.');
        setIsAvailable(null);
      }
    } catch (error) {
      console.error('Username check error:', error);
      setIsChecking(false);
      setError('Too many requests, please try again later.');
      setIsAvailable(null);
    }
  }, []);

  // Debounce effect
  useEffect(() => {
    if (!username) {
      setIsAvailable(null);
      setError(null);
      return;
    }

    const timer = setTimeout(() => {
      checkUsername(username);
    }, 500);

    return () => clearTimeout(timer);
  }, [username, checkUsername]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!isAvailable || isSubmitting) return;

    setIsSubmitting(true);
    setError(null);

    const res = await usersApi.updateUsername(username);

    if (res.success) {
      // Refresh user data in context
      await refreshUser();
      navigate('/dashboard');
    } else {
      setError(res.error || 'Failed to update username');
      setIsSubmitting(false);
    }
  };

  const handleSkip = () => {
    // User wants to keep their auto-generated username
    navigate('/dashboard');
  };

  return (
    <div className="min-h-screen bg-[#0A0A0B] flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="flex justify-center mb-8">
          <div className="w-16 h-16 bg-gradient-to-br from-emerald-400 to-emerald-600 rounded-2xl flex items-center justify-center">
            <Flame className="w-10 h-10 text-white" />
          </div>
        </div>

        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-white mb-2">Choose Your Username</h1>
          <p className="text-zinc-400">
            This is how other players will find and identify you
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="bg-zinc-900/50 border border-zinc-800 rounded-2xl p-6">
          <div className="mb-6">
            <label className="block text-sm font-medium text-zinc-300 mb-2">
              Username
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <AtSign className="h-5 w-5 text-zinc-500" />
              </div>
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value.toLowerCase().replace(/[^a-z0-9_]/g, ''))}
                placeholder="your_username"
                className="w-full pl-10 pr-12 py-3 bg-zinc-800/50 border border-zinc-700 rounded-xl text-white placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/50 focus:border-emerald-500"
                maxLength={30}
                autoFocus
              />
              <div className="absolute inset-y-0 right-0 pr-3 flex items-center">
                {isChecking && (
                  <Loader2 className="h-5 w-5 text-zinc-500 animate-spin" />
                )}
                {!isChecking && isAvailable === true && (
                  <Check className="h-5 w-5 text-emerald-500" />
                )}
                {!isChecking && isAvailable === false && (
                  <X className="h-5 w-5 text-red-500" />
                )}
              </div>
            </div>
            {error && (
              <p className="mt-2 text-sm text-red-400">{error}</p>
            )}
            {isAvailable && !error && (
              <p className="mt-2 text-sm text-emerald-400">Username is available!</p>
            )}
            <p className="mt-2 text-xs text-zinc-500">
              3-30 characters, lowercase letters, numbers, and underscores only
            </p>
          </div>

          {/* Current username hint */}
          {user?.username && (
            <div className="mb-6 p-3 bg-zinc-800/30 border border-zinc-700/50 rounded-xl">
              <p className="text-sm text-zinc-400">
                Your current username is <span className="text-white font-mono">@{user.username}</span>
              </p>
            </div>
          )}

          {/* Buttons */}
          <div className="space-y-3">
            <button
              type="submit"
              disabled={!isAvailable || isSubmitting}
              className="w-full py-3 px-4 bg-gradient-to-r from-emerald-500 to-emerald-600 text-white font-semibold rounded-xl hover:from-emerald-600 hover:to-emerald-700 focus:outline-none focus:ring-2 focus:ring-emerald-500/50 disabled:opacity-50 disabled:cursor-not-allowed transition-all flex items-center justify-center"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                  Setting username...
                </>
              ) : (
                'Set Username'
              )}
            </button>

            <button
              type="button"
              onClick={handleSkip}
              className="w-full py-3 px-4 text-zinc-400 hover:text-white font-medium transition-colors"
            >
              Skip for now
            </button>
          </div>
        </form>

        {/* Info */}
        <p className="mt-6 text-center text-sm text-zinc-500">
          You can change your username later in settings
        </p>
      </div>
    </div>
  );
}
