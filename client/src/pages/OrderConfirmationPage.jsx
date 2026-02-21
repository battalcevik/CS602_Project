import React from 'react';
import { useLocation, Link } from 'react-router-dom';
import Navbar from '../components/Navbar';
import './OrderConfirmationPage.css';

const OrderConfirmationPage = () => {
  const location = useLocation();
  const orderId = location.state?.orderId;

  return (
    <div className="confirmation-page">
      <Navbar />
      <div className="confirmation-container">
        <div className="confirmation-card">
          <div className="checkmark-circle">✓</div>
          <h1>Order Placed Successfully!</h1>
          <p className="thank-you-msg">
            Thank you for shopping with ShopZone! Your order has been confirmed.
          </p>
          {orderId && (
            <div className="order-id-box">
              <p className="order-id-label">Order ID</p>
              <p className="order-id-value">{orderId}</p>
            </div>
          )}
          <div className="confirmation-steps">
            <div className="step active">
              <span className="step-icon">📦</span>
              <span>Order Placed</span>
            </div>
            <div className="step-line" />
            <div className="step">
              <span className="step-icon">🔄</span>
              <span>Processing</span>
            </div>
            <div className="step-line" />
            <div className="step">
              <span className="step-icon">🚚</span>
              <span>Shipped</span>
            </div>
            <div className="step-line" />
            <div className="step">
              <span className="step-icon">🏠</span>
              <span>Delivered</span>
            </div>
          </div>
          <div className="confirmation-actions">
            <Link to="/profile" className="view-orders-btn">View My Orders</Link>
            <Link to="/" className="continue-btn">Continue Shopping</Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderConfirmationPage;
