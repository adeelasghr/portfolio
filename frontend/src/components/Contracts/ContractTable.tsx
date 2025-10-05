import React, { useState, useEffect, useRef } from "react";
import {
  Search,
  SlidersHorizontal,
  ChevronDown,
  ChevronUp,
  FileSpreadsheet,
  Download,
  File,
  Mail,
  Settings,
  Printer,
  PencilIcon,
} from "lucide-react";

import { generatePDF } from "../../utils/exportPDF";
import { exportToExcel } from "../../utils/exportExcel";
import { AnimatePresence } from "framer-motion";
import SettingsContractPopup from "../Popups/SettingsContractPopup";
import CloseContractPopup from "../Popups/CloseContractPopup";
import SendContractPopup from "../Popups/SendContractPopup";
import PrintContractPopup from "../Popups/PrintContractPopup";
import TimelineContractPopup from "../Popups/TimelineContractPopup";
import { ContractBrief } from "../../interfaces/Contract";
import { getContractsBrief } from "../../api/contractApi";
import loader from "../../assets/images/loader.gif";
import { useNavigate } from "react-router-dom";
import EditContractPopup from "../Popups/EditContractPopup";


const ContractTable: React.FC = () => {
  const [contracts, setContracts] = useState<ContractBrief[]>([]);
  const [loading, setLoading] = useState(true);
  const [activePopup, setActivePopup] = useState<{
    type: string | null;
    contractId: number | null;
  }>({ type: null, contractId: null });
  const navigate = useNavigate();

  //Fetching Contracts
  useEffect(() => {
    const loadContracts = async () => {
      try {
        const data = await getContractsBrief();
        setContracts(data as ContractBrief[]);
        console.log(data);
      } catch (error) {
        console.error("Failed to fetch contract:", error);
      } finally {
        setLoading(false);
      }
    };

    loadContracts();
  }, []);

  //Edit Button
  const handleEdit = (contractId: string, status: string) => {
    if (status == "Closed") {
      setActivePopup({
        type: "edit",
        contractId: Number(contractId),
      })
    }
    else {
      navigate(`/contracts/edit/${contractId}`);
    }
  };

  // State Variables
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<string[]>([]);
  const [sortConfig, setSortConfig] = useState<{
    key: keyof ContractBrief;
    direction: "asc" | "desc";
  } | null>(null);
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [showExportMenu, setShowExportMenu] = useState(false);
  const filterRef = useRef<HTMLDivElement>(null);

  // Filtering Data
  const filteredContracts = contracts
    .filter((contract) => {
      const matchesSearch =
        contract.contractCode
          .toLowerCase()
          .includes(searchTerm.toLowerCase()) ||
        contract.vehicle.toLowerCase().includes(searchTerm.toLowerCase()) ||
        contract.client.includes(searchTerm);

      const matchesStatus =
        statusFilter.length === 0 || statusFilter.includes(contract.status);

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

  const handleSort = (key: keyof ContractBrief) => {
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

  //Setting Up Loading
  if (loading)
    return (
      <div className="card rounded-lg shadow-md overflow-hidden">
        <p className="flex items-center justify-center h-full">
          <img className="mx-auto w-[20%]" src={loader} />
        </p>
      </div>
    );

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
                placeholder="Search contracts..."
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
                      generatePDF(filteredContracts);
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
                      exportToExcel(filteredContracts);
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
                  ${statusFilter.length > 0
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
                          ${isFilterOpen
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
                  {["Confirmed", "Active", "Completed"].map((status) => (
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
                  "Vehicle",
                  "Client",
                  "Contract Start",
                  "Contract End",
                  "Amount",
                  "Status",
                  "Actions",
                ].map((header, index) => {
                  const key = header
                    .toLowerCase()
                    .replace(" ", "") as keyof ContractBrief;
                  return (
                    <th
                      key={header}
                      onClick={() => header !== "Actions" && handleSort(key)}
                      className={`px-6 py-3 text-left text-xs bg-white font-medium text-gray-500 uppercase tracking-wider ${header !== "Actions"
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
              {filteredContracts.map((contract) => (
                <tr key={contract.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    {contract.contractCode}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {contract.vehicle}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {contract.client}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {new Date(contract.start)
                      .toLocaleString("en-GB", {
                        day: "2-digit",
                        month: "short",
                        year: "numeric",
                        hour: "2-digit",
                        minute: "2-digit",
                        hour12: false,
                      })
                      .replace(",", " at")}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {new Date(contract.end)
                      .toLocaleString("en-GB", {
                        day: "2-digit",
                        month: "short",
                        year: "numeric",
                        hour: "2-digit",
                        minute: "2-digit",
                        hour12: false,
                      })
                      .replace(",", " at")}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    €{contract.amount}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span
                      className={`px-2 py-1 text-xs font-medium rounded-full ${contract.status === "Active"
                          ? "bg-green-100 text-green-800"
                          : contract.status === "Confirmed"
                            ? "bg-blue-100 text-blue-800"
                            : contract.status === "Cancelled"
                              ? "bg-red-100 text-red-800"
                              : "bg-purple text-white"
                        }`}
                    >
                      {contract.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    <div className="flex items-center gap-2">
                      {/* <button
                      onClick={() => setActivePopup({ type: 'timeline', contractId: Number(contract.id) })}
                      className="btn-sm p-1 text-blue-600 hover:bg-blue-50 rounded-full transition-colors"
                      title="View Details"
                    >
                      <List size={18} />
                    </button> */}
                      <button
                        disabled={
                          contract.status === "Cancelled"
                        }
                        onClick={() =>
                          setActivePopup({
                            type: "send",
                            contractId: Number(contract.id),
                          })
                        }
                        className={`btn-sm p-1 rounded-full ${contract.status === "Cancelled"
                            ? "text-green-400 bg-gray-500 cursor-not-allowed"
                            : "text-green-600 hover:bg-green-50"
                          }`}
                        title="Send Contract"
                      >
                        <Mail size={18} />
                      </button>
                      <button
                        disabled={
                          contract.status === "Closed" ||
                          contract.status === "Cancelled"
                        }
                        onClick={() =>
                          setActivePopup({
                            type: "settings",
                            contractId: Number(contract.id),
                          })
                        }
                        className={`btn-sm p-1 rounded-full ${contract.status === "Closed" ||
                            contract.status === "Cancelled"
                            ? "text-green-400 bg-gray-500 cursor-not-allowed"
                            : "text-green-600 hover:bg-green-50"
                          }`}
                        title="Close Contract"
                      >
                        <Settings size={18} />
                      </button>
                      <button
                        disabled={
                          contract.status === "Cancelled"
                        }
                        onClick={() => handleEdit(contract.id, contract.status)}
                        className={`btn-sm p-1 rounded-full ${contract.status === "Cancelled"
                            ? "text-gray-400 bg-gray-100 cursor-not-allowed"
                            : "text-green-600 bg-white hover:bg-green-50"
                          }`}
                        title="Edit Contract"
                      >
                        <PencilIcon size={18} />
                      </button>
                      <button
                        onClick={() =>
                          setActivePopup({
                            type: "print",
                            contractId: Number(contract.id),
                          })
                        }
                        className="btn-sm p-1 text-green-600 hover:bg-green-50 rounded-full transition-colors"
                        title="Print"
                      >
                        <Printer size={18} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <AnimatePresence>
        {activePopup.type === "edit" && (
          <EditContractPopup
            contractId={activePopup.contractId!}
            onClose={() => setActivePopup({ type: null, contractId: null })}
          />
        )}
        {activePopup.type === "print" && (
          <PrintContractPopup
            contractId={activePopup.contractId!}
            onClose={() => setActivePopup({ type: null, contractId: null })}
          />
        )}

        {activePopup.type === "settings" && (
          <SettingsContractPopup
            contractId={activePopup.contractId!}
            onClose={() => setActivePopup({ type: null, contractId: null })}
          />
        )}

        {activePopup.type === "send" && (
          <SendContractPopup
            contractId={activePopup.contractId!}
            onClose={() => setActivePopup({ type: null, contractId: null })}
          />
        )}

        {activePopup.type === "close" && (
          <CloseContractPopup
            contractId={activePopup.contractId!}
            onClose={() => setActivePopup({ type: null, contractId: null })}
          />
        )}

        {activePopup.type === "timeline" && (
          <TimelineContractPopup
            contractId={activePopup.contractId!}
            onClose={() => setActivePopup({ type: null, contractId: null })}
          />
        )}
      </AnimatePresence>
    </>
  );
};

export default ContractTable;
