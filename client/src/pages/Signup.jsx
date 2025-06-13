import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const Signup = () => {
  const [userData, setUserData] = useState({
    name: '',
    email: '',
    password: '',
  });

  const navigate = useNavigate();

  const handleChange = (e) => {
    setUserData({ ...userData, [e.target.name]: e.target.value });
  };

const handleSubmit = async (e) => {
  e.preventDefault();
  try {
    const res = await axios.post(`${import.meta.env.VITE_API_BASE}/auth/signup`, userData);

    // ✅ Show success alert
    alert('Signup Success!');

    // ✅ Save user & navigate
    localStorage.setItem('user', JSON.stringify(res.data.user));
    navigate('/');
  } catch (err) {
    console.error(err);

    // ✅ Show error message from server if available
    alert(err.response?.data?.msg || 'Signup failed');
  }
};


  return (
    <div className="flex justify-center items-center min-h-screen bg-blue-50">
      <form
        onSubmit={handleSubmit}
        className="bg-white p-6 rounded-xl shadow-xl w-full max-w-md"
      >
        <h2 className="text-2xl font-bold mb-6 text-center">Signup</h2>
        <input
          type="text"
          name="name"
          placeholder="Full Name"
          value={userData.name}
          onChange={handleChange}
          required
          className="w-full mb-4 px-4 py-2 border rounded"
        />
        <input
          type="email"
          name="email"
          placeholder="Email"
          value={userData.email}
          onChange={handleChange}
          required
          className="w-full mb-4 px-4 py-2 border rounded"
        />
        <input
          type="password"
          name="password"
          placeholder="Password"
          value={userData.password}
          onChange={handleChange}
          required
          className="w-full mb-6 px-4 py-2 border rounded"
        />
        <button
          type="submit"
          className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700"
        >
          Signup
        </button>
        <p
          className="text-center text-sm mt-4 text-blue-600 cursor-pointer"
          onClick={() => navigate('/login')}
        >
          Already have an account? Login
        </p>
      </form>
    </div>
  );
};

export default Signup;
