import React, { Suspense } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/Auth';
const LoginPage = React.lazy(() => import('./pages/Login'));
const PageNotFound = React.lazy(() => import('./pages/PageNotFound'));
const DashboardPage = React.lazy(() => import('./pages/DashboardPage'));

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route exact path="/login" element={<Suspense><LoginPage/></Suspense>} />
          <Route exact path="/" element={<Suspense><DashboardPage/></Suspense>} />
          <Route path="*" element={<Suspense><PageNotFound/></Suspense>} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;
