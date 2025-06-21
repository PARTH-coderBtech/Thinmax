import React, { useState } from 'react';
import { useLocation } from 'react-router-dom';
import axios from 'axios';

const ProductDetails = () => {
  const location = useLocation();
  const { product, quantity } = location.state;

  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    address: '',
    pincode: '',
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
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

  const handlePayment = async () => {
    const res = await loadRazorpay();
    if (!res) {
      alert('Razorpay SDK failed to load');
      return;
    }

    try {
      // Create order on backend
      const orderResponse = await axios.post(`${import.meta.env.VITE_API_BASE}/payment/create-order`, {
        amount: product.price * quantity * 100, // Razorpay amount in paise
        productId: product._id,
        productName: product.name,
      });

      const { order } = orderResponse.data;

      const options = {
        key: import.meta.env.VITE_RAZORPAY_KEY,
        amount: order.amount,
        currency: order.currency,
        name: "Indodeeps",
        description: product.name,
        order_id: order.id,
        handler: async (response) => {
          // Save full order details along with user details
          await axios.post(`${import.meta.env.VITE_API_BASE}/payment/verify`, {
            razorpay_order_id: response.razorpay_order_id,
            razorpay_payment_id: response.razorpay_payment_id,
            razorpay_signature: response.razorpay_signature,
            orderId: order.id,
            productId: product._id,
            quantity: quantity,
            name: formData.fullName,
            email: formData.email,
            phone: formData.phone,
            address: formData.address,
            pincode: formData.pincode
          });

          alert('Payment Successful!');
        },
        prefill: {
          name: formData.fullName,
          email: formData.email,
          contact: formData.phone,
        },
        theme: {
          color: "#3399cc",
        },
      };

      const paymentObject = new window.Razorpay(options);
      paymentObject.open();
    } catch (error) {
      console.error(error);
      alert('Something went wrong');
    }
  };

  return (
    <div className="max-w-3xl mx-auto p-4">
      <h1 className="text-3xl font-bold mb-4">{product.name}</h1>
      <img src={product.image} alt={product.name} className="w-96 h-80 object-cover mb-4" />
      <p className="mb-4">{product.description}</p>
      <video controls className="w-96 mb-4">
        <source src="/videos/Howtouse.mp4" type="video/mp4" />
        Your browser does not support the video tag.
      </video>
      <p className="text-lg font-bold">Quantity: {quantity}</p>
      <p className="text-lg font-bold mb-6">Total Amount: ₹{product.price * quantity}</p>

      <h2 className="text-2xl font-bold mb-4">Enter Delivery Details:</h2>

      <div className="space-y-4">
        <input name="fullName" onChange={handleChange} placeholder="Full Name" className="border p-2 w-full" />
        <input name="email" onChange={handleChange} placeholder="Email" className="border p-2 w-full" />
        <input name="phone" onChange={handleChange} placeholder="Phone Number" className="border p-2 w-full" />
        <input name="address" onChange={handleChange} placeholder="Full Address" className="border p-2 w-full" />
        <input name="pincode" onChange={handleChange} placeholder="Pincode" className="border p-2 w-full" />
      </div>

      <button
        onClick={handlePayment}
        className="mt-6 bg-green-600 text-white px-6 py-3 rounded hover:bg-green-700"
      >
        Proceed to Pay
      </button>
    </div>
  );
};

export default ProductDetails;
