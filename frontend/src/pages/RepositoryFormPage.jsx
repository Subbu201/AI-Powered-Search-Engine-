import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import RepositoryService from '../services/repositoryService';
import AuthService from '../services/authService';

const RepositoryFormPage = () => {
  const { id } = useParams();
  const isEditMode = !!id;
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    repositoryName: '',
    repositoryUrl: '',
    description: '',
    language: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!AuthService.getCurrentUser()) {
      navigate('/login');
      return;
    }

    if (isEditMode) {
      fetchRepository(id);
    }
  }, [id, navigate, isEditMode]);

  const fetchRepository = async (repoId) => {
    try {
      const data = await RepositoryService.getById(repoId);
      setFormData({
        repositoryName: data.repositoryName || '',
        repositoryUrl: data.repositoryUrl || '',
        description: data.description || '',
        language: data.language || ''
      });
    } catch (err) {
      setError('Failed to fetch repository details.');
      console.error(err);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      if (isEditMode) {
        await RepositoryService.update(id, formData);
      } else {
        await RepositoryService.create(formData);
      }
      navigate('/repositories');
    } catch (err) {
      setError('Failed to save repository. Check if name is unique.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="dashboard-container">
      <div className="dashboard-header">
        <h2>{isEditMode ? 'Edit Repository' : 'Add New Repository'}</h2>
        <button className="btn-secondary" onClick={() => navigate('/repositories')}>
          Cancel
        </button>
      </div>

      <div className="auth-card" style={{ maxWidth: '600px', margin: '0 auto' }}>
        {error && <div className="error-message">{error}</div>}

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="form-label">Repository Name *</label>
            <input
              type="text"
              name="repositoryName"
              className="form-input"
              value={formData.repositoryName}
              onChange={handleChange}
              placeholder="e.g., react-core"
              required
            />
          </div>

          <div className="form-group">
            <label className="form-label">Repository URL *</label>
            <input
              type="url"
              name="repositoryUrl"
              className="form-input"
              value={formData.repositoryUrl}
              onChange={handleChange}
              placeholder="e.g., https://github.com/facebook/react"
              required
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
            />
          </div>

          <button type="submit" className="btn-primary" disabled={loading}>
            {loading ? 'Saving...' : 'Save Repository'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default RepositoryFormPage;
