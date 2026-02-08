import { useState, useEffect } from 'react';
import { MessageSquare, Loader2, Flame } from 'lucide-react';
import { friendsApi, type Friend } from '../../services/api';

interface FriendListProps {
  onSelectFriend: (friend: Friend) => void;
  selectedFriendId?: string;
}

export default function FriendList({ onSelectFriend, selectedFriendId }: FriendListProps) {
  const [friends, setFriends] = useState<Friend[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchFriends() {
      setLoading(true);
      const res = await friendsApi.getAll();
      if (res.success && res.data) {
        setFriends(res.data);
      }
      setLoading(false);
    }
    fetchFriends();
  }, []);

  // Get initials from display name
  const getInitials = (name: string) => {
    return name.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase();
  };

  if (loading) {
    return (
      <div className="bg-card border border-border rounded-xl h-full flex items-center justify-center">
        <Loader2 className="w-6 h-6 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="bg-card border border-border rounded-xl h-full flex flex-col">
      <div className="p-4 border-b border-border">
        <h2 className="font-semibold text-foreground">Friends</h2>
      </div>

      <div className="flex-1 overflow-y-auto p-2">
        {friends.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground text-sm">
            No friends yet
          </div>
        ) : (
          friends.map((friend) => (
            <button
              key={friend.id}
              onClick={() => onSelectFriend(friend)}
              className={`w-full flex items-center gap-3 p-3 rounded-lg transition-colors ${selectedFriendId === friend.id
                ? 'bg-secondary text-secondary-foreground'
                : 'hover:bg-accent/50 text-foreground'
                }`}
            >
              <div className="relative">
                <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center text-primary font-semibold overflow-hidden">
                  {friend.avatarUrl ? (
                    <img src={friend.avatarUrl} alt="" className="w-full h-full object-cover" />
                  ) : (
                    getInitials(friend.displayName)
                  )}
                </div>
                <div className={`absolute bottom-0 right-0 w-3 h-3 rounded-full border-2 border-card ${friend.status === 'online' ? 'bg-green-500' :
                  friend.status === 'busy' ? 'bg-red-500' : 'bg-gray-500'
                  }`} />
              </div>

              <div className="flex-1 text-left min-w-0">
                <p className="font-medium truncate">{friend.displayName}</p>
                <div className="flex items-center gap-2 text-xs text-muted-foreground">
                  <span className="flex items-center gap-1">
                    <Flame className="w-3 h-3 text-orange-500" />
                    {friend.currentStreak}
                  </span>
                  <span>• {friend.status}</span>
                </div>
              </div>

              <MessageSquare className="w-4 h-4 text-muted-foreground" />
            </button>
          ))
        )}
      </div>
    </div>
  );
}
