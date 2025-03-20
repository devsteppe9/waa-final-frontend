import Property from '../components/Property'
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { API_BASE_URL } from '../config';
import { apiRequest } from '../request';


export default function Customer() {
    const navigate = useNavigate();
    const [currentTab, setCurrentTab] = useState('properties');
    const [availableProperties, setAvailableProperties] = useState([]);
    const [filteredProperties, setFilteredProperties] = useState([]);

    const [offerHistory, setOfferHistory] = useState([]);
    const [savedProperties, setSavedProperties] = useState([]);
    const [selectedProperty, setSelectedProperty] = useState(null);
    const [offerPrice, setOfferPrice] = useState('');
    const [offerMessage, setOfferMessage] = useState('');

    const [searchName, setSearchName] = useState('');
    const [searchLocation, setSearchLocation] = useState('');
    const [minPrice, setMinPrice] = useState('');
    const [maxPrice, setMaxPrice] = useState('');
    const [sortOption, setSortOption] = useState('');


    useEffect(() => {
        filterProperties();
    }, [searchName, searchLocation, minPrice, maxPrice, availableProperties, sortOption]);


    const filterProperties = () => {
        let filtered = availableProperties.filter((property) => {
            return (
                (searchName === '' || property.name.toLowerCase().includes(searchName.toLowerCase())) &&
                (searchLocation === '' || property.address.toLowerCase().includes(searchLocation.toLowerCase())) &&
                (minPrice === '' || parseFloat(property.price) >= parseFloat(minPrice)) &&
                (maxPrice === '' || parseFloat(property.price) <= parseFloat(maxPrice))
            );
        });

        if (sortOption === 'price-asc') {
            filtered.sort((a, b) => a.price - b.price);
        } else if (sortOption === 'price-desc') {
            filtered.sort((a, b) => b.price - a.price);
        } else if (sortOption === 'date-asc') {
            filtered.sort((a, b) => new Date(a.created) - new Date(b.created));
        } else if (sortOption === 'date-desc') {
            filtered.sort((a, b) => new Date(b.created) - new Date(a.created));
        }
        setFilteredProperties(filtered);
    };


    const userDetails = JSON.parse(localStorage.getItem('user'));


    const getInitials = (name) => {
        if (!name) return "";
        const words = name.trim().split(" ");
        if (words.length === 1) {
            return words[0][0].toUpperCase();
        }
        return words[0][0].toUpperCase() + words[1][0].toUpperCase();
    };

    const handleChange = (e) => {
        if (e.target.id == 'offerprice') {
            console.log('offerprice');
            setOfferPrice(e.target.value);
        } else if (e.target.id == 'offermessage') {
            console.log('message');
            setOfferMessage(e.target.value);
        }
    }

    const cancelOffer = async (id) => {
        const data = await apiRequest(`${API_BASE_URL}/offers/${id}`, 'PATCH');
        const updatedOfferHistory = offerHistory.filter(offer => offer.id !== id);
        setOfferHistory(updatedOfferHistory);

    }


    const fetchOfferHistory = async () => {
        const data = await apiRequest(`${API_BASE_URL}/offers`, 'GET');
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
        setFilteredProperties(data);

        setCurrentTab('properties');
    }
    useEffect(() => {
        fetchAvailableProperties();
    }, []);

    const addOffer = async () => {
        const postData = {
            'offerAmount': offerPrice,
            'message': offerMessage,
            'propertyId': selectedProperty.id
        };
        const data = await apiRequest(`${API_BASE_URL}/offers/create`, 'POST', postData);
        setOfferMessage('');
        setOfferPrice('');

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

                            <h2 className="text-blue-400 text-center text-3xl border-b border-solid border-gray-300 mb-7 pb-3">Available Properties</h2>
                            <div className="mb-4 grid grid-cols-1 md:grid-cols-5 gap-4">
                                <input
                                    type="text"
                                    placeholder="Search by Name"
                                    value={searchName}
                                    onChange={(e) => setSearchName(e.target.value)}
                                    className="p-2 border border-gray-300 rounded-md"
                                />
                                <input
                                    type="text"
                                    placeholder="Search by Location"
                                    value={searchLocation}
                                    onChange={(e) => setSearchLocation(e.target.value)}
                                    className="p-2 border border-gray-300 rounded-md"
                                />
                                <input
                                    type="number"
                                    placeholder="Min Price"
                                    value={minPrice}
                                    onChange={(e) => setMinPrice(e.target.value)}
                                    className="p-2 border border-gray-300 rounded-md"
                                />
                                <input
                                    type="number"
                                    placeholder="Max Price"
                                    value={maxPrice}
                                    onChange={(e) => setMaxPrice(e.target.value)}
                                    className="p-2 border border-gray-300 rounded-md"
                                />
                                <select
                                    value={sortOption}
                                    onChange={(e) => setSortOption(e.target.value)}
                                    className="p-2 border border-gray-300 rounded-md"
                                >
                                    <option value="">Sort By</option>
                                    <option value="price-asc">Price: Low to High</option>
                                    <option value="price-desc">Price: High to Low</option>
                                    <option value="date-asc">Date: Oldest First</option>
                                    <option value="date-desc">Date: Newest First</option>
                                </select>
                            </div>

                            <div className="border-solid border-t border-gray-300 pt-4 mt-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-10">
                                {filteredProperties &&
                                    filteredProperties.map((property) => (
                                        <Property property={property} setSelectedProperty={setSelectedProperty} key={`property-${property.id}`} />
                                    )
                                    )}
                            </div>
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
                                                    <div className="mt-3">{offer.status}</div>
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

                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-10">
                                    {savedProperties.map((property) => (
                                        <Property property={property} setSelectedProperty={setSelectedProperty} key={`saved-${property.id}`} />
                                    ))
                                    }
                                </div>
                            </div>
                        </>
                    }

                </div >

                {selectedProperty &&
                    <div
                        className="fixed inset-0 bg-black bg-opacity-50 flex flex-col items-center justify-center z-50 overflow-hidden"
                    >
                        <div className="bg-white p-6 rounded-lg w-11/12 md:w-3/4 lg:w-2/3 max-w-screen-lg max-h-[90vh]">
                            <div className="flex justify-between items-center mb-6">
                                <h2 className="text-2xl text-center">Send Offer</h2>
                                <button onClick={() => setSelectedProperty(null)}
                                    className="text-gray-500 hover:text-gray-700 text-2xl font-bold"
                                >
                                    ×
                                </button>
                            </div>
                            <div className="flex gap-4">
                                <div className="flex-1">
                                    <div>
                                        <label className="block mb-2 text-sm font-medium text-gray-700">
                                            Price
                                        </label>
                                        <input
                                            type="text"
                                            id="offerPrice"
                                            value={offerPrice}
                                            onChange={(e) => setOfferPrice(e.target.value)}
                                            name="price"
                                            placeholder="Enter Your Offer Price"
                                            className="w-full p-2.5 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                                        />
                                    </div>
                                    <div className="mt-5">
                                        <label className="block mb-2 text-sm font-medium text-gray-700">
                                            Message
                                        </label>
                                        <textarea onChange={(e) => setOfferMessage(e.target.value)} value={offerMessage} id="offerMessage" className="w-full p-2.5 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"></textarea>
                                    </div>
                                    <button onClick={addOffer} className="bg-blue-800 text-white p-4">Send Offer</button>
                                </div>
                                <div className="flex-1">
                                    <img
                                        src={selectedProperty.fileResources?.length > 0
                                            ? `${API_BASE_URL}/file-resources/${selectedProperty.fileResources[0].storageKey}`
                                            : "/lazy.png"}
                                        alt={selectedProperty.name}
                                        className="property-image w-full h-48 object-cover" />
                                    <h2>{selectedProperty.name}</h2>
                                    <strong>Price : ${selectedProperty.price}</strong>
                                </div>

                            </div>
                        </div>
                    </div>
                }

            </>
        </>
    )
}