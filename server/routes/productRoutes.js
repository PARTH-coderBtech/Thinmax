const express = require('express');
const router = express.Router();
const Product = require('../models/Product');
const auth = require("../middlewares/authMiddleware");
const admin = require("../middlewares/adminMiddleware");


router.post('/add', auth, async (req, res) => {
  try {
    const { name, price, description, image } = req.body;
    const newProduct = new Product({ name, price, description, image });
    await newProduct.save();
    res.json(newProduct);
  } catch (err) {
    res.status(500).json({ msg: 'Error adding product' });
  }
});

router.get('/all', async (req, res) => {
  try {
    const products = await Product.find();
    res.json(products);
  } catch (err) {
    res.status(500).json({ msg: 'Error fetching products' });
  }
});

module.exports = router;