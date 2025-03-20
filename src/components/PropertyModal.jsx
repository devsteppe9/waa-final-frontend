import { useEffect, useState } from "react";
import Status from "./Status";
import defaultImg from "../assets/default.png";
import { API_BASE_URL } from "../config";

export default function PropertyModal({ property, onClose }) {
    const [selectedOffer, setSelectedOffer] = useState(null);

    const handleAcceptOffer = (offerId) => {
        setSelectedOffer(offerId);
    };

    const handleRejectOffer = () => {
        setSelectedOffer(null);
    };
    useEffect(() => {
        document.body.style.overflow = "hidden";
        return () => {
          document.body.style.overflow = "unset";
        };
      }, []);
    const offers = [
        {
            id: 1,
            username: "JohnDoe",
            message: "This is my best offer. I love this house!",
            offerPrice: 340000,
        },
        {
            id: 2,
            username: "JaneSmith",
            message: "I'd love to make an offer on this property. Looking forward to hearing back!",
            offerPrice: 345000,
        },
        {
            id: 3,
            username: "MikeJohnson",
            message: "I think this is the right house for me. My family is excited!",
            offerPrice: 350000,
        },
    ];
    const handleOverlayClick = (e) => {
        if (e.target === e.currentTarget) {
          onClose();
        }
      };
      console.log(property);
      
    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50" onClick={handleOverlayClick}>
            <div className="bg-white rounded-lg w-11/12 md:w-2/3 lg:w-2/3 xl:w-1/2 p-6 shadow-lg relative max-h-[90vh] overflow-y-auto">
                <button
                    className="absolute top-3 right-3 text-gray-600 hover:text-gray-800"
                    onClick={onClose}
                >
                    <i className="fa-solid fa-xmark text-2xl"></i>
                </button>

                <div className="mb-6">
                    <div className="flex justify-between items-start mb-4 mr-8">
                        <div>
                            <h3 className="text-2xl font-bold text-gray-800 mb-1">{property.name}</h3>
                            <p className="text-gray-600 text-sm flex items-center">
                                <i className="fa-solid fa-location-dot mr-2"></i>
                                {property.address}
                            </p>
                        </div>
                        <Status status={property.status} />
                    </div>

                    <div className="grid grid-cols-2 gap-6 mb-6 bg-gray-50 p-4 rounded-lg">
                        <div>
                            <p className="text-gray-500 text-sm uppercase tracking-wider mb-1">Price</p>
                            <p className="text-2xl font-bold text-blue-600">${property.price?.toLocaleString()}</p>
                        </div>
                        <div>
                            <p className="text-gray-500 text-sm uppercase tracking-wider mb-1">Total Area</p>
                            <p className="text-2xl font-bold text-gray-800">{property.totalArea?.toLocaleString()} sqft</p>
                        </div>
                    </div>

                    <div className="mb-6">
                        <h4 className="text-gray-700 font-semibold text-lg mb-2">Description</h4>
                        <p className="text-gray-600 leading-relaxed">{property.description}</p>
                    </div>

                    <div className="mb-6">
                        <h4 className="text-gray-700 font-semibold text-lg mb-3">Property Images</h4>
                        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                            {property.fileResources?.length > 0 ? (
                                property.fileResources.map((file, index) => (
                                    <img
                                        key={index}
                                        src={`${API_BASE_URL}/file-resources/${file.storageKey}`}
                                        alt={`${property.name} - ${index + 1}`}
                                        className="w-full h-48 object-cover rounded-md"
                                    />
                                ))
                            ) : (
                                <img
                                    src={defaultImg}
                                    alt={property.name}
                                    className="w-full h-48 object-cover rounded-md"
                                />
                            )}
                        </div>
                    </div>
                </div>

                <div className="mt-6">
                    <h4 className="text-gray-700 font-semibold text-lg mb-4">Offers</h4>
                    {/* {property.offers.map((offer) => ( */}
                    {offers.map((offer) => (

                        <div
                            key={offer.id}
                            className={`p-4 mb-4 border rounded-lg ${
                                selectedOffer === offer.id ? 'bg-green-100' : 'bg-white'
                            } ${selectedOffer !== null && selectedOffer !== offer.id ? 'opacity-50' : ''}`}
                        >
                            <div className="flex justify-between items-center">
                                <div>
                                    <p className="font-semibold">{offer.username}</p>
                                    <p className="text-sm text-gray-500">{offer.message}</p>
                                </div>
                                <div className="text-lg font-bold text-blue-600">${offer.offerPrice}</div>
                            </div>
                            <div className="mt-2 flex justify-between text-sm text-gray-500">
                                <div>
                                    <span
                                        className={`${
                                            offer.status === "Accepted"
                                                ? "text-green-500"
                                                : offer.status === "Rejected"
                                                ? "text-red-500"
                                                : "text-yellow-500"
                                        }`}
                                    >
                                        {offer.status}
                                    </span>
                                </div>
                                <div>
                                    <button
                                        onClick={() => handleAcceptOffer(offer.id)}
                                        className="bg-blue-500 text-white px-4 py-2 rounded mr-2"
                                    >
                                        Accept
                                    </button>
                                    <button
                                        onClick={handleRejectOffer}
                                        className="bg-gray-300 text-gray-700 px-4 py-2 rounded"
                                    >
                                        Reject
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
