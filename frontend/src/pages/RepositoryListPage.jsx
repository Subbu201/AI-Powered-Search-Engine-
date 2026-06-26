import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import RepositoryService from '../services/repositoryService';
import AuthService from '../services/authService';

const RepositoryListPage = () => {
  const [repositories, setRepositories] = useState([]);
  const [loading, setLoading] = useState(true);
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

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this repository?')) {
      try {
        await RepositoryService.delete(id);
        fetchRepositories(); // Refresh the list
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
          <button className="btn-primary" style={{ marginTop: 0 }} onClick={() => navigate('/repositories/new')}>
            + Add Repository
          </button>
        </div>
      </div>

      <div className="auth-card" style={{ maxWidth: '100%' }}>
        {loading ? (
          <p>Loading repositories...</p>
        ) : repositories.length === 0 ? (
          <p style={{ color: 'var(--text-muted)' }}>No repositories found. Add one to get started!</p>
        ) : (
          <div style={{ overflowX: 'auto' }}>
            <table className="data-table">
              <thead>
                <tr>
                  <th>Name</th>
                  <th>URL</th>
                  <th>Language</th>
                  <th>Added On</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {repositories.map((repo) => (
                  <tr key={repo.id}>
                    <td><strong>{repo.repositoryName}</strong></td>
                    <td><a href={repo.repositoryUrl} target="_blank" rel="noreferrer" style={{ color: 'var(--primary-color)' }}>{repo.repositoryUrl}</a></td>
                    <td>{repo.language || 'N/A'}</td>
                    <td>{new Date(repo.createdAt).toLocaleDateString()}</td>
                    <td>
                      <div className="actions-cell">
                        <button className="btn-secondary" onClick={() => navigate(`/repositories/${repo.id}/edit`)}>Edit</button>
                        <button className="btn-danger" onClick={() => handleDelete(repo.id)}>Delete</button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default RepositoryListPage;
