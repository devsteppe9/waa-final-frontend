import { useEffect, useState } from "react";
import DataTable from "react-data-table-component";
import PropertyModal from "./PropertyModal";
import { FaEdit, FaTrashAlt } from "react-icons/fa";
import EditProperty from "./EditProperty";
import DeleteModal from "./DeleteModal";
import { API_BASE_URL } from "../config";
import defaultImg from "../assets/default.png";
import Status from "./Status";

export default function PropertyList({ properties, fetchMyProperties }) {
  const [selectedProperty, setSelectedProperty] = useState(null);
  const [search, setSearch] = useState("");
  const [filteredProperties, setFilteredProperties] = useState([]);  
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
  useEffect(() => {
    if (!properties || !Array.isArray(properties)) {
      setFilteredProperties([]);
      return;
    }

    const filtered = properties.filter((property) =>
      property && [
        property.name,
        property.address,
        property.status,
        property.price?.toString()
      ].some(field => field?.toLowerCase().includes(search.toLowerCase()))
    );

    setFilteredProperties(filtered);
  }, [search, properties]); 
  const renderActions = (row) => {
    switch (row.status) {
      case "AVAILABLE":
        return (
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
            {row?.offers?.length === 0 && (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setSelectedProperty(row);
                  setIsDeleteOpen(true);
                }}
                className="text-red-500 hover:text-red-600 text-lg"
                title="Delete"
              >
                <FaTrashAlt />
              </button>
            )}
            
          </div>
        );

      case "PENDING":
        return (
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
            {/* <button
              onClick={(e) => {
                e.stopPropagation();
                setSelectedProperty(row);
                handleContingent();
              }}
              className="text-green-500 hover:text-green-600 text-lg"
              title="Add Contingent"
            >
              <i className="fa-solid fa-file-signature"></i>
            </button> */}
          </div>
        );

      case "CONTINGENT":
        return (
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
            {/* <button
              onClick={(e) => {
                e.stopPropagation();
                setSelectedProperty(row);
                handleMarkAsSold();
              }}
              className="text-green-500 hover:text-green-600 text-lg"
              title="Mark as Sold"
            >
              <i className="fa-solid fa-check-circle"></i> */}
            {/* </button> */}
          </div>
        );

      case "SOLD":
        return (
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
        );

      default:
        return null;
    }
  };
  const columns = [
    {
      name: "Image",
      selector: (row) => (
        <img
          src={
            row.fileResources?.length > 0
              ? `${API_BASE_URL}/file-resources/${row?.fileResources[0]?.storageKey}`
              : defaultImg
          }
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
      name: "Price",
      selector: (row) => `$${row.price || 0}`,
      sortable: true,
    },
    {
      name: "Created",
      selector: (row) => {
        const date = new Date(row?.created);
        const options = {
          year: "numeric",
          month: "short",
          day: "numeric"
        }
        return date.toLocaleDateString("en-US", options);
      },
      sortable: true,
      width: "120px",
    },
    {
      name: "Offers",
      selector: (row) => row?.offers?.length,
      sortable: true,
      cell: (row) => `${row?.offers?.length || 0} offers`,
    },
    {
      name: "Status",
      selector: (row) => row.status,
      sortable: true,
      cell: (row) => <Status status={row.status} />,
    },
    
    
    {
      name: "Actions",
      cell: renderActions,
      ignoreRowClick: true,
    },
  ];
  
  return (
    <div className="space-y-4 w-full rounded-xl">
      <input
        type="text"
        placeholder="Search..."
        className="mb-4 p-2 border border-gray-300 rounded-lg w-full"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />
      <DataTable
        columns={columns}
        data={filteredProperties}
        pagination
        highlightOnHover
        responsive
        striped
        onRowClicked={openModal}
      />

      {isViewOpen && (
        <PropertyModal propertyId={selectedProperty.id} onClose={closeModal} fetchMyProperties={fetchMyProperties}/>
      )}

      {isEditOpen && (
        <EditProperty
          property={selectedProperty}
          fetchMyProperties={fetchMyProperties}
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
          fetchMyProperties={fetchMyProperties}
        />
      )}
    </div>
  );
}
