import React, { useEffect, useState } from 'react';
import Navbar from '../components/Navbar';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';
import './ProfilePage.css';

const STATUS_COLORS = {
  pending: '#f59e0b',
  processing: '#3b82f6',
  shipped: '#8b5cf6',
  delivered: '#10b981',
  cancelled: '#ef4444',
};

const ProfilePage = () => {
  const { user } = useAuth();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [expandedOrder, setExpandedOrder] = useState(null);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const res = await api.get('/orders');
        setOrders(res.data.data);
      } catch (err) {
        setError('Failed to load orders.');
      } finally {
        setLoading(false);
      }
    };
    fetchOrders();
  }, []);

  const toggleOrder = (id) => {
    setExpandedOrder((prev) => (prev === id ? null : id));
  };

  return (
    <div className="profile-page">
      <Navbar />
      <div className="profile-container">
        {/* User Info */}
        <div className="profile-header-card">
          <div className="profile-avatar">{user?.username?.charAt(0).toUpperCase()}</div>
          <div className="profile-info">
            <h1>{user?.username}</h1>
            <p>{user?.email}</p>
            <span className="role-badge">{user?.role}</span>
          </div>
        </div>

        {/* Orders */}
        <div className="orders-section">
          <h2>My Orders</h2>
          {loading ? (
            <p className="loading-text">Loading your orders...</p>
          ) : error ? (
            <p className="error-text">{error}</p>
          ) : orders.length === 0 ? (
            <div className="no-orders">
              <span>📦</span>
              <p>You haven't placed any orders yet.</p>
            </div>
          ) : (
            <div className="orders-list">
              {orders.map((order) => (
                <div key={order._id} className="order-card">
                  <div
                    className="order-card-header"
                    onClick={() => toggleOrder(order._id)}
                  >
                    <div className="order-meta">
                      <p className="order-id-label">Order ID: <span>{order._id}</span></p>
                      <p className="order-date">{new Date(order.createdAt).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</p>
                    </div>
                    <div className="order-summary-right">
                      <span className="order-total">${order.totalAmount.toFixed(2)}</span>
                      <span
                        className="order-status-badge"
                        style={{ backgroundColor: STATUS_COLORS[order.status] || '#666' }}
                      >
                        {order.status}
                      </span>
                      <span className="expand-arrow">{expandedOrder === order._id ? '▲' : '▼'}</span>
                    </div>
                  </div>

                  {expandedOrder === order._id && (
                    <div className="order-items-expanded">
                      {order.items.map((item, idx) => (
                        <div key={idx} className="order-item-row">
                          <span className="order-item-name">{item.product?.name || 'Product Unavailable'}</span>
                          <span className="order-item-qty">× {item.quantity}</span>
                          <span className="order-item-price">${(item.priceAtOrder * item.quantity).toFixed(2)}</span>
                        </div>
                      ))}
                      <div className="order-items-total">
                        <span>Total:</span>
                        <span>${order.totalAmount.toFixed(2)}</span>
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
