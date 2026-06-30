import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import IndexingService from '../services/indexingService';
import AIService from '../services/aiService';

const FileViewerPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // AI State
  const [aiLoading, setAiLoading] = useState(false);
  const [aiResponse, setAiResponse] = useState('');
  const [aiModalOpen, setAiModalOpen] = useState(false);
  const [aiTitle, setAiTitle] = useState('');

  useEffect(() => {
    fetchFile();
  }, [id]);

  const fetchFile = async () => {
    try {
      const data = await IndexingService.getFileDetails(id);
      setFile(data);
    } catch (err) {
      let errorMsg = 'Failed to fetch file content';
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

  const handleAIAction = async (actionType) => {
    setAiLoading(true);
    setAiResponse('');
    setAiModalOpen(true);
    
    try {
      let result = '';
      if (actionType === 'explain') {
        setAiTitle('AI Explanation');
        result = await AIService.explainCode(id);
      } else if (actionType === 'summary') {
        setAiTitle('AI Summary');
        result = await AIService.summarizeCode(id);
      } else if (actionType === 'suggestions') {
        setAiTitle('AI Suggestions & Best Practices');
        result = await AIService.suggestImprovements(id);
      }
      setAiResponse(result);
    } catch (err) {
      setAiResponse(err.response?.data || 'Failed to generate AI response.');
    } finally {
      setAiLoading(false);
    }
  };

  return (
    <div className="dashboard-container">
      <div className="dashboard-header">
        <h2>File Viewer</h2>
        <div style={{ display: 'flex', gap: '1rem' }}>
          {file && (
            <>
              <button className="btn-primary" style={{ marginTop: 0, backgroundColor: '#673ab7' }} onClick={() => handleAIAction('explain')}>
                ✨ Explain with AI
              </button>
              <button className="btn-primary" style={{ marginTop: 0, backgroundColor: '#673ab7' }} onClick={() => handleAIAction('summary')}>
                ✨ Generate Summary
              </button>
              <button className="btn-primary" style={{ marginTop: 0, backgroundColor: '#673ab7' }} onClick={() => handleAIAction('suggestions')}>
                ✨ Get Suggestions
              </button>
            </>
          )}
          <button className="btn-secondary" onClick={() => navigate(-1)}>
            Back
          </button>
        </div>
      </div>

      <div className="auth-card" style={{ maxWidth: '100%', position: 'relative' }}>
        {error && <div className="error-message">{error}</div>}
        {loading ? (
          <p>Loading code...</p>
        ) : file && (
          <div>
            <div style={{ marginBottom: '1rem', borderBottom: '1px solid var(--border-color)', paddingBottom: '1rem' }}>
              <h3 style={{ margin: '0 0 0.5rem 0' }}>{file.fileName}</h3>
              <p style={{ margin: 0, color: 'var(--text-muted)', fontSize: '0.9rem' }}>{file.filePath}</p>
            </div>
            <pre style={{
              background: '#1e1e1e',
              color: '#d4d4d4',
              padding: '1.5rem',
              borderRadius: '8px',
              overflowX: 'auto',
              fontSize: '0.9rem',
              lineHeight: '1.5',
              fontFamily: 'Consolas, Monaco, "Andale Mono", "Ubuntu Mono", monospace'
            }}>
              <code>{file.fileContent}</code>
            </pre>
          </div>
        )}
      </div>

      {/* AI Modal Overlay */}
      {aiModalOpen && (
        <div style={{
          position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
          backgroundColor: 'rgba(0,0,0,0.6)', display: 'flex', justifyContent: 'center', alignItems: 'center',
          zIndex: 1000, padding: '2rem'
        }}>
          <div className="auth-card" style={{ 
            width: '100%', maxWidth: '800px', maxHeight: '80vh', 
            overflowY: 'auto', margin: 0, position: 'relative',
            backgroundColor: 'var(--card-bg)' 
          }}>
            <button 
              onClick={() => setAiModalOpen(false)}
              style={{ position: 'absolute', top: '1rem', right: '1rem', background: 'none', border: 'none', fontSize: '1.5rem', cursor: 'pointer', color: 'var(--text-color)' }}
            >
              &times;
            </button>
            <h2 style={{ marginTop: 0, color: '#673ab7' }}>{aiTitle}</h2>
            <hr style={{ borderColor: 'var(--border-color)', margin: '1rem 0' }} />
            
            {aiLoading ? (
              <div style={{ textAlign: 'center', padding: '2rem' }}>
                <span className="spinner" style={{ width: '40px', height: '40px', borderWidth: '4px', borderColor: '#673ab7', borderTopColor: 'transparent', margin: '0 auto' }}></span>
                <p style={{ marginTop: '1rem', color: 'var(--text-muted)' }}>Gemini AI is analyzing the code...</p>
                <div style={{ marginTop: '15px', fontSize: '13px', color: '#666', textAlign: 'center', padding: '10px', backgroundColor: '#f0f4f8', borderRadius: '4px' }}>
                  <i style={{ display: 'block', marginBottom: '5px' }}>⏱️ Note: If the server was asleep, this might take up to 15-30 seconds.</i>
                  Please don't close this window.
                </div>
              </div>
            ) : (
              <div style={{ whiteSpace: 'pre-wrap', lineHeight: '1.6', fontSize: '0.95rem' }}>
                {aiResponse}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default FileViewerPage;
