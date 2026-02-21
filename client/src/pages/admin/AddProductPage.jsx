import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Navbar from '../../components/Navbar';
import api from '../../services/api';
import './Admin.css';

const CATEGORIES = ['Electronics', 'Clothing', 'Books', 'Home & Kitchen'];

const AddProductPage = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    stock: '',
    category: '',
  });
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
    setError('');
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImageFile(file);
      const reader = new FileReader();
      reader.onloadend = () => setImagePreview(reader.result);
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const { name, description, price, stock, category } = formData;

    if (!name || !description || !price || !category) {
      setError('Name, description, price, and category are required.');
      return;
    }
    if (parseFloat(price) <= 0) {
      setError('Price must be greater than 0.');
      return;
    }

    setLoading(true);
    setError('');
    try {
      const data = new FormData();
      data.append('name', name);
      data.append('description', description);
      data.append('price', parseFloat(price));
      data.append('stock', parseInt(stock) || 0);
      data.append('category', category);
      if (imageFile) data.append('image', imageFile);

      await api.post('/products', data, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });

      setSuccess('Product added successfully! Redirecting...');
      setTimeout(() => navigate('/admin/products'), 1500);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="admin-page">
      <Navbar />
      <div className="admin-container">
        <Link to="/admin/products" className="back-admin-link">← Back to Products</Link>

        <div className="admin-header">
          <h1>➕ Add New Product</h1>
          <p>Fill in the details to list a new product in your store.</p>
        </div>

        <div className="admin-form-card">
          <form onSubmit={handleSubmit} className="admin-form" encType="multipart/form-data">
            <div className="form-group">
              <label htmlFor="name">Product Name *</label>
              <input
                type="text"
                id="name"
                name="name"
                placeholder="e.g. Apple iPhone 15"
                value={formData.name}
                onChange={handleChange}
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="description">Description *</label>
              <textarea
                id="description"
                name="description"
                placeholder="Detailed product description..."
                value={formData.description}
                onChange={handleChange}
                required
                rows={4}
              />
            </div>

            <div className="form-row">
              <div className="form-group">
                <label htmlFor="price">Price ($) *</label>
                <input
                  type="number"
                  id="price"
                  name="price"
                  placeholder="29.99"
                  value={formData.price}
                  onChange={handleChange}
                  min="0"
                  step="0.01"
                  required
                />
              </div>
              <div className="form-group">
                <label htmlFor="stock">Stock Quantity</label>
                <input
                  type="number"
                  id="stock"
                  name="stock"
                  placeholder="100"
                  value={formData.stock}
                  onChange={handleChange}
                  min="0"
                />
              </div>
            </div>

            <div className="form-group">
              <label htmlFor="category">Category *</label>
              <select
                id="category"
                name="category"
                value={formData.category}
                onChange={handleChange}
                required
              >
                <option value="">Select a category</option>
                {CATEGORIES.map((cat) => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>
            </div>

            <div className="form-group">
              <label htmlFor="image">Product Image</label>
              <input
                type="file"
                id="image"
                name="image"
                accept="image/jpeg,image/jpg,image/png,image/gif,image/webp"
                onChange={handleImageChange}
              />
              {imagePreview && (
                <img src={imagePreview} alt="Preview" className="image-preview" />
              )}
            </div>

            {error && <div className="form-error">{error}</div>}
            {success && <div className="form-success">{success}</div>}

            <div className="form-actions">
              <button type="submit" className="submit-btn" disabled={loading}>
                {loading ? 'Adding Product...' : '➕ Add Product'}
              </button>
              <Link to="/admin/products" className="cancel-link">Cancel</Link>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AddProductPage;
