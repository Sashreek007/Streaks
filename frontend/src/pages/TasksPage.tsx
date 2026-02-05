import { useState } from 'react';
import { Plus, Search, Flame, Calendar, MoreVertical } from 'lucide-react';

// Mock data
const tasks = [
  {
    id: 1,
    title: 'Complete project proposal',
    description: 'Write and submit the Q1 project proposal',
    priority: 'high',
    dueDate: 'Feb 9',
    streak: 5,
    category: 'Work',
    completed: false,
  },
  {
    id: 2,
    title: 'Practice Spanish',
    description: 'Complete daily lesson on Duolingo',
    priority: 'low',
    dueDate: 'Feb 4',
    streak: 15,
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
    category: 'Wellness',
    completed: false,
  },
];

const categories = ['All', 'Work', 'Health', 'Learning', 'Wellness'];

const priorityColors: Record<string, string> = {
  high: 'bg-red-500/10 text-red-500 border-red-500/20',
  medium: 'bg-yellow-500/10 text-yellow-500 border-yellow-500/20',
  low: 'bg-green-500/10 text-green-500 border-green-500/20',
};

export default function TasksPage() {
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [activeTab, setActiveTab] = useState<'active' | 'completed'>('active');
  const [searchQuery, setSearchQuery] = useState('');

  const filteredTasks = tasks.filter(task => {
    if (selectedCategory !== 'All' && task.category !== selectedCategory) return false;
    if (searchQuery && !task.title.toLowerCase().includes(searchQuery.toLowerCase())) return false;
    if (activeTab === 'completed') return task.completed;
    return !task.completed;
  });

  return (
    <div className="p-6 lg:p-8 max-w-4xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl lg:text-3xl font-bold text-foreground">Tasks</h1>
          <p className="text-muted-foreground mt-1">Manage your daily tasks and habits</p>
        </div>
        <button className="flex items-center gap-2 px-4 py-2.5 bg-primary text-primary-foreground rounded-lg text-sm font-medium hover:bg-primary/90 transition-colors">
          <Plus className="w-4 h-4" />
          New Task
        </button>
      </div>

      {/* Search and Filters */}
      <div className="flex flex-col sm:flex-row gap-4 mb-6">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <input
            type="text"
            placeholder="Search tasks..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 bg-background border border-input rounded-lg text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
          />
        </div>
        <div className="flex gap-2 overflow-x-auto pb-1">
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
      </div>

      {/* Tabs */}
      <div className="flex gap-4 mb-6 border-b border-border">
        <button
          onClick={() => setActiveTab('active')}
          className={`pb-3 text-sm font-medium transition-colors ${
            activeTab === 'active'
              ? 'text-foreground border-b-2 border-primary'
              : 'text-muted-foreground hover:text-foreground'
          }`}
        >
          Active ({tasks.filter(t => !t.completed).length})
        </button>
        <button
          onClick={() => setActiveTab('completed')}
          className={`pb-3 text-sm font-medium transition-colors ${
            activeTab === 'completed'
              ? 'text-foreground border-b-2 border-primary'
              : 'text-muted-foreground hover:text-foreground'
          }`}
        >
          Completed ({tasks.filter(t => t.completed).length})
        </button>
      </div>

      {/* Task List */}
      <div className="space-y-3">
        {filteredTasks.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-muted-foreground">No tasks found</p>
          </div>
        ) : (
          filteredTasks.map((task) => (
            <div
              key={task.id}
              className="bg-card border border-border rounded-xl p-4 hover:border-primary/50 transition-colors"
            >
              <div className="flex items-start gap-4">
                <button className="mt-1 w-5 h-5 rounded-full border-2 border-muted-foreground hover:border-primary transition-colors flex-shrink-0" />

                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <h3 className="font-medium text-foreground">{task.title}</h3>
                      <p className="text-sm text-muted-foreground mt-0.5">{task.description}</p>
                    </div>
                    <button className="text-muted-foreground hover:text-foreground">
                      <MoreVertical className="w-5 h-5" />
                    </button>
                  </div>

                  <div className="flex flex-wrap items-center gap-3 mt-3">
                    <span className={`text-xs px-2 py-1 rounded border ${priorityColors[task.priority]}`}>
                      <span className="inline-block w-1.5 h-1.5 rounded-full bg-current mr-1.5" />
                      {task.priority}
                    </span>

                    <span className="flex items-center gap-1.5 text-xs text-muted-foreground">
                      <Calendar className="w-3.5 h-3.5" />
                      {task.dueDate}
                    </span>

                    {task.streak > 0 && (
                      <span className="flex items-center gap-1 text-xs text-orange-500">
                        <Flame className="w-3.5 h-3.5" />
                        {task.streak} day streak
                      </span>
                    )}

                    <span className="text-xs px-2 py-1 rounded-full bg-secondary text-secondary-foreground">
                      {task.category}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
