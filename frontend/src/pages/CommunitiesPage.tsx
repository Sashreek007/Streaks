import { useState } from 'react';
import { Plus, Search, Globe, Flame, ArrowUpRight, ShieldAlert } from 'lucide-react';

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
    color: 'from-orange-600 via-orange-900 to-black',
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
    color: 'from-blue-600 via-indigo-900 to-black',
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
    color: 'from-emerald-600 via-teal-900 to-black',
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
    color: 'from-purple-600 via-pink-900 to-black',
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
    color: 'from-cyan-600 via-blue-900 to-black',
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
    color: 'from-lime-600 via-green-900 to-black',
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
        <button className="flex items-center gap-2 px-6 py-3 bg-foreground text-background rounded-none hover:bg-foreground/90 font-black uppercase tracking-wide transition-colors">
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
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {filteredCommunities.map((community) => (
          <div
            key={community.id}
            className="group relative h-[320px] rounded-2xl overflow-hidden bg-black border border-white/10 hover:border-white/30 transition-all duration-300 hover:scale-[1.01] hover:shadow-2xl"
          >
            {/* Background Gradient Image with Noise */}
            <div className={`absolute inset-0 bg-gradient-to-br ${community.color} opacity-60 transition-opacity duration-500 group-hover:opacity-80`} />
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
                <p className="text-gray-300 text-sm line-clamp-2 font-medium leading-relaxed opacity-80 group-hover:opacity-100 transition-opacity">{community.description}</p>
              </div>

              <div className="w-full space-y-4">
                <div className="grid grid-cols-2 gap-2">
                  <div className="bg-black/30 backdrop-blur p-2 border border-white/5 rounded-sm">
                    <div className="text-[10px] uppercase text-gray-400 font-bold">Members</div>
                    <div className="font-mono font-bold">{(community.members / 1000).toFixed(1)}K</div>
                  </div>
                  <div className="bg-black/30 backdrop-blur p-2 border border-white/5 rounded-sm">
                    <div className="text-[10px] uppercase text-gray-400 font-bold">Multiplier</div>
                    <div className="font-mono font-bold text-primary">{community.multiplier}x</div>
                  </div>
                </div>

                <div className="flex items-center justify-between pt-4 border-t border-white/10">
                  <div className="flex items-center gap-2 text-xs font-bold text-orange-400">
                    <Flame className="w-4 h-4" />
                    {community.streak} DAY STREAK
                  </div>
                  <button className={`p-2 rounded-full transition-transform group-hover:rotate-45 ${community.joined ? 'bg-white/20 text-white' : 'bg-white text-black'
                    }`}>
                    <ArrowUpRight className="w-5 h-5" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
