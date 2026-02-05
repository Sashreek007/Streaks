import { NavLink } from 'react-router-dom';
import {
  LayoutDashboard,
  CheckSquare,
  Users,
  Settings,
  User,
  LogOut,
  Flame
} from 'lucide-react';


const navigation = [
  { name: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
  { name: 'Tasks', href: '/tasks', icon: CheckSquare },
  { name: 'Social', href: '/social', icon: Flame },
  { name: 'Communities', href: '/communities', icon: Users },
  { name: 'Profile', href: '/profile', icon: User },
];

export default function AppSidebar() {
  return (
    <div className="w-20 lg:w-24 h-screen sticky top-0 flex flex-col items-center py-8 border-r border-border/50 bg-background/80 backdrop-blur-xl z-50">
      {/* Logo */}
      <div className="mb-12">
        <div className="w-10 h-10 bg-primary rounded-xl flex items-center justify-center text-primary-foreground font-bold text-xl shadow-lg shadow-primary/25">
          S
        </div>
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
        <button className="flex items-center justify-center p-3 text-muted-foreground hover:bg-secondary hover:text-foreground rounded-2xl transition-colors">
          <Settings className="w-6 h-6" />
        </button>
        <button className="flex items-center justify-center p-3 text-muted-foreground hover:text-red-500 hover:bg-red-500/10 rounded-2xl transition-colors">
          <LogOut className="w-6 h-6" />
        </button>
      </div>
    </div>
  );
}
