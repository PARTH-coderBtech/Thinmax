const express = require('express');
const router = express.Router();
const crypto = require('crypto');
const Order = require('../models/Order');
const razorpay = require('../utils/razorpay'); // your pre-configured Razorpay instance

// Create Razorpay order
router.post('/create-order', async (req, res) => {
  try {
    const { amount, productName, productId } = req.body;
    const options = {
      amount: amount * 100,   // convert rupees to paise
      currency: 'INR',
      receipt: `receipt_${Date.now()}`,
    };

    const order = await razorpay.orders.create(options);
    res.status(201).json({ order });
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: 'Failed to create Razorpay order' });
  }
});

// Verify payment signature
router.post('/verify', async (req, res) => {
  try {
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature, productId } = req.body;

    const body = razorpay_order_id + '|' + razorpay_payment_id;

    const expectedSignature = crypto.createHmac('sha256', process.env.RAZORPAY_KEY_SECRET)
      .update(body)
      .digest('hex');

    if (expectedSignature === razorpay_signature) {
      // Save order details in DB
      const order = new Order({
        razorpay_order_id,
        razorpay_payment_id,
        productId,
      });

      await order.save();

      return res.status(200).json({ msg: 'Payment successful' });
    } else {
      return res.status(400).json({ msg: 'Invalid signature' });
    }
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: 'Payment verification failed' });
  }
});

module.exports = router;
