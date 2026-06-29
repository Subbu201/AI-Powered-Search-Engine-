import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import SearchService from '../services/searchService';
import RepositoryService from '../services/repositoryService';

const SearchPage = () => {
  const [keyword, setKeyword] = useState('');
  const [searchType, setSearchType] = useState('keyword'); // keyword, language, repository, file
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [repositories, setRepositories] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    fetchRepositories();
  }, []);

  const fetchRepositories = async () => {
    try {
      const data = await RepositoryService.getAll();
      setRepositories(data);
    } catch (e) {
      console.error('Failed to load repositories', e);
    }
  };

  const handleSearch = async (e) => {
    e.preventDefault();
    if (!keyword.trim()) return;

    setLoading(true);
    setError('');
    setResults([]);

    try {
      let data = [];
      switch (searchType) {
        case 'keyword':
          data = await SearchService.searchByKeyword(keyword);
          break;
        case 'language':
          data = await SearchService.searchByLanguage(keyword);
          break;
        case 'repository':
          data = await SearchService.searchByRepository(keyword);
          break;
        case 'file':
          data = await SearchService.searchByFileName(keyword);
          break;
        default:
          data = await SearchService.searchByKeyword(keyword);
      }
      setResults(data);
      if (data.length === 0) {
        setError('No results found for your query.');
      }
    } catch (err) {
      setError(err.response?.data || 'An error occurred during search.');
    } finally {
      setLoading(false);
    }
  };

  const highlightKeyword = (text, term) => {
    if (!term || searchType !== 'keyword') return text;
    const parts = text.split(new RegExp(`(${term})`, 'gi'));
    return parts.map((part, index) => 
      part.toLowerCase() === term.toLowerCase() ? <strong key={index} style={{ backgroundColor: 'rgba(255, 235, 59, 0.3)', padding: '0 2px', borderRadius: '3px' }}>{part}</strong> : part
    );
  };

  return (
    <div className="dashboard-container">
      <div className="dashboard-header">
        <h2>Code Search Engine</h2>
        <button className="btn-secondary" onClick={() => navigate('/dashboard')}>
          Back to Dashboard
        </button>
      </div>

      <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1.5rem', justifyContent: 'center', flexWrap: 'wrap' }}>
        {['keyword', 'language', 'repository', 'file'].map(type => (
          <button
            key={type}
            type="button"
            className={searchType === type ? 'btn-primary' : 'btn-secondary'}
            onClick={() => { setSearchType(type); setKeyword(''); setResults([]); setError(''); }}
            style={{ margin: 0, padding: '0.5rem 1rem', fontSize: '0.85rem' }}
          >
            Search by {type.charAt(0).toUpperCase() + type.slice(1)}
          </button>
        ))}
      </div>

      <div className="auth-card" style={{ maxWidth: '800px', margin: '0 auto 2rem auto', padding: '2rem' }}>
        <form onSubmit={handleSearch} style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
          
          <div style={{ flexGrow: 1 }}>
            {searchType === 'repository' ? (
              <select 
                className="form-control"
                value={keyword}
                onChange={(e) => setKeyword(e.target.value)}
                style={{ marginBottom: 0, fontSize: '1.1rem', padding: '0.75rem' }}
                required
              >
                <option value="">Select a repository...</option>
                {repositories.map(repo => (
                  <option key={repo.id} value={repo.id}>{repo.repositoryName}</option>
                ))}
              </select>
            ) : searchType === 'language' ? (
              <select 
                className="form-control"
                value={keyword}
                onChange={(e) => setKeyword(e.target.value)}
                style={{ marginBottom: 0, fontSize: '1.1rem', padding: '0.75rem' }}
                required
              >
                <option value="">Select a language...</option>
                <option value="Java">Java</option>
                <option value="JavaScript">JavaScript</option>
                <option value="Python">Python</option>
                <option value="HTML">HTML</option>
                <option value="CSS">CSS</option>
                <option value="XML">XML</option>
                <option value="SQL">SQL</option>
              </select>
            ) : (
              <input
                type="text"
                className="form-control"
                placeholder={`Enter ${searchType} to search...`}
                value={keyword}
                onChange={(e) => setKeyword(e.target.value)}
                style={{ marginBottom: 0, fontSize: '1.1rem', padding: '0.75rem' }}
                required
              />
            )}
          </div>

          <button type="submit" className="btn-primary" style={{ marginBottom: 0, padding: '0.75rem 2rem', fontSize: '1.1rem' }} disabled={loading}>
            {loading ? 'Searching...' : 'Search'}
          </button>
        </form>
      </div>

      {error && <div className="error-message">{error}</div>}

      <div style={{ display: 'grid', gap: '1.5rem', gridTemplateColumns: 'repeat(auto-fill, minmax(350px, 1fr))' }}>
        {results.map((result) => (
          <div 
            key={result.fileId} 
            className="auth-card" 
            style={{ padding: '1.5rem', cursor: 'pointer', transition: 'transform 0.2s', border: '1px solid var(--border-color)' }}
            onClick={() => navigate(`/files/${result.fileId}/view`)}
            onMouseOver={(e) => e.currentTarget.style.transform = 'translateY(-5px)'}
            onMouseOut={(e) => e.currentTarget.style.transform = 'translateY(0)'}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1rem' }}>
              <div>
                <h3 style={{ margin: '0 0 0.25rem 0', color: 'var(--primary-color)', fontSize: '1.1rem' }}>{result.fileName}</h3>
                <p style={{ margin: 0, fontSize: '0.8rem', color: 'var(--text-muted)' }}>{result.repositoryName} • {result.language}</p>
              </div>
              {searchType === 'keyword' && result.score > 0 && (
                <span className="badge badge-completed" style={{ fontSize: '0.75rem' }}>
                  Score: {result.score}
                </span>
              )}
            </div>

            <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '1rem', wordBreak: 'break-all' }}>
              {result.filePath}
            </p>

            <pre style={{ 
              background: 'rgba(0,0,0,0.2)', 
              padding: '1rem', 
              borderRadius: '6px', 
              fontSize: '0.8rem', 
              overflowX: 'auto',
              color: '#d4d4d4',
              whiteSpace: 'pre-wrap',
              wordBreak: 'break-all'
            }}>
              <code>{highlightKeyword(result.preview, searchType === 'keyword' ? keyword : '')}</code>
            </pre>
          </div>
        ))}
      </div>
    </div>
  );
};

export default SearchPage;
