import { useState } from 'react';
import { Heart, MessageCircle, Share2, Image, Trophy, Flame, CheckSquare } from 'lucide-react';
import FriendList from '../components/social/FriendList';
import SquadList from '../components/social/SquadList';
import DMWindow from '../components/social/DMWindow';
import VerificationQueue from '../components/verification/VerificationQueue';
import type { Friend, Squad } from '../data/mockSocial';

// Mock data
const feedPosts = [
  {
    id: 1,
    user: { name: 'Sarah Johnson', avatar: 'SJ', streak: 45 },
    time: '2 hours ago',
    type: 'streak',
    streakDays: 45,
    content: "Just hit my 45-day streak! 🎉 Consistency really is key. Started with just 5 minutes of meditation daily and now it's a non-negotiable part of my routine.",
    likes: 124,
    comments: 18,
  },
  {
    id: 2,
    user: { name: 'Mike Chen', avatar: 'MC', streak: 28 },
    time: '5 hours ago',
    type: 'achievement',
    content: "Week 4 of my fitness journey complete! Lost 5 lbs and feeling stronger every day. The Streaks app has been a game changer for accountability.",
    likes: 89,
    comments: 12,
  },
  {
    id: 3,
    user: { name: 'Emma Rodriguez', avatar: 'ER', streak: 67 },
    time: '8 hours ago',
    type: 'badge',
    badgeName: 'Bookworm Badge',
    content: "Earned my Bookworm badge! 📚 50 books read this year. Reading has transformed my mornings completely.",
    likes: 156,
    comments: 23,
  },
];

