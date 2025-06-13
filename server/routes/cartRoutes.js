const express = require('express');
const router = express.Router();
const Cart = require('../models/Cart');
const auth = require('../middlewares/authMiddleware');
const cartController = require('../controllers/cartController');

// router.post('/add', async (req, res) => {
//   const { userId, productId, quantity } = req.body;
//   try {
//     let cartItem = await Cart.findOne({ userId, productId });
//     if (cartItem) {
//       cartItem.quantity += quantity;
//     } else {
//       cartItem = new Cart({ userId, productId, quantity });
//     }
//     await cartItem.save();
//     res.json(cartItem);
//   } catch (err) {
//     res.status(500).json({ msg: 'Error adding to cart' });
//   }
// });

// router.get('/:userId', async (req, res) => {
//   try {
//     const items = await Cart.find({ userId: req.params.userId }).populate('productId');
//     res.json(items);
//   } catch (err) {
//     res.status(500).json({ msg: 'Error getting cart' });
//   }
// });

// router.delete('/remove/:id', async (req, res) => {
//   try {
//     await Cart.findByIdAndDelete(req.params.id);
//     res.json({ msg: 'Item removed' });
//   } catch (err) {
//     res.status(500).json({ msg: 'Error deleting cart item' });
//   }
// });

router.post('/add', auth, cartController.addToCart);
router.get('/', auth, cartController.getCart);
router.post('/remove', auth, cartController.removeFromCart);

module.exports = router;
