import { useState } from 'react';
import { Plus, Search, Users, Globe, Flame } from 'lucide-react';

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
  },
];

const categories = ['All', 'Fitness', 'Learning', 'Wellness', 'Career', 'Health'];

const categoryColors: Record<string, string> = {
  Fitness: 'bg-green-500/10 text-green-500',
  Learning: 'bg-blue-500/10 text-blue-500',
  Wellness: 'bg-pink-500/10 text-pink-500',
  Career: 'bg-purple-500/10 text-purple-500',
  Health: 'bg-orange-500/10 text-orange-500',
};

export default function CommunitiesPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [filter, setFilter] = useState<'all' | 'joined' | 'discover'>('all');

  const filteredCommunities = communities.filter(community => {
    if (searchQuery && !community.name.toLowerCase().includes(searchQuery.toLowerCase())) return false;
    if (selectedCategory !== 'All' && community.category !== selectedCategory) return false;
    if (filter === 'joined') return community.joined;
    if (filter === 'discover') return !community.joined;
    return true;
  });

  return (
    <div className="p-6 lg:p-8 max-w-5xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl lg:text-3xl font-bold text-foreground">Communities</h1>
          <p className="text-muted-foreground mt-1">Join public communities and compete with others worldwide</p>
        </div>
        <button className="flex items-center gap-2 px-4 py-2.5 bg-primary text-primary-foreground rounded-lg text-sm font-medium hover:bg-primary/90 transition-colors">
          <Plus className="w-4 h-4" />
          Create Community
        </button>
      </div>

      {/* Search */}
      <div className="relative mb-4">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
        <input
          type="text"
          placeholder="Search communities..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full pl-10 pr-4 py-2.5 bg-background border border-input rounded-lg text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
        />
      </div>

      {/* Category Pills */}
      <div className="flex gap-2 overflow-x-auto pb-2 mb-4">
        {categories.map((category) => (
          <button
            key={category}
            onClick={() => setSelectedCategory(category)}
            className={`px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition-colors ${
              selectedCategory === category
                ? 'bg-primary text-primary-foreground'
                : 'bg-secondary text-secondary-foreground hover:bg-secondary/80'
            }`}
          >
            {category}
          </button>
        ))}
      </div>

      {/* Filter Tabs */}
      <div className="flex gap-4 mb-6 border-b border-border">
        {(['all', 'joined', 'discover'] as const).map((tab) => (
          <button
            key={tab}
            onClick={() => setFilter(tab)}
            className={`pb-3 text-sm font-medium capitalize transition-colors ${
              filter === tab
                ? 'text-foreground border-b-2 border-primary'
                : 'text-muted-foreground hover:text-foreground'
            }`}
          >
            {tab === 'all' ? 'All Communities' : tab === 'joined' ? 'My Communities' : 'Discover'}
          </button>
        ))}
      </div>

      {/* Communities Grid */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {filteredCommunities.map((community) => (
          <div
            key={community.id}
            className="bg-card border border-border rounded-xl p-5 hover:border-primary/50 transition-colors"
          >
            <div className="flex items-start justify-between mb-3">
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <h3 className="font-semibold text-foreground truncate">{community.name}</h3>
                  <Globe className="w-4 h-4 text-muted-foreground flex-shrink-0" />
                </div>
                <div className="flex items-center gap-2">
                  <span className={`text-xs px-2 py-0.5 rounded-full ${categoryColors[community.category]}`}>
                    {community.category}
                  </span>
                  <span className="flex items-center gap-1 text-xs text-muted-foreground">
                    <Users className="w-3.5 h-3.5" />
                    {community.members.toLocaleString()}
                  </span>
                </div>
              </div>
            </div>

            <p className="text-sm text-muted-foreground mb-4 line-clamp-2">{community.description}</p>

            <div className="flex items-center justify-between pt-3 border-t border-border">
              <div className="flex items-center gap-3">
                <span className="flex items-center gap-1 text-sm">
                  <span className="text-primary font-medium">{community.multiplier}x</span>
                </span>
                <span className="flex items-center gap-1 text-sm text-orange-500">
                  <Flame className="w-4 h-4" />
                  {community.streak}
                </span>
              </div>
              <button
                className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                  community.joined
                    ? 'bg-secondary text-secondary-foreground hover:bg-secondary/80'
                    : 'bg-primary text-primary-foreground hover:bg-primary/90'
                }`}
              >
                {community.joined ? 'Joined' : 'Join'}
              </button>
            </div>
          </div>
        ))}
      </div>

      {filteredCommunities.length === 0 && (
        <div className="text-center py-12">
          <p className="text-muted-foreground">No communities found</p>
        </div>
      )}
    </div>
  );
}
