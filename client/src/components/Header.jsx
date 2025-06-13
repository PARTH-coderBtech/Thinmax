// Proceeding with Header, Footer, and Home Page
// 1. Header.jsx
import logo from '../assets/logo1.png';
import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

const Header = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem('user'));
    if (user) {
      setIsLoggedIn(true);
      if (user.email === 'admin@example.com') {
        setIsAdmin(true);
      }
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('user');
    setIsLoggedIn(false);
    setIsAdmin(false);
    navigate('/');
  };

  return (
    <header className="bg-white shadow sticky top-0 z-40">
      <div className="max-w-7xl mx-auto flex justify-between items-center px-3 py-3">
        <Link to="/">
          <img src={logo} alt="ThinMax Logo" className="h-[90px]" />
        </Link>
        <nav className="space-x-6 text-gray-700 font-medium flex items-center">
          <Link to="/">Home</Link>
          <Link to="/about">About</Link>
          <Link to="/contact">Contact</Link>
          <Link to="/cart">Cart</Link>
          {isAdmin && <Link to="/admin">Admin</Link>}
          {isLoggedIn ? (
            <button
              onClick={handleLogout}
              className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600"
            >
              Logout
            </button>
          ) : (
            <>
              <Link to="/login">Login</Link>
              <Link to="/signup">Signup</Link>
            </>
          )}
        </nav>
      </div>
    </header>
  );
};

export default Header;