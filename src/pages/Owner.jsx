import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { API_BASE_URL } from "../config";
import PropertyList from "../components/PropertyList";
import AddProperty from "../components/AddProperty";
import { apiRequest } from "../request";

export default function Owner() {
  const navigate = useNavigate();
  const [myProperties, setMyProperties] = useState([]);
  const [showAddForm, setShowAddForm] = useState(false);
  const toggleAddForm = () => {
    setShowAddForm((prev) => !prev);
  };
  const userDetails = JSON.parse(localStorage.getItem("user"));

  const getInitials = (name) => {
    if (!name) return "";
    const words = name.trim().split(" ");
    if (words.length === 1) {
      return words[0][0].toUpperCase();
    }
    return words[0][0].toUpperCase() + words[1][0].toUpperCase();
  };
  const fetchMyProperties = async () => {
    const data = await apiRequest(`${API_BASE_URL}/properties`, 'GET');
    setMyProperties(data);
  };
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
        <div className="flex gap-5 mb-16">
          <div className="w-full md:w-1/4">
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
                <li
                  onClick={fetchMyProperties}
                  className="cursor-pointer p-4 hover:bg-gray-200"
                >
                  <span>My Properties</span>
                </li>
                <li
                  onClick={handleLogout}
                  className="cursor-pointer p-4 hover:bg-gray-200"
                >
                  <span>Logout</span>
                </li>
              </ul>
            </div>
          </div>
          {userDetails?.enabled ? (
            <div className="w-full md:w-3/4">
              <PropertyList properties={myProperties} fetchMyProperties={fetchMyProperties}/>
            </div>
          ) : (
            <div className="text-center p-6 w-full">
              <h2 className="text-xl font-semibold text-red-500">Error</h2>
              <p className="text-gray-600">
                Your account has been deactivated. Please contact support.
              </p>
            </div>
          )}

          {userDetails?.enabled && (
            <button
              onClick={toggleAddForm}
              className="fixed bottom-28 right-8 bg-blue-500 text-white px-6 py-3 rounded-full shadow-lg"
            >
              + Add
            </button>
          )}
          {showAddForm && (
            <AddProperty
            fetchMyProperties = {fetchMyProperties}
              onClose={toggleAddForm}
            />
          )}
        </div>
    </>
  );
}
