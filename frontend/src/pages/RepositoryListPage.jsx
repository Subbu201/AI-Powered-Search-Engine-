import React, { useEffect, useState, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import RepositoryService from '../services/repositoryService';
import AuthService from '../services/authService';
import IndexingService from '../services/indexingService';

const RepositoryListPage = () => {
  const [repositories, setRepositories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [indexing, setIndexing] = useState(null);
  const [progressData, setProgressData] = useState({});
  const [performanceData, setPerformanceData] = useState({});
  const navigate = useNavigate();

  useEffect(() => {
    if (!AuthService.getCurrentUser()) {
      navigate('/login');
      return;
    }
    fetchRepositories();
  }, [navigate]);

  const fetchRepositories = async () => {
    try {
      const data = await RepositoryService.getAll();
      setRepositories(data);
    } catch (err) {
      console.error('Error fetching repositories:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const activeRepos = repositories.filter(r => r.indexingStatus === 'IN_PROGRESS' || indexing === r.id);
    if (activeRepos.length === 0) return;

    const interval = setInterval(async () => {
      let needsRefresh = false;
      const newProgress = { ...progressData };

      for (const repo of activeRepos) {
        try {
          const stats = await IndexingService.getIndexingStatus(repo.id);
          newProgress[repo.id] = stats;
          
          if (stats.status === 'COMPLETED' || stats.status === 'FAILED') {
            needsRefresh = true;
            if (indexing === repo.id) {
              setIndexing(null);
            }
          }
        } catch (e) {
          console.error(e);
        }
      }
      
      setProgressData(prev => ({ ...prev, ...newProgress }));
      
      if (needsRefresh) {
        fetchRepositories();
      }
    }, 1500);

    return () => clearInterval(interval);
  }, [repositories, indexing]);

  const handleIndex = async (id) => {
    setIndexing(id);
    try {
      await IndexingService.indexRepository(id);
      fetchRepositories();
    } catch (err) {
      alert(err.response?.data || 'Error indexing repository');
      setIndexing(null);
    }
  };

  const handleShowPerformance = async (id) => {
    try {
      const perf = await IndexingService.getPerformance(id);
      setPerformanceData(prev => ({ ...prev, [id]: perf }));
    } catch (err) {
      alert(err.response?.data || 'Failed to fetch performance stats');
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this repository?')) {
      try {
        await RepositoryService.delete(id);
        fetchRepositories();
      } catch (err) {
        console.error('Error deleting repository:', err);
      }
    }
  };

  return (
    <div className="dashboard-container">
      <div className="dashboard-header">
        <h2>Manage Repositories</h2>
        <div style={{ display: 'flex', gap: '1rem' }}>
          <button className="btn-secondary" onClick={() => navigate('/dashboard')}>
            Back to Dashboard
          </button>
          <button className="btn-primary" style={{ marginTop: 0 }} onClick={() => navigate('/repositories/import')}>
            + Import Repository
          </button>
        </div>
      </div>

      <div className="auth-card" style={{ maxWidth: '100%' }}>
        {loading ? (
          <p>Loading repositories...</p>
        ) : repositories.length === 0 ? (
          <p style={{ color: 'var(--text-muted)' }}>No repositories found. Add one to get started!</p>
        ) : (
            <table className="data-table">
              <thead>
                <tr>
                  <th style={{width: '20%'}}>Name</th>
                  <th style={{width: '25%'}}>URL</th>
                  <th style={{width: '15%'}}>Local Path</th>
                  <th style={{width: '10%'}}>Status</th>
                  <th style={{width: '30%'}}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {repositories.map((repo) => {
                  const pData = progressData[repo.id];
                  const perf = performanceData[repo.id];
                  const isWorking = repo.indexingStatus === 'IN_PROGRESS' || indexing === repo.id;

                  return (
                    <React.Fragment key={repo.id}>
                      <tr>
                        <td><strong>{repo.repositoryName}</strong></td>
                        <td><a href={repo.repositoryUrl} target="_blank" rel="noreferrer" style={{ color: 'var(--primary-color)' }}>{repo.repositoryUrl}</a></td>
                        <td style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>{repo.localPath || 'Not imported'}</td>
                        <td>
                          <span className={`badge badge-${repo.indexingStatus?.toLowerCase() || 'pending'}`}>
                            {repo.indexingStatus || 'PENDING'}
                          </span>
                        </td>
                        <td>
                          <div className="actions-cell">
                            <button className="btn-secondary" onClick={() => handleIndex(repo.id)} disabled={isWorking}>
                              {isWorking ? <span className="spinner" style={{ width: '12px', height: '12px', borderWidth: '2px' }}></span> : 'Index'}
                            </button>
                            <button className="btn-primary" style={{marginTop: 0}} onClick={() => navigate(`/repositories/${repo.id}/files`)}>Files</button>
                            <button className="btn-danger" onClick={() => handleDelete(repo.id)}>Delete</button>
                          </div>
                        </td>
                      </tr>
                      {/* Progress Bar Row */}
                      {isWorking && pData && (
                        <tr>
                          <td colSpan="5" style={{ padding: '0 1rem 1rem 1rem', borderBottom: '1px solid rgba(102, 126, 234, 0.08)' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', fontSize: '0.85rem' }}>
                              <div style={{ flexGrow: 1, background: 'rgba(255,255,255,0.1)', borderRadius: '4px', height: '8px', overflow: 'hidden' }}>
                                <div style={{ width: `${pData.progress}%`, background: 'var(--primary-color)', height: '100%', transition: 'width 0.5s ease' }}></div>
                              </div>
                              <span style={{ minWidth: '80px', textAlign: 'right' }}>{pData.progress}% ({pData.indexedFiles}/{pData.totalFiles})</span>
                            </div>
                          </td>
                        </tr>
                      )}

                    </React.Fragment>
                  );
                })}
              </tbody>
            </table>
        )}
      </div>
    </div>
  );
};

export default RepositoryListPage;
