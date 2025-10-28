import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../../services/api';
import '../../assets/css/components/pages/DynamicPageView.css';

function DynamicPageView() {
  const { slug } = useParams();
  const navigate = useNavigate();
  const [page, setPage] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    loadPage();
  }, [slug]);

  const loadPage = async () => {
    try {
      setLoading(true);
      const response = await api.get(`/pages/slug/${slug}`);
      setPage(response.data.data.page);
    } catch (error) {
      setError(error.response?.data?.message || 'Page not found');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="loading-container">
        <div className="spinner"></div>
        <p>Loading page...</p>
      </div>
    );
  }

  if (error || !page) {
    return (
      <div className="error-container">
        <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1">
          <circle cx="12" cy="12" r="10"></circle>
          <line x1="12" y1="8" x2="12" y2="12"></line>
          <line x1="12" y1="16" x2="12.01" y2="16"></line>
        </svg>
        <h2>Page Not Found</h2>
        <p>{error || 'The page you are looking for does not exist.'}</p>
        <button onClick={() => navigate('/')} className="btn-primary">
          Go Home
        </button>
      </div>
    );
  }

  const renderContent = () => {
    switch (page.contentType) {
      case 'html':
        return (
          <div
            className="page-content html-content"
            dangerouslySetInnerHTML={{ __html: page.content }}
          />
        );
      
      case 'markdown':
        // For production, use a markdown parser like 'marked' or 'react-markdown'
        return (
          <div className="page-content markdown-content">
            <pre>{page.content}</pre>
          </div>
        );
      
      case 'json':
        return (
          <div className="page-content json-content">
            <pre>{JSON.stringify(JSON.parse(page.content), null, 2)}</pre>
          </div>
        );
      
      default:
        return <div className="page-content">{page.content}</div>;
    }
  };

  return (
    <div className={`dynamic-page-view template-${page.template}`}>
      <div className="page-header">
        {page.icon && <span className="page-icon">{page.icon}</span>}
        <div>
          <h1>{page.title}</h1>
          {page.description && <p className="page-description">{page.description}</p>}
        </div>
      </div>

      {renderContent()}

      <div className="page-footer">
        <small className="text-muted">
          Last updated: {new Date(page.updatedAt).toLocaleString()}
        </small>
      </div>
    </div>
  );
}

export default DynamicPageView;
