import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import Navbar from '../../components/Navbar';
import api from '../../services/api';
import './Admin.css';

const SERVER_URL = 'http://localhost:5001';

const AdminProducts = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const fetchProducts = async () => {
    try {
      const res = await api.get('/products');
      setProducts(res.data.data);
    } catch (err) {
      setError('Failed to load products.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const handleDelete = async (id, name) => {
    if (!window.confirm(`Are you sure you want to delete "${name}"? This cannot be undone.`)) return;
    try {
      await api.delete(`/products/${id}`);
      setProducts((prev) => prev.filter((p) => p._id !== id));
    } catch (err) {
      alert('Failed to delete product: ' + err.message);
    }
  };

  const getImageSrc = (imageUrl, name) => {
    if (!imageUrl) return `https://via.placeholder.com/48x48?text=${encodeURIComponent(name?.charAt(0) || 'P')}`;
    if (imageUrl.startsWith('http')) return imageUrl;
    return `${SERVER_URL}${imageUrl}`;
  };

  return (
    <div className="admin-page">
      <Navbar />
      <div className="admin-container">
        <div className="admin-header">
          <h1>📦 Manage Products</h1>
          <p>Add, edit, and remove products from your store.</p>
        </div>

        <div className="admin-section">
          <div className="admin-section-header">
            <h2>All Products ({products.length})</h2>
            <Link to="/admin/products/add" className="add-btn">
              ➕ Add New Product
            </Link>
          </div>

          {loading ? (
            <div className="admin-loading">Loading products...</div>
          ) : error ? (
            <div className="admin-error">{error}</div>
          ) : products.length === 0 ? (
            <div className="admin-empty">No products found. Add your first product!</div>
          ) : (
            <div style={{ overflowX: 'auto' }}>
              <table className="admin-table">
                <thead>
                  <tr>
                    <th>Image</th>
                    <th>Name</th>
                    <th>Category</th>
                    <th>Price</th>
                    <th>Stock</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {products.map((product) => (
                    <tr key={product._id}>
                      <td>
                        <img
                          src={getImageSrc(product.imageUrl, product.name)}
                          alt={product.name}
                          className="product-thumb"
                          onError={(e) => {
                            e.target.src = `https://via.placeholder.com/48x48?text=P`;
                          }}
                        />
                      </td>
                      <td style={{ fontWeight: 600, maxWidth: '200px' }}>{product.name}</td>
                      <td>{product.category}</td>
                      <td style={{ fontWeight: 700, color: '#e47911' }}>${product.price.toFixed(2)}</td>
                      <td>
                        <span style={{ color: product.stock === 0 ? '#cc0000' : '#2d9e2d', fontWeight: 600 }}>
                          {product.stock}
                        </span>
                      </td>
                      <td>
                        <div className="table-actions">
                          <Link to={`/admin/products/edit/${product._id}`} className="edit-btn">
                            ✏️ Edit
                          </Link>
                          <button className="delete-btn" onClick={() => handleDelete(product._id, product.name)}>
                            🗑 Delete
                          </button>
                        </div>
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

export default AdminProducts;
