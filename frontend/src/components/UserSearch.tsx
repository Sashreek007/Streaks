import { useState, useEffect, useRef } from 'react';
import { Search, X, Loader2, Flame, UserPlus, User } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { usersApi, friendsApi } from '../services/api';

interface SearchResult {
  id: string;
  username: string;
  displayName: string;
  avatarUrl: string | null;
  bio: string | null;
  level: number;
  totalXp: number | null;
  currentStreak: number | null;
}

interface UserSearchProps {
  isMobile?: boolean;
}

export default function UserSearch({ isMobile = false }: UserSearchProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<SearchResult[]>([]);
  const [loading, setLoading] = useState(false);
  const [sendingRequest, setSendingRequest] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const navigate = useNavigate();

  // Debounced search
  useEffect(() => {
    if (query.length < 2) {
      setResults([]);
      return;
    }

    const timer = setTimeout(async () => {
      setLoading(true);
      try {
        const res = await usersApi.search(query);
        if (res.success && res.data) {
          setResults(res.data);
        } else {
          setResults([]);
        }
      } catch (error) {
        console.error('Search error:', error);
        setResults([]);
      } finally {
        setLoading(false);
      }
    }, 300);

    return () => clearTimeout(timer);
  }, [query]);

  // Focus input when modal opens
  useEffect(() => {
    if (isOpen && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isOpen]);

  // Close on escape key
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setIsOpen(false);
      }
    };
    window.addEventListener('keydown', handleEscape);
    return () => window.removeEventListener('keydown', handleEscape);
  }, []);

  const handleSendRequest = async (userId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setSendingRequest(userId);
    await friendsApi.sendRequest(userId);
    setSendingRequest(null);
    // Remove from results after sending request
    setResults(prev => prev.filter(u => u.id !== userId));
  };

  const handleViewProfile = (userId: string) => {
    setIsOpen(false);
    setQuery('');
    navigate(`/profile/${userId}`);
  };

  const getInitials = (name: string) => {
    return name.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase();
  };

  return (
    <>
      {/* Search Button */}
      {isMobile ? (
        <button
          onClick={() => setIsOpen(true)}
          className="flex flex-col items-center gap-1 p-2 rounded-xl transition-all text-muted-foreground"
        >
          <div className="p-2 rounded-xl">
            <Search className="w-5 h-5" />
          </div>
          <span className="text-[10px] font-medium">Search</span>
        </button>
      ) : (
        <button
          onClick={() => setIsOpen(true)}
          title="Search users"
          className="relative group flex items-center justify-center p-3 rounded-2xl transition-all duration-300 text-muted-foreground hover:bg-secondary hover:text-foreground"
        >
          <Search className="w-6 h-6" />
          {/* Tooltip */}
          <div className="absolute left-full ml-4 px-2 py-1 bg-popover text-popover-foreground text-xs font-medium rounded-lg opacity-0 -translate-x-2 pointer-events-none group-hover:opacity-100 group-hover:translate-x-0 transition-all whitespace-nowrap border border-border shadow-lg z-50">
            Search Users
          </div>
        </button>
      )}

      {/* Search Modal */}
      {isOpen && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[100] flex items-start justify-center pt-[10vh]">
          <div
            className="bg-card border border-border rounded-2xl w-full max-w-lg mx-4 shadow-2xl overflow-hidden"
            onClick={e => e.stopPropagation()}
          >
            {/* Search Input */}
            <div className="flex items-center gap-3 p-4 border-b border-border">
              <Search className="w-5 h-5 text-muted-foreground" />
              <input
                ref={inputRef}
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search users by username or name..."
                className="flex-1 bg-transparent text-foreground placeholder:text-muted-foreground focus:outline-none text-lg"
              />
              {loading && <Loader2 className="w-5 h-5 animate-spin text-primary" />}
              <button
                onClick={() => setIsOpen(false)}
                className="p-1 hover:bg-secondary rounded-lg text-muted-foreground hover:text-foreground"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Results */}
            <div className="max-h-[60vh] overflow-y-auto">
              {query.length < 2 ? (
                <div className="p-8 text-center text-muted-foreground">
                  <Search className="w-12 h-12 mx-auto mb-3 opacity-20" />
                  <p>Type at least 2 characters to search</p>
                </div>
              ) : results.length === 0 && !loading ? (
                <div className="p-8 text-center text-muted-foreground">
                  <User className="w-12 h-12 mx-auto mb-3 opacity-20" />
                  <p>No users found for "{query}"</p>
                </div>
              ) : (
                <div className="p-2">
                  {results.map((user) => (
                    <div
                      key={user.id}
                      onClick={() => handleViewProfile(user.id)}
                      className="flex items-center gap-3 p-3 rounded-xl hover:bg-secondary cursor-pointer transition-colors group"
                    >
                      {/* Avatar */}
                      <div className="w-12 h-12 rounded-full bg-primary/20 flex items-center justify-center text-primary font-semibold overflow-hidden shrink-0">
                        {user.avatarUrl ? (
                          <img src={user.avatarUrl} alt="" className="w-full h-full object-cover" />
                        ) : (
                          getInitials(user.displayName)
                        )}
                      </div>

                      {/* User Info */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <p className="font-semibold text-foreground truncate">{user.displayName}</p>
                          <span className="text-xs bg-primary/10 text-primary px-2 py-0.5 rounded-full">
                            Lvl {user.level}
                          </span>
                        </div>
                        <p className="text-sm text-muted-foreground truncate">@{user.username}</p>
                        {user.bio && (
                          <p className="text-xs text-muted-foreground truncate mt-0.5">{user.bio}</p>
                        )}
                      </div>

                      {/* Stats & Actions */}
                      <div className="flex items-center gap-3 shrink-0">
                        {user.currentStreak !== null && (
                          <div className="flex items-center gap-1 text-orange-500">
                            <Flame className="w-4 h-4" />
                            <span className="text-sm font-medium">{user.currentStreak}</span>
                          </div>
                        )}
                        <button
                          onClick={(e) => handleSendRequest(user.id, e)}
                          disabled={sendingRequest === user.id}
                          className="p-2 bg-primary/10 hover:bg-primary/20 text-primary rounded-lg transition-colors disabled:opacity-50"
                          title="Send friend request"
                        >
                          {sendingRequest === user.id ? (
                            <Loader2 className="w-4 h-4 animate-spin" />
                          ) : (
                            <UserPlus className="w-4 h-4" />
                          )}
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Footer hint */}
            <div className="p-3 border-t border-border bg-secondary/30">
              <p className="text-xs text-muted-foreground text-center">
                Press <kbd className="px-1.5 py-0.5 bg-secondary rounded text-foreground">Esc</kbd> to close
              </p>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
