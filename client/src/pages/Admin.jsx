import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const Admin = () => {
  const navigate = useNavigate();
  const [orders, setOrders] = useState([]);
  const [products, setProducts] = useState([]);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    image: '',
  });

  // const user = JSON.parse(localStorage.getItem('user'));
  // const token = user?.token;
const stored = JSON.parse(localStorage.getItem('user'));
const user = stored?.user;
const token = stored?.token;
  useEffect(() => {
    console.log('USER:', user);          // 👈 CHECK THIS
  console.log('TOKEN:', token); 
    if (!user || user.email !== 'admin@example.com') {
      alert('Access Denied: Not admin');
      navigate('/');
      return;
    }

    const fetchData = async () => {
      try {
        const orderRes = await axios.get(
          `${import.meta.env.VITE_API_BASE}/admin/orders`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        setOrders(orderRes.data.orders);

        const productRes = await axios.get(
          `${import.meta.env.VITE_API_BASE}/products/all`
        );
        setProducts(productRes.data);
      } catch (err) {
        console.error('Admin Fetch Error:', err);
      }
    };

    fetchData();
  }, [navigate, user, token]);

  const handleInputChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleAddProduct = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post(
        `${import.meta.env.VITE_API_BASE}/admin/products`,
        formData,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      alert('Product added!');
      setProducts([...products, res.data.product]);
      setFormData({ name: '', description: '', price: '', image: '' });
    } catch (err) {
      console.error('Add product error:', err);
    }
  };

  const handleDeleteProduct = async (id) => {
    try {
      await axios.delete(
        `${import.meta.env.VITE_API_BASE}/admin/products/${id}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      alert('Product deleted!');
      setProducts(products.filter((p) => p._id !== id));
    } catch (err) {
      console.error('Delete product error:', err);
    }
  };

  return (
    <div className="max-w-6xl mx-auto py-10 px-4">
      <h1 className="text-3xl font-bold mb-6 text-center">Admin Panel</h1>

      {/* Product Form */}
      <form
        onSubmit={handleAddProduct}
        className="bg-white p-6 rounded shadow mb-8"
      >
        <h2 className="text-2xl font-semibold mb-4">Add New Product</h2>
        <input
          type="text"
          name="name"
          value={formData.name}
          onChange={handleInputChange}
          placeholder="Product Name"
          className="border p-2 w-full mb-2"
          required
        />
        <textarea
          name="description"
          value={formData.description}
          onChange={handleInputChange}
          placeholder="Description"
          className="border p-2 w-full mb-2"
          required
        />
        <input
          type="number"
          name="price"
          value={formData.price}
          onChange={handleInputChange}
          placeholder="Price"
          className="border p-2 w-full mb-2"
          required
        />
        <input
          type="text"
          name="image"
          value={formData.image}
          onChange={handleInputChange}
          placeholder="Image URL"
          className="border p-2 w-full mb-2"
          required
        />
        <button
          type="submit"
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          Add Product
        </button>
      </form>

      {/* Product List */}
      <h2 className="text-2xl font-semibold mb-4">All Products</h2>
      {products.map((product) => (
        <div
          key={product._id}
          className="flex justify-between items-center bg-white p-4 rounded shadow mb-2"
        >
          <div>
            <p className="font-bold">{product.name}</p>
            <p>₹{product.price}</p>
          </div>
          <button
            onClick={() => handleDeleteProduct(product._id)}
            className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600"
          >
            Delete
          </button>
        </div>
      ))}
    </div>
  );
};

export default Admin;
