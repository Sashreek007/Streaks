import { useState } from 'react';
import { Heart, MessageCircle, Share2, Image, Trophy, Flame, Zap, Crosshair, ArrowLeft, Users, MessageSquare } from 'lucide-react';
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
    time: '2H AGO',
    type: 'streak',
    streakDays: 45,
    content: "Just hit my 45-day streak! Consistency is the only weapon.",
    likes: 124,
    comments: 18,
  },
  {
    id: 2,
    user: { name: 'Mike Chen', avatar: 'MC', streak: 28 },
    time: '5H AGO',
    type: 'achievement',
    content: "Week 4 complete. No days off. No excuses.",
    likes: 89,
    comments: 12,
  },
  {
    id: 3,
    user: { name: 'Emma Rodriguez', avatar: 'ER', streak: 67 },
    time: '8H AGO',
    type: 'badge',
    badgeName: 'Bookworm Badge',
    content: "Earned the Scholar badge. Knowledge is power.",
    likes: 156,
    comments: 23,
  },
];

type MobileView = 'feed' | 'friends' | 'squads' | 'dm' | 'verification' | 'squad-detail';

export default function SocialFeedPage() {
  const [newPost, setNewPost] = useState('');
  const [selectedFriend, setSelectedFriend] = useState<Friend | null>(null);
  const [selectedSquad, setSelectedSquad] = useState<Squad | null>(null);
  const [showVerification, setShowVerification] = useState(false);
  const [mobileView, setMobileView] = useState<MobileView>('feed');

  const handleSelectFriend = (friend: Friend) => {
    setSelectedFriend(friend);
    setSelectedSquad(null);
    setShowVerification(false);
    setMobileView('dm');
  };

  const handleSelectSquad = (squad: Squad) => {
    setSelectedSquad(squad);
    setSelectedFriend(null);
    setShowVerification(false);
    setMobileView('squad-detail');
  };

  const handleShowVerification = () => {
    setShowVerification(true);
    setSelectedFriend(null);
    setSelectedSquad(null);
    setMobileView('verification');
  };

  const handleBackToFeed = () => {
    setSelectedFriend(null);
    setSelectedSquad(null);
    setShowVerification(false);
    setMobileView('feed');
  };

  // Mobile: Show specific views based on state
  const renderMobileContent = () => {
    switch (mobileView) {
      case 'friends':
        return (
          <div className="h-full flex flex-col">
            <div className="flex items-center gap-3 p-4 border-b border-border">
              <button onClick={() => setMobileView('feed')} className="p-2 -ml-2 hover:bg-secondary rounded-lg">
                <ArrowLeft className="w-5 h-5" />
              </button>
              <h2 className="font-bold text-lg">Friends</h2>
            </div>
            <div className="flex-1 overflow-y-auto p-4">
              <FriendList onSelectFriend={handleSelectFriend} selectedFriendId={selectedFriend?.id} />
            </div>
          </div>
        );
      case 'squads':
        return (
          <div className="h-full flex flex-col">
            <div className="flex items-center gap-3 p-4 border-b border-border">
              <button onClick={() => setMobileView('feed')} className="p-2 -ml-2 hover:bg-secondary rounded-lg">
                <ArrowLeft className="w-5 h-5" />
              </button>
              <h2 className="font-bold text-lg">Squads</h2>
            </div>
            <div className="flex-1 overflow-y-auto p-4">
              <SquadList onSelectSquad={handleSelectSquad} selectedSquadId={selectedSquad?.id} />
            </div>
          </div>
        );
      case 'dm':
        return selectedFriend ? (
          <div className="h-full flex flex-col">
            <div className="flex items-center gap-3 p-4 border-b border-border bg-card">
              <button onClick={handleBackToFeed} className="p-2 -ml-2 hover:bg-secondary rounded-lg">
                <ArrowLeft className="w-5 h-5" />
              </button>
              <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center text-primary-foreground font-bold text-sm">
                {selectedFriend.avatar}
              </div>
              <div>
                <h2 className="font-bold">{selectedFriend.name}</h2>
                <p className="text-xs text-muted-foreground">{selectedFriend.status}</p>
              </div>
            </div>
            <div className="flex-1 min-h-0">
              <DMWindow friend={selectedFriend} />
            </div>
          </div>
        ) : null;
      case 'verification':
        return (
          <div className="h-full flex flex-col">
            <div className="flex items-center gap-3 p-4 border-b border-border">
              <button onClick={handleBackToFeed} className="p-2 -ml-2 hover:bg-secondary rounded-lg">
                <ArrowLeft className="w-5 h-5" />
              </button>
              <h2 className="font-bold text-lg">Verify Claims</h2>
            </div>
            <div className="flex-1 overflow-y-auto">
              <VerificationQueue />
            </div>
          </div>
        );
      case 'squad-detail':
        return selectedSquad ? (
          <div className="h-full flex flex-col">
            <div className="flex items-center gap-3 p-4 border-b border-border">
              <button onClick={handleBackToFeed} className="p-2 -ml-2 hover:bg-secondary rounded-lg">
                <ArrowLeft className="w-5 h-5" />
              </button>
              <h2 className="font-bold text-lg">{selectedSquad.name}</h2>
            </div>
            <div className="flex-1 flex items-center justify-center p-8 text-center">
              <div>
                <h2 className="text-2xl font-bold mb-2">{selectedSquad.name}</h2>
                <p className="text-muted-foreground">Squad features coming soon: Shared goals, group chat, and leaderboards.</p>
              </div>
            </div>
          </div>
        ) : null;
      default:
        return renderFeed();
    }
  };

  const renderFeed = () => (
    <div className="h-full flex flex-col p-4 lg:p-0">
      {/* Mobile Quick Actions */}
      <div className="lg:hidden flex gap-2 mb-4">
        <button
          onClick={handleShowVerification}
          className="flex-1 flex items-center justify-center gap-2 p-3 rounded-xl bg-red-500/10 text-red-500 border border-red-500/20"
        >
          <Crosshair className="w-4 h-4" />
          <span className="text-xs font-bold uppercase">Verify (2)</span>
        </button>
        <button
          onClick={() => setMobileView('friends')}
          className="flex-1 flex items-center justify-center gap-2 p-3 rounded-xl bg-card border border-border"
        >
          <MessageSquare className="w-4 h-4" />
          <span className="text-xs font-bold uppercase">DMs</span>
        </button>
        <button
          onClick={() => setMobileView('squads')}
          className="flex-1 flex items-center justify-center gap-2 p-3 rounded-xl bg-card border border-border"
        >
          <Users className="w-4 h-4" />
          <span className="text-xs font-bold uppercase">Squads</span>
        </button>
      </div>

      {/* Competitive Header */}
      <div className="mb-4 lg:mb-6 flex items-end justify-between">
        <div>
          <div className="flex items-center gap-2 text-red-500 font-bold uppercase tracking-widest text-xs mb-1">
            <Flame className="w-4 h-4 animate-pulse" />
            Heads Up
          </div>
          <h1 className="text-xl lg:text-3xl font-black text-foreground">Trailing Behind Sarah</h1>
        </div>
        <div className="text-right">
          <div className="text-xs lg:text-sm font-medium text-muted-foreground">Global Rank</div>
          <div className="text-xl lg:text-2xl font-black text-foreground">#4,201</div>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto space-y-4 lg:space-y-6">
        {/* Create Post */}
        <div className="bg-card border border-border rounded-xl p-4">
          <div className="flex gap-3">
            <div className="w-10 h-10 rounded-sm bg-primary flex items-center justify-center text-primary-foreground font-black flex-shrink-0">
              JD
            </div>
            <div className="flex-1">
              <textarea
                placeholder="Broadcast your victory..."
                value={newPost}
                onChange={(e) => setNewPost(e.target.value)}
                className="w-full bg-transparent text-foreground placeholder:text-muted-foreground resize-none focus:outline-none min-h-[60px] font-medium"
              />
              <div className="flex items-center justify-between mt-3 pt-3 border-t border-border">
                <div className="flex gap-2">
                  <button className="flex items-center gap-2 px-3 py-1.5 rounded-sm bg-secondary text-secondary-foreground text-xs font-bold uppercase hover:bg-secondary/80 transition-colors">
                    <Image className="w-3 h-3" />
                    <span className="hidden sm:inline">Evidence</span>
                  </button>
                </div>
                <button
                  disabled={!newPost.trim()}
                  className="flex items-center gap-2 px-4 lg:px-6 py-1.5 bg-foreground text-background rounded-sm text-xs font-black uppercase hover:bg-foreground/90 disabled:opacity-50 disabled:cursor-not-allowed transition-colors tracking-wide"
                >
                  Broadcast
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Feed Posts */}
        {feedPosts.map((post) => (
          <div key={post.id} className="bg-card border border-border rounded-xl p-4 lg:p-5 hover:border-primary/30 transition-colors">
            {/* Post Header */}
            <div className="flex items-center gap-3 lg:gap-4 mb-4">
              <div className="w-10 h-10 rounded-sm bg-secondary flex items-center justify-center text-foreground font-black border border-border">
                {post.user.avatar}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="font-bold text-foreground text-base lg:text-lg truncate">{post.user.name}</span>
                  {post.user.streak > 30 && (
                    <span className="px-1.5 py-0.5 bg-orange-500/10 text-orange-500 text-[10px] font-black uppercase tracking-wider rounded-sm border border-orange-500/20">
                      Elite
                    </span>
                  )}
                </div>
                <div className="flex items-center gap-2 text-xs text-muted-foreground font-mono">
                  <span>{post.time}</span>
                  <span>•</span>
                  <span className="flex items-center gap-1 text-orange-500">
                    <Flame className="w-3 h-3" />
                    {post.user.streak}
                  </span>
                </div>
              </div>
            </div>

            {/* Streak Banner - Kill Streak Style */}
            {post.type === 'streak' && post.streakDays && (
              <div className="relative overflow-hidden bg-gradient-to-r from-orange-600 to-red-600 rounded-sm p-3 lg:p-4 mb-4 text-white shadow-lg">
                <div className="absolute inset-0 bg-noise opacity-20" />
                <div className="relative z-10 flex items-center gap-3">
                  <div className="p-2 bg-black/20 rounded-full">
                    <Zap className="w-4 lg:w-5 h-4 lg:h-5" />
                  </div>
                  <div>
                    <div className="text-[10px] uppercase font-black tracking-widest opacity-80">Streak Extended</div>
                    <div className="text-lg lg:text-xl font-black uppercase italic tracking-tighter">{post.streakDays} DAY KILL STREAK</div>
                  </div>
                </div>
              </div>
            )}

            {/* Badge Banner */}
            {post.type === 'badge' && post.badgeName && (
              <div className="bg-gradient-to-r from-purple-900 to-indigo-900 border border-purple-500/30 rounded-sm p-3 lg:p-4 mb-4 flex items-center gap-3">
                <Trophy className="w-5 lg:w-6 h-5 lg:h-6 text-purple-400" />
                <div>
                  <div className="text-[10px] uppercase font-black tracking-widest text-purple-300">New Achievement</div>
                  <div className="text-white font-bold text-sm lg:text-base">{post.badgeName}</div>
                </div>
              </div>
            )}

            {/* Content */}
            <p className="text-foreground/90 leading-relaxed font-medium text-sm lg:text-base">{post.content}</p>

            {/* Actions */}
            <div className="flex items-center gap-4 lg:gap-6 mt-4 pt-4 border-t border-border">
              <button className="flex items-center gap-2 text-muted-foreground hover:text-red-500 transition-colors">
                <Heart className="w-5 h-5" />
                <span className="text-xs font-mono font-bold">{post.likes}</span>
              </button>
              <button className="flex items-center gap-2 text-muted-foreground hover:text-primary transition-colors">
                <MessageCircle className="w-5 h-5" />
                <span className="text-xs font-mono font-bold">{post.comments}</span>
              </button>
              <button className="flex items-center gap-2 text-muted-foreground hover:text-primary transition-colors ml-auto">
                <Share2 className="w-5 h-5" />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  return (
    <div className="flex h-[calc(100vh-theme(spacing.16))] lg:gap-6 lg:p-6 lg:p-8 max-w-7xl mx-auto">
      {/* Left Sidebar - Friends & Squads (Desktop only) */}
      <div className="hidden lg:flex w-80 flex-shrink-0 flex-col gap-6">
        {/* Verification Alert Button */}
        <button
          onClick={handleShowVerification}
          className={`group w-full flex items-center justify-between p-4 rounded-xl border transition-all ${showVerification
            ? 'bg-red-600 text-white border-red-500'
            : 'bg-card border-border hover:border-red-500/50 hover:bg-red-500/5'
            }`}
        >
          <div className="flex items-center gap-3">
            <div className={`p-2 rounded-lg ${showVerification ? 'bg-white/20' : 'bg-red-500/10 text-red-500'}`}>
              <Crosshair className="w-5 h-5" />
            </div>
            <div className="text-left">
              <p className="font-bold uppercase tracking-wide text-sm">Verify Claims</p>
              <p className={`text-[10px] font-mono ${showVerification ? 'text-white/80' : 'text-muted-foreground'}`}>2 PENDING TARGETS</p>
            </div>
          </div>
          <div className="w-2 h-2 rounded-full bg-red-500 animate-pulse group-hover:scale-150 transition-transform" />
        </button>

        <div className="flex-1 min-h-0 text-sm">
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
        {/* Mobile View */}
        <div className="lg:hidden h-full">
          {renderMobileContent()}
        </div>

        {/* Desktop View */}
        <div className="hidden lg:block h-full">
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
              {renderFeed()}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
