import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProvider } from './context/ThemeContext';
import { AuthProvider } from './context/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';
import Layout from './components/Layout';
import Login from './components/auth/Login';
import Register from './components/auth/Register';
import Dashboard from './components/Dashboard';
import Profile from './components/Profile';
import Settings from './components/Settings';
import RoleManagement from './components/RoleManagement';
import AdminManagement from './components/AdminManagement';
import Users from './components/Users';
import Products from './components/Products';
import Orders from './components/Orders';
import Analytics from './components/Analytics';
import ActivityLogs from './components/ActivityLogs';
import AppSettings from './components/AppSettings';
import Pages from './components/pages/Pages';
import PageBuilder from './components/pages/PageBuilder';
import DynamicPageView from './components/pages/DynamicPageView';
import './App.css';

function App() {
  return (
    <BrowserRouter>
      <ThemeProvider>
        <AuthProvider>
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            
            <Route element={<ProtectedRoute />}>
              <Route element={<Layout />}>
                <Route path="/dashboard" element={<Dashboard />} />
                <Route path="/users" element={<Users />} />
                <Route path="/products" element={<Products />} />
                <Route path="/orders" element={<Orders />} />
                <Route path="/analytics" element={<Analytics />} />
                <Route path="/profile" element={<Profile />} />
                <Route path="/settings" element={<Settings />} />
                <Route path="/roles" element={<RoleManagement />} />
                <Route path="/admins" element={<AdminManagement />} />
                <Route path="/" element={<Navigate to="/dashboard" replace />} />
                <Route path="/activity-logs" element={<ActivityLogs />} />
                <Route path="/app-settings" element={<AppSettings />} />

              {/* Page Builder */}
                  <Route path="pages" element={<Pages />} />
                  <Route path="pages/create" element={<PageBuilder />} />
                  <Route path="pages/edit/:id" element={<PageBuilder />} />
                  
                  {/* Dynamic Pages */}
                  <Route path="page/:slug" element={<DynamicPageView />} />
                </Route>

                {/* Catch all */}
                <Route path="*" element={<Navigate to="/" replace />} />
            </Route>
          </Routes>
        </AuthProvider>
      </ThemeProvider>
    </BrowserRouter>
  );
}

export default App;
