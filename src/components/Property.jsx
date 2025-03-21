import { API_BASE_URL } from "../config"
import { useState } from "react";

export default function Property({ property, setSelectedProperty, changeFavorite }) {
    const [isFavorite, setIsFavorite] = useState(property.favourites && property.favourites.length > 0 ? 1 : 0);

    const toggleFavorite = async (favorite_id) => {
        const newValue = !isFavorite;
        setIsFavorite((prev) => !prev);
        changeFavorite(property.id, newValue, favorite_id);
    };

    return (
        <>
            <div className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300">
                <div className="relative">

                    <img
                        src={property.fileResources?.length > 0
                            ? `${API_BASE_URL}/file-resources/${property.fileResources[0].storageKey}`
                            : "/https://sportsguff.com/assets/images/lazy.png"}
                        alt={property.name}
                        className="property-image w-full h-48 object-cover" />
                    {localStorage.getItem('user') &&

                        <button
                            onClick={() => toggleFavorite(property.favourites?.[0]?.id)} // This will pass undefined if favourites[0] is not available
                            title="Save"
                            className="absolute top-3 right-3 bg-white p-1.5 rounded-full shadow hover:bg-gray-100"
                        >
                            <i className={`fa-${isFavorite === 0 ? 'regular' : 'solid'} fa-heart text-red-600`}></i>
                        </button>


                    }
                </div>
                <div className="p-4">
                    <div className="flex justify-between mb-1">
                        <span className="text-blue-600 font-bold text-xl">${property.price ? property.price : ' N/A'}</span>
                    </div>
                    <h3 className="font-semibold text-lg mb-1">{property.name}</h3>
                    <div className="flex items-center text-gray-500 text-sm mb-3">
                        <i className="fa-solid fa-location-dot mr-1"></i>
                        <span>{property.address ? property.address : 'N/A'}</span>
                    </div>
                    <div className="flex justify-between mb-4 text-sm">
                        <div className="flex items-center">
                            <i className="fa-solid fa-bed mr-1 text-gray-500"></i>
                            <span>{property.totalBedrooms ? property.totalBedrooms : 'N/A'} beds</span>
                        </div>
                        <div className="flex items-center">
                            <i className="fa-solid fa-bath mr-1 text-gray-500"></i>
                            <span>{property.totalBathrooms ? property.totalBathrooms : 'N/A'} baths</span>
                        </div>
                        <div className="flex items-center">
                            <i className="fa-solid fa-ruler-combined mr-1 text-gray-500"></i>
                            <span>{property.totalArea ? property.totalArea : 'N/A'} sq ft</span>
                        </div>
                    </div>
                    <div className="border-t pt-3 flex justify-between items-center">
                        <div className="flex items-center">
                            <span className="text-sm font-medium">{property.owner?.username ? property.owner?.username : 'N/A'}</span>
                        </div>
                        {localStorage.getItem('user') &&
                            <button onClick={() => setSelectedProperty(property)} className="text-blue-600 hover:text-blue-700 text-sm font-medium"> Send Offer</button>
                        }
                    </div>
                </div>
            </div>
        </>
    )
}