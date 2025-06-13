import React from 'react';

const Footer = () => {
  return (
    <footer className="bg-gray-900 text-white py-6 mt-10">
      <div className="max-w-7xl mx-auto px-4 text-center">
        <p>&copy; {new Date().getFullYear()} ThinMax Waterproofing. All rights reserved.</p>
      </div>
    </footer>
  );
};

export default Footer;