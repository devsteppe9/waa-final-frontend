import { useState } from "react";
import DataTable from "react-data-table-component";
import PropertyModal from "./PropertyModal";
import { FaEdit, FaTrashAlt } from "react-icons/fa";
import EditProperty from "./EditProperty";
import DeleteModal from "./DeleteModal";

export default function PropertyList({ properties }) {
  const [selectedProperty, setSelectedProperty] = useState(null);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [isViewOpen, setIsViewOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const openModal = (property) => {
    setSelectedProperty(property);
    setIsViewOpen(true);
  };

  const closeModal = () => {
    setIsViewOpen(false);
  };

  const handleEdit = (property) => {
    setSelectedProperty(property);
    setIsEditOpen(true);
  };

  const handleDelete = (propertyId) => {
    setIsDeleteOpen(true);
    console.log("Deleting property with ID:", propertyId);
  };

  const columns = [
    {
      name: "Image",
      selector: (row) => (
        <img
          src={row.image}
          alt={row.title}
          className="w-16 h-16 object-cover rounded-md my-2"
        />
      ),
      width: "80px",
    },
    {
      name: "Title",
      selector: (row) => row.title,
      sortable: true,
      width: "180px",
    },
    {
      name: "Location",
      selector: (row) => row.location,
      sortable: true,
    },
    {
      name: "Status",
      selector: (row) => row.status,
      sortable: true,
      cell: (row) => (
        <span
          className={`px-2 py-1 rounded-md text-white text-xs ${
            row.status === "Available" ? "bg-green-500" : "bg-red-500"
          }`}
        >
          {row.status || "Available"}
        </span>
      ),
    },
    {
      name: "Offers",
      selector: (row) => row.offerCount,
      sortable: true,
      cell: (row) => `${row.offerCount || 0} offers`,
    },
    {
      name: "Price",
      selector: (row) => `$${row.price}`,
      sortable: true,
    },
    {
      name: "Actions",
      cell: (row) => (
        <div className="flex gap-2">
          <button
            onClick={(e) => {
              e.stopPropagation();
              openModal(row);
            }}
            className="text-blue-600 hover:text-blue-700 text-lg"
            title="View Details"
          >
            <i className="fa-solid fa-eye"></i>
          </button>
          <button
            onClick={(e) => {
              e.stopPropagation();
              handleEdit(row);
            }}
            className="text-yellow-500 hover:text-yellow-600 text-lg"
            title="Edit"
          >
            <FaEdit />
          </button>
          <button
            onClick={(e) => {
              e.stopPropagation();
              handleDelete(row.id);
            }}
            className="text-red-500 hover:text-red-600 text-lg"
            title="Delete"
          >
            <FaTrashAlt />
          </button>
        </div>
      ),
      ignoreRowClick: true,
    },
  ];

  return (
    <div className="space-y-4 w-full rounded-xl">
      <DataTable
        columns={columns}
        data={properties}
        pagination
        highlightOnHover
        responsive
        striped
        onRowClicked={openModal}
      />

      {isViewOpen && !isEditOpen && (
        <PropertyModal property={selectedProperty} onClose={closeModal} />
      )}

      {isEditOpen && (
        <EditProperty
          property={selectedProperty}
          onEditProperty={() => {
            setIsEditOpen(false);
            setIsViewOpen(true);
          }}
          onClose={() => {
            setIsEditOpen(false);
            setIsViewOpen(false);
          }}
        />
      )}
      {isDeleteOpen && (
        <DeleteModal
          isOpen={isDeleteOpen}
          onClose={() => setIsDeleteOpen(false)}
          onConfirmDelete={handleDelete}
          property={selectedProperty}
        />
      )}
    </div>
  );
}
