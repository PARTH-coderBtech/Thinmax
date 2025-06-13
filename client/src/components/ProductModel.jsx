import React from 'react';

const ProductModal = ({ product, onClose }) => {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
      <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-md">
        <h2 className="text-2xl font-bold mb-2">{product.name}</h2>
        <img
          src={product.image}
          alt={product.name}
          className="w-full h-64 object-cover mb-4 rounded"
        />
        <p className="text-gray-700 mb-4">{product.description}</p>
        <p className="font-bold text-lg mb-4">Price: ₹{product.price}</p>
        <button
          onClick={onClose}
          className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
        >
          Close
        </button>
      </div>
    </div>
  );
};

export default ProductModal;