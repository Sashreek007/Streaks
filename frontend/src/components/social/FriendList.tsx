
import { MessageSquare, UserPlus } from 'lucide-react';
import type { Friend } from '../../data/mockSocial';
import { mockFriends } from '../../data/mockSocial';

interface FriendListProps {
    onSelectFriend: (friend: Friend) => void;
    selectedFriendId?: string;
}

export default function FriendList({ onSelectFriend, selectedFriendId }: FriendListProps) {
    return (
        <div className="bg-card border border-border rounded-xl h-full flex flex-col">
            <div className="p-4 border-b border-border flex items-center justify-between">
                <h2 className="font-semibold text-foreground">Friends</h2>
                <button className="text-primary hover:text-primary/80 transition-colors">
                    <UserPlus className="w-5 h-5" />
                </button>
            </div>

            <div className="flex-1 overflow-y-auto p-2">
                {mockFriends.map((friend) => (
                    <button
                        key={friend.id}
                        onClick={() => onSelectFriend(friend)}
                        className={`w-full flex items-center gap-3 p-3 rounded-lg transition-colors ${selectedFriendId === friend.id
                            ? 'bg-secondary text-secondary-foreground'
                            : 'hover:bg-accent/50 text-foreground'
                            }`}
                    >
                        <div className="relative">
                            <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center text-primary font-semibold">
                                {friend.avatar}
                            </div>
                            <div className={`absolute bottom-0 right-0 w-3 h-3 rounded-full border-2 border-card ${friend.status === 'online' ? 'bg-green-500' :
                                friend.status === 'busy' ? 'bg-red-500' : 'bg-gray-500'
                                }`} />
                        </div>

                        <div className="flex-1 text-left min-w-0">
                            <p className="font-medium truncate">{friend.name}</p>
                            <div className="flex items-center gap-2 text-xs text-muted-foreground">
                                <span className="flex items-center gap-1">
                                    <FlameIcon className="w-3 h-3 text-orange-500" />
                                    {friend.streak}
                                </span>
                                <span>• {friend.status}</span>
                            </div>
                        </div>

                        <MessageSquare className="w-4 h-4 text-muted-foreground" />
                    </button>
                ))}
            </div>
        </div>
    );
}

function FlameIcon({ className }: { className?: string }) {
    return (
        <svg
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="currentColor"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className={className}
        >
            <path d="M8.5 14.5A2.5 2.5 0 0 0 11 12c0-1.38-.5-2-1-3-1.072-2.143-.224-4.054 2-6 .5 2.5 2 4.9 4 6.5 2 1.6 3 3.5 3 5.5a7 7 0 1 1-14 0c0-1.1.243-2.143.7-3.143.6 1.429 1.8 2.343 2.8 3.143Z" />
        </svg>
    );
}
