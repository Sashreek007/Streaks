import { useState } from 'react';
import { Plus, Search, Flame, AlertCircle, Sword, Shield, Crown } from 'lucide-react';

// Mock data
const tasks = [
  {
    id: 1,
    title: 'Complete project proposal',
    description: 'Write and submit the Q1 project proposal',
    priority: 'high',
    dueDate: 'Today', // Changed for demo
    streak: 5,
    xp: 50,
    category: 'Work',
    completed: false,
  },
  {
    id: 2,
    title: 'Practice Spanish',
    description: 'Complete daily lesson on Duolingo',
    priority: 'low',
    dueDate: 'Tomorrow',
    streak: 15,
    xp: 20,
    category: 'Learning',
    completed: false,
  },
  {
    id: 3,
    title: 'Team meeting preparation',
    description: 'Prepare slides for weekly sync',
    priority: 'high',
    dueDate: 'Feb 5',
    streak: 0,
    xp: 40,
    category: 'Work',
    completed: false,
  },
  {
    id: 4,
    title: 'Meditate',
    description: '10 minutes mindfulness meditation',
    priority: 'medium',
    dueDate: 'Feb 4',
    streak: 7,
    xp: 30,
    category: 'Wellness',
    completed: false,
  },
];

const categories = ['All', 'Work', 'Health', 'Learning', 'Wellness'];

export default function TasksPage() {
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');

  const filteredTasks = tasks.filter(task => {
    if (selectedCategory !== 'All' && task.category !== selectedCategory) return false;
    if (searchQuery && !task.title.toLowerCase().includes(searchQuery.toLowerCase())) return false;
    return !task.completed;
  });

  return (
    <div className="p-4 lg:p-6 max-w-5xl mx-auto space-y-8">
      {/* Gamified Header */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
        <div>
          <h1 className="text-3xl lg:text-4xl font-black text-foreground uppercase tracking-tight">Quest Log</h1>
          <p className="text-muted-foreground mt-1 flex items-center gap-2">
            <Sword className="w-4 h-4 text-primary" />
            <span className="font-medium">Level 5 Warrior</span>
            <span className="w-1 h-1 bg-muted-foreground rounded-full" />
            <span>450 / 1000 XP</span>
          </p>
          {/* XP Bar */}
          <div className="mt-4 h-2 w-full lg:w-64 bg-secondary rounded-full overflow-hidden">
            <div className="h-full bg-gradient-to-r from-yellow-500 to-orange-500 w-[45%]" />
          </div>
        </div>

        <button className="flex items-center gap-2 px-6 py-3 bg-primary text-primary-foreground rounded-xl font-bold shadow-lg shadow-primary/25 hover:scale-105 transition-all active:scale-95">
          <Plus className="w-5 h-5" />
          New Quest
        </button>
      </div>

      {/* Filters Area */}
      <div className="flex flex-col gap-4">
        {/* Search */}
        <div className="relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
          <input
            type="text"
            placeholder="Search for quests..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-12 pr-4 py-3 bg-secondary/50 border border-transparent focus:bg-background focus:border-primary rounded-xl transition-all outline-none text-foreground placeholder:text-muted-foreground"
          />
        </div>

        {/* Categories as Tags */}
        <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
          {categories.map((category) => (
            <button
              key={category}
              onClick={() => setSelectedCategory(category)}
              className={`px-4 py-2 rounded-lg text-sm font-bold whitespace-nowrap transition-all ${selectedCategory === category
                ? 'bg-foreground text-background scale-105'
                : 'bg-card border border-border text-muted-foreground hover:border-foreground/50'
                }`}
            >
              {category}
            </button>
          ))}
        </div>
      </div>

      {/* Task Grid - "Quest Board" Style */}
      <div className="grid gap-4">
        {filteredTasks.length === 0 ? (
          <div className="text-center py-20 bg-card/50 border border-dashed border-border rounded-3xl">
            <Shield className="w-12 h-12 mx-auto text-muted-foreground/30 mb-4" />
            <p className="text-muted-foreground">No active quests found. You are safe... for now.</p>
          </div>
        ) : (
          filteredTasks.map((task) => {
            const isHighPriority = task.priority === 'high';
            return (
              <div
                key={task.id}
                className={`group relative overflow-hidden bg-card border rounded-2xl p-5 transition-all duration-300 hover:-translate-y-1 ${isHighPriority
                  ? 'border-red-500/30 hover:border-red-500/60 shadow-[0_0_20px_-10px_rgba(239,68,68,0.2)]'
                  : 'border-border hover:border-primary/50 hover:shadow-lg'
                  }`}
              >
                {/* Visual "Bleeding" for urgency */}
                {isHighPriority && (
                  <div className="absolute top-0 right-0 w-24 h-24 bg-red-500/10 blur-2xl rounded-full -mr-10 -mt-10" />
                )}

                <div className="relative z-10 flex items-start gap-4">
                  {/* Checkbox / Action */}
                  <button className={`mt-1 w-8 h-8 rounded-xl border-2 flex items-center justify-center transition-all ${isHighPriority ? 'border-red-500/50 hover:bg-red-500 hover:border-red-500' : 'border-muted-foreground/30 hover:border-primary hover:bg-primary'
                    } group/btn`}>
                    <Sword className={`w-4 h-4 transition-colors ${isHighPriority ? 'text-red-500 group-hover/btn:text-white' : 'text-muted-foreground group-hover/btn:text-white'
                      }`} />
                  </button>

                  <div className="flex-1 min-w-0">
                    <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-2 mb-1">
                      <h3 className={`font-bold text-lg ${isHighPriority ? 'text-red-500' : 'text-foreground'}`}>
                        {task.title}
                      </h3>
                      <div className="flex items-center gap-2">
                        {isHighPriority && (
                          <div className="flex items-center gap-1 text-xs font-bold text-red-500 bg-red-500/10 px-2 py-1 rounded-md uppercase tracking-wider">
                            <AlertCircle className="w-3 h-3" />
                            Critical
                          </div>
                        )}
                        <span className="text-xs font-medium text-muted-foreground">{task.dueDate}</span>
                      </div>
                    </div>

                    <p className="text-muted-foreground text-sm mb-4 line-clamp-1">{task.description}</p>

                    <div className="flex items-center gap-3">
                      <div className="flex items-center gap-1.5 px-2 py-1 bg-secondary rounded-md text-xs font-medium">
                        <Crown className="w-3.5 h-3.5 text-yellow-500" />
                        <span className="text-foreground">{task.xp} XP</span>
                      </div>

                      {task.streak > 0 && (
                        <div className="flex items-center gap-1.5 px-2 py-1 bg-orange-500/10 rounded-md text-xs font-medium text-orange-500">
                          <Flame className="w-3.5 h-3.5" />
                          {task.streak} Day Streak
                        </div>
                      )}

                      <span className="text-xs text-muted-foreground px-2 py-1 border border-border rounded-md">
                        {task.category}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
