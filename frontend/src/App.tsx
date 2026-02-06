import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProvider } from './context/ThemeContext';
import { AuthProvider, RequireAuth } from './context/AuthContext';
import LoginPage from './pages/LoginPage';
import OAuthCallbackPage from './pages/OAuthCallbackPage';
import DashboardPage from './pages/DashboardPage';
import TasksPage from './pages/TasksPage';
import SocialFeedPage from './pages/SocialFeedPage';
import CommunitiesPage from './pages/CommunitiesPage';
import LeaderboardPage from './pages/LeaderboardPage';
import ProfilePage from './pages/ProfilePage';
import FriendsPage from './pages/FriendsPage';
import SettingsPage from './pages/SettingsPage';
import AppLayout from './components/AppLayout';

function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <BrowserRouter>
          <Routes>
            {/* Auth routes */}
            <Route path="/" element={<LoginPage />} />
            <Route path="/oauth/callback" element={<OAuthCallbackPage />} />

            {/* Protected routes with layout */}
            <Route path="/dashboard" element={
              <RequireAuth>
                <AppLayout>
                  <DashboardPage />
                </AppLayout>
              </RequireAuth>
            } />
            <Route path="/tasks" element={
              <RequireAuth>
                <AppLayout>
                  <TasksPage />
                </AppLayout>
              </RequireAuth>
            } />
            <Route path="/social" element={
              <RequireAuth>
                <AppLayout>
                  <SocialFeedPage />
                </AppLayout>
              </RequireAuth>
            } />
            <Route path="/communities" element={
              <RequireAuth>
                <AppLayout>
                  <CommunitiesPage />
                </AppLayout>
              </RequireAuth>
            } />
            <Route path="/leaderboard" element={
              <RequireAuth>
                <AppLayout>
                  <LeaderboardPage />
                </AppLayout>
              </RequireAuth>
            } />
            <Route path="/friends" element={
              <RequireAuth>
                <AppLayout>
                  <FriendsPage />
                </AppLayout>
              </RequireAuth>
            } />
            <Route path="/profile" element={
              <RequireAuth>
                <AppLayout>
                  <ProfilePage />
                </AppLayout>
              </RequireAuth>
            } />
            <Route path="/settings" element={
              <RequireAuth>
                <AppLayout>
                  <SettingsPage />
                </AppLayout>
              </RequireAuth>
            } />

            {/* Redirect unknown routes to dashboard */}
            <Route path="*" element={<Navigate to="/dashboard" replace />} />
          </Routes>
        </BrowserRouter>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;
