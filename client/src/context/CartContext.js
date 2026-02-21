import React, { createContext, useState, useContext, useEffect, useCallback } from 'react';
import api from '../services/api';
import { useAuth } from './AuthContext';

const CartContext = createContext(null);

export const CartProvider = ({ children }) => {
  const { user } = useAuth();
  const [cart, setCart] = useState(null);
  const [cartLoading, setCartLoading] = useState(false);

  const fetchCart = useCallback(async () => {
    if (!user) {
      setCart(null);
      return;
    }
    try {
      setCartLoading(true);
      const res = await api.get('/cart');
      setCart(res.data.data);
    } catch {
      setCart(null);
    } finally {
      setCartLoading(false);
    }
  }, [user]);

  useEffect(() => {
    fetchCart();
  }, [fetchCart]);

  const addToCart = async (productId, quantity = 1) => {
    const res = await api.post('/cart', { productId, quantity });
    setCart(res.data.data);
    return res.data.data;
  };

  const updateCartItem = async (itemId, quantity) => {
    const res = await api.put(`/cart/${itemId}`, { quantity });
    setCart(res.data.data);
    return res.data.data;
  };

  const removeCartItem = async (itemId) => {
    const res = await api.delete(`/cart/${itemId}`);
    setCart(res.data.data);
    return res.data.data;
  };

  const clearCart = async () => {
    await api.delete('/cart');
    setCart((prev) => (prev ? { ...prev, items: [] } : null));
  };

  const cartCount = cart?.items?.reduce((sum, item) => sum + item.quantity, 0) || 0;
  const cartTotal =
    cart?.items?.reduce((sum, item) => {
      return sum + (item.product?.price || 0) * item.quantity;
    }, 0) || 0;

  return (
    <CartContext.Provider
      value={{ cart, cartLoading, cartCount, cartTotal, addToCart, updateCartItem, removeCartItem, clearCart, fetchCart }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) throw new Error('useCart must be used within CartProvider');
  return context;
};
