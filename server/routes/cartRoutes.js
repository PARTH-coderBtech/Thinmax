const express = require('express');
const router = express.Router();
const Cart = require('../models/Cart');
const auth = require('../middlewares/authMiddleware');
const cartController = require('../controllers/cartController');
router.post('/add',auth, cartController.addToCart);
router.get('/', auth,cartController.getCart);
router.post('/remove', auth,cartController.removeFromCart);

module.exports = router;