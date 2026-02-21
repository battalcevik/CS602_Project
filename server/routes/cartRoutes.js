const express = require('express');
const router = express.Router();
const Cart = require('../models/Cart');
const Product = require('../models/Product');
const isAuth = require('../middleware/isAuth');

// Helper: get or create cart for user
const getOrCreateCart = async (userId) => {
  let cart = await Cart.findOne({ user: userId }).populate('items.product');
  if (!cart) {
    cart = await Cart.create({ user: userId, items: [] });
    cart = await Cart.findOne({ user: userId }).populate('items.product');
  }
  return cart;
};

// GET /api/cart
router.get('/', isAuth, async (req, res) => {
  try {
    const cart = await getOrCreateCart(req.user._id);
    res.json({ success: true, data: cart });
  } catch (error) {
    console.error('Get cart error:', error);
    res.status(500).json({ success: false, message: 'Server error fetching cart.' });
  }
});

// POST /api/cart  { productId, quantity }
router.post('/', isAuth, async (req, res) => {
  try {
    const { productId, quantity = 1 } = req.body;

    if (!productId) {
      return res.status(400).json({ success: false, message: 'Product ID is required.' });
    }

    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({ success: false, message: 'Product not found.' });
    }

    let cart = await Cart.findOne({ user: req.user._id });
    if (!cart) {
      cart = new Cart({ user: req.user._id, items: [] });
    }

    const existingItem = cart.items.find((item) => item.product.toString() === productId);

    if (existingItem) {
      const newQty = existingItem.quantity + parseInt(quantity);
      if (newQty > product.stock) {
        return res.status(400).json({
          success: false,
          message: `Cannot add more than available stock (${product.stock}).`,
        });
      }
      existingItem.quantity = newQty;
    } else {
      if (parseInt(quantity) > product.stock) {
        return res.status(400).json({
          success: false,
          message: `Requested quantity exceeds available stock (${product.stock}).`,
        });
      }
      cart.items.push({ product: productId, quantity: parseInt(quantity) });
    }

    await cart.save();
    cart = await Cart.findOne({ user: req.user._id }).populate('items.product');
    res.json({ success: true, data: cart });
  } catch (error) {
    console.error('Add to cart error:', error);
    res.status(500).json({ success: false, message: 'Server error adding to cart.' });
  }
});

// PUT /api/cart/:itemId  { quantity }
router.put('/:itemId', isAuth, async (req, res) => {
  try {
    const { quantity } = req.body;
    const cart = await Cart.findOne({ user: req.user._id });
    if (!cart) {
      return res.status(404).json({ success: false, message: 'Cart not found.' });
    }

    const item = cart.items.id(req.params.itemId);
    if (!item) {
      return res.status(404).json({ success: false, message: 'Cart item not found.' });
    }

    const product = await Product.findById(item.product);
    const newQty = parseInt(quantity);
    if (newQty < 1) {
      return res.status(400).json({ success: false, message: 'Quantity must be at least 1.' });
    }
    if (newQty > product.stock) {
      return res.status(400).json({
        success: false,
        message: `Cannot exceed available stock (${product.stock}).`,
      });
    }

    item.quantity = newQty;
    await cart.save();

    const updated = await Cart.findOne({ user: req.user._id }).populate('items.product');
    res.json({ success: true, data: updated });
  } catch (error) {
    console.error('Update cart item error:', error);
    res.status(500).json({ success: false, message: 'Server error updating cart.' });
  }
});

// DELETE /api/cart/:itemId
router.delete('/:itemId', isAuth, async (req, res) => {
  try {
    const cart = await Cart.findOne({ user: req.user._id });
    if (!cart) {
      return res.status(404).json({ success: false, message: 'Cart not found.' });
    }

    cart.items = cart.items.filter((item) => item._id.toString() !== req.params.itemId);
    await cart.save();

    const updated = await Cart.findOne({ user: req.user._id }).populate('items.product');
    res.json({ success: true, data: updated });
  } catch (error) {
    console.error('Remove cart item error:', error);
    res.status(500).json({ success: false, message: 'Server error removing cart item.' });
  }
});

// DELETE /api/cart  (clear entire cart)
router.delete('/', isAuth, async (req, res) => {
  try {
    await Cart.findOneAndUpdate({ user: req.user._id }, { items: [] });
    res.json({ success: true, message: 'Cart cleared.' });
  } catch (error) {
    console.error('Clear cart error:', error);
    res.status(500).json({ success: false, message: 'Server error clearing cart.' });
  }
});

module.exports = router;
