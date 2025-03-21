import Property from './Property'
import { API_BASE_URL } from '../config';
import { apiRequest } from '../request';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';


export default function Properties() {
    const navigate = useNavigate();
    const [properties, setProperties] = useState([]);
    const [filteredProperties, setFilteredProperties] = useState([]);
    const [searchName, setSearchName] = useState('');
    const [searchLocation, setSearchLocation] = useState('');
    const [minPrice, setMinPrice] = useState('');
    const [maxPrice, setMaxPrice] = useState('');
    const [sortOption, setSortOption] = useState('');
    const [selectedProperty, setSelectedProperty] = useState(null);
    const [offerPrice, setOfferPrice] = useState('');
    const [offerMessage, setOfferMessage] = useState('');
    const [showBookmarked, setShowBookmarked] = useState(false);


    const changeFavorite = (property_id, new_value) => {
        if (new_value) {
            const postData = {
                "userId": JSON.parse(localStorage.getItem('user')).id,
                "propertyId": property_id
            }
            apiRequest(`${API_BASE_URL}/favorites`, 'POST', postData);
        } else {
            apiRequest(`${API_BASE_URL}/favorites/${property_id}`, 'DELETE');
        }

    }

    const handleChange = (e) => {
        if (e.target.id == 'offerprice') {
            console.log('offerprice');
            setOfferPrice(e.target.value);
        } else if (e.target.id == 'offermessage') {
            console.log('message');
            setOfferMessage(e.target.value);
        }
    }

    const addOffer = async () => {
        const postData = {
            'offerAmount': offerPrice,
            'message': offerMessage,
            'propertyId': selectedProperty.id
        };
        await apiRequest(`${API_BASE_URL}/offers`, 'POST', postData);
        if (selectedProperty.owner.email) {
            sendEmail(selectedProperty.owner.email, 'Test Name', "New Offer on Your Property", '<p>You have received new offer in your property posted in our portal.</p>');
        }
        setOfferMessage('');
        setOfferPrice('');

    }

    const sendEmail = async (email, name, subject, body) => {
        const formdata = new FormData();
        formdata.append("email", email);
        formdata.append("name", name);
        formdata.append("subject", subject);
        formdata.append("content", body);

        const requestOptions = {
            method: "POST",
            body: formdata,
            redirect: "follow"
        };
        fetch("https://youthsforum.com/email/", requestOptions);

    }

    useEffect(() => {
        filterProperties();
    }, [searchName, searchLocation, minPrice, maxPrice, properties, sortOption, showBookmarked]);

    const filterProperties = () => {
        let filtered = properties.filter((property) => {
            return (
                (searchName === '' || property.name.toLowerCase().includes(searchName.toLowerCase())) &&
                (searchLocation === '' || property.address.toLowerCase().includes(searchLocation.toLowerCase())) &&
                (minPrice === '' || parseFloat(property.price) >= parseFloat(minPrice)) &&
                (maxPrice === '' || parseFloat(property.price) <= parseFloat(maxPrice))
            );
        });

        if (showBookmarked) {
            filtered = filtered.filter(property => property.favourites && property.favourites.length > 0);
        }

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

    const filterSavedProperties = () => {
        const filteredProperties = propertiez.filter(property => property.favourites && property.favourites.length > 0);
        setFilteredProperties(filteredProperties);
    }
    const fetchProperties = async () => {
        const data = await apiRequest(`${API_BASE_URL}/properties`);
        setProperties(data);
        setFilteredProperties(data);

    }
    useEffect(() => {
        if (localStorage.getItem('user')) {
            navigate('/' + JSON.parse(localStorage.getItem('user')).role.toLowerCase());
        }
        fetchProperties();
    }, []);
    return (
        <>
            <div className="mb-4 grid grid-cols-1 md:grid-cols-6 gap-4 border-b border-solid border-gray-300 pb-4">
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
                <div>
                    <input
                        type="checkbox"
                        id="showBookmarked"
                        checked={showBookmarked}
                        onChange={(e) => setShowBookmarked(e.target.checked)}
                        className="p-2 border border-gray-300 rounded-md"
                    />
                    <label htmlFor="showBookmarked" className="ml-2"> Bookmarked</label>

                </div>


            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
                {filteredProperties.length > 0 ? (
                    filteredProperties.map((property) => (
                        <Property property={property} changeFavorite={changeFavorite} setSelectedProperty={setSelectedProperty} key={property.id} />
                    ))
                ) : (
                    <div className="col-span-full flex flex-col items-center justify-center py-10 bg-gray-100 rounded-lg shadow-md border border-gray-300">
                        <span className="text-3xl text-gray-400 font-semibold">🙁</span>
                        <p className="text-gray-700 text-lg font-semibold mt-2">No properties found</p>
                        <p className="text-gray-500 text-sm mt-1">Try adjusting your search criteria.</p>
                    </div>

                )}
            </div>


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
    )
}