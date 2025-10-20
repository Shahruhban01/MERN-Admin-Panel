/* eslint-disable no-unused-vars */
import React, { useState, useEffect } from 'react';
import PermissionRoute from './PermissionRoute';

function Analytics() {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(false);
  }, []);

  return (
    <PermissionRoute module="analytics" action="view">
      <div className="analytics-page">
        <div className="page-header">
          <div className="header-content">
            <h1>Analytics Dashboard</h1>
            <p>View system analytics and reports</p>
          </div>
        </div>

        {loading ? (
          <div className="loading-container">
            <div className="spinner"></div>
            <p>Loading analytics...</p>
          </div>
        ) : (
          <div className="analytics-grid">
            <div className="analytics-card">
              <div className="card-header">
                <h3>Total Revenue</h3>
              </div>
              <div className="card-value">$0.00</div>
              <div className="card-footer">No data available</div>
            </div>

            <div className="analytics-card">
              <div className="card-header">
                <h3>Total Orders</h3>
              </div>
              <div className="card-value">0</div>
              <div className="card-footer">No orders yet</div>
            </div>

            <div className="analytics-card">
              <div className="card-header">
                <h3>Total Users</h3>
              </div>
              <div className="card-value">0</div>
              <div className="card-footer">No users registered</div>
            </div>
          </div>
        )}
      </div>
    </PermissionRoute>
  );
}

export default Analytics;
