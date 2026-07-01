import React, { Suspense } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import ProtectedRoute from './components/ProtectedRoute';

// Lazy load pages for code splitting
const LoginPage = React.lazy(() => import('./pages/LoginPage'));
const RegisterPage = React.lazy(() => import('./pages/RegisterPage'));
const DashboardPage = React.lazy(() => import('./pages/DashboardPage'));
const RepositoryListPage = React.lazy(() => import('./pages/RepositoryListPage'));
const RepositoryImportPage = React.lazy(() => import('./pages/RepositoryImportPage'));
const RepositoryFilesPage = React.lazy(() => import('./pages/RepositoryFilesPage'));
const FileViewerPage = React.lazy(() => import('./pages/FileViewerPage'));
const SearchPage = React.lazy(() => import('./pages/SearchPage'));
const AnalyticsDashboardPage = React.lazy(() => import('./pages/AnalyticsDashboardPage'));

// Simple loading fallback
const LoadingFallback = () => (
  <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', flexDirection: 'column', gap: '1rem' }}>
    <div className="spinner" style={{ width: '40px', height: '40px', borderWidth: '4px' }}></div>
    <p style={{ color: 'var(--text-muted)' }}>Loading...</p>
  </div>
);

function App() {
  return (
    <Router>
      <Suspense fallback={<LoadingFallback />}>
        <Routes>
          <Route path="/" element={<Navigate to="/login" replace />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          
          {/* Protected Routes for All Authenticated Users */}
          <Route element={<ProtectedRoute />}>
            <Route path="/dashboard" element={<DashboardPage />} />
            <Route path="/search" element={<SearchPage />} />
            <Route path="/files/:id/view" element={<FileViewerPage />} />
            <Route path="/repositories" element={<RepositoryListPage />} />
            <Route path="/repositories/:id/files" element={<RepositoryFilesPage />} />
            <Route path="/repositories/import" element={<RepositoryImportPage />} />
            <Route path="/analytics" element={<AnalyticsDashboardPage />} />
          </Route>
        </Routes>
      </Suspense>
    </Router>
  );
}

export default App;
