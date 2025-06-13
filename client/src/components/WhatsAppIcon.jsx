import React from 'react';

const WhatsAppIcon = () => {
  const phoneNumber = '919876543210'; // Replace with your actual WhatsApp number (with country code)

  return (
    <a
      href={`https://wa.me/${phoneNumber}`}
      target="_blank"
      rel="noopener noreferrer"
      className="fixed bottom-6 right-6 z-50 bg-green-500 hover:bg-green-600 text-white p-3 rounded-full shadow-lg transition-all"
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        height="32"
        viewBox="0 0 448 512"
        fill="currentColor"
      >
        <path d="M380.9 97.1C339-22.6 209.5-35.1 128.6 47.5 67.5 108.9 55.6 204.4 90.3 278.3l-32.7 98.5 100.7-33.3c70.9 32.4 154.6 18.4 210.7-38.8 81.2-84.6 68.7-214.1-27.1-273.6zM244.2 330.1c-28.3 0-55.8-8.5-78.6-24.6l-5.6-3.9-58.2 19.2 19.2-56.2-3.9-5.9c-22.6-34.3-25.1-78.4-6.6-115.6 18.2-36.7 52.7-61.4 93.5-67.1 44.3-6.2 89.7 14.1 116.4 52.3 27.4 39 28.6 90.1 3.1 130.7-21.5 33.7-58.5 54.6-98.3 54.6z" />
      </svg>
    </a>
  );
};

export default WhatsAppIcon;
