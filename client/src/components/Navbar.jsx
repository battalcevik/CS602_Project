import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import './Navbar.css';

const Navbar = ({ onSearch }) => {
  const { user, logout } = useAuth();
  const { cartCount } = useCart();
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [menuOpen, setMenuOpen] = useState(false);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (onSearch) {
      onSearch(searchQuery);
    } else {
      navigate(`/?search=${encodeURIComponent(searchQuery)}`);
    }
  };

  const handleLogout = async () => {
    try {
      await logout();
      navigate('/');
    } catch (err) {
      console.error('Logout error:', err);
    }
  };

  return (
    <nav className="navbar">
      <div className="navbar-container">
        {/* Logo */}
        <Link to="/" className="navbar-logo">
          <img src="/logo.png" alt="Agile Market Logo" className="logo-icon" />
          <span className="logo-text">Agile Market</span>
        </Link>

        {/* Search Bar */}
        <form className="navbar-search" onSubmit={handleSearchSubmit}>
          <input
            type="text"
            className="search-input"
            placeholder="Search products..."
            value={searchQuery}
            onChange={(e) => {
              setSearchQuery(e.target.value);
              if (onSearch) onSearch(e.target.value);
            }}
          />
          <button type="submit" className="search-btn">
            🔍
          </button>
        </form>

        {/* Right Side */}
        <div className="navbar-right">
          {/* Cart */}
          <Link to="/cart" className="cart-btn">
            <span className="cart-icon">🛒</span>
            <span className="cart-text">Cart</span>
            {cartCount > 0 && <span className="cart-badge">{cartCount}</span>}
          </Link>

          {/* Auth */}
          {user ? (
            <div className="user-menu">
              <button className="user-btn" onClick={() => setMenuOpen(!menuOpen)}>
                <span className="user-avatar">{user.username.charAt(0).toUpperCase()}</span>
                <span className="user-name">{user.username}</span>
                <span className="dropdown-arrow">▾</span>
              </button>
              {menuOpen && (
                <div className="dropdown-menu">
                  {user.role === 'admin' ? (
                    <>
                      <Link to="/admin" className="dropdown-item" onClick={() => setMenuOpen(false)}>
                        🏠 Admin Dashboard
                      </Link>
                      <Link to="/admin/products" className="dropdown-item" onClick={() => setMenuOpen(false)}>
                        📦 Manage Products
                      </Link>
                      <Link to="/admin/orders" className="dropdown-item" onClick={() => setMenuOpen(false)}>
                        📋 Manage Orders
                      </Link>
                      <Link to="/admin/customers" className="dropdown-item" onClick={() => setMenuOpen(false)}>
                        👥 Manage Customers
                      </Link>
                    </>
                  ) : (
                    <Link to="/profile" className="dropdown-item" onClick={() => setMenuOpen(false)}>
                      👤 My Profile & Orders
                    </Link>
                  )}
                  <div className="dropdown-divider" />
                  <button
                    className="dropdown-item dropdown-logout"
                    onClick={() => {
                      setMenuOpen(false);
                      handleLogout();
                    }}
                  >
                    🚪 Logout
                  </button>
                </div>
              )}
            </div>
          ) : (
            <div className="auth-links">
              <Link to="/login" className="nav-login-btn">
                Sign In
              </Link>
              <Link to="/register" className="nav-register-btn">
                Register
              </Link>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
