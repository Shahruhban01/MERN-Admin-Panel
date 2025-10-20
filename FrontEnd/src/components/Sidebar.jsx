import React, { useState, useEffect, useMemo } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import '../assets/css/components/Sidebar.css';

function Sidebar({ isOpen, toggleSidebar }) {
  const location = useLocation();
  const { admin, hasPermission } = useAuth();
  const [expandedMenus, setExpandedMenus] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');

  // const isSuperAdmin = admin?.role === 'super-admin';
  const isSuperAdmin = admin?.roleDetails?.isSuperAdmin || false;

  // Navigation structure with permission requirements
  const navigationItems = [
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
      ), 
      path: '/dashboard',
      keywords: ['home', 'overview', 'main'],
      permission: { module: 'dashboard', action: 'view' }
    },
    { 
      id: 'users',
      name: 'Users', 
      icon: (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
          <circle cx="9" cy="7" r="4"></circle>
          <path d="M23 21v-2a4 4 0 0 0-3-3.87"></path>
          <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
        </svg>
      ), 
      path: '/users',
      keywords: ['customers', 'accounts', 'members'],
      permission: { module: 'users', action: 'view' }
    },
    { 
      id: 'products',
      name: 'Products', 
      icon: (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"></path>
        </svg>
      ),
      path: '/products',
      keywords: ['items', 'inventory', 'catalog'],
      permission: { module: 'products', action: 'view' },
      submenu: [
        { 
          name: 'All Products', 
          path: '/products',
          icon: (
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <line x1="8" y1="6" x2="21" y2="6"></line>
              <line x1="8" y1="12" x2="21" y2="12"></line>
              <line x1="8" y1="18" x2="21" y2="18"></line>
              <line x1="3" y1="6" x2="3.01" y2="6"></line>
              <line x1="3" y1="12" x2="3.01" y2="12"></line>
              <line x1="3" y1="18" x2="3.01" y2="18"></line>
            </svg>
          ),
          keywords: ['list', 'view all'],
          permission: { module: 'products', action: 'view' }
        },
        { 
          name: 'Add Product', 
          path: '/products/add',
          icon: (
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <line x1="12" y1="5" x2="12" y2="19"></line>
              <line x1="5" y1="12" x2="19" y2="12"></line>
            </svg>
          ),
          keywords: ['create', 'new'],
          permission: { module: 'products', action: 'create' }
        },
        { 
          name: 'Categories', 
          path: '/products/categories',
          icon: (
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M3 3h7v7H3zM14 3h7v7h-7zM14 14h7v7h-7zM3 14h7v7H3z"></path>
            </svg>
          ),
          keywords: ['groups', 'types'],
          permission: { module: 'products', action: 'view' }
        }
      ]
    },
    { 
      id: 'orders',
      name: 'Orders', 
      icon: (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <circle cx="9" cy="21" r="1"></circle>
          <circle cx="20" cy="21" r="1"></circle>
          <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"></path>
        </svg>
      ), 
      path: '/orders',
      keywords: ['sales', 'purchases', 'transactions'],
      permission: { module: 'orders', action: 'view' }
    },
    { 
      id: 'analytics',
      name: 'Analytics', 
      icon: (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <polyline points="22 12 18 12 15 21 9 3 6 12 2 12"></polyline>
        </svg>
      ), 
      path: '/analytics',
      keywords: ['reports', 'statistics', 'insights', 'charts'],
      permission: { module: 'analytics', action: 'view' },
      submenu: [
        { 
          name: 'Overview', 
          path: '/analytics',
          icon: (
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <line x1="18" y1="20" x2="18" y2="10"></line>
              <line x1="12" y1="20" x2="12" y2="4"></line>
              <line x1="6" y1="20" x2="6" y2="14"></line>
            </svg>
          ),
          keywords: ['summary'],
          permission: { module: 'analytics', action: 'view' }
        },
        { 
          name: 'Sales Reports', 
          path: '/analytics/sales',
          icon: (
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <line x1="12" y1="1" x2="12" y2="23"></line>
              <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"></path>
            </svg>
          ),
          keywords: ['revenue'],
          permission: { module: 'analytics', action: 'view' }
        },
        { 
          name: 'User Analytics', 
          path: '/analytics/users',
          icon: (
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
              <circle cx="9" cy="7" r="4"></circle>
            </svg>
          ),
          keywords: ['customers'],
          permission: { module: 'analytics', action: 'view' }
        }
      ]
    },
    {
      id: 'settings',
      name: 'Settings',
      icon: (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <circle cx="12" cy="12" r="3"></circle>
          <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"></path>
        </svg>
      ),
      keywords: ['configuration', 'preferences', 'account'],
      permission: { module: 'settings', action: 'view' },
      submenu: [
        { 
          name: 'Profile', 
          path: '/profile',
          icon: (
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
              <circle cx="12" cy="7" r="4"></circle>
            </svg>
          ),
          keywords: ['account', 'personal'],
          permission: { module: 'settings', action: 'view' }
        },
        { 
          name: 'Preferences', 
          path: '/settings',
          icon: (
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.39a2 2 0 0 0-.73-2.73l-.15-.08a2 2 0 0 1-1-1.74v-.5a2 2 0 0 1 1-1.74l.15-.09a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z"></path>
              <circle cx="12" cy="12" r="3"></circle>
            </svg>
          ),
          keywords: ['theme', 'notifications'],
          permission: { module: 'settings', action: 'view' }
        },
        ...(isSuperAdmin ? [
          { 
            name: 'Role Management', 
            path: '/roles',
            icon: (
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path>
              </svg>
            ),
            keywords: ['permissions', 'access control'],
            permission: { module: 'roles', action: 'view' }
          },
          { 
            name: 'Admin Management', 
            path: '/admins',
            icon: (
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M16 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
                <circle cx="8.5" cy="7" r="4"></circle>
                <polyline points="17 11 19 13 23 9"></polyline>
              </svg>
            ),
            keywords: ['users', 'team', 'staff'],
            permission: { module: 'admins', action: 'view' }
          }
        ] : [])
      ]
    }
  ];

  // Filter navigation based on permissions
  const accessibleNavigation = useMemo(() => {
    return navigationItems.filter(item => {
      // Check if user has permission for parent item
      if (item.permission) {
        const hasAccess = hasPermission(item.permission.module, item.permission.action);
        if (!hasAccess) return false;
      }

      // Filter submenu items based on permissions
      if (item.submenu) {
        item.submenu = item.submenu.filter(subItem => {
          if (subItem.permission) {
            return hasPermission(subItem.permission.module, subItem.permission.action);
          }
          return true;
        });
        
        // If all submenu items are filtered out, hide the parent
        if (item.submenu.length === 0) return false;
      }

      return true;
    });
  }, [admin, hasPermission]);

  // Filter navigation items based on search
  const filteredNavigation = useMemo(() => {
    if (!searchQuery.trim()) return accessibleNavigation;

    const query = searchQuery.toLowerCase();
    return accessibleNavigation.map(item => {
      const matchesParent = 
        item.name.toLowerCase().includes(query) ||
        item.keywords?.some(keyword => keyword.includes(query));

      if (item.submenu) {
        const filteredSubmenu = item.submenu.filter(subItem =>
          subItem.name.toLowerCase().includes(query) ||
          subItem.keywords?.some(keyword => keyword.includes(query))
        );

        if (filteredSubmenu.length > 0 || matchesParent) {
          return {
            ...item,
            submenu: filteredSubmenu,
            forceExpanded: filteredSubmenu.length > 0
          };
        }
        return null;
      }

      return matchesParent ? item : null;
    }).filter(Boolean);
  }, [searchQuery, accessibleNavigation]);

  // Auto-expand menus when searching
  useEffect(() => {
    if (searchQuery.trim()) {
      const expandedIds = filteredNavigation
        .filter(item => item.submenu && item.forceExpanded)
        .map(item => item.id);
      setExpandedMenus(expandedIds);
    }
  }, [searchQuery, filteredNavigation]);

  // Auto-expand active menu
  useEffect(() => {
    const activeItem = accessibleNavigation.find(item => {
      if (item.submenu) {
        return item.submenu.some(sub => location.pathname === sub.path);
      }
      return location.pathname === item.path;
    });

    if (activeItem && activeItem.submenu && !expandedMenus.includes(activeItem.id)) {
      setExpandedMenus(prev => [...prev, activeItem.id]);
    }
  }, [location.pathname, accessibleNavigation]);

  const toggleMenu = (menuId) => {
    setExpandedMenus(prev =>
      prev.includes(menuId)
        ? prev.filter(id => id !== menuId)
        : [...prev, menuId]
    );
  };

  const isActive = (path) => location.pathname === path;

  const handleLinkClick = () => {
    if (window.innerWidth <= 768) {
      toggleSidebar();
    }
  };

  return (
    <>
      <div 
        className={`sidebar-overlay ${isOpen ? 'active' : ''}`} 
        onClick={toggleSidebar}
      ></div>
      <aside className={`sidebar ${isOpen ? 'open' : ''}`}>
        <div className="sidebar-header">
          <div className="sidebar-search">
            <svg className="search-icon" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="11" cy="11" r="8"></circle>
              <path d="m21 21-4.35-4.35"></path>
            </svg>
            <input
              type="text"
              placeholder="Search navigation..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="search-input"
            />
            {searchQuery && (
              <button 
                className="search-clear"
                onClick={() => setSearchQuery('')}
                aria-label="Clear search"
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <line x1="18" y1="6" x2="6" y2="18"></line>
                  <line x1="6" y1="6" x2="18" y2="18"></line>
                </svg>
              </button>
            )}
          </div>
        </div>

        <nav className="sidebar-nav">
          <ul className="sidebar-menu">
            {filteredNavigation.length > 0 ? (
              filteredNavigation.map((item) => (
                <li key={item.id} className="sidebar-item">
                  {item.submenu ? (
                    <>
                      <button
                        className={`sidebar-link expandable ${
                          expandedMenus.includes(item.id) || item.forceExpanded ? 'expanded' : ''
                        }`}
                        onClick={() => toggleMenu(item.id)}
                      >
                        <span className="sidebar-icon">{item.icon}</span>
                        <span className="sidebar-text">{item.name}</span>
                        <svg 
                          className="expand-icon" 
                          width="16" 
                          height="16" 
                          viewBox="0 0 24 24" 
                          fill="none" 
                          stroke="currentColor" 
                          strokeWidth="2"
                        >
                          <polyline points="6 9 12 15 18 9"></polyline>
                        </svg>
                      </button>
                      {(expandedMenus.includes(item.id) || item.forceExpanded) && item.submenu.length > 0 && (
                        <ul className="sidebar-submenu">
                          {item.submenu.map((subItem, subIndex) => (
                            <li key={subIndex}>
                              <Link
                                to={subItem.path}
                                className={`sidebar-sublink ${isActive(subItem.path) ? 'active' : ''}`}
                                onClick={handleLinkClick}
                              >
                                <span className="sidebar-icon">{subItem.icon}</span>
                                <span className="sidebar-text">{subItem.name}</span>
                              </Link>
                            </li>
                          ))}
                        </ul>
                      )}
                    </>
                  ) : (
                    <Link 
                      to={item.path} 
                      className={`sidebar-link ${isActive(item.path) ? 'active' : ''}`}
                      onClick={handleLinkClick}
                    >
                      <span className="sidebar-icon">{item.icon}</span>
                      <span className="sidebar-text">{item.name}</span>
                    </Link>
                  )}
                </li>
              ))
            ) : (
              <li className="sidebar-empty">
                <div className="empty-state-sidebar">
                  <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1">
                    <circle cx="11" cy="11" r="8"></circle>
                    <path d="m21 21-4.35-4.35"></path>
                  </svg>
                  <p>No results found</p>
                  <small>Try a different search term</small>
                </div>
              </li>
            )}
          </ul>
        </nav>

        <div className="sidebar-footer">
          <div className="sidebar-user">
            <img src={admin?.avatar} alt={admin?.name} className="sidebar-user-avatar" />
            <div className="sidebar-user-info">
              <span className="sidebar-user-name">{admin?.name}</span>
              <span className="sidebar-user-role">
                {admin?.roleDetails?.name || 'No Role'}
              </span>
            </div>
          </div>
        </div>
      </aside>
    </>
  );
}

export default Sidebar;
