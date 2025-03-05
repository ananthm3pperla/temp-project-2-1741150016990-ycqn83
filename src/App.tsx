import React, { Suspense, lazy } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import { ThemeProvider } from './contexts/ThemeContext';
import { ErrorBoundary } from './components/ErrorBoundary';
import Layout from './components/Layout';
import LoadingState from './components/LoadingState';

// Lazy load all pages for better performance
const Dashboard = lazy(() => import('./pages/Dashboard' /* webpackPrefetch: true */));
const Profile = lazy(() => import('./components/Profile' /* webpackPrefetch: true */));
const Schedule = lazy(() => import('./pages/Schedule' /* webpackPrefetch: true */));
const Team = lazy(() => import('./pages/Team' /* webpackPrefetch: true */));
const Rewards = lazy(() => import('./pages/Rewards' /* webpackPrefetch: true */));
const Feedback = lazy(() => import('./pages/Feedback' /* webpackPrefetch: true */));
const Analytics = lazy(() => import('./pages/Analytics' /* webpackPrefetch: true */));
const Login = lazy(() => import('./pages/Login' /* webpackPrefetch: true */));

const PageLoader = () => (
  <div className="flex items-center justify-center min-h-screen">
    <LoadingState message="Loading page..." />
  </div>
);

function App() {
  return (
    <ErrorBoundary>
      <BrowserRouter>
        <ThemeProvider>
          <AuthProvider>
            <Layout>
              <Suspense fallback={<PageLoader />}>
                <Routes>
                  <Route path="/" element={<Navigate to="/dashboard" replace />} />
                  <Route path="/dashboard" element={<Dashboard />} />
                  <Route path="/profile" element={<Profile />} />
                  <Route path="/profile/:id" element={<Profile />} />
                  <Route path="/schedule" element={<Schedule />} />
                  <Route path="/team" element={<Team />} />
                  <Route path="/rewards" element={<Rewards />} />
                  <Route path="/feedback" element={<Feedback />} />
                  <Route path="/analytics" element={<Analytics />} />
                  <Route path="/login" element={<Login />} />
                  <Route path="*" element={<Navigate to="/dashboard" replace />} />
                </Routes>
              </Suspense>
            </Layout>
          </AuthProvider>
        </ThemeProvider>
      </BrowserRouter>
    </ErrorBoundary>
  );
}

export default App;