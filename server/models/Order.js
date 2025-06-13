const mongoose = require("mongoose");
const orderSchema = new mongoose.Schema({
  userId: String,
  productId: String,
  quantity: Number,
  orderId: String,
  paymentId: String,
});
module.exports = mongoose.model("Order", orderSchema);
