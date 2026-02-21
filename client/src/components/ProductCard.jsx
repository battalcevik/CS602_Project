import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import './ProductCard.css';

const SERVER_URL = 'http://localhost:5001';

const ProductCard = ({ product }) => {
  const { user } = useAuth();
  const { addToCart } = useCart();
  const navigate = useNavigate();
  const [adding, setAdding] = useState(false);
  const [added, setAdded] = useState(false);
  const [error, setError] = useState('');

  const getImageSrc = (imageUrl) => {
    if (!imageUrl) return `https://via.placeholder.com/300x300?text=${encodeURIComponent(product.name)}`;
    if (imageUrl.startsWith('http')) return imageUrl;
    return `${SERVER_URL}${imageUrl}`;
  };

  const handleAddToCart = async () => {
    if (!user) {
      navigate('/login');
      return;
    }
    setAdding(true);
    setError('');
    try {
      await addToCart(product._id, 1);
      setAdded(true);
      setTimeout(() => setAdded(false), 2000);
    } catch (err) {
      setError(err.message);
      setTimeout(() => setError(''), 3000);
    } finally {
      setAdding(false);
    }
  };

  const truncateDescription = (text, maxLen = 80) => {
    if (!text) return '';
    return text.length > maxLen ? text.substring(0, maxLen) + '...' : text;
  };

  return (
    <div className="product-card">
      <Link to={`/products/${product._id}`} className="product-image-link">
        <div className="product-image-wrapper">
          <img
            src={getImageSrc(product.imageUrl)}
            alt={product.name}
            className="product-image"
            onError={(e) => {
              e.target.src = `https://via.placeholder.com/300x300?text=${encodeURIComponent(product.name)}`;
            }}
          />
        </div>
        <span className="product-category-badge">{product.category}</span>
      </Link>

      <div className="product-info">
        <Link to={`/products/${product._id}`} className="product-name-link">
          <h3 className="product-name">{product.name}</h3>
        </Link>
        <p className="product-description">{truncateDescription(product.description)}</p>
        <div className="product-footer">
          <div className="product-price-stock">
            <span className="product-price">${product.price.toFixed(2)}</span>
            <span className={`product-stock ${product.stock === 0 ? 'out-of-stock' : ''}`}>
              {product.stock === 0 ? 'Out of Stock' : `${product.stock} in stock`}
            </span>
          </div>
          {error && <p className="card-error">{error}</p>}
          <button
            className={`add-to-cart-btn ${added ? 'added' : ''} ${product.stock === 0 ? 'disabled' : ''}`}
            onClick={handleAddToCart}
            disabled={adding || product.stock === 0}
          >
            {product.stock === 0 ? 'Out of Stock' : adding ? 'Adding...' : added ? '✓ Added!' : '+ Add to Cart'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
