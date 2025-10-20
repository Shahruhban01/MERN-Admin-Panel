/* eslint-disable react-refresh/only-export-components */
import React, { createContext, useContext, useState, useEffect } from 'react';
import { authAPI } from '../services/api';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [admin, setAdmin] = useState(null);
  const [token, setToken] = useState(localStorage.getItem('token'));
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [permissions, setPermissions] = useState(null);

  // Load admin data on mount if token exists
  useEffect(() => {
    const loadAdmin = async () => {
      if (token) {
        try {
          const response = await authAPI.getMe();
          const adminData = response.data.admin;
          setAdmin(adminData);
          
          // Set permissions
          if (adminData.roleDetails?.isSuperAdmin) {
            // Super admin has all permissions
            setPermissions({
              dashboard: { view: true, edit: true },
              users: { view: true, create: true, edit: true, delete: true },
              products: { view: true, create: true, edit: true, delete: true },
              orders: { view: true, create: true, edit: true, delete: true },
              analytics: { view: true },
              roles: { view: true, create: true, edit: true, delete: true },
              admins: { view: true, create: true, edit: true, delete: true },
              settings: { view: true, edit: true }
            });
          } else if (adminData.roleDetails) {
            setPermissions(adminData.roleDetails.permissions);
          } else {
            setPermissions({});
          }
          
          localStorage.setItem('admin', JSON.stringify(adminData));
        } catch (err) {
          console.error('Failed to load admin:', err);
          logout();
        }
      }
      setLoading(false);
    };

    loadAdmin();
  }, [token]);

  const login = async (email, password) => {
    try {
      setError(null);
      const response = await authAPI.login({ email, password });
      
      const { token: newToken, admin: adminData } = response.data;
      
      setToken(newToken);
      setAdmin(adminData);
      
      // Set permissions
      if (adminData.roleDetails?.isSuperAdmin) {
        setPermissions({
          dashboard: { view: true, edit: true },
          users: { view: true, create: true, edit: true, delete: true },
          products: { view: true, create: true, edit: true, delete: true },
          orders: { view: true, create: true, edit: true, delete: true },
          analytics: { view: true },
          roles: { view: true, create: true, edit: true, delete: true },
          admins: { view: true, create: true, edit: true, delete: true },
          settings: { view: true, edit: true }
        });
      } else if (adminData.roleDetails) {
        setPermissions(adminData.roleDetails.permissions);
      } else {
        setPermissions({});
      }
      
      localStorage.setItem('token', newToken);
      localStorage.setItem('admin', JSON.stringify(adminData));
      
      return { success: true };
    } catch (err) {
      const errorMessage = err.response?.data?.message || 'Login failed';
      setError(errorMessage);
      return { success: false, error: errorMessage };
    }
  };

  const register = async (name, email, password, roleId) => {
    try {
      setError(null);
      const response = await authAPI.register({ name, email, password, roleId });
      
      const { token: newToken, admin: adminData } = response.data;
      
      setToken(newToken);
      setAdmin(adminData);
      
      if (adminData.roleDetails) {
        setPermissions(adminData.roleDetails.permissions);
      } else {
        setPermissions({});
      }
      
      localStorage.setItem('token', newToken);
      localStorage.setItem('admin', JSON.stringify(adminData));
      
      return { success: true };
    } catch (err) {
      const errorMessage = err.response?.data?.message || 'Registration failed';
      setError(errorMessage);
      return { success: false, error: errorMessage };
    }
  };

  const logout = async () => {
    try {
      await authAPI.logout();
    } catch (err) {
      console.error('Logout error:', err);
    } finally {
      setToken(null);
      setAdmin(null);
      setPermissions(null);
      localStorage.removeItem('token');
      localStorage.removeItem('admin');
    }
  };

  // Check if user has specific permission
  const hasPermission = (module, action) => {
    if (!permissions) return false;
    if (admin?.roleDetails?.isSuperAdmin) return true;
    return permissions[module]?.[action] || false;
  };

  // Check if user has any of the specified permissions
  const hasAnyPermission = (permissionArray) => {
    if (!permissions) return false;
    if (admin?.roleDetails?.isSuperAdmin) return true;
    return permissionArray.some(({ module, action }) => 
      permissions[module]?.[action]
    );
  };

  // Check if user has all specified permissions
  const hasAllPermissions = (permissionArray) => {
    if (!permissions) return false;
    if (admin?.roleDetails?.isSuperAdmin) return true;
    return permissionArray.every(({ module, action }) => 
      permissions[module]?.[action]
    );
  };

  // Check if user is super admin
  const isSuperAdmin = () => {
    return admin?.roleDetails?.isSuperAdmin || false;
  };

  const value = {
    admin,
    token,
    loading,
    error,
    permissions,
    login,
    register,
    logout,
    hasPermission,
    hasAnyPermission,
    hasAllPermissions,
    isSuperAdmin,
    isAuthenticated: !!token
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
