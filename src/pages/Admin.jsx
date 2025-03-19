import { useState, useEffect } from "react";
import DataTable from "react-data-table-component";
import { useNavigate } from "react-router-dom";
import { API_BASE_URL } from "../config";

export default function Admin() {
    const navigate = useNavigate();
    const [data, setData] = useState([]);
    const [properties, setProperties] = useState([]);
    const [filteredData, setFilteredData] = useState([]);
    const [search, setSearch] = useState("");

    const userDetails = JSON.parse(localStorage.getItem('user'));

    const getInitials = (name) => {
        if (!name) return "";
        const words = name.trim().split(" ");
        if (words.length === 1) {
            return words[0][0].toUpperCase();
        }
        return words[0][0].toUpperCase() + words[1][0].toUpperCase();
    };
    const fetchUsers = async () => {
        fetch(`${API_BASE_URL}/users`)
            .then((response) => response.json())
            .then((data) => {
                setData(data);
                setFilteredData(data);
                setProperties([]);
            })
            .catch((error) => console.error("Error fetching data:", error));
    }
    useEffect(() => {
        fetchUsers();
    }, []);

    const fetchProperties = async () => {
        fetch(`${API_BASE_URL}/properties`)
            .then((response) => response.json())
            .then((data) => {
                const firstNProperties = data.slice(0, 10);
                setProperties(firstNProperties);
                setFilteredData([]);
            })
            .catch((error) => console.error("Error fetching data:", error));

    }

    // Handle Search
    useEffect(() => {
        const result = data.filter((row) =>
            (row.firstName?.toLowerCase() || "").includes(search.toLowerCase()) ||
            (row.email?.toLowerCase() || "").includes(search.toLowerCase()) ||
            (row.username?.toLowerCase() || "").includes(search.toLowerCase())
        );
        const sortedData = [...result].sort((a, b) => b.id - a.id);

        setFilteredData(sortedData);
    }, [search, data]);

    // Toggle Activation Status
    const toggleStatus = async (id, new_status) => {
        const requestOptions = {
            method: "PATCH",
            redirect: "follow"
        };

        fetch(`${API_BASE_URL}/users/${id}/status?enabled=${new_status}`, requestOptions);

        setData(prevData =>
            prevData.map(user =>
                user.id === id
                    ? { ...user, enabled: !user.enabled }
                    : user
            )
        );
    };

    const columns = [
        {
            name: "ID",
            selector: (row) => row.id,
            sortable: true,
            width: "80px",
        },
        {
            name: "Name",
            selector: (row) => row.firstName + ' ' + row.lastName,
            sortable: true,
        },
        {
            name: "Email",
            selector: (row) => row.email,
            sortable: true,
        },
        {
            name: "Username",
            selector: (row) => row.username,
            sortable: true,
        },
        {
            name: "Role",
            selector: (row) => row.role,
            sortable: true,
        },
        {
            name: "Actions",
            cell: (row) => (
                <button
                    className={`px-3 py-1 rounded-md text-white text-xs transition ${row.enabled === true ? "bg-red-500 hover:bg-red-600" : "bg-green-500 hover:bg-green-600"
                        }`}
                    onClick={() => toggleStatus(row.id, !row.enabled)}
                >
                    {row.enabled === true ? "Deactivate" : "Activate"}
                </button>
            ),
            ignoreRowClick: true
        },
    ];

    const handleLogout = () => {
        localStorage.removeItem("access_token");
        localStorage.removeItem("refresh_token");
        localStorage.removeItem("user");
        navigate("/");
    };

    return (
        <>
            <div className="flex gap-5">
                <div className="w-full md:w-1/4 mb-9">
                    <div className="sticky top-20">
                        <div className="p-4 pb-0">
                            <div className="flex align-center justify-start pb-4">
                                <div className="mr-4 flex items-center justify-center w-16 h-16 rounded-full bg-blue-500 text-white text-xl font-bold">
                                    {getInitials(userDetails.firstName + ' ' + userDetails.lastName)}
                                </div>
                                <div className="">
                                    <div className="text-xl">{userDetails.firstName + ' ' + userDetails.lastName}</div>
                                    <small>{userDetails.email}</small>
                                </div>
                            </div>
                        </div>
                        <ul className="p-0 border-t border-gray-400">
                            <li onClick={fetchUsers} className="cursor-pointer p-4 hover:bg-gray-200">
                                <span>Users</span>
                            </li>
                            <li onClick={fetchProperties} className="cursor-pointer p-4 hover:bg-gray-200">
                                <span>Recent Properties</span>
                            </li>
                            <li onClick={handleLogout} className="cursor-pointer p-4 hover:bg-gray-200">
                                <span>Logout</span>
                            </li>
                        </ul>
                    </div>


                </div>

                {filteredData.length > 0 &&
                    <div className="w-full md:w-3/4">
                        <h2 className="text-xl text-center font-semibold mb-4">Users</h2>
                        <input
                            type="text"
                            placeholder="Search..."
                            className="mb-4 p-2 border border-gray-300 rounded-lg w-full"
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                        />

                        <DataTable
                            columns={columns}
                            data={filteredData}
                            pagination
                            highlightOnHover
                            responsive
                            striped
                            defaultSortFieldId="id"
                            defaultSortAsc={false}
                        />
                    </div>
                }
                {properties.length > 0 &&
                    <div className="w-full md:w-3/4">
                        <h2 className="text-xl text-center font-semibold mb-4">Properties</h2>
                        <ul>
                            {properties.map((property) => (
                                <li className="bg-white p-3 flex">
                                    <img width="200" src="https://static8.depositphotos.com/1007959/943/i/450/depositphotos_9433517-stock-photo-house-for-sale-real-estate.jpg" />
                                    <div className="flex-1 ml-3">
                                        <strong className="mb-6">{property.name}</strong>
                                        <p>{property.description}</p>
                                    </div>
                                </li>
                            ))}
                        </ul>
                    </div>

                }
            </div>

        </>
    );
}
