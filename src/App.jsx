import React, { Suspense } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/Auth';
import { ToastProvider } from './context/Toast';
const LoginPage = React.lazy(() => import('./pages/Login'));
const NotFoundPage = React.lazy(() => import('./pages/PageNotFound'));
const DashboardPage = React.lazy(() => import('./pages/DashboardPage'));
const ResetPasswordPage = React.lazy(() => import('./pages/ResetPasswordPage'));

function App() {
  return (
    <ToastProvider>
      <Router>
        <AuthProvider>
          <Routes>
            <Route exact path="/login" Component={LoginPage}/>
            <Route exact path="/reset-password/:token?" Component={ResetPasswordPage} />
            <Route exact path="/" Component={DashboardPage} />
            <Route path="*" Component={NotFoundPage} />
          </Routes>
        </AuthProvider>
      </Router>
    </ToastProvider>
  );
}

export default App;
