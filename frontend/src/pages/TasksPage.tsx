import { useState, useEffect } from 'react';
import { Plus, Search, Flame, AlertCircle, Sword, Shield, Crown, X, Loader2 } from 'lucide-react';
import { tasksApi } from '../services/api';
import type { Task } from '../services/api';
import { useAuth } from '../context/AuthContext';

export default function TasksPage() {
  const { user } = useAuth();
  const [tasks, setTasks] = useState<Task[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [isCreating, setIsCreating] = useState(false);
  const [completingTaskId, setCompletingTaskId] = useState<string | null>(null);

  // Form state for new task
  const [newTask, setNewTask] = useState({
    title: '',
    description: '',
    category: 'Work',
    difficulty: 'medium' as const,
    priority: 'medium' as const,
    frequency: 'daily' as const,
  });

  // Fetch tasks on mount
  useEffect(() => {
    fetchTasks();
  }, []);

  const fetchTasks = async () => {
    setIsLoading(true);
    const response = await tasksApi.getAll();
    if (response.success && response.data) {
      setTasks(response.data);
    }
    setIsLoading(false);
  };

  // Get unique categories from tasks
  const categories = ['All', ...new Set(tasks.map(t => t.category).filter(Boolean))];

  // Check if task was completed today
  const isCompletedToday = (task: Task) => {
    if (!task.lastCompletedDate) return false;
    const today = new Date().toDateString();
    const completedDate = new Date(task.lastCompletedDate).toDateString();
    return today === completedDate;
  };

  // Filter tasks
  const filteredTasks = tasks.filter(task => {
    if (selectedCategory !== 'All' && task.category !== selectedCategory) return false;
    if (searchQuery && !task.title.toLowerCase().includes(searchQuery.toLowerCase())) return false;
    return task.isActive && !isCompletedToday(task);
  });

  // Create task
  const handleCreateTask = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsCreating(true);

    const response = await tasksApi.create({
      title: newTask.title,
      description: newTask.description || undefined,
      category: newTask.category,
    });

    if (response.success && response.data) {
      setTasks(prev => [response.data!, ...prev]);
      setShowCreateModal(false);
      setNewTask({
        title: '',
        description: '',
        category: 'Work',
        difficulty: 'medium',
        priority: 'medium',
        frequency: 'daily',
      });
    }

    setIsCreating(false);
  };

  // Complete task
  const handleCompleteTask = async (taskId: string) => {
    setCompletingTaskId(taskId);
    const response = await tasksApi.complete(taskId);

    if (response.success) {
      // Update the task in local state
      setTasks(prev => prev.map(t =>
        t.id === taskId
          ? { ...t, lastCompletedDate: new Date().toISOString(), currentStreak: t.currentStreak + 1 }
          : t
      ));
    }

    setCompletingTaskId(null);
  };

  // Format due date
  const formatDueDate = (dueDate: string | null) => {
    if (!dueDate) return null;
    const date = new Date(dueDate);
    const today = new Date();
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    if (date.toDateString() === today.toDateString()) return 'Today';
    if (date.toDateString() === tomorrow.toDateString()) return 'Tomorrow';
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  };

  // Calculate user level and XP progress
  const userLevel = user?.level || 1;
  const userXp = user?.totalXp || 0;
  const xpForCurrentLevel = (userLevel - 1) * 1000;
  const xpForNextLevel = userLevel * 1000;
  const xpProgress = ((userXp - xpForCurrentLevel) / (xpForNextLevel - xpForCurrentLevel)) * 100;

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="p-4 lg:p-6 max-w-5xl mx-auto space-y-8">
      {/* Gamified Header */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
        <div>
          <h1 className="text-3xl lg:text-4xl font-black text-foreground uppercase tracking-tight">Quest Log</h1>
          <p className="text-muted-foreground mt-1 flex items-center gap-2">
            <Sword className="w-4 h-4 text-primary" />
            <span className="font-medium">Level {userLevel} Warrior</span>
            <span className="w-1 h-1 bg-muted-foreground rounded-full" />
            <span>{userXp.toLocaleString()} XP</span>
          </p>
          {/* XP Bar */}
          <div className="mt-4 h-2 w-full lg:w-64 bg-secondary rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-yellow-500 to-orange-500 transition-all"
              style={{ width: `${Math.min(xpProgress, 100)}%` }}
            />
          </div>
        </div>

        <button
          onClick={() => setShowCreateModal(true)}
          className="flex items-center gap-2 px-6 py-3 bg-primary text-primary-foreground rounded-xl font-bold shadow-lg shadow-primary/25 hover:scale-105 transition-all active:scale-95"
        >
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
            <p className="text-muted-foreground">
              {tasks.length === 0
                ? 'No quests yet. Create your first quest to begin!'
                : 'All quests completed! You are safe... for now.'}
            </p>
          </div>
        ) : (
          filteredTasks.map((task) => {
            const isHighPriority = task.priority === 'high';
            const isCompleting = completingTaskId === task.id;
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
                  <button
                    onClick={() => handleCompleteTask(task.id)}
                    disabled={isCompleting}
                    className={`mt-1 w-8 h-8 rounded-xl border-2 flex items-center justify-center transition-all ${isHighPriority ? 'border-red-500/50 hover:bg-red-500 hover:border-red-500' : 'border-muted-foreground/30 hover:border-primary hover:bg-primary'
                      } group/btn disabled:opacity-50`}
                  >
                    {isCompleting ? (
                      <Loader2 className="w-4 h-4 animate-spin" />
                    ) : (
                      <Sword className={`w-4 h-4 transition-colors ${isHighPriority ? 'text-red-500 group-hover/btn:text-white' : 'text-muted-foreground group-hover/btn:text-white'
                        }`} />
                    )}
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
                        {task.dueDate && (
                          <span className="text-xs font-medium text-muted-foreground">
                            {formatDueDate(task.dueDate)}
                          </span>
                        )}
                      </div>
                    </div>

                    {task.description && (
                      <p className="text-muted-foreground text-sm mb-4 line-clamp-1">{task.description}</p>
                    )}

                    <div className="flex items-center gap-3 flex-wrap">
                      <div className="flex items-center gap-1.5 px-2 py-1 bg-secondary rounded-md text-xs font-medium">
                        <Crown className="w-3.5 h-3.5 text-yellow-500" />
                        <span className="text-foreground">{task.baseXp} XP</span>
                      </div>

                      {task.currentStreak > 0 && (
                        <div className="flex items-center gap-1.5 px-2 py-1 bg-orange-500/10 rounded-md text-xs font-medium text-orange-500">
                          <Flame className="w-3.5 h-3.5" />
                          {task.currentStreak} Day Streak
                        </div>
                      )}

                      {task.category && (
                        <span className="text-xs text-muted-foreground px-2 py-1 border border-border rounded-md">
                          {task.category}
                        </span>
                      )}

                      <span className={`text-xs px-2 py-1 rounded-md font-medium ${
                        task.difficulty === 'easy' ? 'bg-green-500/10 text-green-500' :
                        task.difficulty === 'medium' ? 'bg-yellow-500/10 text-yellow-500' :
                        task.difficulty === 'hard' ? 'bg-orange-500/10 text-orange-500' :
                        'bg-red-500/10 text-red-500'
                      }`}>
                        {task.difficulty}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Create Task Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-card border border-border rounded-2xl p-6 w-full max-w-md">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-foreground">Create New Quest</h2>
              <button
                onClick={() => setShowCreateModal(false)}
                className="p-2 hover:bg-secondary rounded-lg transition-colors"
              >
                <X className="w-5 h-5 text-muted-foreground" />
              </button>
            </div>

            <form onSubmit={handleCreateTask} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-foreground mb-1.5">
                  Quest Title
                </label>
                <input
                  type="text"
                  value={newTask.title}
                  onChange={(e) => setNewTask(prev => ({ ...prev, title: e.target.value }))}
                  placeholder="Enter quest title..."
                  required
                  className="w-full px-4 py-2.5 bg-secondary border border-border rounded-xl text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary transition-colors"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-foreground mb-1.5">
                  Description
                </label>
                <textarea
                  value={newTask.description}
                  onChange={(e) => setNewTask(prev => ({ ...prev, description: e.target.value }))}
                  placeholder="Describe your quest..."
                  rows={3}
                  className="w-full px-4 py-2.5 bg-secondary border border-border rounded-xl text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary transition-colors resize-none"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-foreground mb-1.5">
                  Category
                </label>
                <select
                  value={newTask.category}
                  onChange={(e) => setNewTask(prev => ({ ...prev, category: e.target.value }))}
                  className="w-full px-4 py-2.5 bg-secondary border border-border rounded-xl text-foreground focus:outline-none focus:border-primary transition-colors"
                >
                  <option value="Work">Work</option>
                  <option value="Health">Health</option>
                  <option value="Learning">Learning</option>
                  <option value="Wellness">Wellness</option>
                  <option value="Fitness">Fitness</option>
                  <option value="Personal">Personal</option>
                </select>
              </div>

              <div className="flex gap-4 pt-4">
                <button
                  type="button"
                  onClick={() => setShowCreateModal(false)}
                  className="flex-1 px-4 py-2.5 bg-secondary text-foreground rounded-xl font-medium hover:bg-secondary/80 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isCreating || !newTask.title.trim()}
                  className="flex-1 px-4 py-2.5 bg-primary text-primary-foreground rounded-xl font-bold hover:opacity-90 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                  {isCreating ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      Creating...
                    </>
                  ) : (
                    <>
                      <Plus className="w-4 h-4" />
                      Create Quest
                    </>
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
