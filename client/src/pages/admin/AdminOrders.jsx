import React, { useEffect, useState } from 'react';
import Navbar from '../../components/Navbar';
import api from '../../services/api';
import './Admin.css';

const STATUS_COLORS = {
  pending: '#f59e0b',
  processing: '#3b82f6',
  shipped: '#8b5cf6',
  delivered: '#10b981',
  cancelled: '#ef4444',
};

const STATUSES = ['pending', 'processing', 'shipped', 'delivered', 'cancelled'];

const AdminOrders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

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

  useEffect(() => {
    fetchOrders();
  }, []);

  const handleStatusChange = async (orderId, status) => {
    try {
      const res = await api.put(`/orders/${orderId}`, { status });
      setOrders((prev) => prev.map((o) => (o._id === orderId ? res.data.data : o)));
    } catch (err) {
      alert('Failed to update status: ' + err.message);
    }
  };

  const handleDelete = async (orderId) => {
    if (!window.confirm('Delete this order? This cannot be undone.')) return;
    try {
      await api.delete(`/orders/${orderId}`);
      setOrders((prev) => prev.filter((o) => o._id !== orderId));
    } catch (err) {
      alert('Failed to delete order: ' + err.message);
    }
  };

  return (
    <div className="admin-page">
      <Navbar />
      <div className="admin-container">
        <div className="admin-header">
          <h1>📋 Manage Orders</h1>
          <p>View, update, and manage all customer orders.</p>
        </div>

        <div className="admin-section">
          <div className="admin-section-header">
            <h2>All Orders ({orders.length})</h2>
          </div>

          {loading ? (
            <div className="admin-loading">Loading orders...</div>
          ) : error ? (
            <div className="admin-error">{error}</div>
          ) : orders.length === 0 ? (
            <div className="admin-empty">No orders have been placed yet.</div>
          ) : (
            <div style={{ overflowX: 'auto' }}>
              <table className="admin-table">
                <thead>
                  <tr>
                    <th>Order ID</th>
                    <th>Customer</th>
                    <th>Date</th>
                    <th>Items</th>
                    <th>Total</th>
                    <th>Status</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {orders.map((order) => (
                    <tr key={order._id}>
                      <td style={{ fontFamily: 'monospace', fontSize: '11px' }}>
                        {order._id.slice(-8).toUpperCase()}
                      </td>
                      <td>
                        <div style={{ fontWeight: 600 }}>{order.user?.username || 'Unknown'}</div>
                        <div style={{ fontSize: '12px', color: '#888' }}>{order.user?.email}</div>
                      </td>
                      <td>{new Date(order.createdAt).toLocaleDateString()}</td>
                      <td>{order.items?.length} item{order.items?.length !== 1 ? 's' : ''}</td>
                      <td style={{ fontWeight: 700, color: '#e47911' }}>${order.totalAmount.toFixed(2)}</td>
                      <td>
                        <select
                          className="status-select"
                          value={order.status}
                          onChange={(e) => handleStatusChange(order._id, e.target.value)}
                          style={{
                            color: STATUS_COLORS[order.status] || '#666',
                            borderColor: STATUS_COLORS[order.status] || '#ddd',
                            fontWeight: 600,
                          }}
                        >
                          {STATUSES.map((s) => (
                            <option key={s} value={s}>{s}</option>
                          ))}
                        </select>
                      </td>
                      <td>
                        <button className="delete-btn" onClick={() => handleDelete(order._id)}>
                          🗑 Delete
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminOrders;
