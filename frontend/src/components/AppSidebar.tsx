import { Link, useLocation, useNavigate } from 'react-router-dom';
import {
  LayoutDashboard,
  CheckSquare,
  MessageSquare,
  Users,
  Trophy,
  User,
  LogOut,
  Flame,
  Sun,
  Moon
} from 'lucide-react';
import { useTheme } from '../context/ThemeContext';

const navigation = [
  { name: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
  { name: 'Tasks', href: '/tasks', icon: CheckSquare },
  { name: 'Social', href: '/social', icon: MessageSquare },
  { name: 'Groups', href: '/groups', icon: Users },
  { name: 'Leaderboard', href: '/leaderboard', icon: Trophy },
  { name: 'Profile', href: '/profile', icon: User },
];

export default function AppSidebar() {
  const location = useLocation();
  const navigate = useNavigate();
  const { theme, toggleTheme } = useTheme();

  const handleSignOut = () => {
    // TODO: Add actual sign out logic
    navigate('/');
  };

  return (
    <aside className="w-64 bg-card border-r border-border flex flex-col h-screen sticky top-0">
      {/* Logo */}
      <div className="p-6">
        <Link to="/dashboard" className="flex items-center gap-2">
          <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
            <Flame className="w-5 h-5 text-primary-foreground" />
          </div>
          <span className="text-xl font-semibold text-foreground">Streaks</span>
        </Link>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-3">
        <ul className="space-y-1">
          {navigation.map((item) => {
            const isActive = location.pathname === item.href;
            return (
              <li key={item.name}>
                <Link
                  to={item.href}
                  className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                    isActive
                      ? 'bg-primary text-primary-foreground'
                      : 'text-muted-foreground hover:text-foreground hover:bg-accent'
                  }`}
                >
                  <item.icon className="w-5 h-5" />
                  {item.name}
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>

      {/* Theme Toggle */}
      <div className="px-3 py-2">
        <button
          onClick={toggleTheme}
          className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-accent w-full transition-colors"
        >
          {theme === 'dark' ? (
            <>
              <Sun className="w-5 h-5" />
              Light Mode
            </>
          ) : (
            <>
              <Moon className="w-5 h-5" />
              Dark Mode
            </>
          )}
        </button>
      </div>

      {/* User Profile */}
      <div className="p-3 border-t border-border">
        <div className="flex items-center gap-3 px-3 py-2">
          <div className="w-10 h-10 rounded-full bg-primary flex items-center justify-center text-primary-foreground font-semibold">
            JD
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-foreground truncate">John Doe</p>
            <p className="text-xs text-muted-foreground truncate">john@example.com</p>
          </div>
        </div>
        <button
          onClick={handleSignOut}
          className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-accent w-full transition-colors mt-1"
        >
          <LogOut className="w-5 h-5" />
          Sign out
        </button>
      </div>
    </aside>
  );
}
