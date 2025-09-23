import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { NotificationProvider } from './contexts/NotificationContext';
import { Layout } from './components/Layout/Layout';
import { LoginPage } from './components/Auth/LoginPage';
import { RegisterPage } from './components/Auth/RegisterPage';
import { UserDashboard } from './components/Dashboard/UserDashboard';
import { AdminDashboard } from './components/Admin/AdminDashboard';
import { ApplicationManagement } from './components/Admin/ApplicationManagement';
import { CompanyManagement } from './components/Admin/CompanyManagement';
import { UserManagement } from './components/Admin/UserManagement';
import { Reports } from './components/Admin/Reports';
import { AdminSettings } from './components/Admin/AdminSettings';
import { RegistrationForm } from './components/Registration/RegistrationForm';
import { StatusPage } from './components/Status/StatusPage';
import { SettingsPage } from './components/Settings/SettingsPage';





const ProtectedRoute: React.FC<{ children: React.ReactNode; adminOnly?: boolean }> = ({ 
  children, 
  adminOnly = false 
}) => {
  const { isAuthenticated, user } = useAuth();
  
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }
  
  if (adminOnly && user?.role !== 'ADMIN') {
    return <Navigate to="/dashboard" replace />;
  }
  
  return <>{children}</>;
};

const AppRoutes: React.FC = () => {
  const { isAuthenticated, user } = useAuth();

  if (!isAuthenticated) {
    return (
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    );
  }

  const defaultRoute = user?.role === 'ADMIN' ? '/admin' : '/dashboard';

  return (
    <Routes>
      <Route path="/" element={<Navigate to={defaultRoute} replace />} />
      
      {/* User Routes */}
      <Route 
        path="/dashboard" 
        element={
          <ProtectedRoute>
            <UserDashboard />
          </ProtectedRoute>
        } 
      />
      <Route 
        path="/register" 
        element={
          <ProtectedRoute>
            <RegistrationForm />
          </ProtectedRoute>
        } 
      />
      <Route
        path="/status"
        element={
          <ProtectedRoute>
            <StatusPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/settings"
        element={
          <ProtectedRoute>
            <SettingsPage />
          </ProtectedRoute>
        }
      />

      {/* Admin Routes */}
      <Route 
        path="/admin" 
        element={
          <ProtectedRoute adminOnly>
            <AdminDashboard />
          </ProtectedRoute>
        } 
      />
      <Route
        path="/admin/applications"
        element={
          <ProtectedRoute adminOnly>
            <ApplicationManagement />
          </ProtectedRoute>
        }
      />
      <Route
        path="/admin/companies"
        element={
          <ProtectedRoute adminOnly>
            <CompanyManagement />
          </ProtectedRoute>
        }
      />
      <Route
        path="/admin/users"
        element={
          <ProtectedRoute adminOnly>
            <UserManagement />
          </ProtectedRoute>
        }
      />
      <Route
        path="/admin/reports"
        element={
          <ProtectedRoute adminOnly>
            <Reports />
          </ProtectedRoute>
        }
      />
      <Route
        path="/admin/settings"
        element={
          <ProtectedRoute adminOnly>
            <AdminSettings />
          </ProtectedRoute>
        }
      />

      <Route path="*" element={<Navigate to={defaultRoute} replace />} />
    </Routes>
  );
};

function App() {
  return (
    <AuthProvider>
      <NotificationProvider>
        <Router>
          <Layout>
            <AppRoutes />
          </Layout>
        </Router>
      </NotificationProvider>
    </AuthProvider>
  );
}

export default App;