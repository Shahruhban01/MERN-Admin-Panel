/* eslint-disable no-unused-vars */
import React, { useState, useEffect } from 'react';
import PermissionRoute from './PermissionRoute';
import PermissionGuard from './PermissionGuard';
import api from '../services/api';
import '../assets/css/components/AppSettings.css';

function AppSettings() {
  const [settings, setSettings] = useState({
    appName: '',
    logoUrl: '',
    faviconUrl: '',
    contactEmail: '',
    supportPhone: '',
    maintenanceMode: false,
    maintenanceMessage: '',
    allowRegistration: true,
    maxLoginAttempts: 5,
    sessionTimeout: 30,
    dateFormat: 'MM/DD/YYYY',
    timezone: 'UTC',
    language: 'en'
  });
  
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });
  const [hasChanges, setHasChanges] = useState(false);
  const [originalSettings, setOriginalSettings] = useState(null);
  const [lastUpdated, setLastUpdated] = useState(null);

  useEffect(() => {
    loadSettings();
  }, []);

  const loadSettings = async () => {
    try {
      setLoading(true);
      const response = await api.get('/app-settings');
      const data = response.data.data.settings;
      
      // Extract metadata if available
      if (response.data.meta) {
        setLastUpdated(response.data.meta.lastUpdatedAt);
      }
      
      setSettings(data);
      setOriginalSettings(data);
    } catch (error) {
      // Handle different error codes
      if (error.response?.data?.code === 'PERMISSION_DENIED') {
        showMessage('error', 'You do not have permission to view settings');
      } else {
        showMessage('error', error.response?.data?.message || 'Failed to load settings');
      }
    } finally {
      setLoading(false);
    }
  };

  const showMessage = (type, text) => {
    setMessage({ type, text });
    setTimeout(() => setMessage({ type: '', text: '' }), 4000);
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setSettings({
      ...settings,
      [name]: type === 'checkbox' ? checked : value
    });
    setHasChanges(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setSaving(true);
      const response = await api.put('/app-settings', settings);
      
      // Use the message from backend if available
      const successMessage = response.data?.message || 'Settings updated successfully';
      showMessage('success', successMessage);
      
      setHasChanges(false);
      await loadSettings();
    } catch (error) {
      // Handle validation errors
      if (error.response?.data?.code === 'VALIDATION_ERROR') {
        const errors = error.response.data.errors || [];
        const errorMessages = errors.map(err => err.msg).join(', ');
        showMessage('error', `Validation failed: ${errorMessages}`);
      } else {
        showMessage('error', error.response?.data?.message || 'Failed to update settings');
      }
    } finally {
      setSaving(false);
    }
  };

  const handleReset = async () => {
    if (!window.confirm('Reset all settings to defaults? This cannot be undone.')) {
      return;
    }

    try {
      setSaving(true);
      const response = await api.post('/app-settings/reset');
      
      const successMessage = response.data?.message || 'Settings reset to defaults';
      showMessage('success', successMessage);
      
      setHasChanges(false);
      await loadSettings();
    } catch (error) {
      showMessage('error', error.response?.data?.message || 'Failed to reset settings');
    } finally {
      setSaving(false);
    }
  };

  const handleCancel = () => {
    setSettings(originalSettings);
    setHasChanges(false);
  };

  // Quick toggle for boolean fields (uses new backend endpoint)
  const quickToggle = async (fieldName) => {
    try {
      const response = await api.post(`/app-settings/toggle/${fieldName}`);
      if (response.data.success) {
        showMessage('success', `${fieldName} toggled successfully`);
        await loadSettings();
      }
    } catch (error) {
      showMessage('error', `Failed to toggle ${fieldName}`);
    }
  };

  if (loading) {
    return (
      <div className="loading-container">
        <div className="spinner"></div>
        <p>Loading settings...</p>
      </div>
    );
  }

  return (
    <PermissionRoute module="settings" action="view">
      <div className="app-settings-page">
        <div className="page-header">
          <div className="header-content">
            <h1>Application Settings</h1>
            <p>Configure global application settings and preferences</p>
            {lastUpdated && (
              <span className="last-updated">
                Last updated: {new Date(lastUpdated).toLocaleString()}
              </span>
            )}
          </div>
          <PermissionGuard module="settings" action="edit">
            <button 
              className="btn-danger" 
              onClick={handleReset}
              disabled={saving}
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <polyline points="1 4 1 10 7 10"></polyline>
                <path d="M3.51 15a9 9 0 1 0 2.13-9.36L1 10"></path>
              </svg>
              Reset to Defaults
            </button>
          </PermissionGuard>
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

        <form onSubmit={handleSubmit} className="settings-form">
          {/* General Settings */}
          <div className="settings-section">
            <div className="section-header">
              <h2>General Settings</h2>
              <p>Basic application information and branding</p>
            </div>
            <div className="settings-grid">
              <div className="form-group">
                <label htmlFor="appName">Application Name</label>
                <input
                  type="text"
                  id="appName"
                  name="appName"
                  value={settings.appName}
                  onChange={handleChange}
                  placeholder="Admin Panel"
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="logoUrl">Logo URL</label>
                <input
                  type="url"
                  id="logoUrl"
                  name="logoUrl"
                  value={settings.logoUrl || ''}
                  onChange={handleChange}
                  placeholder="https://example.com/logo.png"
                />
              </div>

              <div className="form-group">
                <label htmlFor="faviconUrl">Favicon URL</label>
                <input
                  type="url"
                  id="faviconUrl"
                  name="faviconUrl"
                  value={settings.faviconUrl || ''}
                  onChange={handleChange}
                  placeholder="https://example.com/favicon.ico"
                />
              </div>
            </div>
          </div>

          {/* Contact Information */}
          <div className="settings-section">
            <div className="section-header">
              <h2>Contact Information</h2>
              <p>Support contact details</p>
            </div>
            <div className="settings-grid">
              <div className="form-group">
                <label htmlFor="contactEmail">Contact Email</label>
                <input
                  type="email"
                  id="contactEmail"
                  name="contactEmail"
                  value={settings.contactEmail}
                  onChange={handleChange}
                  placeholder="admin@example.com"
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="supportPhone">Support Phone</label>
                <input
                  type="tel"
                  id="supportPhone"
                  name="supportPhone"
                  value={settings.supportPhone || ''}
                  onChange={handleChange}
                  placeholder="+1 (555) 000-0000"
                />
              </div>
            </div>
          </div>

          {/* System Settings */}
          <div className="settings-section">
            <div className="section-header">
              <h2>System Settings</h2>
              <p>Security and system configuration</p>
            </div>
            <div className="settings-grid">
              <div className="form-group">
                <label htmlFor="maxLoginAttempts">Max Login Attempts</label>
                <input
                  type="number"
                  id="maxLoginAttempts"
                  name="maxLoginAttempts"
                  value={settings.maxLoginAttempts}
                  onChange={handleChange}
                  min="3"
                  max="10"
                  required
                />
                <span className="form-hint">Number of failed login attempts before lockout (3-10)</span>
              </div>

              <div className="form-group">
                <label htmlFor="sessionTimeout">Session Timeout (minutes)</label>
                <input
                  type="number"
                  id="sessionTimeout"
                  name="sessionTimeout"
                  value={settings.sessionTimeout}
                  onChange={handleChange}
                  min="5"
                  max="1440"
                  required
                />
                <span className="form-hint">Time before automatic logout (5-1440)</span>
              </div>

              <div className="form-group checkbox-group">
                <label className="checkbox-label">
                  <input
                    type="checkbox"
                    name="allowRegistration"
                    checked={settings.allowRegistration}
                    onChange={handleChange}
                  />
                  <span>Allow New Registrations</span>
                </label>
              </div>
            </div>
          </div>

          {/* Maintenance Mode */}
          <div className="settings-section">
            <div className="section-header">
              <h2>Maintenance Mode</h2>
              <p>Enable maintenance mode to restrict access</p>
            </div>
            <div className="form-group checkbox-group">
              <label className="checkbox-label">
                <input
                  type="checkbox"
                  name="maintenanceMode"
                  checked={settings.maintenanceMode}
                  onChange={handleChange}
                />
                <span>Enable Maintenance Mode</span>
              </label>
              <span className="form-hint">When enabled, only admins can access the system</span>
            </div>

            {settings.maintenanceMode && (
              <div className="form-group">
                <label htmlFor="maintenanceMessage">Maintenance Message</label>
                <textarea
                  id="maintenanceMessage"
                  name="maintenanceMessage"
                  value={settings.maintenanceMessage}
                  onChange={handleChange}
                  rows="3"
                  placeholder="Message to display during maintenance"
                ></textarea>
              </div>
            )}
          </div>

          {/* Localization */}
          <div className="settings-section">
            <div className="section-header">
              <h2>Localization</h2>
              <p>Date, time and language preferences</p>
            </div>
            <div className="settings-grid">
              <div className="form-group">
                <label htmlFor="dateFormat">Date Format</label>
                <select
                  id="dateFormat"
                  name="dateFormat"
                  value={settings.dateFormat}
                  onChange={handleChange}
                >
                  <option value="MM/DD/YYYY">MM/DD/YYYY</option>
                  <option value="DD/MM/YYYY">DD/MM/YYYY</option>
                  <option value="YYYY-MM-DD">YYYY-MM-DD</option>
                </select>
              </div>

              <div className="form-group">
                <label htmlFor="timezone">Timezone</label>
                <select
                  id="timezone"
                  name="timezone"
                  value={settings.timezone}
                  onChange={handleChange}
                >
                  <option value="UTC">UTC</option>
                  <option value="America/New_York">Eastern Time</option>
                  <option value="America/Chicago">Central Time</option>
                  <option value="America/Denver">Mountain Time</option>
                  <option value="America/Los_Angeles">Pacific Time</option>
                  <option value="Europe/London">London</option>
                  <option value="Europe/Paris">Paris</option>
                  <option value="Asia/Tokyo">Tokyo</option>
                </select>
              </div>

              <div className="form-group">
                <label htmlFor="language">Language</label>
                <select
                  id="language"
                  name="language"
                  value={settings.language}
                  onChange={handleChange}
                >
                  <option value="en">English</option>
                  <option value="es">Spanish</option>
                  <option value="fr">French</option>
                  <option value="de">German</option>
                </select>
              </div>
            </div>
          </div>

          {/* Form Actions */}
          <PermissionGuard module="settings" action="edit">
            <div className="settings-actions">
              {hasChanges && (
                <button 
                  type="button" 
                  className="btn-secondary" 
                  onClick={handleCancel}
                  disabled={saving}
                >
                  Cancel
                </button>
              )}
              <button 
                type="submit" 
                className="btn-primary" 
                disabled={saving || !hasChanges}
              >
                {saving ? 'Saving...' : 'Save Changes'}
              </button>
            </div>
          </PermissionGuard>
        </form>
      </div>
    </PermissionRoute>
  );
}

export default AppSettings;
