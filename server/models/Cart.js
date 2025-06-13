// const mongoose = require("mongoose");
// const cartSchema = new mongoose.Schema({
//   userId: String,
//   items: [
//     {
//       productId: String,
//       name: String,
//       price: Number,
//       image: String,
//       quantity: Number,
//     },
//   ],
// });
// module.exports = mongoose.model("Cart", cartSchema);
const mongoose = require('mongoose');

const cartSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    unique: true
  },
  items: [
    {
      product: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Product'
      },
      quantity: {
        type: Number,
        default: 1
      }
    }
  ]
});

module.exports = mongoose.model('Cart', cartSchema);

