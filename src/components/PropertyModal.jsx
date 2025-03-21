import { useEffect, useState } from "react";
import Status from "./Status";
import defaultImg from "../assets/default.png";
import { API_BASE_URL } from "../config";
import { apiRequest } from '../request'


export default function PropertyModal({ propertyId, onClose , fetchMyProperties}) {
    const [selectedOffer, setSelectedOffer] = useState(null);
    const [offers, setOffers] = useState([]);    
    const [property, setProperty] = useState({});

     const fetchProperty = async () => {
        try {
            const response = await apiRequest(`${API_BASE_URL}/properties/${propertyId}`, "GET");
            setProperty(response);
            setOffers(response.offers);
        } catch (error) {
            console.error("There was an error fetching the property data!", error);
        }
     };
    
    const handleAcceptOffer = async (offerId) => {
        try {
            await apiRequest(`${API_BASE_URL}/properties/${property.id}/offers/${offerId}`,"PATCH", { status: "ACCEPTED" });

            setOffers((prevOffers) =>
                prevOffers.map((offer) =>
                    offer.id === offerId ? { ...offer, status: "ACCEPTED" } : offer
                )
            );
            fetchProperty();
            setSelectedOffer(offerId);
        } catch (error) {
            console.error("There was an error rejecting the offer!", error);
        }

    };

    const handleRejectOffer = async (offerId) => {
        try {
            await apiRequest(`${API_BASE_URL}/properties/${property.id}/offers/${offerId}`,"PATCH", { status: "REJECTED" });

            setOffers((prevOffers) =>
                prevOffers.map((offer) =>
                    offer.id === offerId ? { ...offer, status: "REJECTED" } : offer
                )
            );
            fetchProperty();
            setSelectedOffer(null);
        } catch (error) {
            console.error("There was an error accepting the offer!", error);
        }
    };

    const handleContingent = async () => {
        try {
            await apiRequest(`${API_BASE_URL}/properties/${property.id}`, "PATCH", { status: "CONTINGENT" },{},{},false);
            setProperty({ ...property, status: "CONTINGENT" });
            fetchMyProperties();

        } catch (error) {
            console.error("There was an error changing the property status!", error);
        }
    };

    const handleMarkAsSold = async () => {
        try {
            await apiRequest(`${API_BASE_URL}/properties/${property.id}`, "PATCH", { status: "SOLD" },{},{},false);
            setProperty({ ...property, status: "SOLD" });
            fetchMyProperties();
        } catch (error) {
            console.error("There was an error changing the property status!", error);
        }
    };
    useEffect(() => {
        fetchProperty();
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

                <div className="mb-6 flex justify-between">
                    <div className="w-2/3">
                        <div className="mb-4">
                            <Status status={property.status} />
                            <h3 className="text-xl font-semibold">{property.name}</h3>
                            <span className="text-sm text-gray-500">{property.address}</span>
                        </div>
                        <div className="mb-4">
                            <p className="text-gray-600 leading-relaxed">{property.description}</p>
                        </div>
                    </div>
                    <div className="w-1/3 text-right">
                        <div className="mb-4">
                            <span className="text-blue-600 font-bold text-lg">{formatCurrency(property.price)}</span>
                        </div>
                        <div className="grid grid-cols-1 gap-4">
                            {property?.fileResources?.length > 0 ? (
                                <img
                                    src={`${API_BASE_URL}/file-resources/${property.fileResources[0].storageKey}`}
                                    alt={`${property.name} - 1`}
                                    className="w-48 h-48 object-cover rounded-md"
                                />
                            ) : (
                                <img
                                    src={defaultImg}
                                    alt={property.name}
                                    className="w-24 h-24 object-cover rounded-md"
                                />
                            )}
                        </div>
                    </div>
                </div>

                <div className="mb-6">
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

                <div className="mt-6">
                    <h4 className="text-gray-700 font-semibold text-lg mb-4">Offers</h4>
                    {offers?.length > 0 && offers.map((offer) => (
                        <div
                            key={offer.id}
                            className={`p-4 mb-4 border rounded-lg ${selectedOffer === offer.id ? 'bg-green-100' : 'bg-white'
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
                                        className={`${offer.status === "Accepted"
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
                                    {offer.status !== "REJECTED" && (<button
                                        onClick={() => handleRejectOffer(offer.id)}
                                        className="bg-gray-300 text-gray-700 px-4 py-2 rounded"
                                    >
                                        Reject
                                    </button>
                                    )}
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
