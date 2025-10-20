/* eslint-disable no-unused-vars */
import React, { useState, useEffect } from 'react';
import PermissionRoute from './PermissionRoute';
import { roleAPI } from '../services/api';
import RoleModal from './RoleModal';
import '../assets/css/components/RoleManagement.css';

function RoleManagement() {
  const [roles, setRoles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState({ type: '', text: '' });
  const [showModal, setShowModal] = useState(false);
  const [selectedRole, setSelectedRole] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    loadRoles();
  }, []);

  const loadRoles = async () => {
    try {
      setLoading(true);
      const response = await roleAPI.getAllRoles();
      setRoles(response.data.roles);
    } catch (error) {
      showMessage('error', 'Failed to load roles');
    } finally {
      setLoading(false);
    }
  };

  const showMessage = (type, text) => {
    setMessage({ type, text });
    setTimeout(() => setMessage({ type: '', text: '' }), 4000);
  };

  const handleCreateRole = () => {
    setSelectedRole(null);
    setShowModal(true);
  };

  const handleEditRole = (role) => {
    setSelectedRole(role);
    setShowModal(true);
  };

  const handleDeleteRole = async (roleId, roleName) => {
    if (!window.confirm(`Are you sure you want to delete role "${roleName}"?`)) {
      return;
    }

    try {
      await roleAPI.deleteRole(roleId);
      showMessage('success', 'Role deleted successfully');
      loadRoles();
    } catch (error) {
      showMessage('error', error.response?.data?.message || 'Failed to delete role');
    }
  };

  const handleModalClose = () => {
    setShowModal(false);
    setSelectedRole(null);
  };

  const handleModalSuccess = () => {
    loadRoles();
    handleModalClose();
    showMessage('success', selectedRole ? 'Role updated successfully' : 'Role created successfully');
  };

  const filteredRoles = roles.filter(role =>
    role.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    role.description?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getPermissionCount = (permissions) => {
    let count = 0;
    Object.values(permissions).forEach(module => {
      Object.values(module).forEach(permission => {
        if (permission) count++;
      });
    });
    return count;
  };

  if (loading) {
    return (
      <div className="loading-container">
        <div className="spinner"></div>
        <p>Loading roles...</p>
      </div>
    );
  }

  return (
    <PermissionRoute module="roles" action="view">
    <div className="role-management">
      <div className="page-header">
        <div className="header-content">
          <h1>Role Management</h1>
          <p>Create and manage roles with specific permissions</p>
        </div>
        <button className="btn-primary" onClick={handleCreateRole}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <line x1="12" y1="5" x2="12" y2="19"></line>
            <line x1="5" y1="12" x2="19" y2="12"></line>
          </svg>
          Create Role
        </button>
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

      <div className="table-controls">
        <div className="search-box">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <circle cx="11" cy="11" r="8"></circle>
            <path d="m21 21-4.35-4.35"></path>
          </svg>
          <input
            type="text"
            placeholder="Search roles..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div className="table-info">
          <span>{filteredRoles.length} role{filteredRoles.length !== 1 ? 's' : ''}</span>
        </div>
      </div>

      <div className="roles-grid">
        {filteredRoles.map((role) => (
          <div key={role._id} className="role-card">
            <div className="role-card-header">
              <div className="role-info">
                <h3>{role.name}</h3>
                {role.isDefault && (
                  <span className="badge badge-default">Default</span>
                )}
                {!role.isActive && (
                  <span className="badge badge-inactive">Inactive</span>
                )}
              </div>
              <div className="role-actions">
                <button
                  className="btn-icon"
                  onClick={() => handleEditRole(role)}
                  title="Edit role"
                >
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path>
                    <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path>
                  </svg>
                </button>
                {!role.isDefault && (
                  <button
                    className="btn-icon btn-danger"
                    onClick={() => handleDeleteRole(role._id, role.name)}
                    title="Delete role"
                  >
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <polyline points="3 6 5 6 21 6"></polyline>
                      <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
                    </svg>
                  </button>
                )}
              </div>
            </div>

            <p className="role-description">
              {role.description || 'No description provided'}
            </p>

            <div className="role-stats">
              <div className="stat-item">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path>
                </svg>
                <span>{getPermissionCount(role.permissions)} Permissions</span>
              </div>
              <div className="stat-item">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
                  <circle cx="9" cy="7" r="4"></circle>
                  <path d="M23 21v-2a4 4 0 0 0-3-3.87"></path>
                  <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
                </svg>
                <span>{role.adminCount || 0} Admin{role.adminCount !== 1 ? 's' : ''}</span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {filteredRoles.length === 0 && (
        <div className="empty-state">
          <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1">
            <circle cx="12" cy="12" r="10"></circle>
            <line x1="12" y1="8" x2="12" y2="12"></line>
            <line x1="12" y1="16" x2="12.01" y2="16"></line>
          </svg>
          <h3>No roles found</h3>
          <p>
            {searchTerm
              ? 'Try adjusting your search terms'
              : 'Create your first role to get started'}
          </p>
        </div>
      )}

      {showModal && (
        <RoleModal
          role={selectedRole}
          onClose={handleModalClose}
          onSuccess={handleModalSuccess}
        />
      )}
    </div>
    </PermissionRoute>
  );
}

export default RoleManagement;
