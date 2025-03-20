import { useEffect, useState } from "react";
import defaultImg from "../assets/default.png";
import axios from "axios";
import { API_BASE_URL } from "../config";

export default function EditProperty({ property, onClose, fetchMyProperties }) {
  const [updatedProperty, setUpdatedProperty] = useState({
    name: property.name || "",
    address: property.address || "",
    price: property.price || 0,
    description: property.description || "",
    totalArea: property.totalArea || 0,
    fileResources: property.fileResources || [],
  });

  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "unset";
    };
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setUpdatedProperty((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async () => {
    const payload = {
      ...updatedProperty,
      price: Number(updatedProperty.price),
      totalArea: Number(updatedProperty.totalArea)
    };
    const res = await axios.patch(`${API_BASE_URL}/properties/${property.id}`, payload, {
      headers: {
        "Content-Type": "application/json",
        // Authorization: `Bearer ${userDetails.token}`,
      },
    });
    onClose();
    setUpdatedProperty({
      name: "",
      address: "",
      price: 0,
      description: "",
      totalArea: 0,
      fileResources: [],
    });
    if (res.status === 200) {
      fetchMyProperties();
      alert("Property updated successfully");
    } else {
      alert("Error updating property");
    }
  };

  const handleOverlayClick = (e) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  return (
    <div
      className="fixed inset-0 bg-black bg-opacity-50 flex flex-col items-center justify-center z-50 overflow-hidden"
      onClick={handleOverlayClick}
    >
      <div className="bg-white p-6 rounded-lg w-11/12 md:w-3/4 lg:w-2/3 max-w-screen-lg max-h-[90vh]">
        <div className="flex justify-between items-center mb-6">
          <div></div>
          <h2 className="text-2xl text-center">Edit Property</h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 text-2xl font-bold"
          >
            ×
          </button>
        </div>
        <div className="flex flex-row gap-4">
          <div className="w-1/3 mr-6">
            <img
              src={
                property.fileResources.length > 0
                  ? `http://52.90.131.91/api/v1/file-resources/${property.fileResources[0].storageKey}`
                  : defaultImg
              }
              alt={property.name}
              className="w-full h-48 object-cover rounded-md"
            />
          </div>

          <div className="md:w-2/3">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <div>
                <label
                  htmlFor="name"
                  className="block mb-2 text-sm font-medium text-gray-700"
                >
                  Property Name
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  placeholder="Enter property name"
                  value={updatedProperty.name}
                  onChange={handleChange}
                  className="w-full p-2.5 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                />
              </div>

              <div>
                <label
                  htmlFor="address"
                  className="block mb-2 text-sm font-medium text-gray-700"
                >
                  Address
                </label>
                <input
                  type="text"
                  id="address"
                  name="address"
                  placeholder="Enter address"
                  value={updatedProperty.address}
                  onChange={handleChange}
                  className="w-full p-2.5 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                />
              </div>

              <div>
                <label
                  htmlFor="price"
                  className="block mb-2 text-sm font-medium text-gray-700"
                >
                  Price
                </label>
                <input
                  type="number"
                  id="price"
                  name="price"
                  placeholder="Price"
                  value={updatedProperty.price}
                  onChange={handleChange}
                  className="w-full p-2 border border-gray-300 rounded"
                />
              </div>

              <div>
                <label
                  htmlFor="totalArea"
                  className="block mb-2 text-sm font-medium text-gray-700"
                >
                  Total Area (sqft)
                </label>
                <input
                  type="number"
                  id="totalArea"
                  name="totalArea"
                  placeholder="Total Area (sqft)"
                  value={updatedProperty.totalArea}
                  onChange={handleChange}
                  className="w-full p-2 border border-gray-300 rounded"
                />
              </div>
            </div>
          </div>
        </div>
        <div>
          <label
            htmlFor="description"
            className="block mb-2 text-sm font-medium text-gray-700"
          >
            Description
          </label>
          <textarea
            id="description"
            name="description"
            placeholder="Enter property description"
            value={updatedProperty.description}
            onChange={handleChange}
            className="w-full p-2.5 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
          />
        </div>

        <div className="flex justify-between mt-4 md:mt-6">
          <button
            onClick={onClose}
            className="bg-gray-300 text-gray-700 px-6 py-2 rounded"
          >
            Close
          </button>
          <button
            onClick={handleSubmit}
            className="bg-blue-500 text-white px-6 py-2 rounded"
          >
            Save Changes
          </button>
        </div>
      </div>
    </div>
  );
}
