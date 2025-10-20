import React from 'react';
import { useAuth } from '../context/AuthContext';
import '../assets/css/components/AccessDenied.css';

function PermissionRoute({ module, action, children }) {
  const { hasPermission } = useAuth();

  if (!hasPermission(module, action)) {
    return (
      <div className="access-denied-container">
        <div className="access-denied">
          <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
            <circle cx="12" cy="12" r="10"></circle>
            <line x1="15" y1="9" x2="9" y2="15"></line>
            <line x1="9" y1="9" x2="15" y2="15"></line>
          </svg>
          <h2>Access Denied</h2>
          <p>You don't have permission to access this page.</p>
          <p className="permission-info">
            Required permission: <strong>{module}.{action}</strong>
          </p>
          <button onClick={() => window.history.back()} className="btn-primary">
            Go Back
          </button>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}

export default PermissionRoute;
