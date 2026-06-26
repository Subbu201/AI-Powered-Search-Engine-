import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import IndexingService from '../services/indexingService';

const RepositoryFilesPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [files, setFiles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchFiles();
  }, [id]);

  const fetchFiles = async () => {
    try {
      const data = await IndexingService.getIndexedFiles(id);
      setFiles(data);
    } catch (err) {
      let errorMsg = 'Failed to fetch files';
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
        <h2>Indexed Files</h2>
        <button className="btn-secondary" onClick={() => navigate('/repositories')}>
          Back to Repositories
        </button>
      </div>

      <div className="auth-card" style={{ maxWidth: '100%' }}>
        {error && <div className="error-message">{error}</div>}
        {loading ? (
          <p>Loading files...</p>
        ) : files.length === 0 ? (
          <p style={{ color: 'var(--text-muted)' }}>No files indexed yet. Please go back and click Index.</p>
        ) : (
          <div style={{ overflowX: 'auto' }}>
            <table className="data-table">
              <thead>
                <tr>
                  <th>File Name</th>
                  <th>Type</th>
                  <th>Path</th>
                  <th>Indexed Time</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {files.map((file) => (
                  <tr key={file.id}>
                    <td><strong>{file.fileName}</strong></td>
                    <td>{file.fileType}</td>
                    <td style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>{file.filePath}</td>
                    <td>{new Date(file.indexedAt).toLocaleString()}</td>
                    <td>
                      <button className="btn-primary" onClick={() => navigate(`/files/${file.id}/view`)}>
                        View Code
                      </button>
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

export default RepositoryFilesPage;
