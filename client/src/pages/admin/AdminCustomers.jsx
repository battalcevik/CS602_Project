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

const AdminCustomers = () => {
  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [expandedCustomer, setExpandedCustomer] = useState(null);
  const [customerOrders, setCustomerOrders] = useState({});
  const [ordersLoading, setOrdersLoading] = useState({});

  useEffect(() => {
    const fetchCustomers = async () => {
      try {
        const res = await api.get('/admin/customers');
        setCustomers(res.data.data);
      } catch (err) {
        setError('Failed to load customers.');
      } finally {
        setLoading(false);
      }
    };
    fetchCustomers();
  }, []);

  const toggleCustomer = async (customerId) => {
    if (expandedCustomer === customerId) {
      setExpandedCustomer(null);
      return;
    }

    setExpandedCustomer(customerId);

    if (!customerOrders[customerId]) {
      setOrdersLoading((prev) => ({ ...prev, [customerId]: true }));
      try {
        const res = await api.get(`/admin/customers/${customerId}/orders`);
        setCustomerOrders((prev) => ({ ...prev, [customerId]: res.data.data }));
      } catch (err) {
        setCustomerOrders((prev) => ({ ...prev, [customerId]: [] }));
      } finally {
        setOrdersLoading((prev) => ({ ...prev, [customerId]: false }));
      }
    }
  };

  return (
    <div className="admin-page">
      <Navbar />
      <div className="admin-container">
        <div className="admin-header">
          <h1>👥 Manage Customers</h1>
          <p>View all registered customers and their order history.</p>
        </div>

        <div className="admin-section">
          <div className="admin-section-header">
            <h2>All Customers ({customers.length})</h2>
          </div>

          {loading ? (
            <div className="admin-loading">Loading customers...</div>
          ) : error ? (
            <div className="admin-error">{error}</div>
          ) : customers.length === 0 ? (
            <div className="admin-empty">No customers found.</div>
          ) : (
            <div>
              {customers.map((customer) => (
                <div key={customer._id} style={{ borderBottom: '1px solid #f0f0f0' }}>
                  {/* Customer Row */}
                  <div
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      padding: '16px 20px',
                      cursor: 'pointer',
                      transition: 'background 0.15s',
                    }}
                    onClick={() => toggleCustomer(customer._id)}
                    onMouseEnter={(e) => (e.currentTarget.style.background = '#fafafa')}
                    onMouseLeave={(e) => (e.currentTarget.style.background = 'transparent')}
                  >
                    <div
                      style={{
                        width: 40,
                        height: 40,
                        borderRadius: '50%',
                        background: '#131921',
                        color: '#febd69',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontWeight: 700,
                        fontSize: 16,
                        marginRight: 14,
                        flexShrink: 0,
                      }}
                    >
                      {customer.username.charAt(0).toUpperCase()}
                    </div>
                    <div style={{ flex: 1 }}>
                      <div style={{ fontWeight: 600, fontSize: 14, color: '#1a1a1a' }}>
                        {customer.username}
                      </div>
                      <div style={{ fontSize: 12, color: '#888' }}>{customer.email}</div>
                    </div>
                    <div style={{ fontSize: 12, color: '#999', marginRight: 20 }}>
                      Joined {new Date(customer.createdAt).toLocaleDateString()}
                    </div>
                    <div style={{ fontSize: 12, color: '#666', marginRight: 12 }}>
                      Click to view orders
                    </div>
                    <span style={{ fontSize: 12, color: '#aaa' }}>
                      {expandedCustomer === customer._id ? '▲' : '▼'}
                    </span>
                  </div>

                  {/* Orders Expansion */}
                  {expandedCustomer === customer._id && (
                    <div className="customer-orders-dropdown">
                      {ordersLoading[customer._id] ? (
                        <p style={{ color: '#888', fontSize: 13 }}>Loading orders...</p>
                      ) : !customerOrders[customer._id] || customerOrders[customer._id].length === 0 ? (
                        <p style={{ color: '#888', fontSize: 13 }}>No orders found for this customer.</p>
                      ) : (
                        customerOrders[customer._id].map((order) => (
                          <div
                            key={order._id}
                            style={{
                              background: '#fff',
                              border: '1px solid #e8e8e8',
                              borderRadius: 8,
                              padding: '12px 16px',
                              marginBottom: 10,
                            }}
                          >
                            <div
                              style={{
                                display: 'flex',
                                justifyContent: 'space-between',
                                alignItems: 'center',
                                marginBottom: 8,
                              }}
                            >
                              <span style={{ fontFamily: 'monospace', fontSize: 11, color: '#888' }}>
                                #{order._id.slice(-10).toUpperCase()}
                              </span>
                              <span
                                style={{
                                  padding: '2px 10px',
                                  borderRadius: 20,
                                  background: STATUS_COLORS[order.status] || '#666',
                                  color: '#fff',
                                  fontSize: 11,
                                  fontWeight: 600,
                                  textTransform: 'capitalize',
                                }}
                              >
                                {order.status}
                              </span>
                              <span style={{ fontWeight: 700, color: '#e47911' }}>
                                ${order.totalAmount.toFixed(2)}
                              </span>
                              <span style={{ fontSize: 12, color: '#888' }}>
                                {new Date(order.createdAt).toLocaleDateString()}
                              </span>
                            </div>
                            {order.items?.map((item, idx) => (
                              <div key={idx} className="customer-order-row">
                                <span>{item.product?.name || 'Product Unavailable'}</span>
                                <span>× {item.quantity}</span>
                                <span>${(item.priceAtOrder * item.quantity).toFixed(2)}</span>
                              </div>
                            ))}
                          </div>
                        ))
                      )}
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

export default AdminCustomers;
