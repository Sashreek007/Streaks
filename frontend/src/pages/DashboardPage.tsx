import { Flame, CheckCircle2, TrendingUp, Target, Plus, Clock, Check } from 'lucide-react';

// Mock data
const stats = [
  { label: 'Current Streak', value: '12', unit: 'days', icon: Flame, color: 'text-orange-500' },
  { label: 'Tasks Completed', value: '47', unit: 'this week', icon: CheckCircle2, color: 'text-green-500' },
  { label: 'Success Rate', value: '94', unit: '%', icon: TrendingUp, color: 'text-pink-500' },
  { label: 'Active Goals', value: '8', unit: 'goals', icon: Target, color: 'text-yellow-500' },
];

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

  return (
    <div className="p-6 lg:p-8 max-w-6xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-2xl lg:text-3xl font-bold text-foreground">
          Welcome back, John! <span className="wave">👋</span>
        </h1>
        <p className="text-muted-foreground mt-1">Here's your progress today</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {stats.map((stat) => (
          <div
            key={stat.label}
            className="bg-card border border-border rounded-xl p-4 lg:p-5"
          >
            <div className="flex items-center justify-between mb-3">
              <span className="text-sm text-muted-foreground">{stat.label}</span>
              <stat.icon className={`w-5 h-5 ${stat.color}`} />
            </div>
            <div className="flex items-baseline gap-1">
              <span className="text-2xl lg:text-3xl font-bold text-foreground">{stat.value}</span>
              <span className="text-sm text-muted-foreground">{stat.unit}</span>
            </div>
          </div>
        ))}
      </div>

      {/* Today's Tasks */}
      <div className="bg-card border border-border rounded-xl p-5 lg:p-6 mb-8">
        <div className="flex items-center justify-between mb-5">
          <div>
            <h2 className="text-lg font-semibold text-foreground">Today's Tasks</h2>
            <p className="text-sm text-muted-foreground">{completedCount} of {todaysTasks.length} completed</p>
          </div>
          <button className="flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-lg text-sm font-medium hover:bg-primary/90 transition-colors">
            <Plus className="w-4 h-4" />
            Add Task
          </button>
        </div>

        <div className="space-y-3">
          {todaysTasks.map((task) => (
            <div
              key={task.id}
              className={`flex items-center gap-4 p-4 rounded-lg border transition-colors ${
                task.completed
                  ? 'bg-muted/30 border-border'
                  : 'bg-background border-border hover:border-primary/50'
              }`}
            >
              <button
                className={`w-6 h-6 rounded-full border-2 flex items-center justify-center transition-colors ${
                  task.completed
                    ? 'bg-primary border-primary'
                    : 'border-muted-foreground hover:border-primary'
                }`}
              >
                {task.completed && <Check className="w-4 h-4 text-primary-foreground" />}
              </button>

              <div className="flex-1 min-w-0">
                <p className={`font-medium ${task.completed ? 'text-muted-foreground line-through' : 'text-foreground'}`}>
                  {task.title}
                </p>
                <div className="flex items-center gap-2 mt-1">
                  <Clock className="w-3.5 h-3.5 text-muted-foreground" />
                  <span className="text-xs text-muted-foreground">{task.time}</span>
                  <span className={`text-xs px-2 py-0.5 rounded-full ${categoryColors[task.category]}`}>
                    {task.category}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Weekly Overview */}
      <div className="bg-card border border-border rounded-xl p-5 lg:p-6">
        <h2 className="text-lg font-semibold text-foreground mb-5">Weekly Overview</h2>
        <div className="grid grid-cols-7 gap-2">
          {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map((day, index) => {
            const isToday = index === 3; // Thursday for demo
            const completionRate = [80, 100, 60, 40, 0, 0, 0][index];
            return (
              <div key={day} className="text-center">
                <span className={`text-xs ${isToday ? 'text-primary font-medium' : 'text-muted-foreground'}`}>
                  {day}
                </span>
                <div
                  className={`mt-2 h-20 rounded-lg ${
                    isToday ? 'ring-2 ring-primary' : ''
                  }`}
                  style={{
                    background: completionRate > 0
                      ? `linear-gradient(to top, hsl(var(--primary) / ${completionRate / 100}) ${completionRate}%, hsl(var(--muted)) ${completionRate}%)`
                      : 'hsl(var(--muted))',
                  }}
                />
                <span className="text-xs text-muted-foreground mt-1 block">{completionRate}%</span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
