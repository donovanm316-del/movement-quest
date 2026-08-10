import type { ReactNode } from 'react';
import { Navigate, Route, HashRouter, Routes } from 'react-router-dom';
import { ProfileProvider, useProfile } from './lib/ProfileContext';
import { Landing } from './pages/Landing';
import { Onboarding } from './pages/Onboarding';
import { RevealRank } from './pages/RevealRank';
import { Dashboard } from './pages/Dashboard';
import { Quests } from './pages/Quests';
import { Ranks } from './pages/Ranks';
import { QuestDetail } from './pages/QuestDetail';
import { Progress } from './pages/Progress';
import { Profile } from './pages/Profile';

function RequireProfile({ children }: { children: ReactNode }) {
  const { profile } = useProfile();
  if (!profile) return <Navigate to="/" replace />;
  return <>{children}</>;
}

function RequireOnboarded({ children }: { children: ReactNode }) {
  const { profile } = useProfile();
  if (!profile) return <Navigate to="/" replace />;
  if (!profile.onboarding) return <Navigate to="/onboarding" replace />;
  return <>{children}</>;
}

function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<Landing />} />
      <Route
        path="/onboarding"
        element={
          <RequireProfile>
            <Onboarding />
          </RequireProfile>
        }
      />
      <Route
        path="/reveal"
        element={
          <RequireOnboarded>
            <RevealRank />
          </RequireOnboarded>
        }
      />
      <Route
        path="/dashboard"
        element={
          <RequireOnboarded>
            <Dashboard />
          </RequireOnboarded>
        }
      />
      <Route
        path="/quests"
        element={
          <RequireOnboarded>
            <Quests />
          </RequireOnboarded>
        }
      />
      <Route
        path="/quest/:questId"
        element={
          <RequireOnboarded>
            <QuestDetail />
          </RequireOnboarded>
        }
      />
      <Route
        path="/ranks"
        element={
          <RequireOnboarded>
            <Ranks />
          </RequireOnboarded>
        }
      />
      <Route
        path="/progress"
        element={
          <RequireOnboarded>
            <Progress />
          </RequireOnboarded>
        }
      />
      <Route
        path="/profile"
        element={
          <RequireOnboarded>
            <Profile />
          </RequireOnboarded>
        }
      />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

function App() {
  return (
    <ProfileProvider>
      <HashRouter>
        <AppRoutes />
      </HashRouter>
    </ProfileProvider>
  );
}

export default App;
