import { Flame, Target, Clock, Check, TrendingUp, Zap, Trophy, Star } from 'lucide-react';

// Mock data
const todaysTasks = [
  { id: 1, title: 'Morning workout', time: '7:00 AM', category: 'Health', completed: true, xp: 50 },
  { id: 2, title: 'Read for 30 minutes', time: '9:00 AM', category: 'Learning', completed: true, xp: 30 },
  { id: 3, title: 'Work on side project', time: '2:00 PM', category: 'Career', completed: false, xp: 75 },
  { id: 4, title: 'Meditate', time: '6:00 PM', category: 'Wellness', completed: false, xp: 25 },
  { id: 5, title: 'Practice guitar', time: '8:00 PM', category: 'Hobbies', completed: false, xp: 40 },
];

const categoryColors: Record<string, string> = {
  Health: 'bg-success/15 text-success border-success/20',
  Learning: 'bg-primary/15 text-primary border-primary/20',
  Career: 'bg-xp/15 text-xp border-xp/20',
  Wellness: 'bg-energy/15 text-energy border-energy/20',
  Hobbies: 'bg-streak/15 text-streak border-streak/20',
};

export default function DashboardPage() {
  const completedCount = todaysTasks.filter(t => t.completed).length;
  const progress = (completedCount / todaysTasks.length) * 100;
  const totalXP = todaysTasks.filter(t => t.completed).reduce((acc, t) => acc + t.xp, 0);
  const pendingXP = todaysTasks.filter(t => !t.completed).reduce((acc, t) => acc + t.xp, 0);

  // Mock "Danger" state for the demo feel
  const isDanger = true;
  const streakSaverTask = todaysTasks.find(t => !t.completed);

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
              <span className="relative z-10">12</span>
              {/* Glitch/Shadow effect for number */}
              <span className="absolute top-1 left-1 text-black/20 z-0 blur-sm">12</span>
            </h1>

            <div className="text-2xl lg:text-3xl font-bold tracking-tight opacity-90 uppercase">
              DAYS
            </div>

            <p className="mt-4 text-base text-white/80 max-w-md font-medium leading-relaxed">
              {isDanger
                ? "Complete a task to keep your streak alive!"
                : "You're on fire! Keep it up to reach your 14-day milestone."}
            </p>
          </div>

          {/* Right: XP Stats */}
          <div className="flex flex-col gap-4">
            <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20">
              <div className="flex items-center gap-3 mb-2">
                <Zap className="w-6 h-6 text-achievement" />
                <span className="text-sm font-bold uppercase tracking-wide text-white/70">Today's XP</span>
              </div>
              <div className="text-4xl font-black text-white">+{totalXP}</div>
              <div className="text-sm text-white/60 mt-1">
                <span className="text-achievement font-bold">+{pendingXP}</span> XP available
              </div>
            </div>

            <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20">
              <div className="flex items-center gap-3 mb-2">
                <Trophy className="w-6 h-6 text-achievement" />
                <span className="text-sm font-bold uppercase tracking-wide text-white/70">Next Reward</span>
              </div>
              <div className="text-lg font-bold text-white">14-Day Badge</div>
              <div className="h-2 bg-white/20 rounded-full mt-3 overflow-hidden">
                <div className="h-full bg-gradient-to-r from-achievement to-streak rounded-full transition-all duration-500" style={{ width: '85%' }} />
              </div>
              <div className="text-xs text-white/60 mt-2">2 days away</div>
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
                {completedCount}/{todaysTasks.length}
              </div>
              <span className="text-muted-foreground/50">•</span>
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

          <div className="space-y-4">
            {todaysTasks.map((task) => {
              const isSaver = isDanger && task.id === streakSaverTask?.id;

              return (
                <div
                  key={task.id}
                  className={`group relative flex items-center gap-5 p-5 rounded-2xl border transition-all duration-300 ${task.completed
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
                    className={`w-10 h-10 rounded-xl border-2 flex items-center justify-center transition-all duration-300 ${task.completed
                      ? 'bg-success border-success scale-110'
                      : isSaver
                        ? 'border-streak text-streak hover:bg-streak hover:text-white animate-pulse'
                        : 'border-muted-foreground/30 group-hover:border-primary group-hover:text-primary'
                      }`}
                  >
                    {task.completed ? <Check className="w-5 h-5 text-white" /> : isSaver && <Flame className="w-5 h-5" />}
                  </button>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-3">
                      <p className={`font-bold text-lg ${task.completed ? 'line-through decoration-success/50 text-muted-foreground' : 'text-foreground'
                        }`}>
                        {task.title}
                      </p>
                      {task.completed && (
                        <span className="flex items-center gap-1 text-xs font-bold text-success bg-success/10 px-2 py-0.5 rounded-full">
                          <Check className="w-3 h-3" /> Done
                        </span>
                      )}
                    </div>
                    <div className="flex items-center gap-3 mt-2">
                      <span className={`text-[10px] uppercase tracking-wider font-bold px-2 py-1 rounded-md border ${categoryColors[task.category]}`}>
                        {task.category}
                      </span>

                      <div className={`flex items-center gap-1.5 text-xs font-medium ${isSaver ? 'text-streak' : 'text-muted-foreground'
                        }`}>
                        <Clock className="w-3.5 h-3.5" />
                        {task.time}
                      </div>

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
        </div>

        {/* Right Column - Contextual / Motivation */}
        <div className="space-y-6">
          {/* Active Goals / Context */}
          <div className="bg-card border border-border rounded-3xl p-6">
            <div className="flex items-center gap-3 mb-6">
              <div className="p-3 bg-primary/10 rounded-xl text-primary">
                <Target className="w-6 h-6" />
              </div>
              <div>
                <h3 className="font-bold text-foreground">Active Goals</h3>
                <p className="text-xs text-muted-foreground">Track your progress</p>
              </div>
            </div>

            <div className="space-y-4">
              <div className="flex items-center gap-3 p-4 rounded-xl bg-primary/5 border border-primary/10 hover:border-primary/30 transition-colors cursor-pointer group">
                <div className="w-12 h-12 rounded-xl bg-primary/20 text-primary flex items-center justify-center font-black text-sm">FE</div>
                <div className="flex-1">
                  <p className="font-bold text-sm text-foreground">Frontend Mastery</p>
                  <p className="text-xs text-muted-foreground mt-0.5">75% complete</p>
                  <div className="h-2 bg-secondary rounded-full mt-2 overflow-hidden">
                    <div className="h-full bg-gradient-to-r from-primary to-success rounded-full w-3/4 group-hover:w-[78%] transition-all" />
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-3 p-4 rounded-xl bg-energy/5 border border-energy/10 hover:border-energy/30 transition-colors cursor-pointer group">
                <div className="w-12 h-12 rounded-xl bg-energy/20 text-energy flex items-center justify-center font-black text-sm">FIT</div>
                <div className="flex-1">
                  <p className="font-bold text-sm text-foreground">Summer Fitness</p>
                  <p className="text-xs text-muted-foreground mt-0.5">33% complete</p>
                  <div className="h-2 bg-secondary rounded-full mt-2 overflow-hidden">
                    <div className="h-full bg-gradient-to-r from-energy to-streak rounded-full w-1/3 group-hover:w-[36%] transition-all" />
                  </div>
                </div>
              </div>
            </div>

            <button className="w-full mt-6 py-4 border-2 border-dashed border-primary/30 rounded-xl text-xs font-bold uppercase tracking-widest text-primary hover:bg-primary/5 hover:border-primary transition-all">
              + Add New Goal
            </button>
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
