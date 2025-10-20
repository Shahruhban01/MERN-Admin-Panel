import React, { useState, useEffect } from 'react';
import { roleAPI } from '../services/api';
import '../assets/css/components/RoleModal.css';

function RoleModal({ role, onClose, onSuccess }) {
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    permissions: {
      dashboard: { view: false, edit: false },
      users: { view: false, create: false, edit: false, delete: false },
      products: { view: false, create: false, edit: false, delete: false },
      orders: { view: false, create: false, edit: false, delete: false },
      analytics: { view: false },
      roles: { view: false, create: false, edit: false, delete: false },
      admins: { view: false, create: false, edit: false, delete: false },
      settings: { view: false, edit: false }
    },
    isActive: true
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (role) {
      setFormData({
        name: role.name,
        description: role.description || '',
        permissions: role.permissions,
        isActive: role.isActive
      });
    }
  }, [role]);

  const modules = [
    {
      id: 'dashboard',
      name: 'Dashboard',
      icon: '📊',
      permissions: ['view', 'edit']
    },
    {
      id: 'users',
      name: 'Users',
      icon: '👥',
      permissions: ['view', 'create', 'edit', 'delete']
    },
    {
      id: 'products',
      name: 'Products',
      icon: '📦',
      permissions: ['view', 'create', 'edit', 'delete']
    },
    {
      id: 'orders',
      name: 'Orders',
      icon: '🛒',
      permissions: ['view', 'create', 'edit', 'delete']
    },
    {
      id: 'analytics',
      name: 'Analytics',
      icon: '📈',
      permissions: ['view']
    },
    {
      id: 'roles',
      name: 'Roles',
      icon: '🔐',
      permissions: ['view', 'create', 'edit', 'delete']
    },
    {
      id: 'admins',
      name: 'Admins',
      icon: '👨‍💼',
      permissions: ['view', 'create', 'edit', 'delete']
    },
    {
      id: 'settings',
      name: 'Settings',
      icon: '⚙️',
      permissions: ['view', 'edit']
    }
  ];

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? checked : value
    });
  };

  const handlePermissionChange = (module, permission) => {
    setFormData({
      ...formData,
      permissions: {
        ...formData.permissions,
        [module]: {
          ...formData.permissions[module],
          [permission]: !formData.permissions[module][permission]
        }
      }
    });
  };

  const handleSelectAll = (module) => {
    const allSelected = Object.values(formData.permissions[module]).every(val => val);
    const newPermissions = {};
    
    Object.keys(formData.permissions[module]).forEach(permission => {
      newPermissions[permission] = !allSelected;
    });

    setFormData({
      ...formData,
      permissions: {
        ...formData.permissions,
        [module]: newPermissions
      }
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!formData.name.trim()) {
      setError('Role name is required');
      return;
    }

    setLoading(true);

    try {
      if (role) {
        await roleAPI.updateRole(role._id, formData);
      } else {
        await roleAPI.createRole(formData);
      }
      onSuccess();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to save role');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-container" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2>{role ? 'Edit Role' : 'Create New Role'}</h2>
          <button className="modal-close" onClick={onClose}>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <line x1="18" y1="6" x2="6" y2="18"></line>
              <line x1="6" y1="6" x2="18" y2="18"></line>
            </svg>
          </button>
        </div>

        <form onSubmit={handleSubmit} className="modal-body">
          {error && (
            <div className="alert alert-error">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="12" cy="12" r="10"></circle>
                <line x1="12" y1="8" x2="12" y2="12"></line>
                <line x1="12" y1="16" x2="12.01" y2="16"></line>
              </svg>
              {error}
            </div>
          )}

          <div className="form-section">
            <h3>Basic Information</h3>
            <div className="form-group">
              <label htmlFor="name">Role Name *</label>
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                placeholder="e.g., Content Manager"
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="description">Description</label>
              <textarea
                id="description"
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                rows="3"
                placeholder="Brief description of this role..."
              ></textarea>
            </div>

            <div className="form-group checkbox-group">
              <label className="checkbox-label">
                <input
                  type="checkbox"
                  name="isActive"
                  checked={formData.isActive}
                  onChange={handleInputChange}
                />
                <span>Active Role</span>
              </label>
            </div>
          </div>

          <div className="form-section">
            <h3>Permissions</h3>
            <p className="section-description">Select what this role can access and do</p>

            <div className="permissions-grid">
              {modules.map((module) => (
                <div key={module.id} className="permission-module">
                  <div className="module-header">
                    <div className="module-info">
                      <span className="module-icon">{module.icon}</span>
                      <h4>{module.name}</h4>
                    </div>
                    <button
                      type="button"
                      className="btn-text-small"
                      onClick={() => handleSelectAll(module.id)}
                    >
                      {Object.values(formData.permissions[module.id]).every(val => val)
                        ? 'Deselect All'
                        : 'Select All'}
                    </button>
                  </div>

                  <div className="module-permissions">
                    {module.permissions.map((permission) => (
                      <label key={permission} className="permission-checkbox">
                        <input
                          type="checkbox"
                          checked={formData.permissions[module.id][permission]}
                          onChange={() => handlePermissionChange(module.id, permission)}
                        />
                        <span className="permission-label">
                          {permission.charAt(0).toUpperCase() + permission.slice(1)}
                        </span>
                      </label>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="modal-footer">
            <button type="button" className="btn-secondary" onClick={onClose} disabled={loading}>
              Cancel
            </button>
            <button type="submit" className="btn-primary" disabled={loading}>
              {loading ? 'Saving...' : role ? 'Update Role' : 'Create Role'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default RoleModal;
