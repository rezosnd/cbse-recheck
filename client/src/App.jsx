import { Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { useAuth } from './contexts/AuthContext';

// Pages
import LandingPage from './pages/LandingPage';
import AuthPage from './pages/AuthPage';
import Dashboard from './pages/Dashboard';
import ApplicationForm from './pages/ApplicationForm';
import ApplicationDetail from './pages/ApplicationDetail';
import Messages from './pages/Messages';
import Timer from './pages/Timer';
import AdminDashboard from './pages/admin/AdminDashboard';
import AdminApplications from './pages/admin/AdminApplications';
import AdminApplicationDetail from './pages/admin/AdminApplicationDetail';
import AdminUsers from './pages/admin/AdminUsers';

// Components
import ProtectedRoute from './components/ProtectedRoute';
import AdminRoute from './components/AdminRoute';
import PageLoader from './components/PageLoader';
import CustomCursor from './components/CustomCursor';

const App = () => {
  const { loading, darkMode } = useAuth();

  if (loading) return <PageLoader />;

  return (
    <>
      <CustomCursor />
      <Toaster
        position="top-right"
        toastOptions={{
          duration: 4000,
          style: {
            background: darkMode ? '#1e293b' : '#fff',
            color: darkMode ? '#f1f5f9' : '#0f172a',
            border: darkMode ? '1px solid #334155' : '1px solid #e2e8f0',
            borderRadius: '12px',
            boxShadow: '0 10px 30px rgba(0,0,0,0.15)',
            fontSize: '14px',
            fontWeight: '500',
          },
          success: { iconTheme: { primary: '#10b981', secondary: '#fff' } },
          error: { iconTheme: { primary: '#ef4444', secondary: '#fff' } },
        }}
      />

      <Routes>
        {/* Public */}
        <Route path="/" element={<LandingPage />} />
        <Route path="/auth" element={<AuthPage />} />
        <Route path="/timer" element={<Timer />} />

        {/* Protected Student Routes */}
        <Route element={<ProtectedRoute />}>
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/apply" element={<ApplicationForm />} />
          <Route path="/application/:id" element={<ApplicationDetail />} />
          <Route path="/messages" element={<Messages />} />
        </Route>

        {/* Protected Admin Routes */}
        <Route element={<AdminRoute />}>
          <Route path="/admin" element={<AdminDashboard />} />
          <Route path="/admin/applications" element={<AdminApplications />} />
          <Route path="/admin/applications/:id" element={<AdminApplicationDetail />} />
          <Route path="/admin/users" element={<AdminUsers />} />
        </Route>

        {/* Catch all */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </>
  );
};

export default App;
