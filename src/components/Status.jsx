import React from "react";

const Status = ({ status }) => {
  const statusStyles = {
    AVAILABLE: "bg-green-500",
    PENDING: "bg-yellow-500",
    CONTINGENT: "bg-orange-500",
    SOLD: "bg-red-500",
  };
  const handleText = (status) => {
    if (!status) return "Unavailable";
    return status.charAt(0).toUpperCase() + status.slice(1).toLowerCase();
  };

  return (
    <span
      className={`px-2 py-1 rounded-md text-white text-xs ${
        statusStyles[status] || "bg-gray-400"
      }`}
    >
      {handleText(status) || "Unavailable"}
    </span>
  );
};

export default Status;
