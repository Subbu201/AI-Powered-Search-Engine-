import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import DashboardPage from './pages/DashboardPage';
import RepositoryListPage from './pages/RepositoryListPage';
import RepositoryFormPage from './pages/RepositoryFormPage';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Navigate to="/login" replace />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/dashboard" element={<DashboardPage />} />
        <Route path="/repositories" element={<RepositoryListPage />} />
        <Route path="/repositories/new" element={<RepositoryFormPage />} />
        <Route path="/repositories/:id/edit" element={<RepositoryFormPage />} />
      </Routes>
    </Router>
  );
}

export default App;
