import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProvider } from './context/ThemeContext';
import LoginPage from './pages/LoginPage';
import DashboardPage from './pages/DashboardPage';
import TasksPage from './pages/TasksPage';
import SocialFeedPage from './pages/SocialFeedPage';
import CommunitiesPage from './pages/CommunitiesPage';
import LeaderboardPage from './pages/LeaderboardPage';
import ProfilePage from './pages/ProfilePage';
import AppLayout from './components/AppLayout';

function App() {
  return (
    <ThemeProvider>
      <BrowserRouter>
        <Routes>
          {/* Auth routes */}
          <Route path="/" element={<LoginPage />} />

          {/* Protected routes with layout */}
          <Route path="/dashboard" element={
            <AppLayout>
              <DashboardPage />
            </AppLayout>
          } />
          <Route path="/tasks" element={
            <AppLayout>
              <TasksPage />
            </AppLayout>
          } />
          <Route path="/social" element={
            <AppLayout>
              <SocialFeedPage />
            </AppLayout>
          } />
          <Route path="/communities" element={
            <AppLayout>
              <CommunitiesPage />
            </AppLayout>
          } />
          <Route path="/leaderboard" element={
            <AppLayout>
              <LeaderboardPage />
            </AppLayout>
          } />
          <Route path="/profile" element={
            <AppLayout>
              <ProfilePage />
            </AppLayout>
          } />

          {/* Redirect unknown routes to dashboard */}
          <Route path="*" element={<Navigate to="/dashboard" replace />} />
        </Routes>
      </BrowserRouter>
    </ThemeProvider>
  );
}

export default App;
