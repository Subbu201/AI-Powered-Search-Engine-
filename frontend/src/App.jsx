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

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Navigate to="/login" replace />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/dashboard" element={<DashboardPage />} />
        <Route path="/repositories" element={<RepositoryListPage />} />
        <Route path="/repositories/import" element={<RepositoryImportPage />} />
        <Route path="/repositories/:id/files" element={<RepositoryFilesPage />} />
        <Route path="/files/:id/view" element={<FileViewerPage />} />
        <Route path="/search" element={<SearchPage />} />
      </Routes>
    </Router>
  );
}

export default App;
