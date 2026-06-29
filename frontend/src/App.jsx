import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import DashboardPage from './pages/DashboardPage';
import RepositoryListPage from './pages/RepositoryListPage';
import RepositoryImportPage from './pages/RepositoryImportPage';
import RepositoryFilesPage from './pages/RepositoryFilesPage';
import FileViewerPage from './pages/FileViewerPage';
import SearchPage from './pages/SearchPage';
import AnalyticsDashboardPage from './pages/AnalyticsDashboardPage';
import ProtectedRoute from './components/ProtectedRoute';

function App() {
  return (
    <Router>
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
    </Router>
  );
}

export default App;
