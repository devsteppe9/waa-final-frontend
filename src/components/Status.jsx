import React from "react";

const Status = ({ status }) => {
  const statusStyles = {
    AVAILABLE: "bg-green-100 text-green-800",
    PENDING: "bg-yellow-100 text-yellow-800",
    CONTINGENT: "bg-orange-100 text-orange-800",
    SOLD: "bg-red-100 text-red-800",
    DEFAULT: "bg-grey-100 text-grey-800"
  };

  return (
    <span
      className={`px-2 py-1 rounded-md text-white text-xs ${
        statusStyles[status] || "bg-grey-400"
      }`}
    >
      {status || "Unavailable"}
    </span>
  );
};

export default Status;
