/* eslint-disable no-unused-vars */
import React, { useState, useEffect } from 'react';
import { useTheme } from '../context/ThemeContext';
import { useAuth } from '../context/AuthContext';
import { profileAPI } from '../services/api';
import '../assets/css/components/Settings.css';

function Settings() {
  const { theme, toggleTheme } = useTheme();
  const { admin } = useAuth();
  const [activeSection, setActiveSection] = useState('appearance');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });
  const [hasChanges, setHasChanges] = useState(false);

  const [settings, setSettings] = useState({
    // Appearance
    theme: 'light',
    
    // Notifications
    emailNotifications: true,
    pushNotifications: false,
    weeklyDigest: true,
    newUserAlerts: true,
    systemUpdates: false,
    
    // Dashboard
    dashboardLayout: 'default',
    cardsPerRow: '4',
    showSidebar: true,
    compactMode: false,
    
    // Account
    language: 'en',
    timezone: 'UTC',
    dateFormat: 'MM/DD/YYYY',
    currency: 'USD'
  });

  useEffect(() => {
    loadSettings();
  }, []);

  const loadSettings = async () => {
    try {
      const response = await profileAPI.getProfile();
      const prefs = response.data.admin.preferences;
      
      setSettings(prev => ({
        ...prev,
        theme: prefs.theme || 'light',
        emailNotifications: prefs.emailNotifications ?? true,
        dashboardLayout: prefs.dashboardLayout || 'default',
        language: prefs.language || 'en'
      }));
    } catch (error) {
      console.error('Failed to load settings');
    }
  };

  const showMessage = (type, text) => {
    setMessage({ type, text });
    setTimeout(() => setMessage({ type: '', text: '' }), 4000);
  };

  const handleSettingChange = (key, value) => {
    setSettings(prev => ({ ...prev, [key]: value }));
    setHasChanges(true);
  };

  const handleThemeChange = (newTheme) => {
    handleSettingChange('theme', newTheme);
    if (theme !== newTheme) {
      toggleTheme();
    }
  };

  const handleSaveSettings = async () => {
    setLoading(true);
    try {
      await profileAPI.updatePreferences({
        theme: settings.theme,
        emailNotifications: settings.emailNotifications,
        dashboardLayout: settings.dashboardLayout,
        language: settings.language
      });
      
      setHasChanges(false);
      showMessage('success', 'Settings saved successfully');
    } catch (error) {
      showMessage('error', 'Failed to save settings');
    } finally {
      setLoading(false);
    }
  };

  const handleResetSettings = () => {
    if (window.confirm('Are you sure you want to reset all settings to default?')) {
      loadSettings();
      setHasChanges(false);
      showMessage('success', 'Settings reset to default');
    }
  };

  const sections = [
    {
      id: 'appearance',
      name: 'Appearance',
      icon: (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <circle cx="12" cy="12" r="3"></circle>
          <path d="M12 1v6M12 17v6M4.22 4.22l4.24 4.24M15.54 15.54l4.24 4.24M1 12h6M17 12h6M4.22 19.78l4.24-4.24M15.54 8.46l4.24-4.24"></path>
        </svg>
      )
    },
    {
      id: 'notifications',
      name: 'Notifications',
      icon: (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"></path>
          <path d="M13.73 21a2 2 0 0 1-3.46 0"></path>
        </svg>
      )
    },
    {
      id: 'dashboard',
      name: 'Dashboard',
      icon: (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <rect x="3" y="3" width="7" height="7"></rect>
          <rect x="14" y="3" width="7" height="7"></rect>
          <rect x="14" y="14" width="7" height="7"></rect>
          <rect x="3" y="14" width="7" height="7"></rect>
        </svg>
      )
    },
    {
      id: 'account',
      name: 'Account',
      icon: (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
          <circle cx="12" cy="7" r="4"></circle>
        </svg>
      )
    }
  ];

  return (
    <div className="settings-page">
      <div className="settings-header">
        <div className="header-content">
          <h1>Settings</h1>
          <p>Manage your account preferences and configurations</p>
        </div>
        {hasChanges && (
          <div className="header-actions">
            <button className="btn-outline" onClick={handleResetSettings}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <polyline points="1 4 1 10 7 10"></polyline>
                <path d="M3.51 15a9 9 0 1 0 2.13-9.36L1 10"></path>
              </svg>
              Reset
            </button>
            <button className="btn-primary" onClick={handleSaveSettings} disabled={loading}>
              {loading ? (
                <>
                  <span className="spinner-mini"></span>
                  Saving...
                </>
              ) : (
                <>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z"></path>
                    <polyline points="17 21 17 13 7 13 7 21"></polyline>
                    <polyline points="7 3 7 8 15 8"></polyline>
                  </svg>
                  Save Changes
                </>
              )}
            </button>
          </div>
        )}
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

      <div className="settings-container">
        <aside className="settings-sidebar">
          <nav className="settings-nav">
            {sections.map(section => (
              <button
                key={section.id}
                className={`settings-nav-item ${activeSection === section.id ? 'active' : ''}`}
                onClick={() => setActiveSection(section.id)}
              >
                <span className="nav-icon">{section.icon}</span>
                <span className="nav-label">{section.name}</span>
                <svg className="nav-arrow" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <polyline points="9 18 15 12 9 6"></polyline>
                </svg>
              </button>
            ))}
          </nav>
        </aside>

        <main className="settings-content">
          {/* Appearance Section */}
          {activeSection === 'appearance' && (
            <div className="settings-section">
              <div className="section-header">
                <h2>Appearance</h2>
                <p>Customize how the dashboard looks and feels</p>
              </div>

              <div className="settings-group">
                <div className="setting-item-enhanced">
                  <div className="setting-label">
                    <h3>Theme</h3>
                    <p>Choose your preferred color scheme</p>
                  </div>
                  <div className="theme-selector">
                    <button
                      className={`theme-card ${settings.theme === 'light' ? 'active' : ''}`}
                      onClick={() => handleThemeChange('light')}
                    >
                      <div className="theme-preview light-preview">
                        <div className="preview-header"></div>
                        <div className="preview-body">
                          <div className="preview-sidebar"></div>
                          <div className="preview-content">
                            <div className="preview-card"></div>
                            <div className="preview-card"></div>
                          </div>
                        </div>
                      </div>
                      <div className="theme-info">
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
                        <span>Light</span>
                      </div>
                      {settings.theme === 'light' && (
                        <div className="theme-check">
                          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
                            <polyline points="20 6 9 17 4 12"></polyline>
                          </svg>
                        </div>
                      )}
                    </button>

                    <button
                      className={`theme-card ${settings.theme === 'dark' ? 'active' : ''}`}
                      onClick={() => handleThemeChange('dark')}
                    >
                      <div className="theme-preview dark-preview">
                        <div className="preview-header"></div>
                        <div className="preview-body">
                          <div className="preview-sidebar"></div>
                          <div className="preview-content">
                            <div className="preview-card"></div>
                            <div className="preview-card"></div>
                          </div>
                        </div>
                      </div>
                      <div className="theme-info">
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                          <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"></path>
                        </svg>
                        <span>Dark</span>
                      </div>
                      {settings.theme === 'dark' && (
                        <div className="theme-check">
                          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
                            <polyline points="20 6 9 17 4 12"></polyline>
                          </svg>
                        </div>
                      )}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Notifications Section */}
          {activeSection === 'notifications' && (
            <div className="settings-section">
              <div className="section-header">
                <h2>Notifications</h2>
                <p>Manage how you receive notifications</p>
              </div>

              <div className="settings-group">
                <h4 className="group-title">Email Notifications</h4>
                <div className="setting-item-enhanced">
                  <div className="setting-label">
                    <h3>Activity Notifications</h3>
                    <p>Receive emails about activity in your dashboard</p>
                  </div>
                  <label className="switch">
                    <input
                      type="checkbox"
                      checked={settings.emailNotifications}
                      onChange={(e) => handleSettingChange('emailNotifications', e.target.checked)}
                    />
                    <span className="switch-slider"></span>
                  </label>
                </div>

                <div className="setting-item-enhanced">
                  <div className="setting-label">
                    <h3>Weekly Digest</h3>
                    <p>Get a summary of weekly activity</p>
                  </div>
                  <label className="switch">
                    <input
                      type="checkbox"
                      checked={settings.weeklyDigest}
                      onChange={(e) => handleSettingChange('weeklyDigest', e.target.checked)}
                    />
                    <span className="switch-slider"></span>
                  </label>
                </div>

                <div className="setting-item-enhanced">
                  <div className="setting-label">
                    <h3>System Updates</h3>
                    <p>Notifications about system updates and maintenance</p>
                  </div>
                  <label className="switch">
                    <input
                      type="checkbox"
                      checked={settings.systemUpdates}
                      onChange={(e) => handleSettingChange('systemUpdates', e.target.checked)}
                    />
                    <span className="switch-slider"></span>
                  </label>
                </div>
              </div>

              <div className="settings-group">
                <h4 className="group-title">Push Notifications</h4>
                <div className="setting-item-enhanced">
                  <div className="setting-label">
                    <h3>Browser Notifications</h3>
                    <p>Show desktop notifications for important events</p>
                  </div>
                  <label className="switch">
                    <input
                      type="checkbox"
                      checked={settings.pushNotifications}
                      onChange={(e) => handleSettingChange('pushNotifications', e.target.checked)}
                    />
                    <span className="switch-slider"></span>
                  </label>
                </div>

                <div className="setting-item-enhanced">
                  <div className="setting-label">
                    <h3>New User Alerts</h3>
                    <p>Get notified when new users register</p>
                  </div>
                  <label className="switch">
                    <input
                      type="checkbox"
                      checked={settings.newUserAlerts}
                      onChange={(e) => handleSettingChange('newUserAlerts', e.target.checked)}
                    />
                    <span className="switch-slider"></span>
                  </label>
                </div>
              </div>
            </div>
          )}

          {/* Dashboard Section */}
          {activeSection === 'dashboard' && (
            <div className="settings-section">
              <div className="section-header">
                <h2>Dashboard</h2>
                <p>Configure your dashboard layout and preferences</p>
              </div>

              <div className="settings-group">
                <div className="setting-item-enhanced">
                  <div className="setting-label">
                    <h3>Layout Style</h3>
                    <p>Choose how your dashboard content is displayed</p>
                  </div>
                  <div className="radio-group">
                    <label className="radio-option">
                      <input
                        type="radio"
                        name="layout"
                        value="default"
                        checked={settings.dashboardLayout === 'default'}
                        onChange={(e) => handleSettingChange('dashboardLayout', e.target.value)}
                      />
                      <span className="radio-label">
                        <span className="radio-title">Default</span>
                        <span className="radio-desc">Balanced layout with all widgets</span>
                      </span>
                    </label>
                    <label className="radio-option">
                      <input
                        type="radio"
                        name="layout"
                        value="compact"
                        checked={settings.dashboardLayout === 'compact'}
                        onChange={(e) => handleSettingChange('dashboardLayout', e.target.value)}
                      />
                      <span className="radio-label">
                        <span className="radio-title">Compact</span>
                        <span className="radio-desc">Condensed view with less spacing</span>
                      </span>
                    </label>
                    <label className="radio-option">
                      <input
                        type="radio"
                        name="layout"
                        value="detailed"
                        checked={settings.dashboardLayout === 'detailed'}
                        onChange={(e) => handleSettingChange('dashboardLayout', e.target.value)}
                      />
                      <span className="radio-label">
                        <span className="radio-title">Detailed</span>
                        <span className="radio-desc">More information and larger widgets</span>
                      </span>
                    </label>
                  </div>
                </div>

                <div className="setting-item-enhanced">
                  <div className="setting-label">
                    <h3>Cards Per Row</h3>
                    <p>Number of metric cards displayed in each row</p>
                  </div>
                  <select
                    className="select-enhanced"
                    value={settings.cardsPerRow}
                    onChange={(e) => handleSettingChange('cardsPerRow', e.target.value)}
                  >
                    <option value="2">2 Cards</option>
                    <option value="3">3 Cards</option>
                    <option value="4">4 Cards</option>
                    <option value="6">6 Cards</option>
                  </select>
                </div>

                <div className="setting-item-enhanced">
                  <div className="setting-label">
                    <h3>Show Sidebar</h3>
                    <p>Display the navigation sidebar by default</p>
                  </div>
                  <label className="switch">
                    <input
                      type="checkbox"
                      checked={settings.showSidebar}
                      onChange={(e) => handleSettingChange('showSidebar', e.target.checked)}
                    />
                    <span className="switch-slider"></span>
                  </label>
                </div>

                <div className="setting-item-enhanced">
                  <div className="setting-label">
                    <h3>Compact Mode</h3>
                    <p>Reduce padding and spacing throughout the dashboard</p>
                  </div>
                  <label className="switch">
                    <input
                      type="checkbox"
                      checked={settings.compactMode}
                      onChange={(e) => handleSettingChange('compactMode', e.target.checked)}
                    />
                    <span className="switch-slider"></span>
                  </label>
                </div>
              </div>
            </div>
          )}

          {/* Account Section */}
          {activeSection === 'account' && (
            <div className="settings-section">
              <div className="section-header">
                <h2>Account</h2>
                <p>Regional and language preferences</p>
              </div>

              <div className="settings-group">
                <div className="setting-item-enhanced">
                  <div className="setting-label">
                    <h3>Language</h3>
                    <p>Select your preferred language</p>
                  </div>
                  <select
                    className="select-enhanced"
                    value={settings.language}
                    onChange={(e) => handleSettingChange('language', e.target.value)}
                  >
                    <option value="en">English</option>
                    <option value="es">Español</option>
                    <option value="fr">Français</option>
                    <option value="de">Deutsch</option>
                    <option value="it">Italiano</option>
                    <option value="pt">Português</option>
                    <option value="zh">中文</option>
                    <option value="ja">日本語</option>
                  </select>
                </div>

                <div className="setting-item-enhanced">
                  <div className="setting-label">
                    <h3>Timezone</h3>
                    <p>Your local timezone for accurate timestamps</p>
                  </div>
                  <select
                    className="select-enhanced"
                    value={settings.timezone}
                    onChange={(e) => handleSettingChange('timezone', e.target.value)}
                  >
                    <option value="UTC">UTC (Coordinated Universal Time)</option>
                    <option value="America/New_York">Eastern Time (ET)</option>
                    <option value="America/Chicago">Central Time (CT)</option>
                    <option value="America/Denver">Mountain Time (MT)</option>
                    <option value="America/Los_Angeles">Pacific Time (PT)</option>
                    <option value="Europe/London">London (GMT)</option>
                    <option value="Europe/Paris">Paris (CET)</option>
                    <option value="Asia/Tokyo">Tokyo (JST)</option>
                    <option value="Asia/Shanghai">Shanghai (CST)</option>
                  </select>
                </div>

                <div className="setting-item-enhanced">
                  <div className="setting-label">
                    <h3>Date Format</h3>
                    <p>How dates are displayed throughout the app</p>
                  </div>
                  <select
                    className="select-enhanced"
                    value={settings.dateFormat}
                    onChange={(e) => handleSettingChange('dateFormat', e.target.value)}
                  >
                    <option value="MM/DD/YYYY">MM/DD/YYYY (12/31/2025)</option>
                    <option value="DD/MM/YYYY">DD/MM/YYYY (31/12/2025)</option>
                    <option value="YYYY-MM-DD">YYYY-MM-DD (2025-12-31)</option>
                    <option value="MMM DD, YYYY">MMM DD, YYYY (Dec 31, 2025)</option>
                  </select>
                </div>

                <div className="setting-item-enhanced">
                  <div className="setting-label">
                    <h3>Currency</h3>
                    <p>Default currency for financial displays</p>
                  </div>
                  <select
                    className="select-enhanced"
                    value={settings.currency}
                    onChange={(e) => handleSettingChange('currency', e.target.value)}
                  >
                    <option value="USD">USD - US Dollar ($)</option>
                    <option value="EUR">EUR - Euro (€)</option>
                    <option value="GBP">GBP - British Pound (£)</option>
                    <option value="JPY">JPY - Japanese Yen (¥)</option>
                    <option value="CNY">CNY - Chinese Yuan (¥)</option>
                    <option value="INR">INR - Indian Rupee (₹)</option>
                  </select>
                </div>
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}

export default Settings;
