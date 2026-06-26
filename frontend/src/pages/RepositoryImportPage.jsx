import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import RepositoryService from '../services/repositoryService';
import AuthService from '../services/authService';

const RepositoryImportPage = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    repositoryName: '',
    repositoryUrl: '',
    description: '',
    language: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    if (!AuthService.getCurrentUser()) {
      navigate('/login');
    }
  }, [navigate]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess(false);

    try {
      await RepositoryService.importRepo(formData);
      setSuccess(true);
      setTimeout(() => navigate('/repositories'), 2000);
    } catch (err) {
      let errorMsg = 'Failed to import repository. Ensure the URL is valid.';
      if (err.response?.data) {
        if (typeof err.response.data === 'string') {
          errorMsg = err.response.data;
        } else if (err.response.data.message) {
          errorMsg = err.response.data.message;
        } else {
          errorMsg = JSON.stringify(err.response.data);
        }
      }
      setError(errorMsg);
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="dashboard-container">
      <div className="dashboard-header">
        <h2>Import GitHub Repository</h2>
        <button className="btn-secondary" onClick={() => navigate('/repositories')} disabled={loading}>
          Cancel
        </button>
      </div>

      <div className="auth-card" style={{ maxWidth: '600px', margin: '0 auto' }}>
        {error && <div className="error-message">{error}</div>}
        {success && <div style={{ color: 'var(--success-color)', padding: '1rem', background: 'rgba(46, 213, 115, 0.1)', borderRadius: '8px', marginBottom: '1rem' }}>Repository imported and cloned successfully! Redirecting...</div>}

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="form-label">GitHub Repository URL *</label>
            <input
              type="url"
              name="repositoryUrl"
              className="form-input"
              value={formData.repositoryUrl}
              onChange={handleChange}
              placeholder="e.g., https://github.com/user/repo.git"
              required
              disabled={loading}
            />
          </div>

          <div className="form-group">
            <label className="form-label">Repository Name (Local alias) *</label>
            <input
              type="text"
              name="repositoryName"
              className="form-input"
              value={formData.repositoryName}
              onChange={handleChange}
              placeholder="e.g., react-core"
              required
              disabled={loading}
            />
          </div>

          <div className="form-group">
            <label className="form-label">Primary Language</label>
            <input
              type="text"
              name="language"
              className="form-input"
              value={formData.language}
              onChange={handleChange}
              placeholder="e.g., JavaScript, Java, Python"
              disabled={loading}
            />
          </div>

          <div className="form-group">
            <label className="form-label">Description</label>
            <textarea
              name="description"
              className="form-input"
              value={formData.description}
              onChange={handleChange}
              placeholder="Brief description of the repository..."
              rows="4"
              style={{ resize: 'vertical' }}
              disabled={loading}
            />
          </div>

          <button type="submit" className="btn-primary" disabled={loading} style={{ position: 'relative' }}>
            {loading ? (
              <span style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}>
                <span className="spinner"></span> Cloning Repository...
              </span>
            ) : 'Import Repository'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default RepositoryImportPage;
