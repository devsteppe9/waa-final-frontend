import Offer from '../components/Offer'
import Property from '../components/Property'
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { API_BASE_URL } from '../config';


export default function Owner() {
    const navigate = useNavigate();
    const [myProperties, setMyProperties] = useState([]);

    const userDetails = JSON.parse(localStorage.getItem('user'));


    const getInitials = (name) => {
        if (!name) return "";
        const words = name.trim().split(" ");
        if (words.length === 1) {
            return words[0][0].toUpperCase();
        }
        return words[0][0].toUpperCase() + words[1][0].toUpperCase();
    };

    const fetchMyProperties = async () => {
        fetch(`${API_BASE_URL}properties.php`)
            .then((response) => response.json())
            .then((data) => {
                setMyProperties(data.data);
            })
            .catch((error) => console.error("Error fetching data:", error));
    }
    useEffect(() => {
        fetchMyProperties();
    }, []);

    const handleLogout = () => {
        localStorage.removeItem("role");
        localStorage.removeItem("user");
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
                                        {getInitials(userDetails.name)}
                                    </div>
                                    <div className="">
                                        <div className="text-xl">{userDetails.name}</div>
                                        <small>{userDetails.email}</small>
                                    </div>
                                </div>
                            </div>
                            <ul className="p-0 border-t border-gray-400">
                                <li onClick={fetchMyProperties} className="cursor-pointer p-4 hover:bg-gray-200">
                                    <span>My Properties</span>
                                </li>
                                <li onClick={handleLogout} className="cursor-pointer p-4 hover:bg-gray-200">
                                    <span>Logout</span>
                                </li>
                            </ul>
                        </div>


                    </div>
                    <div className="w-full md:w-3/4">
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-10">
                            {myProperties &&
                                myProperties.map((property) => (
                                    <Property property={property} key={`property-${property.id}`} />
                                )
                                )}
                        </div>
                    </div>
                </div >

            </>
        </>
    )
}