// backend/routes/adminRoutes.js
const express = require('express');
const router = express.Router();
const Product = require('../models/Product');
const Order = require('../models/Order');
const authMiddleware = require('../middlewares/authMiddleware');
const adminMiddleware = require('../middlewares/adminMiddleware');

// Get all orders (already exists)
router.get('/orders', authMiddleware, adminMiddleware, async (req, res) => {
  try {
    const orders = await Order.find({});
    res.json({ orders });
  } catch (err) {
    res.status(500).json({ msg: 'Server Error' });
  }
});

// Create a new product
router.post('/products', authMiddleware, adminMiddleware, async (req, res) => {
  try {
    const { name, description, price, image } = req.body;
    const product = new Product({ name, description, price, image });
    await product.save();
    res.status(201).json({ product });
  } catch (err) {
    res.status(500).json({ msg: 'Error adding product' });
  }
});

// Delete a product
router.delete('/products/:id', authMiddleware, adminMiddleware, async (req, res) => {
  try {
    const id = req.params.id;
    await Product.findByIdAndDelete(id);
    res.json({ msg: 'Product deleted' });
  } catch (err) {
    res.status(500).json({ msg: 'Error deleting product' });
  }
});

module.exports = router;
