import React from "react";

export default function DeleteModal({ isOpen, onClose, onConfirmDelete, property }) {
  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50"
      onClick={onClose}
    >
      <div
        className="bg-white p-6 rounded-lg w-96 max-w-md"
        onClick={(e) => e.stopPropagation()} 
      >
        <h3 className="text-lg font-semibold mb-4 text-center">Are you sure you want to delete this property?</h3>
        <div className="mb-4">
          <p><strong>{property?.title}</strong></p>
          <p>{property?.location}</p>
        </div>
        <div className="flex justify-between mt-4">
          <button
            onClick={onClose}
            className="bg-gray-300 text-gray-700 px-6 py-2 rounded"
          >
            Cancel
          </button>
          <button
            onClick={() => {
              onConfirmDelete(property.id); 
              onClose(); 
            }}
            className="bg-red-500 text-white px-6 py-2 rounded"
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  );
}
