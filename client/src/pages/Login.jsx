import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const Login = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post(`${import.meta.env.VITE_API_BASE}/auth/login`, {
        email,
        password,
      });

      localStorage.setItem('user', JSON.stringify(res.data));
      

      if (res.data?.email === 'admin@example.com') {
        navigate('/admin');
      } else {
        navigate('/');
      }
    } catch (err) {
      alert('Login failed');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <form
        onSubmit={handleSubmit}
        className="bg-white p-6 rounded shadow w-full max-w-md"
      >
        <h2 className="text-2xl font-bold mb-4">Login</h2>
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full p-2 mb-3 border rounded"
          required
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full p-2 mb-3 border rounded"
          required
        />
        <button
          type="submit"
          className="w-full bg-blue-600 text-white p-2 rounded hover:bg-blue-700"
        >
          Login
        </button>
        <p className="text-sm mt-3 text-gray-500">
          Don’t have an account?{' '}
          <span
            onClick={() => navigate('/signup')}
            className="text-blue-600 cursor-pointer hover:underline"
          >
            Signup
          </span>
        </p>
      </form>
    </div>
  );
};

export default Login;
