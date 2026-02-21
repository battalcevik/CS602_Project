import React, { useState, useEffect, useCallback } from 'react';
import { useSearchParams } from 'react-router-dom';
import Navbar from '../components/Navbar';
import ProductCard from '../components/ProductCard';
import api from '../services/api';
import './HomePage.css';

const CATEGORIES = ['All', 'Electronics', 'Clothing', 'Books', 'Home & Kitchen'];

const HomePage = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchParams, setSearchParams] = useSearchParams();
  const [searchQuery, setSearchQuery] = useState(searchParams.get('search') || '');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [sortBy, setSortBy] = useState('newest');

  const fetchProducts = useCallback(async (query, category) => {
    setLoading(true);
    setError('');
    try {
      const params = {};
      if (query) params.search = query;
      if (category && category !== 'All') params.category = category;
      const res = await api.get('/products', { params });
      let data = res.data.data;

      // Client-side sort
      if (sortBy === 'price-asc') data = [...data].sort((a, b) => a.price - b.price);
      else if (sortBy === 'price-desc') data = [...data].sort((a, b) => b.price - a.price);
      else if (sortBy === 'name') data = [...data].sort((a, b) => a.name.localeCompare(b.name));

      setProducts(data);
    } catch (err) {
      setError('Failed to load products. Please try again.');
    } finally {
      setLoading(false);
    }
  }, [sortBy]);

  useEffect(() => {
    const query = searchParams.get('search') || '';
    setSearchQuery(query);
    fetchProducts(query, selectedCategory);
  }, [searchParams, selectedCategory, sortBy]);

  const handleSearch = (query) => {
    setSearchQuery(query);
    if (query) {
      setSearchParams({ search: query });
    } else {
      setSearchParams({});
    }
  };

  const handleCategoryClick = (cat) => {
    setSelectedCategory(cat);
  };

  return (
    <div className="home-page">
      <Navbar onSearch={handleSearch} />

      {/* Hero Banner */}
      <div className="hero-banner">
        <div className="hero-content">
          <h1>Welcome to Agile Market</h1>
          <p>Discover thousands of products at amazing prices</p>
        </div>
      </div>

      <div className="home-container">
        {/* Filters Bar */}
        <div className="filters-bar">
          <div className="category-filters">
            {CATEGORIES.map((cat) => (
              <button
                key={cat}
                className={`category-btn ${selectedCategory === cat ? 'active' : ''}`}
                onClick={() => handleCategoryClick(cat)}
              >
                {cat}
              </button>
            ))}
          </div>
          <div className="sort-filter">
            <label htmlFor="sortBy">Sort by:</label>
            <select id="sortBy" value={sortBy} onChange={(e) => setSortBy(e.target.value)}>
              <option value="newest">Newest</option>
              <option value="price-asc">Price: Low to High</option>
              <option value="price-desc">Price: High to Low</option>
              <option value="name">Name A-Z</option>
            </select>
          </div>
        </div>

        {/* Search Result Info */}
        {searchQuery && (
          <div className="search-info">
            Showing results for: <strong>"{searchQuery}"</strong>
            <button className="clear-search" onClick={() => handleSearch('')}>✕ Clear</button>
          </div>
        )}

        {/* Products Grid */}
        {loading ? (
          <div className="loading-grid">
            {[...Array(8)].map((_, i) => (
              <div key={i} className="skeleton-card">
                <div className="skeleton-image" />
                <div className="skeleton-text" />
                <div className="skeleton-text short" />
                <div className="skeleton-btn" />
              </div>
            ))}
          </div>
        ) : error ? (
          <div className="error-state">
            <p>{error}</p>
            <button onClick={() => fetchProducts(searchQuery, selectedCategory)}>Retry</button>
          </div>
        ) : products.length === 0 ? (
          <div className="empty-state">
            <span className="empty-icon">📦</span>
            <h3>No products found</h3>
            <p>Try adjusting your search or category filter.</p>
            <button className="reset-btn" onClick={() => { handleSearch(''); setSelectedCategory('All'); }}>
              Show All Products
            </button>
          </div>
        ) : (
          <>
            <p className="results-count">{products.length} product{products.length !== 1 ? 's' : ''} found</p>
            <div className="products-grid">
              {products.map((product) => (
                <ProductCard key={product._id} product={product} />
              ))}
            </div>
          </>
        )}
      </div>

      <footer className="footer">
        <p>© 2026 Agile Market — CS602 Term Project</p>
      </footer>
    </div>
  );
};

export default HomePage;
