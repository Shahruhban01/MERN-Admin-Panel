import React, { useEffect, useState } from 'react';
import PermissionRoute from './PermissionRoute';
import api from '../services/api';
import '../assets/css/components/Common.css';

function ActivityLogs() {
  const [logs, setLogs] = useState([]);
  const [filters, setFilters] = useState({ actionType: '' });
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [meta, setMeta] = useState({ page: 1, limit: 10, total: 0 });
  const [message, setMessage] = useState({ type: '', text: '' });
  const [selectedLog, setSelectedLog] = useState(null);
  const [showModal, setShowModal] = useState(false);

  const loadLogs = async () => {
    try {
      setLoading(true);
      const params = { page, limit: 10 };
      if (filters.actionType) params.actionType = filters.actionType;
      
      const response = await api.get('/activity-logs', { params });
      setLogs(response.data.data.logs || []);
      setMeta(response.data.meta || { page: 1, limit: 10, total: 0 });
    } catch (error) {
      console.error('Failed to load activity logs:', error);
      showMessage('error', 'Failed to load activity logs');
    } finally {
      setLoading(false);
    }
  };

  const showMessage = (type, text) => {
    setMessage({ type, text });
    setTimeout(() => setMessage({ type: '', text: '' }), 4000);
  };

  const truncateDescription = (text) => {
    const words = text.split(' ');
    if (words.length <= 5) return text;
    return words.slice(0, 5).join(' ') + '...';
  };

  const handleRowClick = (log) => {
    setSelectedLog(log);
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setSelectedLog(null);
  };

  useEffect(() => {
    loadLogs();
  }, [page, filters]);

  const totalPages = Math.ceil(meta.total / meta.limit) || 1;

  return (
    <PermissionRoute module="activity_logs" action="view">
      <div className="activity-logs-page">
        <div className="page-header">
          <div className="header-content">
            <h1>Activity Logs</h1>
            <p>Track admin actions and system changes</p>
          </div>
        </div>

        {message.text && (
          <div className={`notification notification-${message.type}`}>
            <div className="notification-icon">
              {message.type === 'success' ? (
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <polyline points="20 6 9 17 4 12"></polyline>
                </svg>
              ) : (
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <circle cx="12" cy="12" r="10"></circle>
                  <line x1="12" y1="8" x2="12" y2="12"></line>
                  <line x1="12" y1="16" x2="12.01" y2="16"></line>
                </svg>
              )}
            </div>
            <span>{message.text}</span>
          </div>
        )}

        {loading ? (
          <div className="loading-container">
            <div className="spinner"></div>
            <p>Loading activity logs...</p>
          </div>
        ) : (
          <>
            <div className="table-controls">
              <div className="search-box">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <circle cx="11" cy="11" r="8"></circle>
                  <path d="m21 21-4.35-4.35"></path>
                </svg>
                <input
                  type="text"
                  placeholder="Filter by action type (e.g., login, create, delete)"
                  value={filters.actionType}
                  onChange={(e) => {
                    setFilters({ ...filters, actionType: e.target.value });
                    setPage(1);
                  }}
                />
              </div>
              <div className="table-info">
                <span>{meta.total || 0} log{meta.total !== 1 ? 's' : ''}</span>
              </div>
            </div>

            <div className="table-wrapper">
              <table className="data-table">
                <thead>
                  <tr>
                    <th>Admin</th>
                    <th>Action Type</th>
                    <th>Description</th>
                    <th>IP Address</th>
                    <th>Date & Time</th>
                  </tr>
                </thead>
                <tbody>
                  {logs.length > 0 ? (
                    logs.map((log) => (
                      <tr 
                        key={log._id} 
                        onClick={() => handleRowClick(log)}
                        style={{ cursor: 'pointer' }}
                        className="clickable-row"
                      >
                        <td>
                          <div className="admin-info">
                            <span className="admin-name">{log.admin?.name || 'Unknown'}</span>
                            <span className="admin-email">{log.admin?.email || 'N/A'}</span>
                          </div>
                        </td>
                        <td>
                          <span className={`action-badge action-${log.actionType}`}>
                            {log.actionType}
                          </span>
                        </td>
                        <td>{truncateDescription(log.description)}</td>
                        <td>{log.ipAddress || '-'}</td>
                        <td>{new Date(log.createdAt).toLocaleString()}</td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="5" className="empty-state-td">
                        <div className="empty-state">
                          <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1">
                            <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
                            <polyline points="14 2 14 8 20 8"></polyline>
                            <line x1="16" y1="13" x2="8" y2="13"></line>
                            <line x1="16" y1="17" x2="8" y2="17"></line>
                            <polyline points="10 9 9 9 8 9"></polyline>
                          </svg>
                          <p>No activity logs found</p>
                        </div>
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>

            {logs.length > 0 && (
              <div className="pagination-controls">
                <button 
                  className="btn-secondary" 
                  onClick={() => setPage(prev => Math.max(1, prev - 1))}
                  disabled={page <= 1}
                >
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <polyline points="15 18 9 12 15 6"></polyline>
                  </svg>
                  Previous
                </button>
                
                <div className="pagination-info">
                  <span>Page {meta.page} of {totalPages}</span>
                </div>

                <button 
                  className="btn-secondary" 
                  onClick={() => setPage(prev => prev + 1)}
                  disabled={page >= totalPages}
                >
                  Next
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <polyline points="9 18 15 12 9 6"></polyline>
                  </svg>
                </button>
              </div>
            )}
          </>
        )}

        {/* Activity Details Modal */}
        {showModal && selectedLog && (
          <div className="modal-overlay" onClick={closeModal}>
            <div className="modal-container" onClick={(e) => e.stopPropagation()}>
              <div className="modal-header">
                <h2>Activity Log Details</h2>
                <button className="modal-close" onClick={closeModal}>
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <line x1="18" y1="6" x2="6" y2="18"></line>
                    <line x1="6" y1="6" x2="18" y2="18"></line>
                  </svg>
                </button>
              </div>

              <div className="modal-body">
                <div className="log-detail-section">
                  <h3>Admin Information</h3>
                  <div className="detail-grid">
                    <div className="detail-item">
                      <span className="detail-label">Name:</span>
                      <span className="detail-value">{selectedLog.admin?.name || 'Unknown'}</span>
                    </div>
                    <div className="detail-item">
                      <span className="detail-label">Email:</span>
                      <span className="detail-value">{selectedLog.admin?.email || 'N/A'}</span>
                    </div>
                  </div>
                </div>

                <div className="log-detail-section">
                  <h3>Action Details</h3>
                  <div className="detail-grid">
                    <div className="detail-item">
                      <span className="detail-label">Action Type:</span>
                      <span className={`action-badge action-${selectedLog.actionType}`}>
                        {selectedLog.actionType}
                      </span>
                    </div>
                    <div className="detail-item">
                      <span className="detail-label">Timestamp:</span>
                      <span className="detail-value">{new Date(selectedLog.createdAt).toLocaleString()}</span>
                    </div>
                  </div>
                </div>

                <div className="log-detail-section">
                  <h3>Description</h3>
                  <p className="log-description">{selectedLog.description}</p>
                </div>

                <div className="log-detail-section">
                  <h3>Technical Information</h3>
                  <div className="detail-grid">
                    <div className="detail-item">
                      <span className="detail-label">IP Address:</span>
                      <span className="detail-value">{selectedLog.ipAddress || 'Not recorded'}</span>
                    </div>
                    <div className="detail-item">
                      <span className="detail-label">User Agent:</span>
                      <span className="detail-value" style={{ fontSize: '12px' }}>
                        {selectedLog.userAgent || 'Not recorded'}
                      </span>
                    </div>
                    {selectedLog.affectedRecord && (
                      <div className="detail-item">
                        <span className="detail-label">Affected Record:</span>
                        <span className="detail-value">{JSON.stringify(selectedLog.affectedRecord)}</span>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              <div className="modal-footer">
                <button className="btn-secondary" onClick={closeModal}>Close</button>
              </div>
            </div>
          </div>
        )}
      </div>
    </PermissionRoute>
  );
}

export default ActivityLogs;
