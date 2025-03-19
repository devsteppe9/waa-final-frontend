import React from "react";

const Status = ({ status }) => {
  const statusStyles = {
    Available: "text-green-600",
    Pending: "text-yellow-600",
    Contingent: "text-gray-600",
  };

  return (
    <span className={`text-sm font-semibold ${statusStyles[status] || "text-gray-600"}`}>
      {status}
    </span>
  );
};

export default Status;

