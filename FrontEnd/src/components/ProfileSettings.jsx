import React, { useState, useEffect } from 'react';
import { useTheme } from '../context/ThemeContext';
import { profileAPI } from '../services/api';

function ProfileSettings() {
  const { theme, toggleTheme } = useTheme();
  const [preferences, setPreferences] = useState({
    theme: 'light',
    emailNotifications: true,
    dashboardLayout: 'default',
    language: 'en'
  });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });
  const [hasChanges, setHasChanges] = useState(false);

  useEffect(() => {
    loadPreferences();
  }, []);

  const loadPreferences = async () => {
    try {
      const response = await profileAPI.getProfile();
      const prefs = response.data.admin.preferences;
      
      setPreferences({
        theme: prefs.theme || theme,
        emailNotifications: prefs.emailNotifications ?? true,
        dashboardLayout: prefs.dashboardLayout || 'default',
        language: prefs.language || 'en'
      });
    } catch (error) {
      console.error('Failed to load preferences:', error);
    }
  };

  const showMessage = (type, text) => {
    setMessage({ type, text });
    setTimeout(() => setMessage({ type: '', text: '' }), 3000);
  };

  const handlePreferenceChange = (key, value) => {
    setPreferences(prev => ({ ...prev, [key]: value }));
    setHasChanges(true);
  };

  const handleThemeChange = (newTheme) => {
    handlePreferenceChange('theme', newTheme);
    if (theme !== newTheme) {
      toggleTheme();
    }
  };

  const handleSavePreferences = async () => {
    setLoading(true);
    try {
      await profileAPI.updatePreferences(preferences);
      
      setHasChanges(false);
      showMessage('success', 'Preferences saved successfully');
      await loadPreferences();
    } catch (error) {
      showMessage('error', error.response?.data?.message || 'Failed to save preferences');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="profile-section">
      <div className="section-header">
        <h2>Preferences</h2>
        <p>Customize your dashboard experience</p>
      </div>

      {message.text && (
        <div className={`alert-mini alert-${message.type}`}>
          {message.text}
        </div>
      )}

      <div className="preferences-content">
        {/* Theme Setting */}
        <div className="preference-group">
          <h3 className="preference-group-title">Appearance</h3>
          
          <div className="preference-item">
            <div className="preference-info">
              <h4>Theme</h4>
              <p>Choose your preferred color scheme</p>
            </div>
            <div className="preference-control">
              <div className="theme-buttons">
                <button 
                  className={`theme-btn ${preferences.theme === 'light' ? 'active' : ''}`}
                  onClick={() => handleThemeChange('light')}
                  type="button"
                >
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <circle cx="12" cy="12" r="5"></circle>
                    <line x1="12" y1="1" x2="12" y2="3"></line>
                    <line x1="12" y1="21" x2="12" y2="23"></line>
                    <line x1="4.22" y1="4.22" x2="5.64" y2="5.64"></line>
                    <line x1="18.36" y1="18.36" x2="19.78" y2="19.78"></line>
                    <line x1="1" y1="12" x2="3" y2="12"></line>
                    <line x1="21" y1="12" x2="23" y2="12"></line>
                    <line x1="4.22" y1="19.78" x2="5.64" y2="18.36"></line>
                    <line x1="18.36" y1="5.64" x2="19.78" y2="4.22"></line>
                  </svg>
                  Light
                </button>
                <button 
                  className={`theme-btn ${preferences.theme === 'dark' ? 'active' : ''}`}
                  onClick={() => handleThemeChange('dark')}
                  type="button"
                >
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"></path>
                  </svg>
                  Dark
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Notifications Setting */}
        <div className="preference-group">
          <h3 className="preference-group-title">Notifications</h3>
          
          <div className="preference-item">
            <div className="preference-info">
              <h4>Email Notifications</h4>
              <p>Receive email updates about your account activity</p>
            </div>
            <div className="preference-control">
              <label className="toggle-switch">
                <input
                  type="checkbox"
                  checked={preferences.emailNotifications}
                  onChange={(e) => handlePreferenceChange('emailNotifications', e.target.checked)}
                />
                <span className="toggle-slider"></span>
              </label>
            </div>
          </div>
        </div>

        {/* Dashboard Setting */}
        <div className="preference-group">
          <h3 className="preference-group-title">Dashboard</h3>
          
          <div className="preference-item">
            <div className="preference-info">
              <h4>Dashboard Layout</h4>
              <p>Choose how information is displayed</p>
            </div>
            <div className="preference-control">
              <select
                value={preferences.dashboardLayout}
                onChange={(e) => handlePreferenceChange('dashboardLayout', e.target.value)}
                className="preference-select"
              >
                <option value="default">Default</option>
                <option value="compact">Compact</option>
                <option value="detailed">Detailed</option>
              </select>
            </div>
          </div>
        </div>

        {/* Language Setting */}
        <div className="preference-group">
          <h3 className="preference-group-title">Language & Region</h3>
          
          <div className="preference-item">
            <div className="preference-info">
              <h4>Language</h4>
              <p>Select your preferred language</p>
            </div>
            <div className="preference-control">
              <select
                value={preferences.language}
                onChange={(e) => handlePreferenceChange('language', e.target.value)}
                className="preference-select"
              >
                <option value="en">English</option>
                <option value="es">Español</option>
                <option value="fr">Français</option>
                <option value="de">Deutsch</option>
                <option value="it">Italiano</option>
                <option value="pt">Português</option>
              </select>
            </div>
          </div>
        </div>

        {/* Save Button */}
        {hasChanges && (
          <div className="preference-actions">
            <button 
              type="button" 
              className="btn-secondary" 
              onClick={loadPreferences}
              disabled={loading}
            >
              Cancel
            </button>
            <button 
              type="button" 
              className="btn-primary" 
              onClick={handleSavePreferences}
              disabled={loading}
            >
              {loading ? 'Saving...' : 'Save Preferences'}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

export default ProfileSettings;
