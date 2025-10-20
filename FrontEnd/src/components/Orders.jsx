/* eslint-disable no-unused-vars */
import React, { useState, useEffect } from 'react';
import PermissionRoute from './PermissionRoute';
import PermissionGuard from './PermissionGuard';
import api from '../services/api';

function Orders() {
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState({ type: '', text: '' });

  useEffect(() => {
    setLoading(false);
  }, []);

  return (
    <PermissionRoute module="orders" action="view">
      <div className="orders-page">
        <div className="page-header">
          <div className="header-content">
            <h1>Orders Management</h1>
            <p>View and manage customer orders</p>
          </div>
          <PermissionGuard module="orders" action="create">
            <button className="btn-primary">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <line x1="12" y1="5" x2="12" y2="19"></line>
                <line x1="5" y1="12" x2="19" y2="12"></line>
              </svg>
              Create Order
            </button>
          </PermissionGuard>
        </div>

        {loading ? (
          <div className="loading-container">
            <div className="spinner"></div>
            <p>Loading orders...</p>
          </div>
        ) : (
          <div className="empty-state">
            <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1">
              <circle cx="9" cy="21" r="1"></circle>
              <circle cx="20" cy="21" r="1"></circle>
              <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"></path>
            </svg>
            <h3>No orders yet</h3>
            <p>Orders will appear here once customers place them</p>
          </div>
        )}
      </div>
    </PermissionRoute>
  );
}

export default Orders;
