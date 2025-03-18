import { useState, useEffect } from "react";
import DataTable from "react-data-table-component";
import { useNavigate } from "react-router-dom";
import { API_BASE_URL } from "../config";

export default function Admin() {
    const navigate = useNavigate();
    const [data, setData] = useState([]);
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
    const fetchOwners = async () => {
        fetch(`${API_BASE_URL}owners.php`)
            .then((response) => response.json())
            .then((data) => {
                // Add a `status` field to mock active/inactive users
                const updatedData = data.map(user => ({
                    ...user,
                    status: Math.random() > 0.5 ? "Active" : "Inactive" // Randomly assign status
                }));
                setData(updatedData);
                setFilteredData(updatedData);
            })
            .catch((error) => console.error("Error fetching data:", error));
    }
    useEffect(() => {
        fetchOwners();
    }, []);

    // Handle Search
    useEffect(() => {
        const result = data.filter((row) =>
            row.name.toLowerCase().includes(search.toLowerCase()) ||
            row.email.toLowerCase().includes(search.toLowerCase()) ||
            row.phone.toLowerCase().includes(search.toLowerCase())
        );
        setFilteredData(result);
    }, [search, data]);

    // Toggle Activation Status
    const toggleStatus = (id) => {
        setData(prevData =>
            prevData.map(user =>
                user.id === id
                    ? { ...user, status: user.status === "Active" ? "Inactive" : "Active" }
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
            selector: (row) => row.name,
            sortable: true,
        },
        {
            name: "Email",
            selector: (row) => row.email,
            sortable: true,
        },
        {
            name: "Phone",
            selector: (row) => row.phone,
            sortable: true,
        },
        {
            name: "Actions",
            cell: (row) => (
                <button
                    className={`px-3 py-1 rounded-md text-white text-xs transition ${row.status === "Active" ? "bg-red-500 hover:bg-red-600" : "bg-green-500 hover:bg-green-600"
                        }`}
                    onClick={() => toggleStatus(row.id)}
                >
                    {row.status === "Active" ? "Deactivate" : "Activate"}
                </button>
            ),
            ignoreRowClick: true
        },
    ];

    const handleLogout = () => {
        localStorage.removeItem("role");
        localStorage.removeItem("user");
        navigate("/");
    };


    return (
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
                            <li onClick={fetchOwners} className="cursor-pointer p-4 hover:bg-gray-200">
                                <span>Owners</span>
                            </li>
                            <li onClick={handleLogout} className="cursor-pointer p-4 hover:bg-gray-200">
                                <span>Logout</span>
                            </li>
                        </ul>
                    </div>


                </div>
                <div className="w-full md:w-3/4">
                    <h2 className="text-xl text-center font-semibold mb-4">Owners</h2>
                    <input
                        type="text"
                        placeholder="Search..."
                        className="mb-4 p-2 border border-gray-300 rounded-lg w-full"
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                    />

                    <DataTable
                        columns={columns}
                        data={filteredData} // Use filtered data for searching
                        pagination
                        highlightOnHover
                        responsive
                        striped
                    />
                </div>
            </div>
        </>
    );
}
