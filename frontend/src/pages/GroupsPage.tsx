import { useState } from 'react';
import { Plus, Search, Users, Lock, Unlock, Flame } from 'lucide-react';

// Mock data
const groups = [
  {
    id: 1,
    name: 'Morning Runners',
    description: 'A group for early birds who love to start their day with a run.',
    members: 156,
    isPublic: true,
    multiplier: 1.5,
    streak: 32,
    joined: true,
  },
  {
    id: 2,
    name: 'Book Club 2024',
    description: 'Read one book per month and discuss with fellow readers.',
    members: 89,
    isPublic: true,
    multiplier: 1.2,
    streak: 15,
    joined: true,
  },
  {
    id: 3,
    name: 'Tech Team Fitness',
    description: 'Private group for the dev team to stay active together.',
    members: 24,
    isPublic: false,
    multiplier: 2.0,
    streak: 45,
    joined: false,
  },
  {
    id: 4,
    name: 'Meditation Masters',
    description: 'Daily meditation practice and mindfulness discussions.',
    members: 234,
    isPublic: true,
    multiplier: 1.3,
    streak: 67,
    joined: false,
  },
];

export default function GroupsPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [filter, setFilter] = useState<'all' | 'joined' | 'discover'>('all');

  const filteredGroups = groups.filter(group => {
    if (searchQuery && !group.name.toLowerCase().includes(searchQuery.toLowerCase())) return false;
    if (filter === 'joined') return group.joined;
    if (filter === 'discover') return !group.joined;
    return true;
  });

  return (
    <div className="p-6 lg:p-8 max-w-4xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl lg:text-3xl font-bold text-foreground">Groups</h1>
          <p className="text-muted-foreground mt-1">Join accountability groups and compete together</p>
        </div>
        <button className="flex items-center gap-2 px-4 py-2.5 bg-primary text-primary-foreground rounded-lg text-sm font-medium hover:bg-primary/90 transition-colors">
          <Plus className="w-4 h-4" />
          Create Group
        </button>
      </div>

      {/* Search and Filters */}
      <div className="flex flex-col sm:flex-row gap-4 mb-6">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <input
            type="text"
            placeholder="Search groups..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 bg-background border border-input rounded-lg text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
          />
        </div>
        <div className="flex gap-2">
          {(['all', 'joined', 'discover'] as const).map((tab) => (
            <button
              key={tab}
              onClick={() => setFilter(tab)}
              className={`px-4 py-2 rounded-lg text-sm font-medium capitalize transition-colors ${
                filter === tab
                  ? 'bg-primary text-primary-foreground'
                  : 'bg-secondary text-secondary-foreground hover:bg-secondary/80'
              }`}
            >
              {tab}
            </button>
          ))}
        </div>
      </div>

      {/* Groups Grid */}
      <div className="grid gap-4 md:grid-cols-2">
        {filteredGroups.map((group) => (
          <div
            key={group.id}
            className="bg-card border border-border rounded-xl p-5 hover:border-primary/50 transition-colors"
          >
            <div className="flex items-start justify-between mb-3">
              <div>
                <h3 className="font-semibold text-foreground">{group.name}</h3>
                <div className="flex items-center gap-3 mt-1">
                  <span className="flex items-center gap-1 text-xs text-muted-foreground">
                    {group.isPublic ? <Unlock className="w-3.5 h-3.5" /> : <Lock className="w-3.5 h-3.5" />}
                    {group.isPublic ? 'Public' : 'Private'}
                  </span>
                  <span className="flex items-center gap-1 text-xs text-muted-foreground">
                    <Users className="w-3.5 h-3.5" />
                    {group.members} members
                  </span>
                </div>
              </div>
              <button
                className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                  group.joined
                    ? 'bg-secondary text-secondary-foreground hover:bg-secondary/80'
                    : 'bg-primary text-primary-foreground hover:bg-primary/90'
                }`}
              >
                {group.joined ? 'Joined' : 'Join'}
              </button>
            </div>

            <p className="text-sm text-muted-foreground mb-4">{group.description}</p>

            <div className="flex items-center gap-4 pt-3 border-t border-border">
              <span className="flex items-center gap-1 text-sm">
                <span className="text-primary font-medium">{group.multiplier}x</span>
                <span className="text-muted-foreground">multiplier</span>
              </span>
              <span className="flex items-center gap-1 text-sm text-orange-500">
                <Flame className="w-4 h-4" />
                {group.streak} day streak
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
