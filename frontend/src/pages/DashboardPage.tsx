import { Flame, Target, Clock, Check, TrendingUp } from 'lucide-react';

// Mock data
const todaysTasks = [
  { id: 1, title: 'Morning workout', time: '7:00 AM', category: 'Health', completed: true },
  { id: 2, title: 'Read for 30 minutes', time: '9:00 AM', category: 'Learning', completed: true },
  { id: 3, title: 'Work on side project', time: '2:00 PM', category: 'Career', completed: false },
  { id: 4, title: 'Meditate', time: '6:00 PM', category: 'Wellness', completed: false },
  { id: 5, title: 'Practice guitar', time: '8:00 PM', category: 'Hobbies', completed: false },
];

const categoryColors: Record<string, string> = {
  Health: 'bg-green-500/10 text-green-500',
  Learning: 'bg-blue-500/10 text-blue-500',
  Career: 'bg-purple-500/10 text-purple-500',
  Wellness: 'bg-pink-500/10 text-pink-500',
  Hobbies: 'bg-orange-500/10 text-orange-500',
};

export default function DashboardPage() {
  const completedCount = todaysTasks.filter(t => t.completed).length;
  const progress = (completedCount / todaysTasks.length) * 100;

  // Mock "Danger" state for the demo feel
  const isDanger = true;
  const streakSaverTask = todaysTasks.find(t => !t.completed);

  return (
    <div className="p-4 lg:p-6 max-w-7xl mx-auto space-y-8">
      {/* Hero Section - The "Hero" Streak Visualization */}
      <div className={`relative overflow-hidden rounded-3xl p-8 lg:p-12 text-white shadow-2xl animate-fadeIn transition-colors duration-1000 ${isDanger ? 'bg-gradient-to-br from-red-600 via-red-950 to-black' : 'bg-gradient-to-br from-orange-600 via-red-600 to-purple-700'
        }`}>

        {/* Noise Texture Overlay */}
        <div className="absolute inset-0 bg-noise mix-blend-overlay opacity-20 pointer-events-none z-0" />

        {/* Abstract Background Shapes */}
        <div className="absolute top-0 right-0 -mt-20 -mr-20 w-96 h-96 bg-white/10 rounded-full blur-3xl animate-breathe z-0" />
        <div className={`absolute bottom-0 left-0 -mb-20 -ml-20 w-64 h-64 rounded-full blur-3xl animate-float z-0 ${isDanger ? 'bg-red-500/20' : 'bg-yellow-500/20'
          }`} />

        <div className="relative z-10 flex flex-col items-center text-center gap-2">
          <div className="flex items-center gap-2 mb-2 text-white/80 uppercase tracking-[0.2em] text-xs font-bold">
            <Flame className={`w-4 h-4 ${isDanger ? 'text-red-500 animate-pulse' : ''}`} />
            {isDanger ? 'Streak At Risk' : 'Current Streak'}
          </div>

          <h1 className="text-8xl lg:text-[10rem] font-black tracking-tighter leading-none relative">
            <span className="relative z-10">12</span>
            {/* Glitch/Shadow effect for number */}
            <span className="absolute top-1 left-1 text-black/20 z-0 blur-sm">12</span>
          </h1>

          <div className="text-2xl lg:text-3xl font-bold tracking-tight opacity-90 uppercase">
            DAYS
          </div>

          <p className="mt-6 text-lg text-white/80 max-w-md font-medium leading-relaxed">
            {isDanger
              ? "You haven't extended your streak yet. The clock is ticking."
              : "You're on fire! 🔥 Keep it up to reach your 14-day milestone badge."}
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Streak Survival - Asymmetric Main Column */}
        <div className="col-span-1 lg:col-span-2 space-y-8">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-black text-foreground uppercase tracking-tight flex items-center gap-2">
              {isDanger && <div className="w-3 h-3 bg-red-500 rounded-full animate-pulse" />}
              Streak Survival
            </h2>
            <div className="text-xs font-mono text-muted-foreground uppercase tracking-widest">
              {Math.round(progress)}% Secure
            </div>
          </div>

          <div className="space-y-4">
            {todaysTasks.map((task) => {
              const isSaver = isDanger && task.id === streakSaverTask?.id;

              return (
                <div
                  key={task.id}
                  className={`group relative flex items-center gap-5 p-6 rounded-2xl border transition-all duration-300 ${task.completed
                    ? 'bg-muted/30 border-transparent opacity-50'
                    : isSaver
                      ? 'bg-background border-red-500/50 shadow-[0_0_30px_-10px_rgba(239,68,68,0.3)] scale-[1.02]'
                      : 'bg-card border-border hover:border-primary/50'
                    }`}
                >
                  {isSaver && (
                    <div className="absolute -top-3 -right-3 bg-red-500 text-white text-[10px] font-black uppercase tracking-widest px-2 py-1 rounded shadow-lg animate-bounce">
                      Streak Saver
                    </div>
                  )}

                  <button
                    className={`w-8 h-8 rounded-xl border-2 flex items-center justify-center transition-all ${task.completed
                      ? 'bg-green-500 border-green-500 scale-110'
                      : isSaver
                        ? 'border-red-500 text-red-500 hover:bg-red-500 hover:text-white'
                        : 'border-muted-foreground group-hover:border-primary'
                      }`}
                  >
                    {task.completed ? <Check className="w-5 h-5 text-white" /> : isSaver && <Flame className="w-5 h-5" />}
                  </button>

                  <div className="flex-1 min-w-0">
                    <p className={`font-bold text-xl ${task.completed ? 'line-through decoration-muted-foreground/50' : 'text-foreground'
                      }`}>
                      {task.title}
                    </p>
                    <div className="flex items-center gap-3 mt-2">
                      {/* Category Tag */}
                      <span className={`text-[10px] uppercase tracking-wider font-bold px-2 py-0.5 rounded-sm ${categoryColors[task.category]}`}>
                        {task.category}
                      </span>

                      <div className={`flex items-center gap-1.5 text-xs font-medium ${isSaver ? 'text-red-500' : 'text-muted-foreground'
                        }`}>
                        <Clock className="w-3.5 h-3.5" />
                        {task.time}
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
              </div>
            </div>

            <div className="space-y-4">
              <div className="flex items-center gap-3 p-3 rounded-xl bg-secondary/50 hover:bg-secondary transition-colors cursor-pointer group">
                <div className="w-10 h-10 rounded-lg bg-blue-500/20 text-blue-500 flex items-center justify-center font-bold">FE</div>
                <div className="flex-1">
                  <p className="font-medium text-sm">Frontend Mastery</p>
                  <div className="h-1.5 bg-background rounded-full mt-2 overflow-hidden">
                    <div className="h-full bg-blue-500 w-3/4 group-hover:w-[80%] transition-all" />
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-3 p-3 rounded-xl bg-secondary/50 hover:bg-secondary transition-colors cursor-pointer group">
                <div className="w-10 h-10 rounded-lg bg-pink-500/20 text-pink-500 flex items-center justify-center font-bold">Fit</div>
                <div className="flex-1">
                  <p className="font-medium text-sm">Summer Fitness</p>
                  <div className="h-1.5 bg-background rounded-full mt-2 overflow-hidden">
                    <div className="h-full bg-pink-500 w-1/3 group-hover:w-[35%] transition-all" />
                  </div>
                </div>
              </div>
            </div>

            <button className="w-full mt-6 py-4 border-2 border-dashed border-border rounded-xl text-xs font-bold uppercase tracking-widest text-muted-foreground hover:text-foreground hover:border-foreground transition-all">
              + Add Target
            </button>
          </div>

          {/* Quote / Motivation */}
          <div className="bg-black rounded-3xl p-8 text-white relative overflow-hidden group">
            <div className="absolute inset-0 bg-noise opacity-20 pointer-events-none" />

            <div className="relative z-10">
              <p className="font-serif italic text-xl leading-relaxed opacity-90 group-hover:opacity-100 transition-opacity">
                "Discipline is doing what you hate to do, but doing it like you love it."
              </p>
              <div className="mt-6 flex items-center gap-2 opacity-50 text-[10px] uppercase tracking-[0.25em]">
                <div className="w-8 h-[1px] bg-white" />
                Mike Tyson
              </div>
            </div>
            <TrendingUp className="absolute bottom-4 right-4 w-32 h-32 text-white/5 -rotate-12 transition-transform group-hover:scale-110 duration-700" />
          </div>
        </div>
      </div>
    </div>
  );
}

