import type { ReactNode } from 'react';
import AppSidebar from './AppSidebar';

interface AppLayoutProps {
  children: ReactNode;
}

export default function AppLayout({ children }: AppLayoutProps) {
  return (
    <div className="flex min-h-screen bg-background">
      <AppSidebar />
      <main className="flex-1 overflow-y-auto pb-20 md:pb-0">
        {children}
      </main>
    </div>
  );
}
