import React, { Suspense, startTransition } from 'react';
import { BrowserRouter as Router, Routes, Route, useNavigate } from 'react-router-dom';
import { AuthProvider } from './context/Auth';
import { ToastProvider } from './context/Toast';

const LogoutPage = React.lazy(() => import('./pages/Logout'));
const UserProfilePage = React.lazy(() => import('./pages/UserProfilePage'));
const LoginPage = React.lazy(() => import('./pages/Login'));
const NotFoundPage = React.lazy(() => import('./pages/PageNotFound'));
const DashboardPage = React.lazy(() => import('./pages/DashboardPage'));
const ResetPasswordPage = React.lazy(() => import('./pages/ResetPasswordPage'));

function App() {
  return (
    <ToastProvider>
      <Router>
        <AuthProvider>
          <Suspense fallback={<div>Loading...</div>}>
            <Routes>
              <Route path="/login" element={<LoginPage />} />
              <Route path="/logout" element={<LogoutPage />} />
              <Route path="/reset-password/:token?" element={<ResetPasswordPage />} />
              <Route path="/user-profile" element={<UserProfilePage />} />
              <Route path="/" element={<DashboardPage />} />
              <Route path="/app" element={<DashboardPage />} />
              <Route path="*" element={<NotFoundPage />} />
            </Routes>
          </Suspense>
        </AuthProvider>
      </Router>
    </ToastProvider>
  );
}

export default App;
