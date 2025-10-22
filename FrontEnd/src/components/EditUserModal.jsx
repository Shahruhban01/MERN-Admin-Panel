import React, { useState, useEffect } from 'react';
import '../assets/css/components/Common.css';
import api from '../services/api';

function EditUserModal({ user, onClose, onSuccess, showMessage }) {
  const [form, setForm] = useState({
    name: '',
    email: '',
    isActive: true
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (user) {
      setForm({
        name: user.name,
        email: user.email,
        isActive: user.isActive
      });
    }
  }, [user]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm({ ...form, [name]: type === 'checkbox' ? checked : value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      await api.put(`/users/${user._id}`, form);
      showMessage('success', 'User updated successfully');
      onSuccess();
    } catch (error) {
      showMessage('error', error.response?.data?.message || 'Failed to update user');
    } finally {
      setLoading(false);
    }
  };

  if (!user) return null;

  return (
    <div className="modal-overlay">
      <div className="modal">
        <h2>Edit User</h2>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Full Name</label>
            <input name="name" value={form.name} onChange={handleChange} required />
          </div>
          <div className="form-group">
            <label>Email</label>
            <input name="email" type="email" value={form.email} onChange={handleChange} required />
          </div>
          <div className="form-group checkbox">
            <label>
              <input
                type="checkbox"
                name="isActive"
                checked={form.isActive}
                onChange={handleChange}
              />
              Active
            </label>
          </div>
          <div className="modal-actions">
            <button type="button" className="btn-secondary" onClick={onClose}>Cancel</button>
            <button type="submit" className="btn-primary" disabled={loading}>
              {loading ? 'Saving...' : 'Save Changes'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default EditUserModal;
