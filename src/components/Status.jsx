import React from "react";

const Status = ({ status }) => {
  const statusStyles = {
    AVAILABLE: "text-green-600",
    PENDING: "text-yellow-600",
    CONTINGENT: "text-gray-600",
    SOLD: "text-red-600",
    DEFAULT: "text-gray-600"
  };
  const handleText = (status) => {
    if (!status) return "Unavailable";
    return status?.charAt(0)?.toUpperCase() + status?.slice(1)?.toLowerCase();
  };

  return (
    <span
      className={`px-2 py-1 rounded-md text-white text-xs ${
        statusStyles[status] || statusStyles.DEFAULT
      }`}
    >
      {handleText(status) || "Unavailable"}
    </span>
  );
};

export default Status;
