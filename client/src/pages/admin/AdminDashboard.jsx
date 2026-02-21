import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import Navbar from '../../components/Navbar';
import api from '../../services/api';
import './Admin.css';

const AdminDashboard = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await api.get('/admin/stats');
        setStats(res.data.data);
      } catch (err) {
        console.error('Stats error:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, []);

  return (
    <div className="admin-page">
      <Navbar />
      <div className="admin-container">
        <div className="admin-header">
          <h1>🏠 Admin Dashboard</h1>
          <p>Welcome to the ShopZone admin panel. Manage your store from here.</p>
        </div>

        {/* Stats Cards */}
        <div className="stats-grid">
          <div className="stat-card blue">
            <div className="stat-icon">📦</div>
            <div className="stat-info">
              <p className="stat-label">Total Products</p>
              <p className="stat-value">{loading ? '...' : stats?.totalProducts ?? 0}</p>
            </div>
          </div>
          <div className="stat-card green">
            <div className="stat-icon">📋</div>
            <div className="stat-info">
              <p className="stat-label">Total Orders</p>
              <p className="stat-value">{loading ? '...' : stats?.totalOrders ?? 0}</p>
            </div>
          </div>
          <div className="stat-card purple">
            <div className="stat-icon">👥</div>
            <div className="stat-info">
              <p className="stat-label">Total Customers</p>
              <p className="stat-value">{loading ? '...' : stats?.totalCustomers ?? 0}</p>
            </div>
          </div>
          <div className="stat-card orange">
            <div className="stat-icon">💰</div>
            <div className="stat-info">
              <p className="stat-label">Total Revenue</p>
              <p className="stat-value">{loading ? '...' : `$${(stats?.totalRevenue ?? 0).toFixed(2)}`}</p>
            </div>
          </div>
        </div>

        {/* Quick Links */}
        <div className="quick-links">
          <h2>Quick Actions</h2>
          <div className="quick-links-grid">
            <Link to="/admin/products" className="quick-link-card">
              <span className="ql-icon">📦</span>
              <h3>Manage Products</h3>
              <p>Add, edit, or remove products from your store</p>
            </Link>
            <Link to="/admin/products/add" className="quick-link-card primary">
              <span className="ql-icon">➕</span>
              <h3>Add New Product</h3>
              <p>List a new product with images and details</p>
            </Link>
            <Link to="/admin/orders" className="quick-link-card">
              <span className="ql-icon">📋</span>
              <h3>Manage Orders</h3>
              <p>View and update order statuses</p>
            </Link>
            <Link to="/admin/customers" className="quick-link-card">
              <span className="ql-icon">👥</span>
              <h3>Manage Customers</h3>
              <p>View customers and their order history</p>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
