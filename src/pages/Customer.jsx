import Offer from '../components/Offer'
import Property from '../components/Property'
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { API_BASE_URL } from '../config';
import { apiRequest } from '../request';


export default function Customer() {
    const navigate = useNavigate();
    const [currentTab, setCurrentTab] = useState('properties');
    const [availableProperties, setAvailableProperties] = useState([]);
    const [offerHistory, setOfferHistory] = useState([]);
    const [savedProperties, setSavedProperties] = useState([]);

    const userDetails = JSON.parse(localStorage.getItem('user'));


    const getInitials = (name) => {
        if (!name) return "";
        const words = name.trim().split(" ");
        if (words.length === 1) {
            return words[0][0].toUpperCase();
        }
        return words[0][0].toUpperCase() + words[1][0].toUpperCase();
    };

    const fetchOfferHistory = async () => {
        const data = await apiRequest(`${API_BASE_URL}/properties`, 'GET');
        setOfferHistory(data);
        setCurrentTab('offers');
    }
    const fetchSavedProperties = async () => {
        const data = await apiRequest(`${API_BASE_URL}/properties`, 'GET');
        setSavedProperties(data);
        setCurrentTab('saved');
    }
    const fetchAvailableProperties = async () => {
        const data = await apiRequest(`${API_BASE_URL}/properties`, 'GET');
        setAvailableProperties(data);
        setCurrentTab('properties');
    }
    useEffect(() => {
        fetchAvailableProperties();
    }, []);

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
                                <li onClick={fetchSavedProperties} className="cursor-pointer p-4 hover:bg-gray-200">
                                    <span>Saved Properties</span>
                                </li>
                                <li onClick={handleLogout} className="cursor-pointer p-4 hover:bg-gray-200">
                                    <span>Logout</span>
                                </li>
                            </ul>
                        </div>


                    </div>

                    {currentTab === 'properties' &&
                        <div className="w-full md:w-3/4">
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-10">
                                {availableProperties &&
                                    availableProperties.map((property) => (
                                        <Property property={property} key={`property-${property.id}`} />
                                    )
                                    )}
                            </div>
                        </div>
                    }
                    {currentTab === 'offers' &&
                        offerHistory.map((offer) => (
                            <Offer key={`offer-${offer.id}`} />
                        ))
                    }
                    {currentTab === 'saved' &&
                        savedProperties.map((property) => (
                            <Property property={property} key={`saved-${property.id}`} />
                        ))
                    }

                </div >

            </>
        </>
    )
}