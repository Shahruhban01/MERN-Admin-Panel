import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import PermissionRoute from '../PermissionRoute';
import PermissionGuard from '../PermissionGuard';
import api from '../../services/api';
import '../../assets/css/components/pages/Pages.css';

function Pages() {
  const [pages, setPages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState('all');
  const [message, setMessage] = useState({ type: '', text: '' });

  useEffect(() => {
    loadPages();
  }, [filter]);

  const loadPages = async () => {
    try {
      setLoading(true);
      const statusParam = filter !== 'all' ? `&status=${filter}` : '';
      const response = await api.get(`/pages?search=${search}${statusParam}`);
      setPages(response.data.data.pages || []);
    } catch (error) {
      showMessage('error', 'Failed to load pages');
    } finally {
      setLoading(false);
    }
  };

  const showMessage = (type, text) => {
    setMessage({ type, text });
    setTimeout(() => setMessage({ type: '', text: '' }), 4000);
  };

  const handleDelete = async (id, title) => {
    if (!window.confirm(`Delete page "${title}"?`)) return;

    try {
      await api.delete(`/pages/${id}`);
      showMessage('success', 'Page deleted successfully');
      loadPages();
    } catch (error) {
      showMessage('error', 'Failed to delete page');
    }
  };

  const getStatusBadge = (status) => {
    const badges = {
      published: { color: 'success', label: 'Published' },
      draft: { color: 'warning', label: 'Draft' },
      archived: { color: 'secondary', label: 'Archived' }
    };
    const badge = badges[status] || badges.draft;
    return <span className={`status-badge badge-${badge.color}`}>{badge.label}</span>;
  };

  const getSidebarPosition = (position) => {
    const positions = {
      top: '📌 Top',
      main: '📋 Main',
      bottom: '⬇️ Bottom',
      hidden: '🔒 Hidden'
    };
    return positions[position] || 'Main';
  };

  return (
    <PermissionRoute module="pages" action="view">
      <div className="pages-container">
        <div className="page-header">
          <div className="header-content">
            <h1>Page Builder</h1>
            <p>Create and manage custom pages</p>
          </div>
          <PermissionGuard module="pages" action="create">
            <Link to="/pages/create" className="btn btn-primary">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <line x1="12" y1="5" x2="12" y2="19"></line>
                <line x1="5" y1="12" x2="19" y2="12"></line>
              </svg>
              Create Page
            </Link>
          </PermissionGuard>
        </div>

        {message.text && (
          <div className={`notification notification-${message.type}`}>
            <span>{message.text}</span>
          </div>
        )}

        <div className="table-controls">
          <div className="search-box">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="11" cy="11" r="8"></circle>
              <path d="m21 21-4.35-4.35"></path>
            </svg>
            <input
              type="text"
              placeholder="Search pages..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && loadPages()}
            />
          </div>
          
          <select
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            className="filter-select"
          >
            <option value="all">All Pages</option>
            <option value="published">Published</option>
            <option value="draft">Draft</option>
            <option value="archived">Archived</option>
          </select>

          <button className="btn-secondary" onClick={loadPages}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <polyline points="23 4 23 10 17 10"></polyline>
              <path d="M20.49 15a9 9 0 1 1-2.12-9.36L23 10"></path>
            </svg>
            Refresh
          </button>
        </div>

        {loading ? (
          <div className="loading-container">
            <div className="spinner"></div>
            <p>Loading pages...</p>
          </div>
        ) : pages.length > 0 ? (
          <div className="table-container">
            <table className="data-table">
              <thead>
                <tr>
                  <th>Page Title</th>
                  <th>Slug</th>
                  <th>Status</th>
                  <th>Sidebar</th>
                  <th>Template</th>
                  <th>Updated</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {pages.map((page) => (
                  <tr key={page._id}>
                    <td>
                      <div className="page-title-cell">
                        {page.icon && <span className="page-icon">{page.icon}</span>}
                        <div>
                          <strong>{page.title}</strong>
                          {page.description && (
                            <small className="page-description">{page.description}</small>
                          )}
                        </div>
                      </div>
                    </td>
                    <td>
                      <code className="slug-code">/{page.slug}</code>
                    </td>
                    <td>{getStatusBadge(page.status)}</td>
                    <td>
                      {page.sidebar.enabled ? (
                        <span className="sidebar-info">
                          {getSidebarPosition(page.sidebar.position)}
                          <small>Order: {page.sidebar.order}</small>
                        </span>
                      ) : (
                        <span className="text-muted">Not in sidebar</span>
                      )}
                    </td>
                    <td>
                      <span className="template-badge">{page.template}</span>
                    </td>
                    <td>
                      <span className="date-text">
                        {new Date(page.updatedAt).toLocaleDateString()}
                      </span>
                    </td>
                    <td className="actions-cell">
                      <Link
                        to={`/page/${page.slug}`}
                        className="btn-icon btn-view"
                        title="View"
                      >
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                          <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path>
                          <circle cx="12" cy="12" r="3"></circle>
                        </svg>
                      </Link>
                      <PermissionGuard module="pages" action="edit">
                        <Link
                          to={`/pages/edit/${page._id}`}
                          className="btn-icon btn-edit"
                          title="Edit"
                        >
                          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path>
                            <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path>
                          </svg>
                        </Link>
                      </PermissionGuard>
                      <PermissionGuard module="pages" action="delete">
                        <button
                          onClick={() => handleDelete(page._id, page.title)}
                          className="btn-icon btn-delete"
                          title="Delete"
                        >
                          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <polyline points="3 6 5 6 21 6"></polyline>
                            <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
                          </svg>
                        </button>
                      </PermissionGuard>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="empty-state">
            <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1">
              <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
              <polyline points="14 2 14 8 20 8"></polyline>
            </svg>
            <h3>No Pages Yet</h3>
            <p>Create your first custom page to get started</p>
            <PermissionGuard module="pages" action="create">
              <Link to="/pages/create" className="btn btn-primary">
                Create First Page
              </Link>
            </PermissionGuard>
          </div>
        )}
      </div>
    </PermissionRoute>
  );
}

export default Pages;
