import { useEffect, useState } from "react";
import Status from "./Status";
import defaultImg from "../assets/default.png";
import { API_BASE_URL } from "../config";
import { apiRequest } from '../request'

export default function PropertyModal({ property, onClose }) {
    const [selectedOffer, setSelectedOffer] = useState(null);
    const [offers, setOffers] = useState(property.offers || []);    

    const handleAcceptOffer = async (offerId) => {
        try {
            await apiRequest(`${API_BASE_URL}/offers/${offerId}`,"PATCH", { status: "ACCEPTED" });
            setOffers((prevOffers) =>
                prevOffers.map((offer) =>
                    offer.id === offerId ? { ...offer, status: "ACCEPTED" } : offer
                )
            );
            setSelectedOffer(offerId);
        } catch (error) {
            console.error("There was an error rejecting the offer!", error);
        }
        
    };

    const handleRejectOffer = async (offerId) => {
        try {
            await apiRequest(`${API_BASE_URL}/offers/${offerId}`,"PATCH", { status: "REJECTED" });
            setOffers((prevOffers) =>
                prevOffers.map((offer) =>
                    offer.id === offerId ? { ...offer, status: "REJECTED" } : offer
                )
            );
            setSelectedOffer(null);
        } catch (error) {
            console.error("There was an error rejecting the offer!", error);
        }
    };

    const handleContingent = async () => {
        try {
            await apiRequest(`${API_BASE_URL}/properties/${property.id}`, "PATCH", { status: "CONTINGENT" });
            property.status = "CONTINGENT";
        } catch (error) {
            console.error("There was an error changing the property status!", error);
        }
    };

       const handleMarkAsSold = async () => {
        try {
            await apiRequest(`${API_BASE_URL}/properties/${property.id}`, "PATCH", { status: "SOLD" });
            property.status = "SOLD";
        } catch (error) {
            console.error("There was an error changing the property status!", error);
        }
    };
    useEffect(() => {
        document.body.style.overflow = "hidden";
        const handleKeyDown = (e) => {
            if (e.key === "Escape") {
                onClose();
            }
        };
        document.addEventListener("keydown", handleKeyDown);
        return () => {
            document.body.style.overflow = "unset";
            document.removeEventListener("keydown", handleKeyDown);
        };
    }, [onClose]);
    
    const handleOverlayClick = (e) => {
        if (e.target === e.currentTarget) {
          onClose();
        }
    };
    
    const formatCurrency = (amount) => {
        return new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: 'USD',
            minimumFractionDigits: 0,
            maximumFractionDigits: 0,
        }).format(amount);
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
                            <Status status={property.status} />
                            <h3 className="text-xl font-semibold">{property.name}</h3>
                            <span className="text-sm text-gray-500">{property.address}</span>
                        </div>
                        <div className="mb-4">
                            <span className="text-blue-600 font-bold text-lg">{formatCurrency(property.price)}</span>
                        </div>
                        <div className="mb-4 text-sm text-gray-500">
                            <p>{property.description} description here</p>
                        </div>
                        <div className="flex justify-between text-sm text-gray-500 mb-4">
                            <div>
                                <span>{property.offers.length} offers</span>
                            </div>
                        </div>
                        {property.status === "PENDING" && (
                            <button
                                onClick={handleContingent}
                                className="bg-orange-500 text-white px-4 py-2 rounded"
                            >
                                Contingent
                            </button>
                        )}

                        {property.status === "CONTINGENT" && (
                            <button
                                onClick={handleMarkAsSold}
                                className="bg-red-500 text-white px-4 py-2 rounded"
                            >
                                Mark as sold
                            </button>
                        )}
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
                                    <p className="font-semibold">{offer.user.username}</p>
                                    <p className="text-sm text-gray-500">{offer.message}</p>
                                </div>
                                <div className="text-lg font-bold text-blue-600">{formatCurrency(offer.offerAmount)}</div>
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
                                    {offer.status === "OPEN" && (
                                        <button
                                            onClick={() => handleAcceptOffer(offer.id)}
                                            className="bg-blue-500 text-white px-4 py-2 rounded mr-2"
                                        >
                                            Accept
                                        </button>
                                    )}
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
