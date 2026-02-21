require('dotenv').config();
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const User = require('./models/User');
const Product = require('./models/Product');
const Order = require('./models/Order');
const Cart = require('./models/Cart');

const products = [
  // ── ELECTRONICS ──────────────────────────────────────────────
  {
    name: 'Apple AirPods Pro',
    description: 'Active noise cancellation for immersive sound. Transparency mode for hearing the world around you. Customizable fit with three sizes of silicone ear tips.',
    price: 249.99,
    stock: 50,
    category: 'Electronics',
    imageUrl: '/uploads/1771557555337-66075474.jpg',
  },
  {
    name: 'Samsung 65" 4K Smart TV',
    description: 'Crystal clear 4K UHD resolution with HDR support. Smart TV with built-in streaming apps including Netflix, Hulu, and Prime Video. Voice control enabled.',
    price: 799.99,
    stock: 20,
    category: 'Electronics',
    imageUrl: '/uploads/1771561868186-546152553.jpg',
  },
  {
    name: 'Sony WH-1000XM5 Headphones',
    description: 'Industry-leading noise canceling with eight microphones. Up to 30 hours battery life with quick charge capability. Premium sound quality with 40mm drivers.',
    price: 349.99,
    stock: 35,
    category: 'Electronics',
    imageUrl: '/uploads/1771561913411-980194505.jpg',
  },
  {
    name: 'iPad Air 5th Generation',
    description: 'Powerful M1 chip with stunning 10.9-inch Liquid Retina display. Works with Apple Pencil and Magic Keyboard. Available in multiple colors.',
    price: 599.99,
    stock: 25,
    category: 'Electronics',
    imageUrl: '/uploads/1771562117980-149889152.jpg',
  },
  {
    name: 'Logitech MX Master 3 Mouse',
    description: 'Advanced ergonomic wireless mouse with ultra-fast MagSpeed scrolling. Works on any surface including glass. USB-C recharging with 70-day battery.',
    price: 99.99,
    stock: 60,
    category: 'Electronics',
    imageUrl: '/uploads/1771563230150-228295225.jpg',
  },

  // ── CLOTHING ─────────────────────────────────────────────────
  {
    name: 'Nike Air Max 270',
    description: "Nike's biggest heel Air unit yet for incredible cushioning. Engineered mesh upper for lightweight breathability. Max Air cushioning for all-day comfort.",
    price: 149.99,
    stock: 75,
    category: 'Clothing',
    imageUrl: '/uploads/1771562473715-753304256.jpg',
  },
  {
    name: "Levi's 501 Original Jeans",
    description: 'The original straight leg jean that started it all. Made from 100% cotton denim with iconic button fly. A timeless classic that fits any wardrobe.',
    price: 69.99,
    stock: 100,
    category: 'Clothing',
    imageUrl: '/uploads/1771562589112-656132252.jpg',
  },
  {
    name: 'Patagonia Better Sweater Fleece',
    description: 'Classic fleece jacket made from 100% recycled polyester. Provides cozy warmth for cool days. Full-zip design with chest pocket and hand pockets.',
    price: 139.00,
    stock: 45,
    category: 'Clothing',
    imageUrl: '/uploads/1771557609953-799262363.jpg',
  },
  {
    name: 'Adidas Ultraboost Running Shoes',
    description: 'Responsive Boost midsole returns energy with every step. Flexible Primeknit upper hugs your foot for a supportive fit. Ideal for serious runners.',
    price: 179.99,
    stock: 55,
    category: 'Clothing',
    imageUrl: '/uploads/1771562685906-738516671.jpg',
  },
  {
    name: 'Gucci GG Marmont Camera Bag',
    description: 'Iconic Craftsmanship: Made in Italy from premium black matelassé chevron leather, featuring a softly structured shape and a subtle stitched heart detail on the back.',
    price: 1229.00,
    stock: 30,
    category: 'Clothing',
    imageUrl: '/uploads/1771562759479-336289561.jpg',
  },

  // ── BOOKS ────────────────────────────────────────────────────
  {
    name: 'Atomic Habits by James Clear',
    description: 'The definitive guide to building good habits and breaking bad ones. A proven framework for improving every day using tiny changes that deliver remarkable results.',
    price: 18.99,
    stock: 200,
    category: 'Books',
    imageUrl: '/uploads/1771562872356-239515643.jpg',
  },
  {
    name: 'The Art of War by Sun Tzu',
    description: 'Ancient Chinese military treatise that has influenced both Eastern and Western thinking. Timeless strategies applicable to business, sports, and everyday life.',
    price: 9.99,
    stock: 150,
    category: 'Books',
    imageUrl: '/uploads/1771562913058-689387185.jpg',
  },
  {
    name: 'JavaScript: The Good Parts',
    description: 'Douglas Crockford digs into the parts of JavaScript that make it a beautiful programming language. Essential reading for every serious web developer.',
    price: 29.99,
    stock: 80,
    category: 'Books',
    imageUrl: '/uploads/1771557755560-129126387.jpg',
  },
  {
    name: 'Clean Code by Robert C. Martin',
    description: 'A handbook of agile software craftsmanship. Filled with real-world examples and best practices for writing clean, readable, maintainable code.',
    price: 34.99,
    stock: 90,
    category: 'Books',
    imageUrl: '/uploads/1771563002352-446938753.jpg',
  },
  {
    name: 'The Psychology of Money',
    description: 'Morgan Housel shares 19 short stories exploring the strange ways people think about money. Timeless lessons on wealth, greed, and happiness.',
    price: 16.99,
    stock: 120,
    category: 'Books',
    imageUrl: '/uploads/1771563045036-950991177.jpg',
  },

  // ── HOME & KITCHEN ────────────────────────────────────────────
  {
    name: 'Instant Pot Duo 7-in-1',
    description: 'Replaces 7 kitchen appliances: pressure cooker, slow cooker, rice cooker, steamer, sauté pan, food warmer, and yogurt maker. 6-quart capacity, stainless steel inner pot.',
    price: 89.99,
    stock: 40,
    category: 'Home & Kitchen',
    imageUrl: '/uploads/1771557706864-289472733.jpg',
  },
  {
    name: 'Dyson V15 Detect Vacuum',
    description: 'Reveals microscopic dust with a precisely angled green laser. Automatically adapts suction across different floor types. 60 minutes of run time.',
    price: 699.99,
    stock: 15,
    category: 'Home & Kitchen',
    imageUrl: '/uploads/1771557841236-30368498.jpg',
  },
  {
    name: 'Nespresso Vertuo Coffee Machine',
    description: 'Brew 5 different cup sizes from espresso to alto. Centrifusion extraction technology for perfect crema. 17-second heat-up time. 40oz water tank.',
    price: 199.99,
    stock: 28,
    category: 'Home & Kitchen',
    imageUrl: '/uploads/1771563088499-359682067.jpg',
  },
  {
    name: 'KitchenAid Stand Mixer',
    description: 'Tilt-head design allows clear access to bowl and attachments. 5-quart stainless steel bowl handles up to 9 dozen cookies. 10 speeds for mixing, kneading and whipping.',
    price: 449.99,
    stock: 18,
    category: 'Home & Kitchen',
    imageUrl: '/uploads/1771557668285-810590038.jpg',
  },
  {
    name: 'Casper Original Foam Mattress',
    description: 'Three layers of premium foam for the perfect combination of pressure relief and resilience. Breathable open-cell foam keeps you cool all night. 100-night free trial.',
    price: 995.00,
    stock: 12,
    category: 'Home & Kitchen',
    imageUrl: '/uploads/1771563190775-263850203.jpg',
  },
];

const seedDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('Connected to MongoDB...');

    // Clear existing data
    await User.deleteMany({});
    await Product.deleteMany({});
    await Order.deleteMany({});
    await Cart.deleteMany({});
    console.log('Cleared existing data...');

    // Create users
    const salt = await bcrypt.genSalt(10);
    const adminPassword = await bcrypt.hash('AdminTest34!', salt);
    const userPassword = await bcrypt.hash('BcevikTest34!', salt);

    await User.create({
      username: 'Admin User',
      email: 'admin@agilemarket.com',
      password: adminPassword,
      role: 'admin',
    });

    await User.create({
      username: 'Battal Cevik',
      email: 'bcevik@agilemarket.com',
      password: userPassword,
      role: 'customer',
    });

    console.log('Created 2 users (admin + customer)...');

    // Create products
    await Product.insertMany(products);
    console.log('Created 20 products with matched images...');

    console.log('\n✅ Database seeded successfully!');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('Test Credentials:');
    console.log('  Admin:    admin@agilemarket.com  /  AdminTest34!');
    console.log('  Customer: bcevik@agilemarket.com   /  BcevikTest34!');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');

    process.exit(0);
  } catch (error) {
    console.error('Seed error:', error);
    process.exit(1);
  }
};

seedDB();