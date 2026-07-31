import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import LandingPage from './pages/LandingPage';
import SignInPage from './pages/auth/SignInPage';
import SignUpPage from './pages/auth/SignUpPage';
import UserDashboardPage from './pages/dashboard/UserDashboardPage';
import AdminOverviewPage from './pages/admin/AdminOverviewPage';
import AdminUsersPage from './pages/admin/AdminUsersPage';
import AdminAssessmentsPage from './pages/admin/AdminAssessmentsPage';
import AdminAIModulesPage from './pages/admin/AdminAIModulesPage';
import AdminSettingsPage from './pages/admin/AdminSettingsPage';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={<SignInPage />} />
        <Route path="/register" element={<SignUpPage />} />
        <Route path="/dashboard/*" element={<UserDashboardPage />} />
        <Route path="/assessment" element={<div className="p-20 text-slate-900">Assessment Setup Placeholder</div>} />

        {/* Admin Routes */}
        <Route path="/admin" element={<AdminOverviewPage />} />
        <Route path="/admin/overview" element={<AdminOverviewPage />} />
        <Route path="/admin/users" element={<AdminUsersPage />} />
        <Route path="/admin/assessments" element={<AdminAssessmentsPage />} />
        <Route path="/admin/ai-modules" element={<AdminAIModulesPage />} />
        <Route path="/admin/settings" element={<AdminSettingsPage />} />
      </Routes>
    </Router>
  );
}

export default App;
