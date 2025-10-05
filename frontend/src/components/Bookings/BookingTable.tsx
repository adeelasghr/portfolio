import React, { useState, useEffect, useRef } from "react";
import {
  Search,
  SlidersHorizontal,
  ChevronDown,
  ChevronUp,
  Eye,
  Trash2,
  FileText,
  FileSpreadsheet,
  Download,
  File,
  Cross,
  X,
} from "lucide-react";

import { generatePDF } from "../../utils/exportPDF";
import { exportToExcel } from "../../utils/exportExcel";
import { BookingsBrief } from "../../interfaces/Booking";
import { useNavigate } from "react-router-dom";
import { getBookingsBrief } from "../../api/bookingApi";
import loader from '../../assets/images/loader.gif'
import { AnimatePresence } from "framer-motion";
import { formatBookingDates } from "../../utils/dateFormatter";
import BookingCancelPopup from "../Popups/BookingCancelPopup";

const BookingTable: React.FC = () => {
  // State variables
  const [activePopup, setActivePopup] = useState<{
    type: string | null;
    custId: number | null;
  }>({ type: null, custId: null });
  const [bookings, setBookings] = useState<BookingsBrief[]>([]);
  const [selectedBookingId, setSelectedBookingId] = useState<number>(0);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  //Fetching Bookings
  useEffect(() => {
    const loadBookings = async () => {
      try {
        const data = await getBookingsBrief();
        setBookings(data as BookingsBrief[]);
        console.log(data);
      } catch (error) {
        console.error("Failed to fetch booking:", error);
      } finally {
        setLoading(false);
      }
    };

    loadBookings();
  }, []);

  //Handling Clicks for Popups
      useEffect(() => {
      const handleClickOutside = (event: MouseEvent) => {
        if (
          filterRef.current &&
          !filterRef.current.contains(event.target as Node)
        ) {
          setIsFilterOpen(false);
        }
      };
  
      document.addEventListener("mousedown", handleClickOutside);
      return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

  //State Variables
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<string[]>([]);
  const [sortConfig, setSortConfig] = useState<{
    key: keyof BookingsBrief;
    direction: "asc" | "desc";
  } | null>(null);
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [showExportMenu, setShowExportMenu] = useState(false);
  const filterRef = useRef<HTMLDivElement>(null);

  // Filtering Data
  const filteredBookings = bookings
    .filter((booking) => {
      const matchesSearch =
        booking.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
        booking.vehicle.toLowerCase().includes(searchTerm.toLowerCase()) ||
        booking.customer.includes(searchTerm);

      const matchesStatus =
        statusFilter.length === 0 || statusFilter.includes(booking.status);

      return matchesSearch && matchesStatus;
    })
    .sort((a, b) => {
      if (!sortConfig) return 0;

      const { key, direction } = sortConfig;
      if (a[key] < b[key]) return direction === "asc" ? -1 : 1;
      if (a[key] > b[key]) return direction === "asc" ? 1 : -1;
      return 0;
    });

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        filterRef.current &&
        !filterRef.current.contains(event.target as Node)
      ) {
        setIsFilterOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSort = (key: keyof BookingsBrief) => {
    let direction: "asc" | "desc" = "asc";
    if (
      sortConfig &&
      sortConfig.key === key &&
      sortConfig.direction === "asc"
    ) {
      direction = "desc";
    }
    setSortConfig({ key, direction });
  };

  const toggleStatusFilter = (status: string) => {
    setStatusFilter((prev) =>
      prev.includes(status)
        ? prev.filter((s) => s !== status)
        : [...prev, status]
    );
  };

  const clearFilters = () => {
    setSearchTerm("");
    setStatusFilter([]);
    setSortConfig(null);
  };

  const handleDelete = (bookingId: string) => {
      setSelectedBookingId(Number(bookingId));
    setActivePopup({ type: 'delete', custId: Number(bookingId) })
    console.log("Delete Booking:", bookingId);
  };

  const handleCreateContract = () => {
    navigate('/contracts/add/');
  };

    //Setting Up Loading
  if (loading) return(
    
     <div className="card rounded-lg shadow-md overflow-hidden">
            <p className="flex items-center justify-center h-full">
              <img className="mx-auto w-[20%]" src={loader}/>
            </p>
      </div>
  ) 

  return (
    <>
    <div className="card bg-white rounded-lg shadow-md overflow-hidden">
      {/* Header */}
      <div className="p-4 border-b border-gray-200">
        <div className="flex justify-between items-center">
          {/* Search */}
          <div className="relative">
            <Search
              className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
              size={20}
            />
            <input
              type="text"
              placeholder="Search bookings..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full sm:w-64 pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          {/* Filter and Export Button */}
          <div className="relative" ref={filterRef}>
            {/* Export Button */}
            <button
              className="px-4 py-1 border rounded-lg flex items-center gap-2 transition-colors btn-utils
                                border-gray-200 text-gray-700 hover:bg-gray-50"
              onClick={() => setShowExportMenu(!showExportMenu)}
            >
              <Download size={20} />
              Export
            </button>

            {/* Export Dropdown */}
            {showExportMenu && (
              <div
                style={{ marginTop: "40px" }}
                className="absolute right-0 mt-2 w-64 bg-white rounded-lg shadow-lg border border-gray-200 z-50
                              transition-all duration-200 ease-in-out origin-top-right"
              >
                <button
                  className="w-full px-4 py-2 text-left hover:bg-gray-50 flex items-center gap-2"
                  style={{ fontSize: "15px" }}
                  onClick={() => {
                    generatePDF(filteredBookings);
                    setShowExportMenu(false);
                  }}
                >
                  <File size={20} />
                  Export as PDF
                </button>
                <button
                  className="w-full px-4 py-2 text-left hover:bg-gray-50 flex items-center gap-2"
                  style={{ fontSize: "15px" }}
                  onClick={() => {
                    exportToExcel(filteredBookings);
                    setShowExportMenu(false);
                  }}
                >
                  <FileSpreadsheet size={20} />
                  Export as Excel
                </button>
              </div>
            )}

            {/* Filter Button */}
            <button
              onClick={() => setIsFilterOpen(!isFilterOpen)}
              style={{ marginRight: "5px" }}
              className={`px-4 py-1 border rounded-lg flex items-center gap-2 transition-colors btn-utils 
                  ${
                    statusFilter.length > 0
                      ? "bg-blue-50 text-blue-600 border-blue-200"
                      : "border-gray-200 text-gray-700 hover:bg-gray-50"
                  }`}
            >
              <SlidersHorizontal size={18} />
              <span>Filter</span>
              {statusFilter.length > 0 && (
                <span className="bg-blue-100 text-blue-600 text-xs font-medium px-2 py-0.5 rounded-full">
                  {statusFilter.length}
                </span>
              )}
            </button>

            {/* Filter Dropdown */}
            <div
              style={{ marginTop: "40px" }}
              className={`
                          absolute right-0 mt-2 w-64 bg-white rounded-lg shadow-lg border border-gray-200 z-50
                          transition-all duration-200 ease-in-out origin-top-right
                          ${
                            isFilterOpen
                              ? "opacity-100 scale-100 translate-y-0"
                              : "opacity-0 scale-95 -translate-y-2 pointer-events-none"
                          }
                        `}
            >
              <div className="p-4">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-semibold text-gray-700">
                    Filter by Status
                  </h3>
                  {statusFilter.length > 0 && (
                    <button
                      onClick={clearFilters}
                      className="text-sm text-gray-500 hover:text-gray-700"
                    >
                      Clear all
                    </button>
                  )}
                </div>
                {["Paid", "Pending", "Cancelled", "Completed"].map((status) => (
                  <label
                    key={status}
                    className="flex items-center gap-2 py-2 cursor-pointer"
                  >
                    <input
                      type="checkbox"
                      checked={statusFilter.includes(status)}
                      onChange={() => toggleStatusFilter(status)}
                      className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                    />
                    <span className="text-gray-700">{status}</span>
                  </label>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-50">
            <tr>
              {[
                "Code",
                "From",
                "to",
                "Vehicle",
                "Name",
                "Status",
                "Source",
                "Actions",
              ].map((header, index) => {
                const key = header
                  .toLowerCase()
                  .replace(" ", "") as keyof BookingsBrief;
                return (
                  <th
                    key={header}
                    onClick={() => header !== "Actions" && handleSort(key)}
                    className={`px-6 py-3 text-left text-xs bg-white font-medium text-gray-500 uppercase tracking-wider ${
                      header !== "Actions"
                        ? "cursor-pointer hover:bg-gray-100"
                        : ""
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      {header}
                      {header !== "Actions" &&
                        sortConfig?.key === key &&
                        (sortConfig.direction === "asc" ? (
                          <ChevronUp size={14} />
                        ) : (
                          <ChevronDown size={14} />
                        ))}
                    </div>
                  </th>
                );
              })}
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {filteredBookings.map((booking) => (
              <tr key={booking.id} className="hover:bg-gray-50">
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                  {booking.code}
                </td>
                 <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {formatBookingDates(booking.bookingFrom)}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {formatBookingDates(booking.bookingTo)}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {booking.vehicle}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {booking.customer}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span
                    className={`px-2 py-1 text-xs font-medium rounded-full ${
                      booking.status === "Paid"
                        ? "bg-green-100 text-green-800"
                        : booking.status === "Cancelled"
                        ? "bg-red-100 text-red-800"
                        : "bg-purple-100 text-black-800"
                    }`}
                  >
                    {booking.status}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {booking.source}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => handleCreateContract()}
                      className="btn-sm p-1 text-purple-600 hover:bg-purple-50 rounded-full transition-colors"
                      title="Create Contract"
                    >
                      <FileText size={18} />
                    </button>
                    <button
                     onClick={() => handleDelete(booking.id)}
                      className="btn-sm p-1 text-blue-600 hover:bg-blue-50 rounded-full transition-colors"
                      title="View Details"
                    >
                      <Eye size={18} />
                    </button>
                    {/* <button
                      onClick={() => handleEdit(booking.ID)}
                      className="btn-sm p-1 text-green-600 hover:bg-green-50 rounded-full transition-colors"
                      title="Edit"
                    >
                      <Edit size={18} />
                    </button>
                    <button
                      onClick={() => handleDelete(booking.id)}
                      className="btn-sm p-1 text-red-600 hover:bg-red-50 rounded-full transition-colors"
                      title="Delete"
                    >
                      <X size={18} />
                    </button> */}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>

        <AnimatePresence>
          {activePopup.type === 'delete' && (
              <BookingCancelPopup
                bookId={selectedBookingId}
                onClose={() => setActivePopup({ type: null, custId: null })}
              />
            )}
        </AnimatePresence>
    </>
  );
};

export default BookingTable;