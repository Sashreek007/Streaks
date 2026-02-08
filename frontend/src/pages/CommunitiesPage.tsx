import { useState, useEffect } from 'react';
import { Plus, Search, Globe, Flame, ArrowUpRight, ShieldAlert, Loader2, X } from 'lucide-react';
import { communitiesApi, type Community } from '../services/api';

// Color mapping based on category
const categoryColors: Record<string, string> = {
  fitness: 'from-orange-600 via-orange-900 to-black',
  learning: 'from-blue-600 via-indigo-900 to-black',
  wellness: 'from-emerald-600 via-teal-900 to-black',
  career: 'from-purple-600 via-pink-900 to-black',
  health: 'from-lime-600 via-green-900 to-black',
  productivity: 'from-cyan-600 via-blue-900 to-black',
  social: 'from-pink-600 via-rose-900 to-black',
  creative: 'from-yellow-600 via-amber-900 to-black',
  default: 'from-gray-600 via-gray-900 to-black',
};

function getCategoryColor(category: string): string {
  return categoryColors[category.toLowerCase()] || categoryColors.default;
}

export default function CommunitiesPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [filter, setFilter] = useState<'all' | 'joined' | 'discover'>('all');

  // API data states
  const [allCommunities, setAllCommunities] = useState<Community[]>([]);
  const [myCommunities, setMyCommunities] = useState<Community[]>([]);

  // Loading states
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [joiningId, setJoiningId] = useState<string | null>(null);
  const [leavingId, setLeavingId] = useState<string | null>(null);

  // Create community modal
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [creating, setCreating] = useState(false);
  const [newCommunity, setNewCommunity] = useState({
    name: '',
    description: '',
    category: 'Fitness',
  });

  // Fetch all data on mount
  useEffect(() => {
    async function fetchData() {
      setLoading(true);
      setError(null);

      try {
        const [allRes, myRes] = await Promise.all([
          communitiesApi.getAll(),
          communitiesApi.getMy(),
        ]);

        if (allRes.success && allRes.data) {
          setAllCommunities(allRes.data);
        }
        if (myRes.success && myRes.data) {
          setMyCommunities(myRes.data);
        }
      } catch (err) {
        setError('Failed to load communities');
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, []);

  // Create a set of joined community IDs for quick lookup
  const joinedIds = new Set(myCommunities.map(c => c.id));

  // Combine all communities with joined status
  const communitiesWithStatus = allCommunities.map(community => ({
    ...community,
    joined: joinedIds.has(community.id),
  }));

  // Filter communities
  const filteredCommunities = communitiesWithStatus.filter(community => {
    if (searchQuery && !community.name.toLowerCase().includes(searchQuery.toLowerCase())) return false;
    if (filter === 'joined') return community.joined;
    if (filter === 'discover') return !community.joined;
    return true;
  });

  // Handler functions
  const handleJoin = async (communityId: string) => {
    setJoiningId(communityId);
    const res = await communitiesApi.join(communityId);

    if (res.success) {
      // Add to my communities
      const community = allCommunities.find(c => c.id === communityId);
      if (community) {
        setMyCommunities(prev => [...prev, community]);
        // Update member count in all communities
        setAllCommunities(prev => prev.map(c =>
          c.id === communityId ? { ...c, memberCount: c.memberCount + 1 } : c
        ));
      }
    }
    setJoiningId(null);
  };

  const handleLeave = async (communityId: string) => {
    if (!confirm('Are you sure you want to leave this community?')) return;

    setLeavingId(communityId);
    const res = await communitiesApi.leave(communityId);

    if (res.success) {
      setMyCommunities(prev => prev.filter(c => c.id !== communityId));
      // Update member count in all communities
      setAllCommunities(prev => prev.map(c =>
        c.id === communityId ? { ...c, memberCount: Math.max(0, c.memberCount - 1) } : c
      ));
    }
    setLeavingId(null);
  };

  const handleCreateCommunity = async (e: React.FormEvent) => {
    e.preventDefault();
    setCreating(true);

    const res = await communitiesApi.create({
      name: newCommunity.name,
      description: newCommunity.description,
      category: newCommunity.category,
    });

    if (res.success && res.data) {
      // Add to both lists
      setAllCommunities(prev => [res.data!, ...prev]);
      setMyCommunities(prev => [res.data!, ...prev]);
      setShowCreateModal(false);
      setNewCommunity({ name: '', description: '', category: 'Fitness' });
    }
    setCreating(false);
  };

  if (loading) {
    return (
      <div className="p-6 lg:p-8 max-w-7xl mx-auto flex items-center justify-center min-h-[400px]">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6 lg:p-8 max-w-7xl mx-auto">
        <div className="bg-destructive/10 border border-destructive/20 text-destructive rounded-xl p-4">
          {error}
        </div>
      </div>
    );
  }

  return (
    <div className="p-4 lg:p-6 max-w-7xl mx-auto space-y-8">
      {/* Hero Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <div className="flex items-center gap-2 text-primary font-bold tracking-widest uppercase text-xs mb-2">
            <Globe className="w-4 h-4" />
            Global Factions
          </div>
          <h1 className="text-4xl lg:text-5xl font-black text-foreground tracking-tighter uppercase relative">
            Communities
            <span className="absolute -top-4 -right-8 text-xs font-mono bg-primary text-white px-2 py-1 rounded-sm rotate-12">New S4</span>
          </h1>
          <p className="text-muted-foreground mt-2 max-w-xl text-lg font-medium leading-relaxed">
            Join forces. Compete for the multiplier. Dominate the leaderboard.
          </p>
        </div>
        <button
          onClick={() => setShowCreateModal(true)}
          className="flex items-center gap-2 px-6 py-3 bg-foreground text-background rounded-none hover:bg-foreground/90 font-black uppercase tracking-wide transition-colors"
        >
          <Plus className="w-5 h-5" />
          Establish Squad
        </button>
      </div>

      {/* Filter Bar */}
      <div className="sticky top-20 z-30 bg-background/80 backdrop-blur-xl p-3 -mx-2 rounded-xl border border-border/50 shadow-sm">
        <div className="flex flex-col md:flex-row gap-4">
          {/* Search */}
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <input
              type="text"
              placeholder="Find your faction..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-transparent outline-none text-foreground placeholder:text-muted-foreground font-medium"
            />
          </div>

          {/* Tabs */}
          <div className="flex items-center gap-1 bg-secondary/50 p-1 rounded-lg">
            {(['all', 'joined', 'discover'] as const).map(tab => (
              <button
                key={tab}
                onClick={() => setFilter(tab)}
                className={`px-4 py-1.5 rounded-md text-xs font-bold uppercase tracking-wide transition-all ${filter === tab ? 'bg-foreground text-background shadow-md' : 'text-muted-foreground hover:text-foreground'
                  }`}
              >
                {tab === 'all' ? 'All' : tab}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Grid */}
      {filteredCommunities.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-muted-foreground">
            {filter === 'joined'
              ? "You haven't joined any communities yet"
              : filter === 'discover'
                ? 'No new communities to discover'
                : 'No communities found'
            }
          </p>
        </div>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {filteredCommunities.map((community) => (
            <div
              key={community.id}
              className="group relative h-[320px] rounded-2xl overflow-hidden bg-black border border-white/10 hover:border-white/30 transition-all duration-300 hover:scale-[1.01] hover:shadow-2xl"
            >
              {/* Background Gradient Image with Noise */}
              <div className={`absolute inset-0 bg-gradient-to-br ${getCategoryColor(community.category)} opacity-60 transition-opacity duration-500 group-hover:opacity-80`} />
              <div className="absolute inset-0 bg-noise opacity-30 mix-blend-overlay" />
              <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-transparent" />

              {/* Content Overlay */}
              <div className="absolute inset-0 p-6 flex flex-col items-start justify-between text-white">
                <div className="w-full">
                  <div className="flex items-start justify-between">
                    <span className="px-2 py-0.5 bg-black/50 backdrop-blur-md text-[10px] font-bold uppercase tracking-widest border border-white/10">
                      {community.category}
                    </span>
                    {community.joined && (
                      <span className="flex items-center gap-1 px-2 py-1 bg-white text-black text-[10px] font-bold uppercase tracking-widest">
                        <ShieldAlert className="w-3 h-3" />
                        Member
                      </span>
                    )}
                  </div>

                  <h3 className="text-3xl font-black mt-4 mb-2 uppercase leading-none">{community.name}</h3>
                  <p className="text-gray-300 text-sm line-clamp-2 font-medium leading-relaxed opacity-80 group-hover:opacity-100 transition-opacity">
                    {community.description || 'No description'}
                  </p>
                </div>

                <div className="w-full space-y-4">
                  <div className="grid grid-cols-2 gap-2">
                    <div className="bg-black/30 backdrop-blur p-2 border border-white/5 rounded-sm">
                      <div className="text-[10px] uppercase text-gray-400 font-bold">Members</div>
                      <div className="font-mono font-bold">
                        {community.memberCount >= 1000
                          ? `${(community.memberCount / 1000).toFixed(1)}K`
                          : community.memberCount
                        }
                      </div>
                    </div>
                    <div className="bg-black/30 backdrop-blur p-2 border border-white/5 rounded-sm">
                      <div className="text-[10px] uppercase text-gray-400 font-bold">Multiplier</div>
                      <div className="font-mono font-bold text-primary">{community.streakMultiplier}x</div>
                    </div>
                  </div>

                  <div className="flex items-center justify-between pt-4 border-t border-white/10">
                    <div className="flex items-center gap-2 text-xs font-bold text-orange-400">
                      <Flame className="w-4 h-4" />
                      {community.streakThreshold} DAY THRESHOLD
                    </div>
                    <button
                      onClick={() => community.joined ? handleLeave(community.id) : handleJoin(community.id)}
                      disabled={joiningId === community.id || leavingId === community.id}
                      className={`p-2 rounded-full transition-all ${community.joined
                        ? 'bg-white/20 text-white hover:bg-red-500/50'
                        : 'bg-white text-black hover:bg-primary hover:text-white'
                        } disabled:opacity-50`}
                    >
                      {(joiningId === community.id || leavingId === community.id) ? (
                        <Loader2 className="w-5 h-5 animate-spin" />
                      ) : (
                        <ArrowUpRight className="w-5 h-5 group-hover:rotate-45 transition-transform" />
                      )}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Create Community Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm">
          <div className="bg-card border border-border rounded-xl p-6 w-full max-w-md mx-4">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-foreground">Create Community</h2>
              <button
                onClick={() => setShowCreateModal(false)}
                className="p-1 text-muted-foreground hover:text-foreground transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateCommunity} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-foreground mb-1">
                  Community Name
                </label>
                <input
                  type="text"
                  value={newCommunity.name}
                  onChange={(e) => setNewCommunity(prev => ({ ...prev, name: e.target.value }))}
                  placeholder="Enter community name"
                  className="w-full px-4 py-2 bg-background border border-input rounded-lg text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-foreground mb-1">
                  Description
                </label>
                <textarea
                  value={newCommunity.description}
                  onChange={(e) => setNewCommunity(prev => ({ ...prev, description: e.target.value }))}
                  placeholder="What's this community about?"
                  rows={3}
                  className="w-full px-4 py-2 bg-background border border-input rounded-lg text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring resize-none"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-foreground mb-1">
                  Category
                </label>
                <select
                  value={newCommunity.category}
                  onChange={(e) => setNewCommunity(prev => ({ ...prev, category: e.target.value }))}
                  className="w-full px-4 py-2 bg-background border border-input rounded-lg text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
                >
                  <option value="Fitness">Fitness</option>
                  <option value="Learning">Learning</option>
                  <option value="Wellness">Wellness</option>
                  <option value="Career">Career</option>
                  <option value="Health">Health</option>
                  <option value="Productivity">Productivity</option>
                  <option value="Social">Social</option>
                  <option value="Creative">Creative</option>
                </select>
              </div>

              <div className="flex gap-3 pt-4">
                <button
                  type="button"
                  onClick={() => setShowCreateModal(false)}
                  className="flex-1 px-4 py-2 bg-secondary text-secondary-foreground rounded-lg font-medium hover:bg-secondary/80 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={creating || !newCommunity.name}
                  className="flex-1 px-4 py-2 bg-primary text-primary-foreground rounded-lg font-medium hover:bg-primary/90 transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
                >
                  {creating ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      Creating...
                    </>
                  ) : (
                    'Create Community'
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
