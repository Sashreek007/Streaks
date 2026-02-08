import { NavLink, useNavigate } from 'react-router-dom';
import {
  LayoutDashboard,
  CheckSquare,
  Users,
  Settings,
  User,
  LogOut,
  Flame,
  Trophy,
  UserPlus
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import UserSearch from './UserSearch';


const navigation = [
  { name: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
  { name: 'Tasks', href: '/tasks', icon: CheckSquare },
  { name: 'Social', href: '/social', icon: Flame },
  { name: 'Friends', href: '/friends', icon: UserPlus },
  { name: 'Communities', href: '/communities', icon: Users },
  { name: 'Leaderboard', href: '/leaderboard', icon: Trophy },
  { name: 'Profile', href: '/profile', icon: User },
];

// Mobile bottom nav - subset of main navigation
const mobileNavigation = [
  { name: 'Home', href: '/dashboard', icon: LayoutDashboard },
  { name: 'Tasks', href: '/tasks', icon: CheckSquare },
  { name: 'Social', href: '/social', icon: Flame },
  { name: 'Rank', href: '/leaderboard', icon: Trophy },
  { name: 'Profile', href: '/profile', icon: User },
];

export default function AppSidebar() {
  const navigate = useNavigate();
  const { logout } = useAuth();

  const handleLogout = async () => {
    await logout();
    navigate('/');
  };

  return (
    <>
      {/* Desktop Sidebar - Hidden on mobile */}
      <div className="hidden md:flex w-20 lg:w-24 h-screen sticky top-0 flex-col items-center py-8 border-r border-border/50 bg-background/80 backdrop-blur-xl z-50">
        {/* Logo */}
        <div className="mb-12">
          <div className="w-10 h-10 bg-primary rounded-xl flex items-center justify-center text-primary-foreground font-bold text-xl shadow-lg shadow-primary/25">
            S
          </div>
        </div>

        {/* Search */}
        <div className="mb-4 w-full px-4">
          <UserSearch />
        </div>

        {/* Navigation */}
        <nav className="flex-1 flex flex-col gap-4 w-full px-4">
          {navigation.map((item) => (
            <NavLink
              key={item.name}
              to={item.href}
              title={item.name}
              className={({ isActive }) =>
                `relative group flex items-center justify-center p-3 rounded-2xl transition-all duration-300 ${isActive
                  ? 'bg-primary text-primary-foreground shadow-md shadow-primary/20 scale-110'
                  : 'text-muted-foreground hover:bg-secondary hover:text-foreground'
                }`
              }
            >
              <item.icon className="w-6 h-6" />

              {/* Tooltip */}
              <div className="absolute left-full ml-4 px-2 py-1 bg-popover text-popover-foreground text-xs font-medium rounded-lg opacity-0 -translate-x-2 pointer-events-none group-hover:opacity-100 group-hover:translate-x-0 transition-all whitespace-nowrap border border-border shadow-lg z-50">
                {item.name}
              </div>
            </NavLink>
          ))}
        </nav>

        {/* Bottom Actions */}
        <div className="flex flex-col gap-4 w-full px-4">
          <NavLink
            to="/settings"
            title="Settings"
            className={({ isActive }) =>
              `relative group flex items-center justify-center p-3 rounded-2xl transition-all duration-300 ${isActive
                ? 'bg-primary text-primary-foreground shadow-md shadow-primary/20 scale-110'
                : 'text-muted-foreground hover:bg-secondary hover:text-foreground'
              }`
            }
          >
            <Settings className="w-6 h-6" />
            {/* Tooltip */}
            <div className="absolute left-full ml-4 px-2 py-1 bg-popover text-popover-foreground text-xs font-medium rounded-lg opacity-0 -translate-x-2 pointer-events-none group-hover:opacity-100 group-hover:translate-x-0 transition-all whitespace-nowrap border border-border shadow-lg z-50">
              Settings
            </div>
          </NavLink>
          <button
            onClick={handleLogout}
            title="Log out"
            className="relative group flex items-center justify-center p-3 text-muted-foreground hover:text-red-500 hover:bg-red-500/10 rounded-2xl transition-colors"
          >
            <LogOut className="w-6 h-6" />
            {/* Tooltip */}
            <div className="absolute left-full ml-4 px-2 py-1 bg-popover text-popover-foreground text-xs font-medium rounded-lg opacity-0 -translate-x-2 pointer-events-none group-hover:opacity-100 group-hover:translate-x-0 transition-all whitespace-nowrap border border-border shadow-lg z-50">
              Log out
            </div>
          </button>
        </div>
      </div>

      {/* Mobile Bottom Navigation - Visible only on mobile */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 bg-background/95 backdrop-blur-xl border-t border-border/50 z-50 safe-area-inset-bottom">
        <nav className="flex items-center justify-around px-2 py-2">
          {mobileNavigation.slice(0, 2).map((item) => (
            <NavLink
              key={item.name}
              to={item.href}
              className={({ isActive }) =>
                `flex flex-col items-center gap-1 p-2 rounded-xl transition-all ${isActive
                  ? 'text-primary'
                  : 'text-muted-foreground'
                }`
              }
            >
              {({ isActive }) => (
                <>
                  <div className={`p-2 rounded-xl transition-all ${isActive ? 'bg-primary/10' : ''}`}>
                    <item.icon className="w-5 h-5" />
                  </div>
                  <span className="text-[10px] font-medium">{item.name}</span>
                </>
              )}
            </NavLink>
          ))}

          {/* Mobile Search */}
          <UserSearch isMobile />

          {mobileNavigation.slice(2).map((item) => (
            <NavLink
              key={item.name}
              to={item.href}
              className={({ isActive }) =>
                `flex flex-col items-center gap-1 p-2 rounded-xl transition-all ${isActive
                  ? 'text-primary'
                  : 'text-muted-foreground'
                }`
              }
            >
              {({ isActive }) => (
                <>
                  <div className={`p-2 rounded-xl transition-all ${isActive ? 'bg-primary/10' : ''}`}>
                    <item.icon className="w-5 h-5" />
                  </div>
                  <span className="text-[10px] font-medium">{item.name}</span>
                </>
              )}
            </NavLink>
          ))}
        </nav>
      </div>
    </>
  );
}
