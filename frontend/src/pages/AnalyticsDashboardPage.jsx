import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import AnalyticsService from '../services/analyticsService';
import AuthService from '../services/authService';
import RepositoryService from '../services/repositoryService';
import {
  PieChart, Pie, Cell, Tooltip as RechartsTooltip, Legend, ResponsiveContainer,
  BarChart, Bar, XAxis, YAxis, CartesianGrid,
  LineChart, Line
} from 'recharts';

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8', '#ffc658'];

const AnalyticsDashboardPage = () => {
  const navigate = useNavigate();
  const [overview, setOverview] = useState(null);
  const [languageStats, setLanguageStats] = useState([]);
  const [keywordStats, setKeywordStats] = useState([]);
  const [repoStats, setRepoStats] = useState([]);
  const [selectedRepoId, setSelectedRepoId] = useState('');
  const [repositories, setRepositories] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const user = AuthService.getCurrentUser();
    if (!user) {
      navigate('/login');
      return;
    }
    fetchData();
    fetchRepositories();
  }, [navigate]);

  useEffect(() => {
    fetchLanguageStats(selectedRepoId);
  }, [selectedRepoId]);

  const fetchRepositories = async () => {
    try {
      const data = await RepositoryService.getAll();
      setRepositories(data);
    } catch (err) {
      console.error(err);
    }
  };

  const fetchLanguageStats = async (repoId) => {
    try {
      const langData = await AnalyticsService.getLanguageStats(repoId);
      setLanguageStats(langData);
    } catch (err) {
      console.error(err);
    }
  };

  const fetchData = async () => {
    try {
      setLoading(true);
      const [overviewData, keywordData, repoData] = await Promise.all([
        AnalyticsService.getOverview(),
        AnalyticsService.getTopSearches(),
        AnalyticsService.getRepositoryStats()
      ]);
      setOverview(overviewData);
      setKeywordStats(keywordData);
      setRepoStats(repoData);
      // initial load of language stats is handled by the useEffect on selectedRepoId
    } catch (err) {
      console.error('Failed to fetch analytics', err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="dashboard-container">
        <div className="dashboard-header">
          <h2>Analytics Dashboard</h2>
          <button className="btn-secondary" onClick={() => navigate('/dashboard')}>Back to Dashboard</button>
        </div>
        <p>Loading analytics...</p>
      </div>
    );
  }

  return (
    <div className="dashboard-container" style={{ maxWidth: '1200px' }}>
      <div className="dashboard-header">
        <h2>Analytics Dashboard</h2>
        <button className="btn-secondary" onClick={() => navigate('/dashboard')}>Back to Dashboard</button>
      </div>
      
      {/* KPI grid removed as requested */}

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem', marginBottom: '2rem' }}>
        <div className="auth-card" style={{ padding: '1.5rem', margin: 0, display: 'flex', flexDirection: 'column' }}>
          <h3 style={{ marginBottom: '1rem', textAlign: 'center' }}>File Extension Distribution</h3>
          <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '1rem' }}>
            <select 
              className="form-control" 
              style={{ width: 'auto', marginBottom: 0, padding: '0.5rem' }}
              value={selectedRepoId}
              onChange={(e) => setSelectedRepoId(e.target.value)}
            >
              <option value="">All Repositories</option>
              {repositories.map(repo => (
                <option key={repo.id} value={repo.id}>{repo.repositoryName}</option>
              ))}
            </select>
          </div>
          <div style={{ height: '260px', flexGrow: 1 }}>
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={languageStats}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                  outerRadius={90}
                  fill="#8884d8"
                  dataKey="repositoryCount"
                  nameKey="language"
                >
                  {languageStats.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <RechartsTooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="auth-card" style={{ padding: '1.5rem', margin: 0 }}>
          <h3 style={{ marginBottom: '1rem', textAlign: 'center' }}>Top Searched Keywords</h3>
          <div style={{ height: '300px' }}>
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={keywordStats} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="keyword" />
                <YAxis />
                <RechartsTooltip />
                <Legend />
                <Bar dataKey="count" fill="#8884d8" name="Search Count" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      <div className="auth-card" style={{ padding: '1.5rem', margin: 0 }}>
        <h3 style={{ marginBottom: '1rem', textAlign: 'center' }}>Repository File Distribution</h3>
        <div style={{ height: '400px' }}>
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={repoStats} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="repositoryName" />
              <YAxis />
              <RechartsTooltip />
              <Legend />
              <Line type="monotone" dataKey="totalFiles" stroke="#8884d8" name="Total Files" activeDot={{ r: 8 }} />
              <Line type="monotone" dataKey="indexedFilesCount" stroke="#82ca9d" name="Indexed Files" />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};

export default AnalyticsDashboardPage;
