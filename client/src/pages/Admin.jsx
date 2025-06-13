import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const Cart = () => {
  const [cart, setCart] = useState([]);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const storedCart = JSON.parse(localStorage.getItem('cart')) || [];
    setCart(storedCart);
  }, []);

  const updateCart = (newCart) => {
    setCart(newCart);
    localStorage.setItem('cart', JSON.stringify(newCart));
  };

  const handleQuantityChange = (index, type) => {
    const newCart = [...cart];
    if (type === 'increment') {
      newCart[index].quantity += 1;
    } else if (type === 'decrement' && newCart[index].quantity > 1) {
      newCart[index].quantity -= 1;
    }
    updateCart(newCart);
  };

  const handleRemove = (index) => {
    const newCart = [...cart];
    newCart.splice(index, 1);
    updateCart(newCart);
  };

  const handleCheckout = async () => {
    const user = JSON.parse(localStorage.getItem('user'));
    if (!user) {
      alert('Please login to continue checkout.');
      return navigate('/login');
    }

    const totalAmount = cart.reduce((acc, item) => acc + item.price * item.quantity, 0);
    const productDetails = cart.map((item) => ({
      id: item.id,
      name: item.name,
      quantity: item.quantity,
    }));

    setLoading(true);

    try {
      const res = await axios.post(`${import.meta.env.VITE_API_BASE}/api/payment/create-order`, {
        amount: totalAmount * 100,
        cart: productDetails,
      });

      const { order } = res.data;

      const options = {
        key: import.meta.env.VITE_RAZORPAY_KEY,
        amount: order.amount,
        currency: 'INR',
        name: 'ThinMax Waterproofing',
        description: 'Cart Checkout',
        order_id: order.id,
        handler: async (response) => {
          alert('Payment Successful!');
          await axios.post(`${import.meta.env.VITE_API_BASE}/api/payment/verify`, {
            ...response,
            orderId: order.id,
            cart: productDetails,
          });
          updateCart([]);
        },
        prefill: {
          name: user.name,
          email: user.email,
        },
        theme: {
          color: '#1e40af',
        },
      };

      const rzp = new window.Razorpay(options);
      rzp.open();
    } catch (err) {
      console.error(err);
      alert('Payment failed!');
    }

    setLoading(false);
  };

  return (
    <div className="max-w-5xl mx-auto px-4 py-10">
      <h2 className="text-3xl font-bold mb-6 text-center">Your Cart</h2>
      {cart.length === 0 ? (
        <p className="text-center text-gray-600">Your cart is empty.</p>
      ) : (
        <div className="space-y-6">
          {cart.map((item, index) => (
            <div key={index} className="flex items-center justify-between bg-white shadow p-4 rounded-lg">
              <div>
                <h3 className="font-semibold text-gray-800">{item.name}</h3>
                <p className="text-sm text-gray-600">₹{item.price} × {item.quantity}</p>
              </div>
              <div className="flex items-center space-x-2">
                <button
                  onClick={() => handleQuantityChange(index, 'decrement')}
                  className="px-2 py-1 bg-gray-200 rounded"
                >
                  -
                </button>
                <span>{item.quantity}</span>
                <button
                  onClick={() => handleQuantityChange(index, 'increment')}
                  className="px-2 py-1 bg-gray-200 rounded"
                >
                  +
                </button>
                <button
                  onClick={() => handleRemove(index)}
                  className="ml-4 px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600"
                >
                  Remove
                </button>
              </div>
            </div>
          ))}

          <div className="text-right mt-4">
            <p className="text-xl font-bold">
              Total: ₹
              {cart.reduce((acc, item) => acc + item.price * item.quantity, 0)}
            </p>
            <button
              onClick={handleCheckout}
              disabled={loading}
              className="mt-4 px-6 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
            >
              {loading ? 'Processing...' : 'Proceed to Pay'}
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Cart;
