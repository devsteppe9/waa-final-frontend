import Property from '../components/Property'

import Properties from '../components/Properties'
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { API_BASE_URL } from '../config';
import { apiRequest } from '../request';


export default function Customer() {
    const navigate = useNavigate();
    const [currentTab, setCurrentTab] = useState('properties');

    const [offerHistory, setOfferHistory] = useState([]);
    const [savedProperties, setSavedProperties] = useState([]);
    const [selectedProperty, setSelectedProperty] = useState(null);


    const [propertyKey, setPropertyKey] = useState(0);


    const userDetails = JSON.parse(localStorage.getItem('user'));


    const getInitials = (name) => {
        if (!name) return "";
        const words = name.trim().split(" ");
        if (words.length === 1) {
            return words[0][0].toUpperCase();
        }
        return words[0][0].toUpperCase() + words[1][0].toUpperCase();
    };




    const cancelOffer = async (id) => {
        await apiRequest(`${API_BASE_URL}/offers/${id}`, 'PATCH', { 'status': 'CANCELLED' });
        const updatedOfferHistory = offerHistory.filter(offer => offer.id !== id);
        setOfferHistory(updatedOfferHistory);

    }


    const fetchOfferHistory = async () => {
        const data = await apiRequest(`${API_BASE_URL}/offers`, 'GET');
        setOfferHistory(data);
        setCurrentTab('offers');
    }
    const fetchSavedProperties = async () => {
        const data = await apiRequest(`${API_BASE_URL}/properties?withFavs=true`, 'GET');
        setSavedProperties(data);
        setCurrentTab('saved');
    }
    const fetchAvailableProperties = async () => {
        setPropertyKey(prevKey => prevKey + 1);
        setCurrentTab('properties');
    }



    const handleLogout = () => {
        localStorage.removeItem("user");
        localStorage.removeItem("access_token");
        localStorage.removeItem("refresh_token");
        navigate("/");
    };

    return (
        <>
            <>
                <div className="flex gap-5">
                    <div className="w-full md:w-1/4">
                        <div className="sticky top-20">
                            <div className="p-4 pb-0">
                                <div className="flex align-center justify-start pb-4">
                                    <div className="mr-4 flex items-center justify-center w-16 h-16 rounded-full bg-blue-500 text-white text-xl font-bold">
                                        {getInitials(userDetails.firstName)}
                                    </div>
                                    <div className="">
                                        <div className="text-xl">{userDetails.firstName}</div>
                                        <small>{userDetails.email}</small>
                                    </div>
                                </div>
                            </div>
                            <ul className="p-0 border-t border-gray-400">
                                <li onClick={fetchAvailableProperties} className="cursor-pointer p-4 hover:bg-gray-200">
                                    <span>Available Properties</span>
                                </li>
                                <li onClick={fetchOfferHistory} className="cursor-pointer p-4 hover:bg-gray-200">
                                    <span>Offer History</span>
                                </li>
                                {/*<li onClick={fetchSavedProperties} className="cursor-pointer p-4 hover:bg-gray-200">
                                    <span>Saved Properties</span>
                                </li>*/}
                                <li onClick={handleLogout} className="cursor-pointer p-4 hover:bg-gray-200">
                                    <span>Logout</span>
                                </li>
                            </ul>
                        </div>


                    </div>

                    {currentTab === 'properties' &&
                        <div className="w-full">

                            <h2 className="text-blue-400 text-center text-3xl border-b border-solid border-gray-300 mb-7 pb-3">Available Properties</h2>
                            <Properties key={propertyKey} />
                        </div>
                    }

                    {currentTab === 'offers' &&
                        <>
                            <div className="w-full">
                                <h2 className="text-blue-400 text-center text-3xl border-b border-solid border-gray-300 mb-7 pb-3">My Offer History</h2>

                                <ul className="divide-y divide-gray-200 w-full">
                                    {offerHistory.map((offer) => (
                                        <li key={offer.id} className="px-4 py-4 sm:px-6 bg-white mb-3">
                                            <div className="flex items-center justify-between gap-4">
                                                <div>
                                                    <img
                                                        width="100"
                                                        src={offer.property?.fileResources?.length > 0
                                                            ? `${API_BASE_URL}/file-resources/${offer.property?.fileResources[0].storageKey}`
                                                            : "https://sportsguff.com/assets/images/lazy.png"}
                                                        alt={offer.property?.name}
                                                        className="w-full h-48 object-cover" />
                                                </div>
                                                <div className="flex-1 min-w-0">
                                                    <h3 className="text-lg font-medium text-gray-900 truncate">
                                                        {offer.property?.name}
                                                    </h3>
                                                    <div className="mt-3">
                                                        <span className={offer.status}>{offer.status}</span>
                                                    </div>
                                                    <div className="my-4 font-bold">Offfer Price : ${offer.offerAmount}</div>

                                                    <div className="my-4 font-bold">Original Price : ${offer.property?.price}</div>
                                                    <p className="text-xs">{offer.message}  </p>
                                                </div>
                                                <div className="flex space-x-2">
                                                    <>
                                                        {offer.status === 'OPEN' &&
                                                            <button
                                                                onClick={() => cancelOffer(offer.id)}
                                                                className="inline-flex items-center bg-red-600 px-3 py-1 border border-transparent text-sm font-medium rounded-md text-white">
                                                                <i className="fa fa-close h-4 w-4 mr-1"></i>
                                                                Cancel Offer
                                                            </button>
                                                        }
                                                    </>
                                                </div>
                                            </div>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        </>
                    }
                    {currentTab === 'saved' &&
                        <>
                            <div className="w-full">
                                <h2 className="text-blue-400 text-center text-3xl border-b border-solid border-gray-300 mb-7 pb-3">Saved Properties</h2>

                                <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-3 gap-10">
                                    {savedProperties.map((property) => (
                                        <Property property={property} setSelectedProperty={setSavedProperties} key={`saved-${property.id}`} />
                                    ))
                                    }
                                </div>
                            </div>
                        </>
                    }

                </div >



            </>
        </>
    )
}