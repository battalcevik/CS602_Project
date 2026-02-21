import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import Navbar from '../../components/Navbar';
import api from '../../services/api';
import './Admin.css';

const CATEGORIES = ['Electronics', 'Clothing', 'Books', 'Home & Kitchen'];
const SERVER_URL = 'http://localhost:5001';

const EditProductPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    stock: '',
    category: '',
  });
  const [currentImageUrl, setCurrentImageUrl] = useState('');
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState('');
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const res = await api.get(`/products/${id}`);
        const p = res.data.data;
        setFormData({
          name: p.name,
          description: p.description,
          price: p.price.toString(),
          stock: p.stock.toString(),
          category: p.category,
        });
        setCurrentImageUrl(p.imageUrl || '');
      } catch (err) {
        setError('Failed to load product.');
      } finally {
        setFetching(false);
      }
    };
    fetchProduct();
  }, [id]);

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

  const getExistingImageSrc = () => {
    if (!currentImageUrl) return null;
    if (currentImageUrl.startsWith('http')) return currentImageUrl;
    return `${SERVER_URL}${currentImageUrl}`;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const { name, description, price, category } = formData;

    if (!name || !description || !price || !category) {
      setError('Name, description, price, and category are required.');
      return;
    }

    setLoading(true);
    setError('');
    try {
      const data = new FormData();
      data.append('name', formData.name);
      data.append('description', formData.description);
      data.append('price', parseFloat(formData.price));
      data.append('stock', parseInt(formData.stock) || 0);
      data.append('category', formData.category);
      if (imageFile) data.append('image', imageFile);

      await api.put(`/products/${id}`, data, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });

      setSuccess('Product updated successfully! Redirecting...');
      setTimeout(() => navigate('/admin/products'), 1500);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  if (fetching) {
    return (
      <div className="admin-page">
        <Navbar />
        <div className="admin-container">
          <div className="admin-loading">Loading product...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="admin-page">
      <Navbar />
      <div className="admin-container">
        <Link to="/admin/products" className="back-admin-link">← Back to Products</Link>

        <div className="admin-header">
          <h1>✏️ Edit Product</h1>
          <p>Update the details for this product.</p>
        </div>

        <div className="admin-form-card">
          <form onSubmit={handleSubmit} className="admin-form" encType="multipart/form-data">
            <div className="form-group">
              <label htmlFor="name">Product Name *</label>
              <input
                type="text"
                id="name"
                name="name"
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
              <label>Product Image</label>
              {!imagePreview && getExistingImageSrc() && (
                <div>
                  <p style={{ fontSize: '12px', color: '#888', margin: '0 0 6px' }}>Current image:</p>
                  <img
                    src={getExistingImageSrc()}
                    alt="Current"
                    className="image-preview"
                    onError={(e) => { e.target.style.display = 'none'; }}
                  />
                </div>
              )}
              <input
                type="file"
                id="image"
                name="image"
                accept="image/jpeg,image/jpg,image/png,image/gif,image/webp"
                onChange={handleImageChange}
                style={{ marginTop: '8px' }}
              />
              {imagePreview && (
                <div>
                  <p style={{ fontSize: '12px', color: '#888', margin: '6px 0' }}>New image preview:</p>
                  <img src={imagePreview} alt="Preview" className="image-preview" />
                </div>
              )}
            </div>

            {error && <div className="form-error">{error}</div>}
            {success && <div className="form-success">{success}</div>}

            <div className="form-actions">
              <button type="submit" className="submit-btn" disabled={loading}>
                {loading ? 'Saving...' : '💾 Save Changes'}
              </button>
              <Link to="/admin/products" className="cancel-link">Cancel</Link>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default EditProductPage;
