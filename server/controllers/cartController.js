
const Cart = require("../models/Cart");
exports.addToCart = async (req, res) => {
  try {
    const { productId, quantity } = req.body;
    const userId = req.user.id; // ✅ use from token

    if (!productId || !quantity) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    let cart = await Cart.findOne({ user: userId });

    if (!cart) {
      cart = await Cart.create({ user: userId, items: [] });
    }

    const existingItem = cart.items.find((item) => item.product.toString() === productId);

    if (existingItem) {
      existingItem.quantity += quantity;
    } else {
      cart.items.push({ product: productId, quantity });
    }

    await cart.save();
    res.json(cart);
  } catch (err) {
    console.error("Add to cart error:", err.message);
    res.status(500).json({ message: err.message });
  }
};


exports.removeFromCart = async (req, res) => {
  try {
    const { userId, productId } = req.body;

    const cart = await Cart.findOne({ user: userId });
    if (!cart) return res.status(404).json({ message: "Cart not found" });

    cart.items = cart.items.filter((item) => item.product.toString() !== productId);
    await cart.save();

    res.json(cart);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.getCart = async (req, res) => {
  try {
    const { userId } = req.query;
    const cart = await Cart.findOne({ user: userId }).populate("items.product");

    if (!cart) return res.status(404).json({ message: "Cart not found" });

    res.json(cart);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};