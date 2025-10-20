import React from 'react';
import '../assets/css/components/MainContent.css';

function MainContent({ sidebarOpen }) {
  const kpiMetrics = [
    { 
      title: 'Total Revenue', 
      value: '$54,239', 
      change: '+12.5%',
      changeValue: '+$4,200',
      positive: true,
      icon: (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <line x1="12" y1="1" x2="12" y2="23"></line>
          <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"></path>
        </svg>
      ),
      color: 'blue',
      trend: 'up'
    },
    { 
      title: 'Total Users', 
      value: '8,459', 
      change: '+8.2%',
      changeValue: '+642',
      positive: true,
      icon: (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
          <circle cx="9" cy="7" r="4"></circle>
          <path d="M23 21v-2a4 4 0 0 0-3-3.87"></path>
          <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
        </svg>
      ),
      color: 'green',
      trend: 'up'
    },
    { 
      title: 'Active Orders', 
      value: '3,567', 
      change: '-2.4%',
      changeValue: '-87',
      positive: false,
      icon: (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <circle cx="9" cy="21" r="1"></circle>
          <circle cx="20" cy="21" r="1"></circle>
          <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"></path>
        </svg>
      ),
      color: 'orange',
      trend: 'down'
    },
    { 
      title: 'Conversion Rate', 
      value: '3.46%', 
      change: '+1.2%',
      changeValue: '+0.4%',
      positive: true,
      icon: (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <polyline points="22 12 18 12 15 21 9 3 6 12 2 12"></polyline>
        </svg>
      ),
      color: 'purple',
      trend: 'up'
    }
  ];

  const salesData = [
    { month: 'Jan', value: 45, label: '$45k' },
    { month: 'Feb', value: 52, label: '$52k' },
    { month: 'Mar', value: 48, label: '$48k' },
    { month: 'Apr', value: 68, label: '$68k' },
    { month: 'May', value: 75, label: '$75k' },
    { month: 'Jun', value: 82, label: '$82k' },
    { month: 'Jul', value: 78, label: '$78k' },
    { month: 'Aug', value: 92, label: '$92k' },
    { month: 'Sep', value: 88, label: '$88k' },
    { month: 'Oct', value: 95, label: '$95k' },
    { month: 'Nov', value: 89, label: '$89k' },
    { month: 'Dec', value: 100, label: '$100k' }
  ];

  const customerMetrics = [
    { label: 'New Customers', value: 1234, percentage: 68, color: 'blue' },
    { label: 'Returning', value: 892, percentage: 48, color: 'green' },
    { label: 'Referrals', value: 456, percentage: 24, color: 'purple' }
  ];

  const recentTransactions = [
    { id: 'TXN-4587', customer: 'Robert Fox', type: 'Purchase', amount: '+$459.00', status: 'completed', time: '2 mins ago' },
    { id: 'TXN-4586', customer: 'Jenny Wilson', type: 'Refund', amount: '-$129.00', status: 'processing', time: '15 mins ago' },
    { id: 'TXN-4585', customer: 'Wade Warren', type: 'Purchase', amount: '+$789.00', status: 'completed', time: '1 hour ago' },
    { id: 'TXN-4584', customer: 'Esther Howard', type: 'Purchase', amount: '+$234.00', status: 'completed', time: '3 hours ago' },
    { id: 'TXN-4583', customer: 'Cameron Williamson', type: 'Subscription', amount: '+$99.00', status: 'pending', time: '5 hours ago' }
  ];

  const topProducts = [
    { name: 'Premium Subscription', sales: 2847, revenue: '$142,350', growth: '+18%', rating: 4.8 },
    { name: 'Enterprise License', sales: 1456, revenue: '$218,400', growth: '+24%', rating: 4.9 },
    { name: 'Basic Plan', sales: 3892, revenue: '$97,300', growth: '+12%', rating: 4.6 },
    { name: 'Professional Package', sales: 1678, revenue: '$83,900', growth: '+15%', rating: 4.7 }
  ];

  const trafficSources = [
    { source: 'Direct', visitors: 4250, percentage: 35, color: '#667eea' },
    { source: 'Organic Search', visitors: 3680, percentage: 30, color: '#3fb950' },
    { source: 'Social Media', visitors: 2440, percentage: 20, color: '#ff9f40' },
    { source: 'Referral', visitors: 1220, percentage: 10, color: '#bc8cff' },
    { source: 'Email', visitors: 610, percentage: 5, color: '#58a6ff' }
  ];

  return (
    <main className={`main-content ${sidebarOpen ? 'sidebar-open' : ''}`}>
      <div className="content-wrapper">
        {/* Enhanced Page Header */}
        <div className="page-header-enhanced">
          <div className="header-content">
            <div className="breadcrumb">
              <span className="breadcrumb-item">Dashboard</span>
              <span className="breadcrumb-separator">/</span>
              <span className="breadcrumb-item active">Analytics</span>
            </div>
            <h1 className="page-title">Dashboard Overview</h1>
            <p className="page-subtitle">Track your business metrics and performance</p>
          </div>
          <div className="header-actions-enhanced">
            <div className="date-range-picker">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
                <line x1="16" y1="2" x2="16" y2="6"></line>
                <line x1="8" y1="2" x2="8" y2="6"></line>
                <line x1="3" y1="10" x2="21" y2="10"></line>
              </svg>
              <span>Last 30 days</span>
            </div>
            <button className="btn btn-primary">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
                <polyline points="7 10 12 15 17 10"></polyline>
                <line x1="12" y1="15" x2="12" y2="3"></line>
              </svg>
              Export Report
            </button>
          </div>
        </div>

        {/* KPI Metrics Grid - Top Priority */}
        <div className="metrics-grid">
          {kpiMetrics.map((metric, index) => (
            <div key={index} className={`metric-card ${metric.color}`}>
              <div className="metric-icon-wrapper">
                <div className={`metric-icon ${metric.color}`}>
                  {metric.icon}
                </div>
              </div>
              <div className="metric-content">
                <span className="metric-label">{metric.title}</span>
                <h2 className="metric-value">{metric.value}</h2>
                <div className="metric-footer">
                  <span className={`metric-change ${metric.positive ? 'positive' : 'negative'}`}>
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
                      {metric.positive ? (
                        <polyline points="18 15 12 9 6 15"></polyline>
                      ) : (
                        <polyline points="6 9 12 15 18 9"></polyline>
                      )}
                    </svg>
                    {metric.change}
                  </span>
                  <span className="metric-change-value">{metric.changeValue}</span>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Primary Content Row - Charts */}
        <div className="dashboard-row">
          {/* Revenue Chart - Largest Widget */}
          <div className="chart-card primary-chart">
            <div className="card-header-advanced">
              <div className="card-title-group">
                <h3>Revenue Analytics</h3>
                <p className="card-description">Monthly revenue performance</p>
              </div>
              <div className="card-toolbar">
                <div className="btn-group">
                  <button className="btn-tab active">Month</button>
                  <button className="btn-tab">Year</button>
                </div>
                <button className="btn-icon-minimal">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <circle cx="12" cy="12" r="1"></circle>
                    <circle cx="12" cy="5" r="1"></circle>
                    <circle cx="12" cy="19" r="1"></circle>
                  </svg>
                </button>
              </div>
            </div>
            <div className="chart-container">
              <div className="chart-gradient-area">
                {salesData.map((data, index) => (
                  <div key={index} className="chart-bar-wrapper">
                    <div 
                      className="chart-bar-modern" 
                      style={{height: `${data.value}%`}}
                      data-tooltip={data.label}
                    >
                      <div className="bar-fill"></div>
                    </div>
                    <span className="chart-label">{data.month}</span>
                  </div>
                ))}
              </div>
            </div>
            <div className="chart-legend">
              <div className="legend-item">
                <span className="legend-dot blue"></span>
                <span>Revenue</span>
                <strong>$892k</strong>
              </div>
              <div className="legend-item">
                <span className="legend-dot green"></span>
                <span>Target</span>
                <strong>$1.2M</strong>
              </div>
            </div>
          </div>

          {/* Customer Analytics */}
          <div className="chart-card secondary-chart">
            <div className="card-header-advanced">
              <div className="card-title-group">
                <h3>Customer Analytics</h3>
                <p className="card-description">User acquisition breakdown</p>
              </div>
            </div>
            <div className="radial-progress-container">
              {customerMetrics.map((metric, index) => (
                <div key={index} className="progress-item-radial">
                  <div className="radial-chart" style={{
                    background: `conic-gradient(var(--accent-${metric.color}) ${metric.percentage * 3.6}deg, var(--bg-tertiary) 0deg)`
                  }}>
                    <div className="radial-inner">
                      <span className="radial-value">{metric.percentage}%</span>
                    </div>
                  </div>
                  <div className="radial-info">
                    <h4>{metric.value.toLocaleString()}</h4>
                    <span>{metric.label}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Secondary Content Row */}
        <div className="dashboard-row">
          {/* Traffic Sources */}
          <div className="chart-card">
            <div className="card-header-advanced">
              <div className="card-title-group">
                <h3>Traffic Sources</h3>
                <p className="card-description">Where your visitors come from</p>
              </div>
            </div>
            <div className="traffic-list">
              {trafficSources.map((source, index) => (
                <div key={index} className="traffic-item">
                  <div className="traffic-info">
                    <div className="traffic-icon" style={{backgroundColor: source.color}}></div>
                    <div className="traffic-details">
                      <span className="traffic-source">{source.source}</span>
                      <span className="traffic-count">{source.visitors.toLocaleString()} visitors</span>
                    </div>
                  </div>
                  <div className="traffic-stats">
                    <span className="traffic-percentage">{source.percentage}%</span>
                    <div className="traffic-progress">
                      <div 
                        className="traffic-progress-bar" 
                        style={{width: `${source.percentage}%`, backgroundColor: source.color}}
                      ></div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Top Products */}
          <div className="chart-card">
            <div className="card-header-advanced">
              <div className="card-title-group">
                <h3>Top Products</h3>
                <p className="card-description">Best selling items</p>
              </div>
              <button className="btn-text">View All</button>
            </div>
            <div className="products-table">
              {topProducts.map((product, index) => (
                <div key={index} className="product-row">
                  <div className="product-rank">{index + 1}</div>
                  <div className="product-details">
                    <h4>{product.name}</h4>
                    <div className="product-meta">
                      <span>{product.sales.toLocaleString()} sales</span>
                      <span className="rating">
                        <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor">
                          <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon>
                        </svg>
                        {product.rating}
                      </span>
                    </div>
                  </div>
                  <div className="product-stats">
                    <span className="product-revenue">{product.revenue}</span>
                    <span className="product-growth positive">{product.growth}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Full Width Transaction Table */}
        <div className="dashboard-row full">
          <div className="chart-card">
            <div className="card-header-advanced">
              <div className="card-title-group">
                <h3>Recent Transactions</h3>
                <p className="card-description">Latest financial activities</p>
              </div>
              <div className="card-toolbar">
                <div className="search-box">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <circle cx="11" cy="11" r="8"></circle>
                    <path d="m21 21-4.35-4.35"></path>
                  </svg>
                  <input type="search" placeholder="Search transactions..." />
                </div>
                <button className="btn-icon-minimal">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <line x1="4" y1="21" x2="4" y2="14"></line>
                    <line x1="4" y1="10" x2="4" y2="3"></line>
                    <line x1="12" y1="21" x2="12" y2="12"></line>
                    <line x1="12" y1="8" x2="12" y2="3"></line>
                    <line x1="20" y1="21" x2="20" y2="16"></line>
                    <line x1="20" y1="12" x2="20" y2="3"></line>
                  </svg>
                </button>
              </div>
            </div>
            <div className="table-wrapper">
              <table className="modern-table">
                <thead>
                  <tr>
                    <th>Transaction ID</th>
                    <th>Customer</th>
                    <th>Type</th>
                    <th>Amount</th>
                    <th>Status</th>
                    <th>Time</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {recentTransactions.map((txn, index) => (
                    <tr key={index}>
                      <td>
                        <span className="txn-id">{txn.id}</span>
                      </td>
                      <td>
                        <div className="customer-cell">
                          <div className="customer-avatar">{txn.customer.charAt(0)}</div>
                          <span>{txn.customer}</span>
                        </div>
                      </td>
                      <td><span className="txn-type">{txn.type}</span></td>
                      <td><strong className={txn.amount.startsWith('+') ? 'amount-positive' : 'amount-negative'}>{txn.amount}</strong></td>
                      <td>
                        <span className={`status-pill ${txn.status}`}>
                          {txn.status}
                        </span>
                      </td>
                      <td><span className="time-text">{txn.time}</span></td>
                      <td>
                        <button className="btn-action">
                          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <circle cx="12" cy="12" r="1"></circle>
                            <circle cx="19" cy="12" r="1"></circle>
                            <circle cx="5" cy="12" r="1"></circle>
                          </svg>
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div className="table-pagination">
              <span className="pagination-info">Showing 1 to 5 of 124 entries</span>
              <div className="pagination-controls">
                <button className="pagination-btn" disabled>Previous</button>
                <button className="pagination-btn active">1</button>
                <button className="pagination-btn">2</button>
                <button className="pagination-btn">3</button>
                <button className="pagination-btn">Next</button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}

export default MainContent;
