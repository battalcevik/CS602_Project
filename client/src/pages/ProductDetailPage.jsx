import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import api from '../services/api';
import './ProductDetailPage.css';

const SERVER_URL = 'http://localhost:5001';

const ProductDetailPage = () => {
  const { id } = useParams();
  const { user } = useAuth();
  const { addToCart } = useCart();
  const navigate = useNavigate();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [quantity, setQuantity] = useState(1);
  const [adding, setAdding] = useState(false);
  const [added, setAdded] = useState(false);
  const [cartError, setCartError] = useState('');

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const res = await api.get(`/products/${id}`);
        setProduct(res.data.data);
      } catch (err) {
        setError('Product not found.');
      } finally {
        setLoading(false);
      }
    };
    fetchProduct();
  }, [id]);

  const getImageSrc = (imageUrl) => {
    if (!imageUrl) return `https://via.placeholder.com/500x500?text=Product`;
    if (imageUrl.startsWith('http')) return imageUrl;
    return `${SERVER_URL}${imageUrl}`;
  };

  const handleAddToCart = async () => {
    if (!user) {
      navigate('/login');
      return;
    }
    setAdding(true);
    setCartError('');
    try {
      await addToCart(product._id, quantity);
      setAdded(true);
      setTimeout(() => setAdded(false), 2500);
    } catch (err) {
      setCartError(err.message);
    } finally {
      setAdding(false);
    }
  };

  if (loading) {
    return (
      <div className="detail-page">
        <Navbar />
        <div className="detail-loading">Loading product...</div>
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="detail-page">
        <Navbar />
        <div className="detail-error">
          <h2>Product Not Found</h2>
          <Link to="/" className="back-link">← Back to Home</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="detail-page">
      <Navbar />
      <div className="detail-container">
        <div className="breadcrumb">
          <Link to="/">Home</Link> / <span>{product.category}</span> / <span>{product.name}</span>
        </div>

        <div className="detail-card">
          <div className="detail-image-section">
            <img
              src={getImageSrc(product.imageUrl)}
              alt={product.name}
              className="detail-image"
              onError={(e) => {
                e.target.src = `https://via.placeholder.com/500x500?text=${encodeURIComponent(product.name)}`;
              }}
            />
          </div>

          <div className="detail-info-section">
            <span className="detail-category">{product.category}</span>
            <h1 className="detail-name">{product.name}</h1>
            <p className="detail-price">${product.price.toFixed(2)}</p>

            <div className="detail-stock-info">
              {product.stock > 0 ? (
                <span className="in-stock">✓ In Stock ({product.stock} available)</span>
              ) : (
                <span className="out-stock">✗ Out of Stock</span>
              )}
            </div>

            <div className="detail-description">
              <h3>Description</h3>
              <p>{product.description}</p>
            </div>

            {product.stock > 0 && (
              <div className="quantity-selector">
                <label>Quantity:</label>
                <div className="qty-controls">
                  <button
                    onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                    disabled={quantity <= 1}
                    className="qty-btn"
                  >
                    −
                  </button>
                  <span className="qty-display">{quantity}</span>
                  <button
                    onClick={() => setQuantity((q) => Math.min(product.stock, q + 1))}
                    disabled={quantity >= product.stock}
                    className="qty-btn"
                  >
                    +
                  </button>
                </div>
              </div>
            )}

            {cartError && <p className="cart-error-msg">{cartError}</p>}

            <div className="detail-actions">
              <button
                className={`detail-add-btn ${added ? 'added' : ''}`}
                onClick={handleAddToCart}
                disabled={adding || product.stock === 0}
              >
                {product.stock === 0
                  ? 'Out of Stock'
                  : adding
                  ? 'Adding...'
                  : added
                  ? '✓ Added to Cart!'
                  : 'Add to Cart'}
              </button>
              {added && (
                <Link to="/cart" className="view-cart-link">
                  View Cart →
                </Link>
              )}
            </div>

            <Link to="/" className="continue-shopping">
              ← Continue Shopping
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetailPage;
