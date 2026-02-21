import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import { useCart } from '../context/CartContext';
import './CartPage.css';

const SERVER_URL = 'http://localhost:5001';

const CartPage = () => {
  const { cart, cartLoading, cartTotal, updateCartItem, removeCartItem, clearCart } = useCart();
  const navigate = useNavigate();

  const getImageSrc = (imageUrl, name) => {
    if (!imageUrl) return `https://via.placeholder.com/80x80?text=Item`;
    if (imageUrl.startsWith('http')) return imageUrl;
    return `${SERVER_URL}${imageUrl}`;
  };

  const handleQuantityChange = async (itemId, newQty) => {
    try {
      await updateCartItem(itemId, newQty);
    } catch (err) {
      alert(err.message);
    }
  };

  const handleRemove = async (itemId) => {
    try {
      await removeCartItem(itemId);
    } catch (err) {
      alert(err.message);
    }
  };

  const handleClearCart = async () => {
    if (window.confirm('Clear all items from your cart?')) {
      await clearCart();
    }
  };

  if (cartLoading) {
    return (
      <div className="cart-page">
        <Navbar />
        <div className="cart-loading">Loading your cart...</div>
      </div>
    );
  }

  const items = cart?.items || [];

  return (
    <div className="cart-page">
      <Navbar />
      <div className="cart-container">
        <h1 className="cart-title">🛒 Shopping Cart</h1>

        {items.length === 0 ? (
          <div className="empty-cart">
            <span className="empty-cart-icon">🛒</span>
            <h2>Your cart is empty</h2>
            <p>Add some products to get started!</p>
            <Link to="/" className="shop-now-btn">Shop Now</Link>
          </div>
        ) : (
          <div className="cart-layout">
            {/* Cart Items */}
            <div className="cart-items-section">
              <div className="cart-items-header">
                <span>{items.length} item{items.length !== 1 ? 's' : ''} in cart</span>
                <button className="clear-cart-btn" onClick={handleClearCart}>
                  🗑 Clear Cart
                </button>
              </div>

              {items.map((item) => (
                <div key={item._id} className="cart-item">
                  <Link to={`/products/${item.product?._id}`}>
                    <img
                      src={getImageSrc(item.product?.imageUrl, item.product?.name)}
                      alt={item.product?.name}
                      className="cart-item-image"
                      onError={(e) => {
                        e.target.src = `https://via.placeholder.com/80x80?text=Item`;
                      }}
                    />
                  </Link>
                  <div className="cart-item-details">
                    <Link to={`/products/${item.product?._id}`} className="cart-item-name">
                      {item.product?.name || 'Product Unavailable'}
                    </Link>
                    <p className="cart-item-unit-price">${item.product?.price?.toFixed(2)} each</p>
                  </div>
                  <div className="cart-item-qty">
                    <button
                      className="qty-btn"
                      onClick={() => handleQuantityChange(item._id, item.quantity - 1)}
                      disabled={item.quantity <= 1}
                    >
                      −
                    </button>
                    <span>{item.quantity}</span>
                    <button
                      className="qty-btn"
                      onClick={() => handleQuantityChange(item._id, item.quantity + 1)}
                      disabled={item.quantity >= (item.product?.stock || 99)}
                    >
                      +
                    </button>
                  </div>
                  <div className="cart-item-total">
                    ${((item.product?.price || 0) * item.quantity).toFixed(2)}
                  </div>
                  <button className="remove-item-btn" onClick={() => handleRemove(item._id)} title="Remove">
                    ✕
                  </button>
                </div>
              ))}
            </div>

            {/* Order Summary */}
            <div className="cart-summary">
              <h2 className="summary-title">Order Summary</h2>
              <div className="summary-rows">
                {items.map((item) => (
                  <div key={item._id} className="summary-row">
                    <span>{item.product?.name} × {item.quantity}</span>
                    <span>${((item.product?.price || 0) * item.quantity).toFixed(2)}</span>
                  </div>
                ))}
              </div>
              <div className="summary-divider" />
              <div className="summary-total">
                <span>Total</span>
                <span>${cartTotal.toFixed(2)}</span>
              </div>
              <button
                className="checkout-btn"
                onClick={() => navigate('/checkout')}
              >
                Proceed to Checkout →
              </button>
              <Link to="/" className="continue-link">← Continue Shopping</Link>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default CartPage;
