import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import AuthService from '../services/authService';
import DashboardService from '../services/dashboardService';

const DashboardPage = () => {
  const [user, setUser] = useState(null);
  const [stats, setStats] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const currentUser = AuthService.getCurrentUser();
    if (!currentUser) {
      navigate('/login');
    } else {
      setUser(currentUser);
      fetchStats();
    }
  }, [navigate]);

  const fetchStats = async () => {
    try {
      const data = await DashboardService.getStats();
      setStats(data);
    } catch (err) {
      console.error('Failed to fetch stats', err);
    }
  };

  const handleLogout = () => {
    AuthService.logout();
    navigate('/login');
  };

  if (!user) return null;

  return (
    <div className="dashboard-container">
      <div className="dashboard-header">
        <h2>Dashboard</h2>
        <div style={{ display: 'flex', gap: '1rem' }}>
          <button className="btn-primary" style={{ marginTop: 0 }} onClick={() => navigate('/repositories')}>
            Manage Repositories
          </button>
          <button className="btn-secondary" onClick={handleLogout}>
            Sign Out
          </button>
        </div>
      </div>
      
      <div className="auth-card" style={{ maxWidth: '100%' }}>
        <h3 style={{ marginBottom: '1rem' }}>Welcome, {user.username}!</h3>
        <p style={{ color: 'var(--text-muted)' }}>
          You have successfully logged into the AI-Powered Code Search & Repository Analytics Platform.
        </p>
        
        {stats && (
          <div className="kpi-grid">
            <div className="kpi-card">
              <div className="kpi-title">Total Repositories</div>
              <div className="kpi-value">{stats.totalRepositories.toLocaleString()}</div>
            </div>
            <div className="kpi-card">
              <div className="kpi-title">Total Indexed Files</div>
              <div className="kpi-value">{stats.totalIndexedFiles.toLocaleString()}</div>
            </div>
            <div className="kpi-card">
              <div className="kpi-title">Total Searches</div>
              <div className="kpi-value">{stats.totalSearches.toLocaleString()}</div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default DashboardPage;
