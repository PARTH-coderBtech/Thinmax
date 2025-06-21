import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import WhatsAppIcon from '../components/WhatsAppIcon';
import Slider from 'react-slick';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';

const Home = () => {
  const [products, setProducts] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const res = await axios.get(`${import.meta.env.VITE_API_BASE}/products/all`);
      setProducts(res.data);
    } catch (error) {
      console.error('Error fetching products:', error);
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
        { productId: product._id, quantity },
        { headers: { Authorization: `Bearer ${token}` } }
      );
    } catch (error) {
      console.error("Backend cart update failed:", error.response?.data || error.message);
    }
  };

  const singleSliderSettings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 2500,
    arrows: false
  };

  const multiProductSliderSettings = {
    dots: true,
    infinite: true,
    speed: 600,
    slidesToShow: 3,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 2000,
    centerMode: true,
    centerPadding: '20px',
    responsive: [
      { breakpoint: 1024, settings: { slidesToShow: 2 } },
      { breakpoint: 600, settings: { slidesToShow: 1 } },
    ],
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-10">
      <h1 className="text-3xl font-bold text-center mb-10 text-gray-800">Our Products</h1>

      {products.length === 1 ? (
        <div className="flex justify-center">
          <div className="bg-white rounded-xl shadow-lg overflow-hidden w-full sm:w-96">
            <Slider {...singleSliderSettings}>
              {[...Array(5)].map((_, index) => (
                <div key={index}>
                  <img
                    src={products[0].image}
                    alt={products[0].name}
                    className="w-full h-72 object-cover"
                  />
                </div>
              ))}
            </Slider>
            <div className="p-4">
              <h2 className="text-xl font-semibold text-gray-800">{products[0].name}</h2>
              <p className="text-gray-600 text-sm">{products[0].description}</p>
              <p className="text-lg font-bold text-blue-600 mt-2">₹{products[0].price}</p>
              <div className="flex items-center mt-4">
                <input type="number" min="1" defaultValue="1" className="w-16 mr-2 border rounded p-1" id={`qty-${products[0]._id}`} />
                <button onClick={() => {
                  const qty = parseInt(document.getElementById(`qty-${products[0]._id}`).value);
                  navigate(`/product/${products[0]._id}`, { state: { product: products[0], quantity: qty } });
                }}
                className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">Buy Now</button>

                <button onClick={() => {
                  const qty = parseInt(document.getElementById(`qty-${products[0]._id}`).value);
                  handleAddToCart(products[0], qty);
                }}
                className="ml-2 bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700">Add to Cart</button>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <Slider {...multiProductSliderSettings}>
          {products.map((product) => (
            <div key={product._id} className="p-2">
              <div className="bg-white rounded-xl shadow-lg overflow-hidden">
                <Slider {...singleSliderSettings}>
                  {[...Array(5)].map((_, index) => (
                    <div key={index}>
                      <img
                        src={product.image}
                        alt={product.name}
                        className="w-full h-64 object-cover"
                      />
                    </div>
                  ))}
                </Slider>
                <div className="p-4">
                  <h2 className="text-xl font-semibold text-gray-800">{product.name}</h2>
                  <p className="text-gray-600 text-sm">{product.description}</p>
                  <p className="text-lg font-bold text-blue-600 mt-2">₹{product.price}</p>
                  <div className="flex items-center mt-4">
                    <input type="number" min="1" defaultValue="1" className="w-16 mr-2 border rounded p-1" id={`qty-${product._id}`} />
                    <button onClick={() => {
                      const qty = parseInt(document.getElementById(`qty-${product._id}`).value);
                      navigate(`/product/${product._id}`, { state: { product, quantity: qty } });
                    }}
                    className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">Buy Now</button>
                    <button onClick={() => {
                      const qty = parseInt(document.getElementById(`qty-${product._id}`).value);
                      handleAddToCart(product, qty);
                    }}
                    className="ml-2 bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700">Add to Cart</button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </Slider>
      )}
      <WhatsAppIcon />
    </div>
  );
};

export default Home;
