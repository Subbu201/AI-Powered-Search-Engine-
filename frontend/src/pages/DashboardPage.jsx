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

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '2rem', marginTop: '3rem', marginBottom: '3rem' }}>
          
          <div className="auth-card" style={{ padding: '2rem', textAlign: 'center', cursor: 'pointer', transition: 'transform 0.2s', margin: 0 }} 
               onClick={() => navigate('/repositories')}
               onMouseOver={(e) => e.currentTarget.style.transform = 'translateY(-5px)'}
               onMouseOut={(e) => e.currentTarget.style.transform = 'translateY(0)'}>
            <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>📁</div>
            <h3>Manage Repositories</h3>
            <p style={{ color: 'var(--text-muted)' }}>Import, index, and delete your codebases.</p>
          </div>

          <div className="auth-card" style={{ padding: '2rem', textAlign: 'center', cursor: 'pointer', transition: 'transform 0.2s', margin: 0 }} 
               onClick={() => navigate('/search')}
               onMouseOver={(e) => e.currentTarget.style.transform = 'translateY(-5px)'}
               onMouseOut={(e) => e.currentTarget.style.transform = 'translateY(0)'}>
            <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>🔍</div>
            <h3>Code Search Engine</h3>
            <p style={{ color: 'var(--text-muted)' }}>Search across all indexed files instantly.</p>
          </div>

          <div className="auth-card" style={{ padding: '2rem', textAlign: 'center', cursor: 'pointer', transition: 'transform 0.2s', margin: 0 }} 
               onClick={() => navigate('/analytics')}
               onMouseOver={(e) => e.currentTarget.style.transform = 'translateY(-5px)'}
               onMouseOut={(e) => e.currentTarget.style.transform = 'translateY(0)'}>
            <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>📈</div>
            <h3>Analytics Dashboard</h3>
            <p style={{ color: 'var(--text-muted)' }}>View system statistics and search trends.</p>
          </div>
        </div>
        
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
