/* eslint-disable no-unused-vars */
import React, { useState, useEffect } from 'react';
import PermissionRoute from './PermissionRoute';
import { adminAPI, roleAPI } from '../services/api';
import AdminModal from './AdminModal';
import '../assets/css/components/AdminManagement.css';

function AdminManagement() {
  const [admins, setAdmins] = useState([]);
  const [roles, setRoles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState({ type: '', text: '' });
  const [showModal, setShowModal] = useState(false);
  const [selectedAdmin, setSelectedAdmin] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterRole, setFilterRole] = useState('all');
  const [filterStatus, setFilterStatus] = useState('all');

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      const [adminsRes, rolesRes] = await Promise.all([
        adminAPI.getAllAdmins(),
        roleAPI.getAllRoles()
      ]);
      setAdmins(adminsRes.data.admins);
      setRoles(rolesRes.data.roles);
    } catch (error) {
      showMessage('error', 'Failed to load data');
    } finally {
      setLoading(false);
    }
  };

  const showMessage = (type, text) => {
    setMessage({ type, text });
    setTimeout(() => setMessage({ type: '', text: '' }), 4000);
  };

  const handleCreateAdmin = () => {
    setSelectedAdmin(null);
    setShowModal(true);
  };

  const handleEditAdmin = (admin) => {
    setSelectedAdmin(admin);
    setShowModal(true);
  };

  const handleDeleteAdmin = async (adminId, adminName) => {
    if (!window.confirm(`Are you sure you want to delete admin "${adminName}"?`)) {
      return;
    }

    try {
      await adminAPI.deleteAdmin(adminId);
      showMessage('success', 'Admin deleted successfully');
      loadData();
    } catch (error) {
      showMessage('error', error.response?.data?.message || 'Failed to delete admin');
    }
  };

  const handleToggleStatus = async (admin) => {
    try {
      await adminAPI.updateAdmin(admin.id, {
        isActive: !admin.isActive
      });
      showMessage('success', `Admin ${admin.isActive ? 'deactivated' : 'activated'} successfully`);
      loadData();
    } catch (error) {
      showMessage('error', error.response?.data?.message || 'Failed to update status');
    }
  };

  const handleModalClose = () => {
    setShowModal(false);
    setSelectedAdmin(null);
  };

  const handleModalSuccess = () => {
    loadData();
    handleModalClose();
    showMessage('success', selectedAdmin ? 'Admin updated successfully' : 'Admin created successfully');
  };

  const filteredAdmins = admins.filter(admin => {
    const matchesSearch = 
      admin.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      admin.email.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesRole = filterRole === 'all' || 
      (filterRole === 'super-admin' && admin.role === 'super-admin') ||
      (filterRole === 'no-role' && !admin.roleDetails) ||
      (admin.roleDetails?._id === filterRole);
    
    const matchesStatus = filterStatus === 'all' ||
      (filterStatus === 'active' && admin.isActive) ||
      (filterStatus === 'inactive' && !admin.isActive);

    return matchesSearch && matchesRole && matchesStatus;
  });

  if (loading) {
    return (
      <div className="loading-container">
        <div className="spinner"></div>
        <p>Loading admins...</p>
      </div>
    );
  }

  return (
     <PermissionRoute module="admins" action="view">
    <div className="admin-management">
      <div className="page-header">
        <div className="header-content">
          <h1>Admin Management</h1>
          <p>Manage system administrators and their roles</p>
        </div>
        <button className="btn-primary" onClick={handleCreateAdmin}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <line x1="12" y1="5" x2="12" y2="19"></line>
            <line x1="5" y1="12" x2="19" y2="12"></line>
          </svg>
          Add Admin
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
            placeholder="Search admins..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        <div className="filters">
          <select value={filterRole} onChange={(e) => setFilterRole(e.target.value)}>
            <option value="all">All Roles</option>
            <option value="super-admin">Super Admin</option>
            <option value="no-role">No Role Assigned</option>
            {roles.filter(r => r.isActive).map(role => (
              <option key={role._id} value={role._id}>{role.name}</option>
            ))}
          </select>

          <select value={filterStatus} onChange={(e) => setFilterStatus(e.target.value)}>
            <option value="all">All Status</option>
            <option value="active">Active</option>
            <option value="inactive">Inactive</option>
          </select>
        </div>

        <div className="table-info">
          <span>{filteredAdmins.length} admin{filteredAdmins.length !== 1 ? 's' : ''}</span>
        </div>
      </div>

      <div className="table-wrapper">
        <table className="admin-table">
          <thead>
            <tr>
              <th>Admin</th>
              <th>Email</th>
              <th>Role</th>
              <th>Department</th>
              <th>Status</th>
              <th>Last Login</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredAdmins.map((admin) => (
              <tr key={admin.id}>
                <td>
                  <div className="admin-info">
                    <img src={admin.avatar} alt={admin.name} className="admin-avatar" />
                    <div>
                      <div className="admin-name">{admin.name}</div>
                      {admin.role === 'super-admin' && (
                        <span className="badge badge-super">Super Admin</span>
                      )}
                    </div>
                  </div>
                </td>
                <td>{admin.email}</td>
                {/* <td>
                  {admin.roleDetails ? (
                    <span className="role-badge">{admin.roleDetails.name}</span>
                  ) : (
                    <span className="text-muted">No role assigned</span>
                  )}
                </td> */}
<td>
  <span className="role-badge">
    {admin.displayRole}
    {admin.roleDetails?.isSuperAdmin && (
      <span className="badge badge-super" style={{marginLeft: '8px'}}>Super Admin</span>
    )}
  </span>
</td>


                <td>{admin.department || '-'}</td>
                <td>
                  <button
                    className={`status-toggle ${admin.isActive ? 'active' : 'inactive'}`}
                    onClick={() => handleToggleStatus(admin)}
                    title={admin.isActive ? 'Click to deactivate' : 'Click to activate'}
                  >
                    {admin.isActive ? 'Active' : 'Inactive'}
                  </button>
                </td>
                <td>
                  {admin.lastLogin
                    ? new Date(admin.lastLogin).toLocaleDateString()
                    : 'Never'}
                </td>
                <td>
                  <div className="action-buttons">
                    <button
                      className="btn-icon"
                      onClick={() => handleEditAdmin(admin)}
                      title="Edit admin"
                    >
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path>
                        <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path>
                      </svg>
                    </button>
                    {admin.role !== 'super-admin' && (
                      <button
                        className="btn-icon btn-danger"
                        onClick={() => handleDeleteAdmin(admin.id, admin.name)}
                        title="Delete admin"
                      >
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                          <polyline points="3 6 5 6 21 6"></polyline>
                          <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
                        </svg>
                      </button>
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {filteredAdmins.length === 0 && (
          <div className="empty-state">
            <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1">
              <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
              <circle cx="9" cy="7" r="4"></circle>
              <path d="M23 21v-2a4 4 0 0 0-3-3.87"></path>
              <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
            </svg>
            <h3>No admins found</h3>
            <p>
              {searchTerm || filterRole !== 'all' || filterStatus !== 'all'
                ? 'Try adjusting your filters'
                : 'Add your first admin to get started'}
            </p>
          </div>
        )}
      </div>

      {showModal && (
        <AdminModal
          admin={selectedAdmin}
          roles={roles.filter(r => r.isActive)}
          onClose={handleModalClose}
          onSuccess={handleModalSuccess}
        />
      )}
    </div>
    </PermissionRoute>
  );
}

export default AdminManagement;