export default function SocialFeedPage() {
  const [newPost, setNewPost] = useState('');
  const [selectedFriend, setSelectedFriend] = useState<Friend | null>(null);
  const [selectedSquad, setSelectedSquad] = useState<Squad | null>(null);
  const [showVerification, setShowVerification] = useState(false);

  const handleSelectFriend = (friend: Friend) => {
    setSelectedFriend(friend);
    setSelectedSquad(null);
    setShowVerification(false);
  };

  const handleSelectSquad = (squad: Squad) => {
    setSelectedSquad(squad);
    setSelectedFriend(null);
    setShowVerification(false);
  };

  const handleShowVerification = () => {
    setShowVerification(true);
    setSelectedFriend(null);
    setSelectedSquad(null);
  };

  return (
    <div className="flex h-[calc(100vh-theme(spacing.16))] gap-6 p-6 lg:p-8 max-w-7xl mx-auto">
      {/* Left Sidebar - Friends & Squads */}
      <div className="w-80 flex-shrink-0 flex flex-col gap-6">
        {/* Verification Alert Button */}
        <button
          onClick={handleShowVerification}
          className={`w-full flex items-center justify-between p-4 rounded-xl border transition-all ${showVerification
              ? 'bg-primary text-primary-foreground border-primary'
              : 'bg-card border-border hover:border-primary/50'
            }`}
        >
          <div className="flex items-center gap-3">
            <div className={`p-2 rounded-lg ${showVerification ? 'bg-primary-foreground/20' : 'bg-primary/10'}`}>
              <CheckSquare className="w-5 h-5" />
            </div>
            <div className="text-left">
              <p className="font-semibold">Verify Claims</p>
              <p className={`text-xs ${showVerification ? 'text-primary-foreground/80' : 'text-muted-foreground'}`}>2 pending tasks</p>
            </div>
          </div>
          <div className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
        </button>

        <div className="flex-1 min-h-0">
          <FriendList
            onSelectFriend={handleSelectFriend}
            selectedFriendId={selectedFriend?.id}
          />
        </div>
        <div className="flex-1 min-h-0">
          <SquadList
            onSelectSquad={handleSelectSquad}
            selectedSquadId={selectedSquad?.id}
          />
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 min-w-0">
        {showVerification ? (
          <VerificationQueue />
        ) : selectedFriend ? (
          <DMWindow friend={selectedFriend} />
        ) : selectedSquad ? (
          <div className="bg-card border border-border rounded-xl h-full flex items-center justify-center p-8 text-center">
            <div>
              <h2 className="text-2xl font-bold mb-2">{selectedSquad.name}</h2>
              <p className="text-muted-foreground">Squad features coming soon: Shared goals, group chat, and leaderboards.</p>
              <button
                onClick={() => setSelectedSquad(null)}
                className="mt-4 text-primary hover:underline"
              >
                Back to Feed
              </button>
            </div>
          </div>
        ) : (
          <div className="max-w-2xl mx-auto h-full flex flex-col">
            {/* Header */}
            <div className="mb-6">
              <h1 className="text-2xl lg:text-3xl font-bold text-foreground">Social Hub</h1>
              <p className="text-muted-foreground mt-1">Connect, compete, and verify progress</p>
            </div>

            <div className="flex-1 overflow-y-auto pr-4 -mr-4 space-y-6">
              {/* Create Post */}
              <div className="bg-card border border-border rounded-xl p-4">
                <div className="flex gap-3">
                  <div className="w-10 h-10 rounded-full bg-primary flex items-center justify-center text-primary-foreground font-semibold flex-shrink-0">
                    JD
                  </div>
                  <div className="flex-1">
                    <textarea
                      placeholder="Share your progress..."
                      value={newPost}
                      onChange={(e) => setNewPost(e.target.value)}
                      className="w-full bg-transparent text-foreground placeholder:text-muted-foreground resize-none focus:outline-none min-h-[60px]"
                    />
                    <div className="flex items-center justify-between mt-3 pt-3 border-t border-border">
                      <div className="flex gap-2">
                        <button className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-secondary text-secondary-foreground text-sm hover:bg-secondary/80 transition-colors">
                          <Image className="w-4 h-4" />
                          Photo
                        </button>
                        <button className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-secondary text-secondary-foreground text-sm hover:bg-secondary/80 transition-colors">
                          <Trophy className="w-4 h-4" />
                          Achievement
                        </button>
                      </div>
                      <button
                        disabled={!newPost.trim()}
                        className="flex items-center gap-2 px-4 py-1.5 bg-primary text-primary-foreground rounded-lg text-sm font-medium hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                      >
                        Post
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              {/* Feed Posts */}
              {feedPosts.map((post) => (
                <div key={post.id} className="bg-card border border-border rounded-xl p-4">
                  {/* Post Header */}
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-10 h-10 rounded-full bg-primary flex items-center justify-center text-primary-foreground font-semibold">
                      {post.user.avatar}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <span className="font-medium text-foreground">{post.user.name}</span>
                        <span className="flex items-center gap-1 text-xs text-orange-500">
                          <Flame className="w-3.5 h-3.5" />
                          {post.user.streak}
                        </span>
                      </div>
                      <span className="text-xs text-muted-foreground">{post.time}</span>
                    </div>
                  </div>

                  {/* Streak Banner */}
                  {post.type === 'streak' && post.streakDays && (
                    <div className="bg-gradient-to-r from-orange-500/20 to-yellow-500/20 border border-orange-500/30 rounded-lg p-3 mb-3 flex items-center gap-2">
                      <Flame className="w-5 h-5 text-orange-500" />
                      <span className="font-medium text-foreground">{post.streakDays} Day Streak</span>
                    </div>
                  )}

                  {/* Badge Banner */}
                  {post.type === 'badge' && post.badgeName && (
                    <div className="bg-gradient-to-r from-purple-500/20 to-pink-500/20 border border-purple-500/30 rounded-lg p-3 mb-3 flex items-center gap-2">
                      <Trophy className="w-5 h-5 text-purple-500" />
                      <span className="font-medium text-foreground">{post.badgeName}</span>
                    </div>
                  )}

                  {/* Content */}
                  <p className="text-foreground leading-relaxed">{post.content}</p>

                  {/* Actions */}
                  <div className="flex items-center gap-6 mt-4 pt-3 border-t border-border">
                    <button className="flex items-center gap-2 text-muted-foreground hover:text-red-500 transition-colors">
                      <Heart className="w-5 h-5" />
                      <span className="text-sm">{post.likes}</span>
                    </button>
                    <button className="flex items-center gap-2 text-muted-foreground hover:text-primary transition-colors">
                      <MessageCircle className="w-5 h-5" />
                      <span className="text-sm">{post.comments}</span>
                    </button>
                    <button className="flex items-center gap-2 text-muted-foreground hover:text-primary transition-colors">
                      <Share2 className="w-5 h-5" />
                      <span className="text-sm">Share</span>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
