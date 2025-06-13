import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import WhatsAppIcon from '../components/WhatsAppIcon';

const Home = () => {
  const [products, setProducts] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const res = await axios.get('http://localhost:5000/api/products/all');
      setProducts(res.data);
    } catch (error) {
      console.error('Error fetching products:', error);
    }
  };

  const loadRazorpay = () => {
    return new Promise((resolve) => {
      const script = document.createElement('script');
      script.src = 'https://checkout.razorpay.com/v1/checkout.js';
      script.onload = () => resolve(true);
      script.onerror = () => resolve(false);
      document.body.appendChild(script);
    });
  };

  const handleBuyNow = async (product, quantity = 1) => {
    const user = JSON.parse(localStorage.getItem("user"));
    const token = user?.token;

    if (!token) {
      alert("Please log in to buy this product.");
      return navigate('/login');
    }

    try {
      // Add to cart (optional for buy now)
      await axios.post(
        `${import.meta.env.VITE_API_BASE}/cart/add`,
        {
          productId: product._id,
          quantity,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const scriptLoaded = await loadRazorpay();
      if (!scriptLoaded) return alert('Razorpay SDK failed to load.');

      const res = await axios.post(
        'http://localhost:5000/api/payment/create-order',
        {
          amount: product.price * quantity * 100,
          productId: product._id,
          productName: product.name,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const options = {
        key: import.meta.env.VITE_RAZORPAY_KEY,
        amount: res.data.order.amount,
        currency: 'INR',
        name: 'ThinMax',
        description: product.name,
        order_id: res.data.order.id,
        handler: async function (response) {
          alert('Payment Successful!');
          await axios.post(
            'http://localhost:5000/api/payment/verify',
            {
              ...response,
              orderId: res.data.order.id,
              productId: product._id,
            },
            {
              headers: {
                Authorization: `Bearer ${token}`,
              },
            }
          );
        },
        prefill: {
          name: user.name,
          email: user.email,
        },
        theme: { color: '#2563eb' },
      };

      const razor = new window.Razorpay(options);
      razor.open();
    } catch (error) {
      console.error("Payment error:", error.response?.data || error.message);
    }
  };

  const handleAddToCart = async (product, quantity = 1) => {
    const user = JSON.parse(localStorage.getItem("user"));
    const token = user?.token;

    if (!token) {
      alert("Please log in to add items to cart.");
      return navigate('/login');
    }

    let cart = JSON.parse(localStorage.getItem("cart")) || [];
    const existingIndex = cart.findIndex((item) => item._id === product._id);

    if (existingIndex >= 0) {
      cart[existingIndex].quantity += quantity;
    } else {
      cart.push({ ...product, quantity });
    }

    localStorage.setItem("cart", JSON.stringify(cart));
    localStorage.setItem("user", JSON.stringify({ ...user, token }));

    alert("Added to cart!");

    try {
      await axios.post(
        `${import.meta.env.VITE_API_BASE}/cart/add`,
        {
          productId: product._id,
          quantity,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
    } catch (error) {
      console.error("Backend cart update failed:", error.response?.data || error.message);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-10">
      <h1 className="text-3xl font-bold text-center mb-10 text-gray-800">Our Products</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
        {products.map((product) => (
          <div key={product._id} className="bg-white shadow rounded-xl overflow-hidden">
            <img
              src={product.image}
              alt={product.name}
              className="w-full h-64 object-cover cursor-pointer hover:scale-105 transition"
              onClick={() => alert(product.description)}
            />
            <div className="p-4">
              <h2 className="text-xl font-semibold text-gray-800">{product.name}</h2>
              <p className="text-gray-600 mt-1 text-sm">{product.description}</p>
              <p className="text-lg font-bold text-blue-600 mt-2">₹{product.price}</p>
              <div className="flex items-center mt-4">
                <input
                  type="number"
                  min="1"
                  defaultValue="1"
                  className="w-16 mr-2 border rounded p-1"
                  id={`qty-${product._id}`}
                />
                <button
                  onClick={() => {
                    const qty = document.getElementById(`qty-${product._id}`).value;
                    handleBuyNow(product, parseInt(qty));
                  }}
                  className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
                >
                  Buy Now
                </button>
                <button
                  onClick={() => {
                    const qty = document.getElementById(`qty-${product._id}`).value;
                    handleAddToCart(product, parseInt(qty));
                  }}
                  className="ml-2 bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
                >
                  Add to Cart
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      <WhatsAppIcon />
    </div>
  );
};

export default Home;
