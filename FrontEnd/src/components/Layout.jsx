import React, { useState } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import Header from './Header';
import Sidebar from './Sidebar';
import '../assets/css/components/Layout.css';

function Layout() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const location = useLocation();

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  // Check if current page is dashboard
  const isDashboardPage = location.pathname === '/dashboard' || location.pathname === '/';

  return (
    <div className="dashboard-layout">
      <Header toggleSidebar={toggleSidebar} />
      <Sidebar isOpen={sidebarOpen} toggleSidebar={toggleSidebar} />
      <main className={`main-layout-content ${sidebarOpen ? 'sidebar-open' : ''} ${isDashboardPage ? 'dashboard-page' : ''}`}>
        <Outlet />
      </main>
    </div>
  );
}

export default Layout;
