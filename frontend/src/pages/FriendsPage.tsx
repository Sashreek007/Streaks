import { useState, useEffect } from 'react';
import { Search, UserPlus, UserCheck, Flame, MessageCircle, MoreVertical, Check, X, Loader2 } from 'lucide-react';
import { friendsApi, type Friend } from '../services/api';
import { useNavigate } from 'react-router-dom';

interface FriendRequest {
  id: string;
  user: Friend;
  createdAt: string;
}

export default function FriendsPage() {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState<'friends' | 'requests' | 'discover'>('friends');

  // API data states
  const [friends, setFriends] = useState<Friend[]>([]);
  const [requests, setRequests] = useState<{ incoming: FriendRequest[]; outgoing: FriendRequest[] }>({ incoming: [], outgoing: [] });
  const [suggestions, setSuggestions] = useState<Friend[]>([]);

  // Loading states
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Action loading states
  const [acceptingId, setAcceptingId] = useState<string | null>(null);
  const [rejectingId, setRejectingId] = useState<string | null>(null);
  const [sendingRequestTo, setSendingRequestTo] = useState<string | null>(null);
  const [removingId, setRemovingId] = useState<string | null>(null);

  // Fetch all data on mount
  useEffect(() => {
    async function fetchData() {
      setLoading(true);
      setError(null);

      try {
        const [friendsRes, requestsRes, suggestionsRes] = await Promise.all([
          friendsApi.getAll(),
          friendsApi.getRequests(),
          friendsApi.getSuggestions(10),
        ]);

        if (friendsRes.success && friendsRes.data) {
          setFriends(friendsRes.data);
        }
        if (requestsRes.success && requestsRes.data) {
          setRequests(requestsRes.data);
        }
        if (suggestionsRes.success && suggestionsRes.data) {
          setSuggestions(suggestionsRes.data);
        }
      } catch (err) {
        setError('Failed to load friends data');
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, []);

  // Filter friends by search query
  const filteredFriends = friends.filter(friend =>
    friend.displayName.toLowerCase().includes(searchQuery.toLowerCase()) ||
    friend.username.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Handler functions
  const handleAcceptRequest = async (requestId: string) => {
    setAcceptingId(requestId);
    const res = await friendsApi.acceptRequest(requestId);

    if (res.success) {
      // Move from requests to friends
      const acceptedRequest = requests.incoming.find(r => r.id === requestId);
      if (acceptedRequest) {
        setFriends(prev => [...prev, acceptedRequest.user]);
        setRequests(prev => ({
          ...prev,
          incoming: prev.incoming.filter(r => r.id !== requestId)
        }));
      }
    }
    setAcceptingId(null);
  };

  const handleRejectRequest = async (requestId: string) => {
    setRejectingId(requestId);
    const res = await friendsApi.rejectRequest(requestId);

    if (res.success) {
      setRequests(prev => ({
        ...prev,
        incoming: prev.incoming.filter(r => r.id !== requestId)
      }));
    }
    setRejectingId(null);
  };

  const handleSendRequest = async (userId: string) => {
    setSendingRequestTo(userId);
    const res = await friendsApi.sendRequest(userId);

    if (res.success) {
      // Remove from suggestions
      setSuggestions(prev => prev.filter(s => s.id !== userId));
    }
    setSendingRequestTo(null);
  };

  const handleRemoveFriend = async (friendshipId: string) => {
    if (!confirm('Are you sure you want to remove this friend?')) return;

    setRemovingId(friendshipId);
    const res = await friendsApi.remove(friendshipId);

    if (res.success) {
      setFriends(prev => prev.filter(f => f.friendshipId !== friendshipId));
    }
    setRemovingId(null);
  };

  const handleMessageFriend = (friendId: string) => {
    navigate('/social', { state: { openDmWith: friendId } });
  };

  // Helper to get avatar initials
  const getInitials = (name: string) => {
    return name.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase();
  };

  if (loading) {
    return (
      <div className="p-6 lg:p-8 max-w-4xl mx-auto flex items-center justify-center min-h-[400px]">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6 lg:p-8 max-w-4xl mx-auto">
        <div className="bg-destructive/10 border border-destructive/20 text-destructive rounded-xl p-4">
          {error}
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 lg:p-8 max-w-4xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl lg:text-3xl font-bold text-foreground">Friends</h1>
          <p className="text-muted-foreground mt-1">Connect with friends and stay accountable together</p>
        </div>
        <button
          onClick={() => setActiveTab('discover')}
          className="flex items-center gap-2 px-4 py-2.5 bg-primary text-primary-foreground rounded-lg text-sm font-medium hover:bg-primary/90 transition-colors"
        >
          <UserPlus className="w-4 h-4" />
          Add Friend
        </button>
      </div>

      {/* Search */}
      <div className="relative mb-6">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
        <input
          type="text"
          placeholder="Search friends by name or username..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full pl-10 pr-4 py-2.5 bg-background border border-input rounded-lg text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
        />
      </div>

      {/* Tabs */}
      <div className="flex gap-4 mb-6 border-b border-border">
        <button
          onClick={() => setActiveTab('friends')}
          className={`pb-3 text-sm font-medium transition-colors ${activeTab === 'friends'
            ? 'text-foreground border-b-2 border-primary'
            : 'text-muted-foreground hover:text-foreground'
            }`}
        >
          My Friends ({friends.length})
        </button>
        <button
          onClick={() => setActiveTab('requests')}
          className={`pb-3 text-sm font-medium transition-colors flex items-center gap-2 ${activeTab === 'requests'
            ? 'text-foreground border-b-2 border-primary'
            : 'text-muted-foreground hover:text-foreground'
            }`}
        >
          Requests
          {requests.incoming.length > 0 && (
            <span className="px-2 py-0.5 bg-primary text-primary-foreground text-xs rounded-full">
              {requests.incoming.length}
            </span>
          )}
        </button>
        <button
          onClick={() => setActiveTab('discover')}
          className={`pb-3 text-sm font-medium transition-colors ${activeTab === 'discover'
            ? 'text-foreground border-b-2 border-primary'
            : 'text-muted-foreground hover:text-foreground'
            }`}
        >
          Discover
        </button>
      </div>

      {/* Friends Tab */}
      {activeTab === 'friends' && (
        <div className="space-y-3">
          {filteredFriends.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-muted-foreground">
                {searchQuery ? 'No friends found matching your search' : 'No friends yet. Start by adding some!'}
              </p>
            </div>
          ) : (
            filteredFriends.map((friend) => (
              <div
                key={friend.id}
                className="bg-card border border-border rounded-xl p-4 flex items-center gap-4 hover:border-primary/50 transition-colors"
              >
                <div className="relative">
                  {friend.avatarUrl ? (
                    <img
                      src={friend.avatarUrl}
                      alt={friend.displayName}
                      className="w-12 h-12 rounded-full object-cover"
                    />
                  ) : (
                    <div className="w-12 h-12 rounded-full bg-primary flex items-center justify-center text-primary-foreground font-semibold">
                      {getInitials(friend.displayName)}
                    </div>
                  )}
                  <div className={`absolute bottom-0 right-0 w-3 h-3 rounded-full border-2 border-card ${friend.status === 'online' ? 'bg-green-500' : 'bg-muted-foreground'
                    }`} />
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <h3 className="font-medium text-foreground">{friend.displayName}</h3>
                    <UserCheck className="w-4 h-4 text-primary" />
                  </div>
                  <p className="text-sm text-muted-foreground">@{friend.username}</p>
                  <div className="flex items-center gap-3 mt-1">
                    <span className="flex items-center gap-1 text-xs text-orange-500">
                      <Flame className="w-3.5 h-3.5" />
                      {friend.currentStreak} day streak
                    </span>
                    <span className="text-xs text-muted-foreground">
                      {friend.totalXp.toLocaleString()} XP
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => handleMessageFriend(friend.id)}
                    className="p-2 text-muted-foreground hover:text-foreground hover:bg-secondary rounded-lg transition-colors"
                    title="Message"
                  >
                    <MessageCircle className="w-5 h-5" />
                  </button>
                  <button
                    onClick={() => handleRemoveFriend(friend.friendshipId)}
                    disabled={removingId === friend.friendshipId}
                    className="p-2 text-muted-foreground hover:text-destructive hover:bg-secondary rounded-lg transition-colors disabled:opacity-50"
                    title="Remove friend"
                  >
                    {removingId === friend.friendshipId ? (
                      <Loader2 className="w-5 h-5 animate-spin" />
                    ) : (
                      <MoreVertical className="w-5 h-5" />
                    )}
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      )}

      {/* Requests Tab */}
      {activeTab === 'requests' && (
        <div className="space-y-3">
          {requests.incoming.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-muted-foreground">No pending friend requests</p>
            </div>
          ) : (
            requests.incoming.map((request) => (
              <div
                key={request.id}
                className="bg-card border border-border rounded-xl p-4 flex items-center gap-4"
              >
                {request.user.avatarUrl ? (
                  <img
                    src={request.user.avatarUrl}
                    alt={request.user.displayName}
                    className="w-12 h-12 rounded-full object-cover"
                  />
                ) : (
                  <div className="w-12 h-12 rounded-full bg-secondary flex items-center justify-center text-secondary-foreground font-semibold">
                    {getInitials(request.user.displayName)}
                  </div>
                )}

                <div className="flex-1 min-w-0">
                  <h3 className="font-medium text-foreground">{request.user.displayName}</h3>
                  <p className="text-sm text-muted-foreground">@{request.user.username}</p>
                  <div className="flex items-center gap-3 mt-1">
                    <span className="flex items-center gap-1 text-xs text-orange-500">
                      <Flame className="w-3.5 h-3.5" />
                      {request.user.currentStreak} day streak
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => handleAcceptRequest(request.id)}
                    disabled={acceptingId === request.id}
                    className="flex items-center gap-1 px-3 py-1.5 bg-primary text-primary-foreground rounded-lg text-sm font-medium hover:bg-primary/90 transition-colors disabled:opacity-50"
                  >
                    {acceptingId === request.id ? (
                      <Loader2 className="w-4 h-4 animate-spin" />
                    ) : (
                      <Check className="w-4 h-4" />
                    )}
                    Accept
                  </button>
                  <button
                    onClick={() => handleRejectRequest(request.id)}
                    disabled={rejectingId === request.id}
                    className="flex items-center gap-1 px-3 py-1.5 bg-secondary text-secondary-foreground rounded-lg text-sm font-medium hover:bg-secondary/80 transition-colors disabled:opacity-50"
                  >
                    {rejectingId === request.id ? (
                      <Loader2 className="w-4 h-4 animate-spin" />
                    ) : (
                      <X className="w-4 h-4" />
                    )}
                    Decline
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      )}

      {/* Discover Tab */}
      {activeTab === 'discover' && (
        <div className="space-y-3">
          <p className="text-sm text-muted-foreground mb-4">People you might know</p>
          {suggestions.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-muted-foreground">No suggestions at the moment</p>
            </div>
          ) : (
            suggestions.map((person) => (
              <div
                key={person.id}
                className="bg-card border border-border rounded-xl p-4 flex items-center gap-4"
              >
                {person.avatarUrl ? (
                  <img
                    src={person.avatarUrl}
                    alt={person.displayName}
                    className="w-12 h-12 rounded-full object-cover"
                  />
                ) : (
                  <div className="w-12 h-12 rounded-full bg-secondary flex items-center justify-center text-secondary-foreground font-semibold">
                    {getInitials(person.displayName)}
                  </div>
                )}

                <div className="flex-1 min-w-0">
                  <h3 className="font-medium text-foreground">{person.displayName}</h3>
                  <p className="text-sm text-muted-foreground">@{person.username}</p>
                  <div className="flex items-center gap-3 mt-1">
                    <span className="flex items-center gap-1 text-xs text-orange-500">
                      <Flame className="w-3.5 h-3.5" />
                      {person.currentStreak} day streak
                    </span>
                    <span className="text-xs text-muted-foreground">
                      {person.totalXp.toLocaleString()} XP
                    </span>
                  </div>
                </div>

                <button
                  onClick={() => handleSendRequest(person.id)}
                  disabled={sendingRequestTo === person.id}
                  className="flex items-center gap-1 px-3 py-1.5 bg-primary text-primary-foreground rounded-lg text-sm font-medium hover:bg-primary/90 transition-colors disabled:opacity-50"
                >
                  {sendingRequestTo === person.id ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    <UserPlus className="w-4 h-4" />
                  )}
                  Add Friend
                </button>
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
}
