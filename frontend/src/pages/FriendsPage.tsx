import { useState } from 'react';
import { Search, UserPlus, UserCheck, Flame, MessageCircle, MoreVertical, Check, X } from 'lucide-react';

// Mock data
const friends = [
  { id: 1, name: 'Sarah Johnson', username: '@sarahj', avatar: 'SJ', streak: 45, status: 'online', mutualFriends: 12 },
  { id: 2, name: 'Mike Chen', username: '@mikechen', avatar: 'MC', streak: 28, status: 'offline', mutualFriends: 8 },
  { id: 3, name: 'Emma Rodriguez', username: '@emmar', avatar: 'ER', streak: 67, status: 'online', mutualFriends: 15 },
  { id: 4, name: 'Alex Kim', username: '@alexk', avatar: 'AK', streak: 34, status: 'offline', mutualFriends: 5 },
];

const friendRequests = [
  { id: 5, name: 'Tom Wilson', username: '@tomw', avatar: 'TW', streak: 12, mutualFriends: 3 },
  { id: 6, name: 'Lisa Park', username: '@lisap', avatar: 'LP', streak: 56, mutualFriends: 7 },
];

const suggestions = [
  { id: 7, name: 'David Brown', username: '@davidb', avatar: 'DB', streak: 89, mutualFriends: 4, isFollowing: false },
  { id: 8, name: 'Amy Davis', username: '@amyd', avatar: 'AD', streak: 23, mutualFriends: 6, isFollowing: true },
  { id: 9, name: 'Chris Lee', username: '@chrisl', avatar: 'CL', streak: 45, mutualFriends: 2, isFollowing: false },
];

export default function FriendsPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState<'friends' | 'requests' | 'discover'>('friends');

  const filteredFriends = friends.filter(friend =>
    friend.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    friend.username.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="p-6 lg:p-8 max-w-4xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl lg:text-3xl font-bold text-foreground">Friends</h1>
          <p className="text-muted-foreground mt-1">Connect with friends and stay accountable together</p>
        </div>
        <button className="flex items-center gap-2 px-4 py-2.5 bg-primary text-primary-foreground rounded-lg text-sm font-medium hover:bg-primary/90 transition-colors">
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
          {friendRequests.length > 0 && (
            <span className="px-2 py-0.5 bg-primary text-primary-foreground text-xs rounded-full">
              {friendRequests.length}
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

      {/* Content */}
      {activeTab === 'friends' && (
        <div className="space-y-3">
          {filteredFriends.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-muted-foreground">No friends found</p>
            </div>
          ) : (
            filteredFriends.map((friend) => (
              <div
                key={friend.id}
                className="bg-card border border-border rounded-xl p-4 flex items-center gap-4 hover:border-primary/50 transition-colors"
              >
                <div className="relative">
                  <div className="w-12 h-12 rounded-full bg-primary flex items-center justify-center text-primary-foreground font-semibold">
                    {friend.avatar}
                  </div>
                  <div className={`absolute bottom-0 right-0 w-3 h-3 rounded-full border-2 border-card ${friend.status === 'online' ? 'bg-green-500' : 'bg-muted-foreground'
                    }`} />
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <h3 className="font-medium text-foreground">{friend.name}</h3>
                    <UserCheck className="w-4 h-4 text-primary" />
                  </div>
                  <p className="text-sm text-muted-foreground">{friend.username}</p>
                  <div className="flex items-center gap-3 mt-1">
                    <span className="flex items-center gap-1 text-xs text-orange-500">
                      <Flame className="w-3.5 h-3.5" />
                      {friend.streak} day streak
                    </span>
                    <span className="text-xs text-muted-foreground">
                      {friend.mutualFriends} mutual friends
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <button className="p-2 text-muted-foreground hover:text-foreground hover:bg-secondary rounded-lg transition-colors">
                    <MessageCircle className="w-5 h-5" />
                  </button>
                  <button className="p-2 text-muted-foreground hover:text-foreground hover:bg-secondary rounded-lg transition-colors">
                    <MoreVertical className="w-5 h-5" />
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      )}

      {activeTab === 'requests' && (
        <div className="space-y-3">
          {friendRequests.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-muted-foreground">No pending friend requests</p>
            </div>
          ) : (
            friendRequests.map((request) => (
              <div
                key={request.id}
                className="bg-card border border-border rounded-xl p-4 flex items-center gap-4"
              >
                <div className="w-12 h-12 rounded-full bg-secondary flex items-center justify-center text-secondary-foreground font-semibold">
                  {request.avatar}
                </div>

                <div className="flex-1 min-w-0">
                  <h3 className="font-medium text-foreground">{request.name}</h3>
                  <p className="text-sm text-muted-foreground">{request.username}</p>
                  <div className="flex items-center gap-3 mt-1">
                    <span className="flex items-center gap-1 text-xs text-orange-500">
                      <Flame className="w-3.5 h-3.5" />
                      {request.streak} day streak
                    </span>
                    <span className="text-xs text-muted-foreground">
                      {request.mutualFriends} mutual friends
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <button className="flex items-center gap-1 px-3 py-1.5 bg-primary text-primary-foreground rounded-lg text-sm font-medium hover:bg-primary/90 transition-colors">
                    <Check className="w-4 h-4" />
                    Accept
                  </button>
                  <button className="flex items-center gap-1 px-3 py-1.5 bg-secondary text-secondary-foreground rounded-lg text-sm font-medium hover:bg-secondary/80 transition-colors">
                    <X className="w-4 h-4" />
                    Decline
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      )}

      {activeTab === 'discover' && (
        <div className="space-y-3">
          <p className="text-sm text-muted-foreground mb-4">People you might know</p>
          {suggestions.map((person) => (
            <div
              key={person.id}
              className="bg-card border border-border rounded-xl p-4 flex items-center gap-4"
            >
              <div className="w-12 h-12 rounded-full bg-secondary flex items-center justify-center text-secondary-foreground font-semibold">
                {person.avatar}
              </div>

              <div className="flex-1 min-w-0">
                <h3 className="font-medium text-foreground">{person.name}</h3>
                <p className="text-sm text-muted-foreground">{person.username}</p>
                <div className="flex items-center gap-3 mt-1">
                  <span className="flex items-center gap-1 text-xs text-orange-500">
                    <Flame className="w-3.5 h-3.5" />
                    {person.streak} day streak
                  </span>
                  <span className="text-xs text-muted-foreground">
                    {person.mutualFriends} mutual friends
                  </span>
                </div>
              </div>

              <div className="flex flex-col gap-2">
                {person.isFollowing ? (
                  <span className="text-xs text-muted-foreground">Following</span>
                ) : (
                  <button className="px-3 py-1.5 bg-secondary text-secondary-foreground rounded-lg text-sm font-medium hover:bg-secondary/80 transition-colors">
                    Follow
                  </button>
                )}
                <button className="px-3 py-1.5 bg-primary text-primary-foreground rounded-lg text-sm font-medium hover:bg-primary/90 transition-colors">
                  Add Friend
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
