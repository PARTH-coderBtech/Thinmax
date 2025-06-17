const mongoose = require("mongoose");

const orderSchema = new mongoose.Schema({
  userId: String,
  productId: String,
  quantity: Number,
  orderId: String,
  paymentId: String,

  // New fields for delivery details
  name: String,
  email: String,
  phone: String,
  address: String,
});

module.exports = mongoose.model("Order", orderSchema);
