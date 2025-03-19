import { useEffect, useState } from "react";

export default function AddProperty({ onAddProperty, onClose }) {
  const [newProperty, setNewProperty] = useState({
    name: "",
    location: "",
    price: "",
    description: "",
    totalArea: "",
    photos: [],
  });

  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "unset";
    };
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setNewProperty((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleFileChange = (e) => {
    const files = e.target.files;
    setNewProperty((prev) => ({
      ...prev,
      photos: Array.from(files),
    }));
  };

  const handleSubmit = () => {
    if (newProperty.name && newProperty.location && newProperty.price) {
      onAddProperty(newProperty);
      onClose();
      setNewProperty({
        name: "",
        location: "",
        price: "",
        description: "",
        totalArea: "",
        photos: [],
      });
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
          <h2 className="text-2xl text-center">Add Property</h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 text-2xl font-bold"
          >
            ×
          </button>
        </div>
        <div className="flex flex-row gap-4">
          <div className="md:w-1/3 mb-6 md:mb-0">
            <label
              htmlFor="photos"
              className="block mb-2 text-sm font-medium text-gray-700 "
            >
              Photos
            </label>
            <div className="border-2 border-dashed border-gray-200 p-6 text-center mb-4 rounded-xl bg-gray-50">
              <input
                type="file"
                id="photos"
                name="photos"
                multiple
                onChange={handleFileChange}
                className="w-full text-sm text-gray-700 cursor-pointer"
              />
              <p className="text-gray-500 mt-2">
                Drag and drop your photos or click to select
              </p>
            </div>
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
                  value={newProperty.name}
                  onChange={handleChange}
                  className="w-full p-2.5 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                />
              </div>

              <div>
                <label
                  htmlFor="location"
                  className="block mb-2 text-sm font-medium text-gray-700"
                >
                  Location
                </label>
                <input
                  type="text"
                  id="location"
                  name="location"
                  placeholder="Enter location"
                  value={newProperty.location}
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
                  value={newProperty.price}
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
                  value={newProperty.totalArea}
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
            value={newProperty.description}
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
            Add Property
          </button>
        </div>
      </div>
    </div>
  );
}
