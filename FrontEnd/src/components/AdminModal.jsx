import React, { useState, useEffect } from 'react';
import { adminAPI } from '../services/api';
import '../assets/css/components/AdminModal.css';

function AdminModal({ admin, roles, onClose, onSuccess }) {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    roleId: '',
    phone: '',
    department: '',
    isActive: true
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  useEffect(() => {
    if (admin) {
      setFormData({
        name: admin.name,
        email: admin.email,
        password: '',
        roleId: admin.roleDetails?._id || '',
        phone: admin.phone || '',
        department: admin.department || '',
        isActive: admin.isActive
      });
    }
  }, [admin]);

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? checked : value
    });
  };

const handleSubmit = async (e) => {
  e.preventDefault();
  setError('');

  // Validation
  if (!formData.name.trim()) {
    setError('Name is required');
    return;
  }

  if (!formData.email.trim()) {
    setError('Email is required');
    return;
  }

  if (!admin && !formData.password) {
    setError('Password is required for new admin');
    return;
  }

  if (formData.password && formData.password.length < 6) {
    setError('Password must be at least 6 characters');
    return;
  }

  setLoading(true);

  try {
    const submitData = {
      name: formData.name,
      email: formData.email,
      phone: formData.phone || null,
      department: formData.department || null,
      isActive: formData.isActive
    };

    // Only send roleId if it's not empty string
    if (formData.roleId && formData.roleId !== '') {
      submitData.roleId = formData.roleId;
    }

    if (!admin) {
      submitData.password = formData.password;
    }

    if (admin) {
      await adminAPI.updateAdmin(admin.id, submitData);
    } else {
      await adminAPI.createAdmin(submitData);
    }
    onSuccess();
  } catch (err) {
    setError(err.response?.data?.message || 'Failed to save admin');
  } finally {
    setLoading(false);
  }
};


  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-container admin-modal" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2>{admin ? 'Edit Admin' : 'Add New Admin'}</h2>
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

          <div className="form-grid">
            <div className="form-group">
              <label htmlFor="name">Full Name *</label>
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                placeholder="John Doe"
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="email">Email Address *</label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                placeholder="admin@example.com"
                required
              />
            </div>

            {!admin && (
              <div className="form-group">
                <label htmlFor="password">Password *</label>
                <div className="password-input">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    id="password"
                    name="password"
                    value={formData.password}
                    onChange={handleInputChange}
                    placeholder="Minimum 6 characters"
                    required
                  />
                  <button
                    type="button"
                    className="password-toggle"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? (
                      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"></path>
                        <line x1="1" y1="1" x2="23" y2="23"></line>
                      </svg>
                    ) : (
                      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path>
                        <circle cx="12" cy="12" r="3"></circle>
                      </svg>
                    )}
                  </button>
                </div>
              </div>
            )}
<div className="form-group">
  <label htmlFor="roleId">Assign Role *</label>
  <select
    id="roleId"
    name="roleId"
    value={formData.roleId}
    onChange={handleInputChange}
    required
  >
    <option value="">Select a role</option>
    {roles.map(role => (
      <option key={role._id} value={role._id}>
        {role.name}
        {role.isSuperAdmin && ' (Super Admin)'}
      </option>
    ))}
  </select>
  <span className="form-hint">Role is required for all admins</span>
</div>


            <div className="form-group">
              <label htmlFor="phone">Phone Number</label>
              <input
                type="tel"
                id="phone"
                name="phone"
                value={formData.phone}
                onChange={handleInputChange}
                placeholder="+1 (555) 000-0000"
              />
            </div>

            <div className="form-group">
              <label htmlFor="department">Department</label>
              <input
                type="text"
                id="department"
                name="department"
                value={formData.department}
                onChange={handleInputChange}
                placeholder="e.g., Engineering"
              />
            </div>
          </div>

          <div className="form-group checkbox-group">
            <label className="checkbox-label">
              <input
                type="checkbox"
                name="isActive"
                checked={formData.isActive}
                onChange={handleInputChange}
              />
              <span>Active Admin</span>
            </label>
            <span className="form-hint">Inactive admins cannot log in</span>
          </div>

          <div className="modal-footer">
            <button type="button" className="btn-secondary" onClick={onClose} disabled={loading}>
              Cancel
            </button>
            <button type="submit" className="btn-primary" disabled={loading}>
              {loading ? 'Saving...' : admin ? 'Update Admin' : 'Create Admin'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default AdminModal;
