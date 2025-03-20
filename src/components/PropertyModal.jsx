import { useEffect, useState } from "react";
import Status from "./Status";
import defaultImg from "../assets/default.png";

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
    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50" onClick={handleOverlayClick}>
            <div className="bg-white rounded-lg w-11/12 md:w-2/3 lg:w-2/3 xl:w-1/2 p-6 shadow-lg relative max-h-[90vh] overflow-y-auto">
                <button
                    className="absolute top-3 right-3 text-gray-600 hover:text-gray-800"
                    onClick={onClose}
                >
                    <i className="fa-solid fa-xmark text-2xl"></i>
                </button>

                <div className="flex mb-6">

                    <div className="w-1/3 mr-6">
                        <img
                            src={property.fileResources.length > 0 ? `http://52.90.131.91/api/v1/file-resources/${property.fileResources[0].storageKey}` : defaultImg}
                            alt={property.name}
                            className="w-full h-48 object-cover rounded-md"
                        />
                    </div>

                    <div className="w-2/3">
                        <div className="mb-4">
                            <Status status="Available" />
                            <h3 className="text-xl font-semibold">{property.name}</h3>
                            <span className="text-sm text-gray-500">{property.address}</span>
                        </div>
                        <div className="mb-4">
                            <span className="text-blue-600 font-bold text-lg">${property.price}</span>
                        </div>
                        <div className="mb-4 text-sm text-gray-500">
                            <p>{property.description} description here</p>
                        </div>
                        <div className="flex justify-between text-sm text-gray-500 mb-4">
                            <div>
                                <span>{property.offers.length} offers</span>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="mt-6">
                    <h4 className="text-lg font-semibold mb-4">Offers</h4>
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
