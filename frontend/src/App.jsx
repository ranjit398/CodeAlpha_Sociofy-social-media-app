import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { Toaster } from 'react-hot-toast';
import ErrorBoundary from './components/ErrorBoundary';
import FeedPage from './pages/Feed/FeedPage';
import ProfilePage from './pages/Profile/ProfilePage';
import ExplorePage from './pages/Explore/ExplorePage';
import AuthPage from './pages/Auth/AuthPage';
import PulseTester from './pages/Tester/index';

function ProtectedRoute({ children }) {
  const { user } = useSelector((s) => s.auth);
  return user ? children : <Navigate to="/auth" replace />;
}

function GuestRoute({ children }) {
  const { user } = useSelector((s) => s.auth);
  return !user ? children : <Navigate to="/" replace />;
}

export default function App() {
  return (
    <ErrorBoundary>
      <BrowserRouter future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
        <div className="noise" />
        <Toaster
          position="top-right"
          toastOptions={{
            style: {
              background: 'var(--bg-3)',
              color: 'var(--text)',
              border: '1px solid var(--border-hover)',
              fontFamily: "'DM Sans', sans-serif",
              fontSize: '14px',
              borderRadius: 'var(--radius-sm)',
            },
            success: { iconTheme: { primary: 'var(--green)', secondary: 'var(--bg-3)' } },
            error: { iconTheme: { primary: 'var(--red)', secondary: 'var(--bg-3)' } },
          }}
        />
        <Routes>
          <Route path="/auth" element={<GuestRoute><AuthPage /></GuestRoute>} />
          <Route path="/" element={<ProtectedRoute><FeedPage /></ProtectedRoute>} />
          <Route path="/explore" element={<ProtectedRoute><ExplorePage /></ProtectedRoute>} />
          <Route path="/profile/:username" element={<ProtectedRoute><ProfilePage /></ProtectedRoute>} />
          <Route path="/tester" element={<PulseTester />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>
    </ErrorBoundary>
  );
}