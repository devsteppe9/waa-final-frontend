import { useState, useEffect } from "react";
import DataTable from "react-data-table-component";
import { useNavigate } from "react-router-dom";
import { API_BASE_URL } from "../config";
import { apiRequest } from '../request'

export default function Admin() {
    const navigate = useNavigate();
    const [currentTab, setCurrentTab] = useState("users");
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
        const data = await apiRequest(`${API_BASE_URL}/users`);
        setData(data);
        setFilteredData(data);
        setCurrentTab('users');

    }
    useEffect(() => {
        fetchUsers();
    }, []);

    const fetchProperties = async () => {
        const data = await apiRequest(`${API_BASE_URL}/properties`);
        const firstNProperties = data.slice(0, 10);
        setProperties(firstNProperties);
        setCurrentTab('properties');

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

        apiRequest(`${API_BASE_URL}/users/${id}/status?enabled=${new_status}`, 'PATCH');

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
            name: "Status",
            selector: (row) => row.enabled === true ? "Active" : "Inactive",
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

    const handleLogout = async () => {
        try {
            await apiRequest(`${API_BASE_URL}/auth/logout`, "POST", null, {}, {},false);
        } catch (error) {
            console.error("Error logging out:", error);
        } finally {
            localStorage.removeItem("role");
            localStorage.removeItem("user");
            localStorage.removeItem("access_token");
            localStorage.removeItem("refresh_token");
            navigate("/");
        }
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

                {currentTab === 'users' &&
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
                {currentTab === 'properties' &&
                    <div className="w-full md:w-3/4">
                        <h2 className="text-xl text-center font-semibold mb-4">Properties</h2>
                        <ul>
                            {properties.map((property) => (
                                <li className="bg-white p-3 flex mb-4">
                                    <img
                                        width="200"
                                        className="border border-solid border-gray-300"
                                        src={property.fileResources?.length > 0
                                            ? `${API_BASE_URL}/file-resources/${property.fileResources[0].storageKey}`
                                            : "/https://sportsguff.com/assets/images/lazy.png"}
                                        alt="Property Image"
                                    />

                                    <div className="flex-1 ml-3">
                                        <strong className="mb-6">{property.name}</strong>
                                        <div className="mt-2">${property.price}</div>
                                        <p className="mt-4">{property.description}</p>
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
