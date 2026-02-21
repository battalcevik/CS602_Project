const Product = require('../models/Product');
const Order = require('../models/Order');
const User = require('../models/User');

const resolvers = {
  Query: {
    products: async (_, { search, category, minPrice, maxPrice }) => {
      try {
        const filter = {};
        if (search) {
          filter.$or = [
            { name: { $regex: search, $options: 'i' } },
            { description: { $regex: search, $options: 'i' } },
          ];
        }
        if (category) filter.category = category;
        if (minPrice !== undefined || maxPrice !== undefined) {
          filter.price = {};
          if (minPrice !== undefined) filter.price.$gte = minPrice;
          if (maxPrice !== undefined) filter.price.$lte = maxPrice;
        }
        return await Product.find(filter).sort({ createdAt: -1 });
      } catch (err) {
        throw new Error('Failed to fetch products: ' + err.message);
      }
    },

    product: async (_, { id }) => {
      try {
        const product = await Product.findById(id);
        if (!product) throw new Error('Product not found');
        return product;
      } catch (err) {
        throw new Error('Failed to fetch product: ' + err.message);
      }
    },

    orders: async () => {
      try {
        return await Order.find()
          .populate('user')
          .populate('items.product')
          .sort({ createdAt: -1 });
      } catch (err) {
        throw new Error('Failed to fetch orders: ' + err.message);
      }
    },

    order: async (_, { id }) => {
      try {
        const order = await Order.findById(id).populate('user').populate('items.product');
        if (!order) throw new Error('Order not found');
        return order;
      } catch (err) {
        throw new Error('Failed to fetch order: ' + err.message);
      }
    },

    customers: async () => {
      try {
        return await User.find({ role: 'customer' }).select('-password');
      } catch (err) {
        throw new Error('Failed to fetch customers: ' + err.message);
      }
    },

    customer: async (_, { id }) => {
      try {
        const user = await User.findById(id).select('-password');
        if (!user) throw new Error('Customer not found');
        return user;
      } catch (err) {
        throw new Error('Failed to fetch customer: ' + err.message);
      }
    },
  },

  Mutation: {
    addProduct: async (_, { input }) => {
      try {
        const product = await Product.create(input);
        return product;
      } catch (err) {
        throw new Error('Failed to add product: ' + err.message);
      }
    },

    updateProduct: async (_, { id, input }) => {
      try {
        const product = await Product.findByIdAndUpdate(id, { $set: input }, { new: true, runValidators: true });
        if (!product) throw new Error('Product not found');
        return product;
      } catch (err) {
        throw new Error('Failed to update product: ' + err.message);
      }
    },

    deleteProduct: async (_, { id }) => {
      try {
        const result = await Product.findByIdAndDelete(id);
        return !!result;
      } catch (err) {
        throw new Error('Failed to delete product: ' + err.message);
      }
    },

    updateOrderStatus: async (_, { id, status }) => {
      try {
        const validStatuses = ['pending', 'processing', 'shipped', 'delivered', 'cancelled'];
        if (!validStatuses.includes(status)) throw new Error('Invalid status');
        const order = await Order.findByIdAndUpdate(id, { status }, { new: true })
          .populate('user')
          .populate('items.product');
        if (!order) throw new Error('Order not found');
        return order;
      } catch (err) {
        throw new Error('Failed to update order status: ' + err.message);
      }
    },
  },
};

module.exports = resolvers;
