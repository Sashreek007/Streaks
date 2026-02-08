import { useState, useEffect } from 'react';
import { Heart, MessageCircle, Share2, Image, Flame, Crosshair, ArrowLeft, Users, MessageSquare, Loader2 } from 'lucide-react';
import FriendList from '../components/social/FriendList';
import SquadList from '../components/social/SquadList';
import DMWindow from '../components/social/DMWindow';
import VerificationQueue from '../components/verification/VerificationQueue';
import { feedApi, type Post, type Friend, type Squad } from '../services/api';
import { useAuth } from '../context/AuthContext';

type MobileView = 'feed' | 'friends' | 'squads' | 'dm' | 'verification' | 'squad-detail';

export default function SocialFeedPage() {
  const { user } = useAuth();
  const [newPost, setNewPost] = useState('');
  const [selectedFriend, setSelectedFriend] = useState<Friend | null>(null);
  const [selectedSquad, setSelectedSquad] = useState<Squad | null>(null);
  const [showVerification, setShowVerification] = useState(false);
  const [mobileView, setMobileView] = useState<MobileView>('feed');

  // API data states
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [posting, setPosting] = useState(false);
  const [likingPostId, setLikingPostId] = useState<string | null>(null);

  // Fetch posts on mount
  useEffect(() => {
    async function fetchPosts() {
      setLoading(true);
      const res = await feedApi.getPosts(20);
      if (res.success && res.data) {
        setPosts(res.data.posts);
      }
      setLoading(false);
    }
    fetchPosts();
  }, []);

  const handleCreatePost = async () => {
    if (!newPost.trim() || posting) return;

    setPosting(true);
    const res = await feedApi.createPost(newPost.trim());
    if (res.success && res.data) {
      setPosts(prev => [res.data!, ...prev]);
      setNewPost('');
    }
    setPosting(false);
  };

  const handleLikePost = async (postId: string) => {
    setLikingPostId(postId);
    const res = await feedApi.likePost(postId);
    if (res.success && res.data !== undefined) {
      setPosts(prev => prev.map(post =>
        post.id === postId
          ? {
            ...post,
            isLiked: res.data!.liked,
            likesCount: res.data!.liked ? post.likesCount + 1 : post.likesCount - 1
          }
          : post
      ));
    }
    setLikingPostId(null);
  };

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

  // Get initials
  const getInitials = (name: string) => {
    return name.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase();
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
              <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center text-primary-foreground font-bold text-sm overflow-hidden">
                {selectedFriend.avatarUrl ? (
                  <img src={selectedFriend.avatarUrl} alt="" className="w-full h-full object-cover" />
                ) : (
                  getInitials(selectedFriend.displayName)
                )}
              </div>
              <div>
                <h2 className="font-bold">{selectedFriend.displayName}</h2>
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
          <span className="text-xs font-bold uppercase">Verify</span>
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
            Feed
          </div>
          <h1 className="text-xl lg:text-3xl font-black text-foreground">Social Activity</h1>
        </div>
        {user && (
          <div className="text-right">
            <div className="text-xs lg:text-sm font-medium text-muted-foreground">Your Streak</div>
            <div className="text-xl lg:text-2xl font-black text-foreground flex items-center gap-1 justify-end">
              <Flame className="w-5 h-5 text-orange-500" />
              {user.currentStreak}
            </div>
          </div>
        )}
      </div>

      <div className="flex-1 overflow-y-auto space-y-4 lg:space-y-6">
        {/* Create Post */}
        <div className="bg-card border border-border rounded-xl p-4">
          <div className="flex gap-3">
            <div className="w-10 h-10 rounded-sm bg-primary flex items-center justify-center text-primary-foreground font-black flex-shrink-0 overflow-hidden">
              {user?.avatarUrl ? (
                <img src={user.avatarUrl} alt="" className="w-full h-full object-cover" />
              ) : (
                user ? getInitials(user.displayName) : '?'
              )}
            </div>
            <div className="flex-1">
              <textarea
                placeholder="Share your progress..."
                value={newPost}
                onChange={(e) => setNewPost(e.target.value)}
                className="w-full bg-transparent text-foreground placeholder:text-muted-foreground resize-none focus:outline-none min-h-[60px] font-medium"
              />
              <div className="flex items-center justify-between mt-3 pt-3 border-t border-border">
                <div className="flex gap-2">
                  <button className="flex items-center gap-2 px-3 py-1.5 rounded-sm bg-secondary text-secondary-foreground text-xs font-bold uppercase hover:bg-secondary/80 transition-colors">
                    <Image className="w-3 h-3" />
                    <span className="hidden sm:inline">Photo</span>
                  </button>
                </div>
                <button
                  onClick={handleCreatePost}
                  disabled={!newPost.trim() || posting}
                  className="flex items-center gap-2 px-4 lg:px-6 py-1.5 bg-foreground text-background rounded-sm text-xs font-black uppercase hover:bg-foreground/90 disabled:opacity-50 disabled:cursor-not-allowed transition-colors tracking-wide"
                >
                  {posting ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    'Post'
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Loading State */}
        {loading ? (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="w-8 h-8 animate-spin text-primary" />
          </div>
        ) : posts.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-muted-foreground">No posts yet. Be the first to share!</p>
          </div>
        ) : (
          /* Feed Posts */
          posts.map((post) => (
            <div key={post.id} className="bg-card border border-border rounded-xl p-4 lg:p-5 hover:border-primary/30 transition-colors">
              {/* Post Header */}
              <div className="flex items-center gap-3 lg:gap-4 mb-4">
                <div className="w-10 h-10 rounded-sm bg-secondary flex items-center justify-center text-foreground font-black border border-border overflow-hidden">
                  {post.author.avatarUrl ? (
                    <img src={post.author.avatarUrl} alt="" className="w-full h-full object-cover" />
                  ) : (
                    getInitials(post.author.displayName)
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="font-bold text-foreground text-base lg:text-lg truncate">{post.author.displayName}</span>
                    <span className="text-xs text-muted-foreground">@{post.author.username}</span>
                  </div>
                  <div className="flex items-center gap-2 text-xs text-muted-foreground font-mono">
                    <span>{formatTimeAgo(post.createdAt)}</span>
                  </div>
                </div>
              </div>

              {/* Content */}
              <p className="text-foreground/90 leading-relaxed font-medium text-sm lg:text-base mb-4">{post.content}</p>

              {/* Image */}
              {post.imageUrl && (
                <div className="rounded-lg overflow-hidden mb-4">
                  <img src={post.imageUrl} alt="" className="w-full object-cover max-h-96" />
                </div>
              )}

              {/* Actions */}
              <div className="flex items-center gap-4 lg:gap-6 pt-4 border-t border-border">
                <button
                  onClick={() => handleLikePost(post.id)}
                  disabled={likingPostId === post.id}
                  className={`flex items-center gap-2 transition-colors ${post.isLiked ? 'text-red-500' : 'text-muted-foreground hover:text-red-500'
                    }`}
                >
                  <Heart className={`w-5 h-5 ${post.isLiked ? 'fill-current' : ''}`} />
                  <span className="text-xs font-mono font-bold">{post.likesCount}</span>
                </button>
                <button className="flex items-center gap-2 text-muted-foreground hover:text-primary transition-colors">
                  <MessageCircle className="w-5 h-5" />
                  <span className="text-xs font-mono font-bold">{post.commentsCount}</span>
                </button>
                <button className="flex items-center gap-2 text-muted-foreground hover:text-primary transition-colors ml-auto">
                  <Share2 className="w-5 h-5" />
                </button>
              </div>
            </div>
          ))
        )}
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
              <p className={`text-[10px] font-mono ${showVerification ? 'text-white/80' : 'text-muted-foreground'}`}>PENDING TARGETS</p>
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
