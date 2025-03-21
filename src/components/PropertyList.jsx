import { useState } from "react";
import DataTable from "react-data-table-component";
import PropertyModal from "./PropertyModal";
import { FaEdit, FaTrashAlt } from "react-icons/fa";
import EditProperty from "./EditProperty";
import DeleteModal from "./DeleteModal";
import { API_BASE_URL } from "../config";
import defaultImg from "../assets/default.png";
import axios from "axios";
import Status from "./Status";

export default function PropertyList({ properties, fetchMyProperties }) {
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

  const columns = [
    {
      name: "Image",
      selector: (row) => (
        <img
          src={row.fileResources?.length > 0 ? `${API_BASE_URL}/file-resources/${row.fileResources[0].storageKey}` : defaultImg}
          alt={row.name}
          className="w-16 h-16 object-cover rounded-md my-2"
        />
      ),
      width: "80px",
    },
    {
      name: "Property name",
      selector: (row) => row.name,
      sortable: true,
    },
    {
      name: "Address",
      selector: (row) => row.address,
      sortable: true,
    },
    {
      name: "Status",
      selector: (row) => row.status,
      sortable: true,
      cell: (row) => (
        <Status status={row.status} />
      ),
    },
    {
      name: "Offers",
      selector: (row) => row?.offers?.length,
      sortable: true,
      cell: (row) => `${row?.offers?.length || 0} offers`,
    },
    {
      name: "Price",
      selector: (row) => `$${row.price || 0}`,
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
              setIsDeleteOpen(true);
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
        <PropertyModal propertyId={selectedProperty.id} fetchMyProperties={fetchMyProperties} onClose={closeModal} />
      )}

      {isEditOpen && (
        <EditProperty
          property={selectedProperty}
          fetchMyProperties = {fetchMyProperties}
          onClose={() => {
            setIsEditOpen(false);
            setIsViewOpen(false);
          }}
        />
      )}
      {isDeleteOpen && (
        <DeleteModal
          onClose={() => setIsDeleteOpen(false)}
          property={selectedProperty}
          fetchMyProperties = {fetchMyProperties}
        />
      )}
    </div>
  );
}
