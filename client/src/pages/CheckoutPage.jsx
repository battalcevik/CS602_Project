import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import Navbar from '../components/Navbar';
import { useCart } from '../context/CartContext';
import api from '../services/api';
import './CheckoutPage.css';

const SERVER_URL = 'http://localhost:5001';

const CheckoutPage = () => {
  const { cart, cartTotal } = useCart();
  const navigate = useNavigate();
  const [placing, setPlacing] = useState(false);
  const [error, setError] = useState('');

  const items = cart?.items || [];

  const getImageSrc = (imageUrl) => {
    if (!imageUrl) return `https://via.placeholder.com/60x60?text=Item`;
    if (imageUrl.startsWith('http')) return imageUrl;
    return `${SERVER_URL}${imageUrl}`;
  };

  const handlePlaceOrder = async () => {
    if (items.length === 0) {
      setError('Your cart is empty.');
      return;
    }
    setPlacing(true);
    setError('');
    try {
      const orderItems = items.map((item) => ({
        productId: item.product._id,
        quantity: item.quantity,
      }));
      const res = await api.post('/orders', { items: orderItems });
      const orderId = res.data.data._id;
      navigate('/order-confirmation', { state: { orderId } });
    } catch (err) {
      setError(err.message);
    } finally {
      setPlacing(false);
    }
  };

  if (items.length === 0) {
    return (
      <div className="checkout-page">
        <Navbar />
        <div className="checkout-container">
          <div className="empty-checkout">
            <h2>No items to checkout</h2>
            <Link to="/" className="back-home-btn">← Go Shopping</Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="checkout-page">
      <Navbar />
      <div className="checkout-container">
        <h1 className="checkout-title">Checkout</h1>

        <div className="checkout-layout">
          {/* Order Items Summary */}
          <div className="checkout-items">
            <h2>Order Summary ({items.length} item{items.length !== 1 ? 's' : ''})</h2>
            {items.map((item) => (
              <div key={item._id} className="checkout-item">
                <img
                  src={getImageSrc(item.product?.imageUrl)}
                  alt={item.product?.name}
                  className="checkout-item-img"
                  onError={(e) => { e.target.src = 'https://via.placeholder.com/60x60?text=Item'; }}
                />
                <div className="checkout-item-info">
                  <p className="checkout-item-name">{item.product?.name}</p>
                  <p className="checkout-item-qty">Qty: {item.quantity} × ${item.product?.price?.toFixed(2)}</p>
                </div>
                <p className="checkout-item-total">
                  ${((item.product?.price || 0) * item.quantity).toFixed(2)}
                </p>
              </div>
            ))}

            <Link to="/cart" className="edit-cart-link">← Edit Cart</Link>
          </div>

          {/* Payment Panel */}
          <div className="checkout-panel">
            <h2>Payment Details</h2>
            <div className="mock-payment-notice">
              <span>🔒</span>
              <p>This is a demo store. No real payment is processed.</p>
            </div>

            <div className="total-breakdown">
              <div className="total-row">
                <span>Subtotal</span>
                <span>${cartTotal.toFixed(2)}</span>
              </div>
              <div className="total-row">
                <span>Shipping</span>
                <span className="free-text">FREE</span>
              </div>
              <div className="total-row">
                <span>Tax (estimated)</span>
                <span>${(cartTotal * 0.08).toFixed(2)}</span>
              </div>
              <div className="total-divider" />
              <div className="total-row grand-total">
                <span>Order Total</span>
                <span>${(cartTotal * 1.08).toFixed(2)}</span>
              </div>
            </div>

            {error && (
              <div className="checkout-error">
                <strong>Error:</strong> {error}
              </div>
            )}

            <button
              className="place-order-btn"
              onClick={handlePlaceOrder}
              disabled={placing}
            >
              {placing ? 'Placing Order...' : '🛒 Place Order'}
            </button>

            <p className="checkout-terms">
              By placing your order, you agree to ShopZone's terms and conditions.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CheckoutPage;
