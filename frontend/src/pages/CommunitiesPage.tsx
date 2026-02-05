import { useState } from 'react';
import { Plus, Search, Users, Globe, Flame, Trophy, ArrowUpRight } from 'lucide-react';

// Mock data - Public communities
const communities = [
  {
    id: 1,
    name: 'Morning Runners',
    description: 'A community for early birds who love to start their day with a run.',
    members: 1560,
    multiplier: 1.5,
    streak: 32,
    joined: true,
    category: 'Fitness',
    color: 'from-orange-500 to-red-500',
  },
  {
    id: 2,
    name: 'Book Club 2024',
    description: 'Read one book per month and discuss with fellow readers.',
    members: 890,
    multiplier: 1.2,
    streak: 15,
    joined: true,
    category: 'Learning',
    color: 'from-blue-500 to-indigo-500',
  },
  {
    id: 3,
    name: 'Meditation Masters',
    description: 'Daily meditation practice and mindfulness discussions.',
    members: 2340,
    multiplier: 1.3,
    streak: 67,
    joined: false,
    category: 'Wellness',
    color: 'from-teal-500 to-emerald-500',
  },
  {
    id: 4,
    name: 'Code Every Day',
    description: 'Commit to coding daily. Share your projects and progress.',
    members: 4500,
    multiplier: 1.4,
    streak: 120,
    joined: false,
    category: 'Career',
    color: 'from-purple-500 to-pink-500',
  },
  {
    id: 5,
    name: 'Language Learners',
    description: 'Practice any language daily with fellow learners worldwide.',
    members: 3200,
    multiplier: 1.3,
    streak: 89,
    joined: false,
    category: 'Learning',
    color: 'from-blue-400 to-cyan-400',
  },
  {
    id: 6,
    name: 'Healthy Eating',
    description: 'Track your meals and share healthy recipes with the community.',
    members: 1800,
    multiplier: 1.2,
    streak: 45,
    joined: false,
    category: 'Health',
    color: 'from-green-500 to-lime-500',
  },
];

export default function CommunitiesPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [filter, setFilter] = useState<'all' | 'joined' | 'discover'>('all');

  const filteredCommunities = communities.filter(community => {
    if (searchQuery && !community.name.toLowerCase().includes(searchQuery.toLowerCase())) return false;
    if (filter === 'joined') return community.joined;
    if (filter === 'discover') return !community.joined;
    return true;
  });

  return (
    <div className="p-4 lg:p-6 max-w-7xl mx-auto space-y-8">
      {/* Hero Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <div className="flex items-center gap-2 text-primary font-bold tracking-wider uppercase text-sm mb-2">
            <Globe className="w-4 h-4" />
            Global Leaderboards
          </div>
          <h1 className="text-4xl lg:text-5xl font-black text-foreground tracking-tight">Communities</h1>
          <p className="text-muted-foreground mt-2 max-w-xl text-lg">
            Join forces with others. Compete for the weekly multiplier badge.
          </p>
        </div>
        <button className="flex items-center gap-2 px-6 py-3 bg-secondary hover:bg-secondary/80 text-foreground rounded-xl font-bold transition-colors">
          <Plus className="w-5 h-5" />
          Create Squad
        </button>
      </div>

      {/* Filter Bar */}
      <div className="sticky top-20 z-30 bg-background/80 backdrop-blur-xl p-2 -mx-2 rounded-2xl border border-border/50 shadow-sm">
        <div className="flex flex-col md:flex-row gap-4">
          {/* Search */}
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <input
              type="text"
              placeholder="Find your tribe..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-transparent outline-none text-foreground placeholder:text-muted-foreground"
            />
          </div>

          {/* Tabs */}
          <div className="flex items-center gap-1 bg-secondary/50 p-1 rounded-xl">
            {(['all', 'joined', 'discover'] as const).map(tab => (
              <button
                key={tab}
                onClick={() => setFilter(tab)}
                className={`px-4 py-1.5 rounded-lg text-sm font-medium capitalize transition-all ${filter === tab ? 'bg-background shadow-sm text-foreground' : 'text-muted-foreground hover:text-foreground'
                  }`}
              >
                {tab === 'all' ? 'All' : tab}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Grid */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {filteredCommunities.map((community) => (
          <div
            key={community.id}
            className="group relative h-[280px] rounded-3xl overflow-hidden shadow-sm hover:shadow-2xl transition-all duration-500 hover:-translate-y-2"
          >
            {/* Background Gradient Image */}
            <div className={`absolute inset-0 bg-gradient-to-br ${community.color} opacity-80 transition-opacity group-hover:opacity-100`} />
            <div className="absolute inset-0 bg-black/20 group-hover:bg-black/10 transition-colors" />

            {/* Content Overlay */}
            <div className="absolute inset-0 p-6 flex flex-col items-start justify-between text-white">
              <div className="w-full">
                <div className="flex items-start justify-between">
                  <span className="px-3 py-1 bg-white/20 backdrop-blur-md rounded-full text-xs font-medium border border-white/10">
                    {community.category}
                  </span>
                  {community.joined && (
                    <span className="w-8 h-8 flex items-center justify-center bg-white text-black rounded-full shadow-lg">
                      <Trophy className="w-4 h-4" />
                    </span>
                  )}
                </div>

                <h3 className="text-2xl font-bold mt-4 mb-2">{community.name}</h3>
                <p className="text-white/80 text-sm line-clamp-2">{community.description}</p>
              </div>

              <div className="w-full pt-4 border-t border-white/10 flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-1.5">
                    <Users className="w-4 h-4 opacity-70" />
                    <span className="font-medium text-sm">{(community.members / 1000).toFixed(1)}k</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <Flame className="w-4 h-4 opacity-70" />
                    <span className="font-medium text-sm">{community.multiplier}x</span>
                  </div>
                </div>

                <button className={`p-2 rounded-full transition-transform group-hover:rotate-45 ${community.joined ? 'bg-white/20' : 'bg-white text-black'
                  }`}>
                  <ArrowUpRight className="w-5 h-5" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
