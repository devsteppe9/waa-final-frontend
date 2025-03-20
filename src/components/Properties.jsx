import Property from './Property'
import { API_BASE_URL } from '../config';
import { apiRequest } from '../request';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';


export default function Properties() {
    const navigate = useNavigate();
    const [properties, setProperties] = useState([]);

    const fetchProperties = async () => {
        const data = await apiRequest(`${API_BASE_URL}/properties`);
        setProperties(data);

    }
    useEffect(() => {
        if (localStorage.getItem('user')) {
            navigate('/' + JSON.parse(localStorage.getItem('user')).role.toLowerCase());
        }
        fetchProperties();
    }, []);
    return (
        <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
                {properties.map((property) => (
                    <Property property={property} key={property.id} />
                ))}
            </div>
        </>
    )
}