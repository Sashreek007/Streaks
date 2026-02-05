import { useState, useEffect } from 'react';
import { Flame, Target, Clock, Check, TrendingUp, Zap, Trophy, Star, Loader2 } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { tasksApi } from '../services/api';
import type { Task } from '../services/api';

const categoryColors: Record<string, string> = {
  health: 'bg-success/15 text-success border-success/20',
  learning: 'bg-primary/15 text-primary border-primary/20',
  career: 'bg-xp/15 text-xp border-xp/20',
  wellness: 'bg-energy/15 text-energy border-energy/20',
  fitness: 'bg-streak/15 text-streak border-streak/20',
  productivity: 'bg-achievement/15 text-achievement border-achievement/20',
  default: 'bg-muted/15 text-muted-foreground border-muted/20',
};

interface TaskWithCompletion extends Task {
  isCompletedToday: boolean;
  xp: number;
}

export default function DashboardPage() {
  const { user } = useAuth();
  const [tasks, setTasks] = useState<TaskWithCompletion[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [completingTaskId, setCompletingTaskId] = useState<string | null>(null);

  useEffect(() => {
    loadTasks();
  }, []);

  const loadTasks = async () => {
    try {
      const response = await tasksApi.getAll();
      if (response.success && response.data) {
        // Transform tasks to include completion status
        const today = new Date().toDateString();
        const tasksWithCompletion: TaskWithCompletion[] = response.data.map(task => ({
          ...task,
          isCompletedToday: task.lastCompletedDate
            ? new Date(task.lastCompletedDate).toDateString() === today
            : false,
          xp: task.baseXp,
        }));
        setTasks(tasksWithCompletion);
      }
    } catch (error) {
      console.error('Failed to load tasks:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCompleteTask = async (taskId: string) => {
    setCompletingTaskId(taskId);
    try {
      const response = await tasksApi.complete(taskId);
      if (response.success) {
        // Update local state
        setTasks(prev => prev.map(t =>
          t.id === taskId ? { ...t, isCompletedToday: true } : t
        ));
      }
    } catch (error) {
      console.error('Failed to complete task:', error);
    } finally {
      setCompletingTaskId(null);
    }
  };

  const completedCount = tasks.filter(t => t.isCompletedToday).length;
  const progress = tasks.length > 0 ? (completedCount / tasks.length) * 100 : 0;

  // Danger state when streak is at risk (no tasks completed today)
  const isDanger = completedCount === 0 && tasks.length > 0;
  const streakSaverTask = tasks.find(t => !t.isCompletedToday);

  // Calculate next milestone
  const currentStreak = user?.currentStreak || 0;
  const nextMilestone = currentStreak < 7 ? 7 : currentStreak < 14 ? 14 : currentStreak < 30 ? 30 : currentStreak < 90 ? 90 : 365;
  const milestoneProgress = (currentStreak / nextMilestone) * 100;
  const daysToMilestone = nextMilestone - currentStreak;

  if (isLoading) {
    return (
      <div className="p-4 lg:p-6 max-w-7xl mx-auto flex items-center justify-center min-h-[60vh]">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="p-4 lg:p-6 max-w-7xl mx-auto space-y-8">
      {/* Hero Section - The "Hero" Streak Visualization */}
      <div className={`relative overflow-hidden rounded-3xl p-8 lg:p-12 text-white shadow-2xl animate-fadeIn transition-colors duration-1000 ${isDanger
        ? 'bg-gradient-to-br from-streak via-energy to-energy/50'
        : 'bg-gradient-to-br from-primary via-success to-primary/80'
        }`}>

        {/* Noise Texture Overlay */}
        <div className="absolute inset-0 bg-noise mix-blend-overlay opacity-20 pointer-events-none z-0" />

        {/* Abstract Background Shapes */}
        <div className="absolute top-0 right-0 -mt-20 -mr-20 w-96 h-96 bg-white/10 rounded-full blur-3xl animate-breathe z-0" />
        <div className={`absolute bottom-0 left-0 -mb-20 -ml-20 w-64 h-64 rounded-full blur-3xl animate-float z-0 ${isDanger ? 'bg-achievement/30' : 'bg-white/20'
          }`} />

        <div className="relative z-10 flex flex-col lg:flex-row lg:items-center lg:justify-between gap-8">
          {/* Left: Streak Counter */}
          <div className="flex flex-col items-center lg:items-start text-center lg:text-left gap-2">
            <div className="flex items-center gap-2 mb-2 text-white/80 uppercase tracking-[0.2em] text-xs font-bold">
              <Flame className={`w-5 h-5 ${isDanger ? 'text-achievement animate-streak-fire' : 'text-white'}`} />
              {isDanger ? 'Streak At Risk!' : 'Current Streak'}
            </div>

            <h1 className="text-8xl lg:text-[10rem] font-black tracking-tighter leading-none relative">
              <span className="relative z-10">{currentStreak}</span>
              {/* Glitch/Shadow effect for number */}
              <span className="absolute top-1 left-1 text-black/20 z-0 blur-sm">{currentStreak}</span>
            </h1>

            <div className="text-2xl lg:text-3xl font-bold tracking-tight opacity-90 uppercase">
              {currentStreak === 1 ? 'DAY' : 'DAYS'}
            </div>

            <p className="mt-4 text-base text-white/80 max-w-md font-medium leading-relaxed">
              {isDanger
                ? "Complete a task to keep your streak alive!"
                : currentStreak === 0
                  ? "Start your streak today by completing a task!"
                  : `You're on fire! Keep it up to reach your ${nextMilestone}-day milestone.`}
            </p>
          </div>

          {/* Right: XP Stats */}
          <div className="flex flex-col gap-4">
            <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20">
              <div className="flex items-center gap-3 mb-2">
                <Zap className="w-6 h-6 text-achievement" />
                <span className="text-sm font-bold uppercase tracking-wide text-white/70">Total XP</span>
              </div>
              <div className="text-4xl font-black text-white">{user?.totalXp?.toLocaleString() || 0}</div>
              <div className="text-sm text-white/60 mt-1">
                Level <span className="text-achievement font-bold">{user?.level || 1}</span>
              </div>
            </div>

            <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20">
              <div className="flex items-center gap-3 mb-2">
                <Trophy className="w-6 h-6 text-achievement" />
                <span className="text-sm font-bold uppercase tracking-wide text-white/70">Next Reward</span>
              </div>
              <div className="text-lg font-bold text-white">{nextMilestone}-Day Badge</div>
              <div className="h-2 bg-white/20 rounded-full mt-3 overflow-hidden">
                <div className="h-full bg-gradient-to-r from-achievement to-streak rounded-full transition-all duration-500" style={{ width: `${Math.min(milestoneProgress, 100)}%` }} />
              </div>
              <div className="text-xs text-white/60 mt-2">{daysToMilestone} days away</div>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Streak Survival - Asymmetric Main Column */}
        <div className="col-span-1 lg:col-span-2 space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-black text-foreground uppercase tracking-tight flex items-center gap-3">
              {isDanger && <div className="w-3 h-3 bg-streak rounded-full animate-pulse" />}
              Today's Missions
            </h2>
            <div className="flex items-center gap-2 text-sm font-mono text-muted-foreground">
              <div className="flex items-center gap-1 text-success font-bold">
                <Check className="w-4 h-4" />
                {completedCount}/{tasks.length}
              </div>
              <span className="text-muted-foreground/50">|</span>
              <span>{Math.round(progress)}% complete</span>
            </div>
          </div>

          {/* Progress Bar */}
          <div className="h-3 bg-secondary rounded-full overflow-hidden">
            <div
              className="h-full rounded-full transition-all duration-700 ease-out bg-gradient-to-r from-primary via-success to-achievement"
              style={{ width: `${progress}%` }}
            />
          </div>

          {tasks.length === 0 ? (
            <div className="text-center py-12 bg-card border border-border rounded-2xl">
              <Target className="w-12 h-12 text-muted-foreground/50 mx-auto mb-4" />
              <h3 className="text-lg font-bold text-foreground mb-2">No Tasks Yet</h3>
              <p className="text-muted-foreground text-sm mb-4">Create your first task to start earning XP!</p>
              <a href="/tasks" className="inline-flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-lg font-medium hover:bg-primary/90 transition-colors">
                <Target className="w-4 h-4" />
                Create Task
              </a>
            </div>
          ) : (
            <div className="space-y-4">
              {tasks.map((task) => {
                const isSaver = isDanger && task.id === streakSaverTask?.id;
                const isCompleting = completingTaskId === task.id;
                const colorClass = categoryColors[task.category.toLowerCase()] || categoryColors.default;

                return (
                  <div
                    key={task.id}
                    className={`group relative flex items-center gap-5 p-5 rounded-2xl border transition-all duration-300 ${task.isCompletedToday
                      ? 'bg-success/5 border-success/20'
                      : isSaver
                        ? 'bg-streak/5 border-streak/50 shadow-lg streak-glow'
                        : 'bg-card border-border hover:border-primary/50 hover:shadow-md'
                      }`}
                  >
                    {isSaver && (
                      <div className="absolute -top-3 -right-3 bg-streak text-white text-[10px] font-black uppercase tracking-widest px-3 py-1.5 rounded-full shadow-lg animate-bounce flex items-center gap-1">
                        <Flame className="w-3 h-3" />
                        Streak Saver
                      </div>
                    )}

                    <button
                      onClick={() => !task.isCompletedToday && handleCompleteTask(task.id)}
                      disabled={task.isCompletedToday || isCompleting}
                      className={`w-10 h-10 rounded-xl border-2 flex items-center justify-center transition-all duration-300 ${task.isCompletedToday
                        ? 'bg-success border-success scale-110'
                        : isSaver
                          ? 'border-streak text-streak hover:bg-streak hover:text-white animate-pulse'
                          : 'border-muted-foreground/30 group-hover:border-primary group-hover:text-primary'
                        } disabled:cursor-not-allowed`}
                    >
                      {isCompleting ? (
                        <Loader2 className="w-5 h-5 animate-spin" />
                      ) : task.isCompletedToday ? (
                        <Check className="w-5 h-5 text-white" />
                      ) : isSaver ? (
                        <Flame className="w-5 h-5" />
                      ) : null}
                    </button>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-3">
                        <p className={`font-bold text-lg ${task.isCompletedToday ? 'line-through decoration-success/50 text-muted-foreground' : 'text-foreground'
                          }`}>
                          {task.title}
                        </p>
                        {task.isCompletedToday && (
                          <span className="flex items-center gap-1 text-xs font-bold text-success bg-success/10 px-2 py-0.5 rounded-full">
                            <Check className="w-3 h-3" /> Done
                          </span>
                        )}
                      </div>
                      <div className="flex items-center gap-3 mt-2">
                        <span className={`text-[10px] uppercase tracking-wider font-bold px-2 py-1 rounded-md border ${colorClass}`}>
                          {task.category}
                        </span>

                        {task.dueDate && (
                          <div className={`flex items-center gap-1.5 text-xs font-medium ${isSaver ? 'text-streak' : 'text-muted-foreground'
                            }`}>
                            <Clock className="w-3.5 h-3.5" />
                            {new Date(task.dueDate).toLocaleDateString()}
                          </div>
                        )}

                        <div className="flex items-center gap-1 text-xs font-bold text-xp">
                          <Zap className="w-3.5 h-3.5" />
                          +{task.xp} XP
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Right Column - Contextual / Motivation */}
        <div className="space-y-6">
          {/* Stats Overview */}
          <div className="bg-card border border-border rounded-3xl p-6">
            <div className="flex items-center gap-3 mb-6">
              <div className="p-3 bg-primary/10 rounded-xl text-primary">
                <Target className="w-6 h-6" />
              </div>
              <div>
                <h3 className="font-bold text-foreground">Your Stats</h3>
                <p className="text-xs text-muted-foreground">Keep pushing forward</p>
              </div>
            </div>

            <div className="space-y-4">
              <div className="flex items-center justify-between p-4 rounded-xl bg-primary/5 border border-primary/10">
                <div className="flex items-center gap-3">
                  <Zap className="w-5 h-5 text-xp" />
                  <span className="text-sm font-medium text-foreground">Total XP</span>
                </div>
                <span className="text-lg font-bold text-xp">{user?.totalXp?.toLocaleString() || 0}</span>
              </div>

              <div className="flex items-center justify-between p-4 rounded-xl bg-streak/5 border border-streak/10">
                <div className="flex items-center gap-3">
                  <Flame className="w-5 h-5 text-streak" />
                  <span className="text-sm font-medium text-foreground">Current Streak</span>
                </div>
                <span className="text-lg font-bold text-streak">{user?.currentStreak || 0} days</span>
              </div>

              <div className="flex items-center justify-between p-4 rounded-xl bg-success/5 border border-success/10">
                <div className="flex items-center gap-3">
                  <Trophy className="w-5 h-5 text-success" />
                  <span className="text-sm font-medium text-foreground">Longest Streak</span>
                </div>
                <span className="text-lg font-bold text-success">{user?.longestStreak || 0} days</span>
              </div>
            </div>
          </div>

          {/* Daily Motivation */}
          <div className="bg-gradient-to-br from-xp/20 via-primary/10 to-success/20 rounded-3xl p-6 border border-xp/20 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-achievement/20 rounded-full blur-3xl" />

            <div className="relative z-10">
              <div className="flex items-center gap-2 mb-4">
                <Star className="w-5 h-5 text-achievement" />
                <span className="text-xs font-bold uppercase tracking-widest text-achievement">Daily Motivation</span>
              </div>

              <p className="font-serif italic text-lg leading-relaxed text-foreground/90">
                "Discipline is doing what you hate to do, but doing it like you love it."
              </p>
              <div className="mt-4 flex items-center gap-2 text-muted-foreground text-xs uppercase tracking-[0.15em]">
                <div className="w-6 h-[1px] bg-muted-foreground/50" />
                Mike Tyson
              </div>
            </div>
            <TrendingUp className="absolute bottom-2 right-2 w-24 h-24 text-primary/10 -rotate-12" />
          </div>
        </div>
      </div>
    </div>
  );
}
