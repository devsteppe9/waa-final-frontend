import React from "react";

const Status = ({ status }) => {
  const statusStyles = {
    AVAILABLE: "text-green-600",
    PENDING: "text-yellow-600",
    CONTINGENT: "text-gray-600",
    SOLD: "text-red-600",
    DEFAULT: "text-gray-600"
  };

  return (
    <span className={`text-sm font-semibold ${statusStyles[status] || "text-gray-600"}`}>
      {status}
    </span>
  );
};

export default Status;

