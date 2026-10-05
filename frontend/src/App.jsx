import { useEffect, useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import LandingPage from './pages/LandingPage';
import AssessmentWorkspace from './pages/AssessmentWorkspace';
import SignInPage from './pages/auth/SignInPage';
import SignUpPage from './pages/auth/SignUpPage';
import UserDashboardPage from './pages/dashboard/UserDashboardPage';
import AdminOverviewPage from './pages/admin/AdminOverviewPage';
import AdminUsersPage from './pages/admin/AdminUsersPage';
import AdminAssessmentsPage from './pages/admin/AdminAssessmentsPage';
import AdminAIModulesPage from './pages/admin/AdminAIModulesPage';
import AdminSettingsPage from './pages/admin/AdminSettingsPage';
import AdminComingSoonPage from './pages/admin/AdminComingSoonPage';
import { clearAuthToken, fetchCurrentUser, getAuthToken } from './lib/api';
import { clearUserProfile, saveUserProfile } from './lib/userProfile';

function ProtectedRoute({ children, adminOnly = false }) {
  const [state, setState] = useState({
    loading: Boolean(getAuthToken()),
    user: null,
    error: '',
  });

  useEffect(() => {
    let cancelled = false;

    async function loadUser() {
      if (!getAuthToken()) {
        setState({ loading: false, user: null, error: '' });
        return;
      }

      try {
        const user = await fetchCurrentUser();
        if (!cancelled) {
          saveUserProfile({
            name: user.name,
            email: user.email,
            picture: user.profile_picture,
          });
          setState({ loading: false, user, error: '' });
        }
      } catch (err) {
        if (!cancelled) {
          clearAuthToken();
          clearUserProfile();
          setState({ loading: false, user: null, error: err.message });
        }
      }
    }

    loadUser();

    return () => {
      cancelled = true;
    };
  }, []);

  if (state.loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-50 text-sm font-semibold text-slate-500">
        Loading your MindSense session...
      </div>
    );
  }

  if (!state.user) {
    return <Navigate to="/login" replace />;
  }

  if (adminOnly && !state.user.is_superuser) {
    return <Navigate to="/dashboard" replace />;
  }

  return children;
}

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<AssessmentWorkspace />} />
        <Route path="/landing" element={<LandingPage />} />
        <Route path="/login" element={<SignInPage />} />
        <Route path="/register" element={<SignUpPage />} />
        <Route path="/dashboard/*" element={<ProtectedRoute><UserDashboardPage /></ProtectedRoute>} />
        <Route path="/assessment" element={<Navigate to="/dashboard" replace />} />

        {/* Admin Routes */}
        <Route path="/admin" element={<ProtectedRoute adminOnly><AdminOverviewPage /></ProtectedRoute>} />
        <Route path="/admin/overview" element={<ProtectedRoute adminOnly><AdminOverviewPage /></ProtectedRoute>} />
        <Route path="/admin/users" element={<ProtectedRoute adminOnly><AdminUsersPage /></ProtectedRoute>} />
        <Route path="/admin/assessments" element={<ProtectedRoute adminOnly><AdminAssessmentsPage /></ProtectedRoute>} />
        <Route path="/admin/ai-modules" element={<ProtectedRoute adminOnly><AdminAIModulesPage /></ProtectedRoute>} />
        <Route path="/admin/questionnaires" element={<ProtectedRoute adminOnly><AdminComingSoonPage title="Questionnaires" /></ProtectedRoute>} />
        <Route path="/admin/content" element={<ProtectedRoute adminOnly><AdminComingSoonPage title="Wellness Content" /></ProtectedRoute>} />
        <Route path="/admin/recommendations" element={<ProtectedRoute adminOnly><AdminComingSoonPage title="Recommendations" /></ProtectedRoute>} />
        <Route path="/admin/reports" element={<ProtectedRoute adminOnly><AdminComingSoonPage title="Reports" /></ProtectedRoute>} />
        <Route path="/admin/logs" element={<ProtectedRoute adminOnly><AdminComingSoonPage title="System Logs" /></ProtectedRoute>} />
        <Route path="/admin/management" element={<ProtectedRoute adminOnly><AdminComingSoonPage title="Admin Management" /></ProtectedRoute>} />
        <Route path="/admin/profile" element={<ProtectedRoute adminOnly><AdminComingSoonPage title="Admin Profile" /></ProtectedRoute>} />
        <Route path="/admin/settings" element={<ProtectedRoute adminOnly><AdminSettingsPage /></ProtectedRoute>} />
      </Routes>
    </Router>
  );
}

export default App;
