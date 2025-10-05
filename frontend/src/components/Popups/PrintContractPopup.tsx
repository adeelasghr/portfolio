import { motion } from "framer-motion";
import {
  X,
  MapPin,
  Clock,
  Mail,
  Phone,
  Fuel,
  GroupIcon,
  Code,
  PlusCircle,
  FileWarning,
} from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { getContractDetails } from "../../api/contractApi";
import loader from "../../assets/images/loader.gif";
import { ContractDetails } from "../../interfaces/Contract";
import logo from "../../assets/images/logo.png";
import stamp from "../../assets/images/stamp.jpg";
import cancel from "../../assets/images/cancelled.jpg";

interface ContractDetailsPopupProps {
  contractId: number;
  onClose: () => void;
}
import { baseImageUrl } from "../../utils/config";
import { InspectionBrief } from "../../interfaces/Inpsection";
import { getInspectionBrief } from "../../api/inspectionApi";
import { useReactToPrint } from "react-to-print";

const locations = [
  { id: "1", label: "Tempelhof Office" },
  { id: "3", label: "Berlin Airport" },
];

const PrintContractPopup: React.FC<ContractDetailsPopupProps> = ({
  contractId,
  onClose,
}) => {
  const [contractDetails, setContractDetails] = useState<ContractDetails>();
  const [inspectionReport, setInspectionReport] = useState<
    InspectionBrief[] | null
  >(null);
  const [loading, setLoading] = useState(true);

  const printRef = useRef<HTMLDivElement>(null);

  const handlePrint = useReactToPrint({
    contentRef: printRef,
  });

  // Fetch contract
  useEffect(() => {
    const loadContract = async () => {
      try {
        const data = await getContractDetails(contractId);
        setContractDetails(data as ContractDetails);
      } catch (error) {
        console.error("Failed to fetch contract:", error);
      } finally {
        setLoading(false);
      }
    };
    loadContract();
  }, [contractId]);

  // Fetch inspection
  useEffect(() => {
    const fetchInspectionReport = async () => {
      if (!contractDetails?.vehicleID) return;
      try {
        const data = await getInspectionBrief(contractDetails.vehicleID);
        setInspectionReport(data as InspectionBrief[]);
      } catch (error) {
        console.error("Error fetching inspection report:", error);
      }
    };
    if (contractDetails?.vehicleID) {
      fetchInspectionReport();
    }
  }, [contractDetails]);

  if (loading)
    return (
      <div className="card rounded-lg shadow-md overflow-hidden">
        <p className="flex items-center justify-center h-full">
          <img className="mx-auto w-[20%]" src={loader} />
        </p>
      </div>
    );

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4 h-full"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0, rotate: -10, y: 100 }}
        animate={{ scale: 1, rotate: 0, y: 0 }}
        exit={{ scale: 0, rotate: 10, y: -100 }}
        transition={{ type: "spring", damping: 15 }}
        className="bg-white rounded-xl shadow-2xl w-1/2 mx-auto h-full overflow-x-hidden overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="relative">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-2 bg-white rounded-full shadow-lg hover:bg-gray-100 transition-colors"
          >
            <X size={20} />
          </button>
          <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black to-transparent p-6">
            <motion.div
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.2 }}
            ></motion.div>
          </div>
        </div>
        <div>
          <div ref={printRef} className="p-8 text-sm">
            <div className="card-header flex justify-between items-start mb-6 text-sm">
              {/* Left column: Heading */}
              <div>
                <h2 className="text-xl font-bold">Contract Details</h2>
                <p className="text-sm">Code: {contractDetails?.contractCode}</p>
                <p className="text-xs">
                  CSR: {contractDetails?.userName + "(" + contractDetails?.userCode +")"}
                </p>
              </div>

              {/* Right column: Company details + logo side-by-side */}
              <div className="flex items-center space-x-4 text-right">
                <div>
                  <h2 className="text-xl font-bold">DeutPak Auto Mieten</h2>
                  <p className="text-sm">+49 30 1234567</p>
                  <p className="text-sm">info@deutpak.com</p>
                </div>
                <img src={logo} alt="Company Logo" className="h-20 w-auto" />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-1">
              <motion.div
                initial={{ x: -20, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ delay: 0.3 }}
                className="space-y-4"
              >
                <div className="space-y-4 text-sm">
                  <div className="">
                    <div className="gap-4 mt-2"></div>
                    <div className="mx-auto overflow-hiddenn">
                      <div className="p-2">
                        <div className="flex flex-col md:flex-row gap-4 text-sm">
                          {/* Left column with details */}
                          <div className="basis-[65%] space-y-2 ">
                            <div className="p-4 border rounded-lg bg-gray-50 flex justify-between">
                              {/* Left: Pick Up Details */}
                              <div className="flex-1 pr-4">
                                <h3 className="font-semibold text-gray-900 mb-2">
                                  Pick Up Details:
                                </h3>
                                <div className="flex items-center space-x-3">
                                  <MapPin className="text-purple" size={16} />
                                  <span>
                                    {
                                      locations.find(
                                        (l) =>
                                          l.id ===
                                          String(contractDetails?.pickupLocID)
                                      )?.label
                                    }
                                  </span>
                                </div>
                                <div className="flex items-center space-x-3">
                                  <Clock className="text-purple" size={16} />
                                  <span>
                                    {new Date(
                                      contractDetails?.pickDateTime ?? ""
                                    )
                                      .toLocaleString("en-GB", {
                                        day: "2-digit",
                                        month: "2-digit",
                                        year: "numeric",
                                        hour: "2-digit",
                                        minute: "2-digit",
                                        hour12: false,
                                      })
                                      .replace(/\//g, "-")}
                                  </span>
                                </div>
                              </div>

                              {/* Right: Drop Off Details */}
                              <div className="flex-1 pl-4 border-l">
                                <h3 className="font-semibold text-gray-900 mb-2">
                                  Drop Off Details:
                                </h3>
                                <div className="flex items-center space-x-3">
                                  <MapPin className="text-purple" size={16} />
                                  <span>
                                    {" "}
                                    {
                                      locations.find(
                                        (l) =>
                                          l.id ===
                                          String(contractDetails?.dropOffLocID)
                                      )?.label
                                    }
                                  </span>
                                </div>
                                <div className="flex items-center space-x-3">
                                  <Clock className="text-purple" size={16} />
                                  <span>
                                    {new Date(
                                      contractDetails?.dropDateTime ?? ""
                                    )
                                      .toLocaleString("en-GB", {
                                        day: "2-digit",
                                        month: "2-digit",
                                        year: "numeric",
                                        hour: "2-digit",
                                        minute: "2-digit",
                                        hour12: false,
                                      })
                                      .replace(/\//g, "-")}
                                  </span>
                                </div>
                              </div>
                            </div>

                            <div className="p-4 border rounded-lg bg-gray-50 flex items-start justify-between">
                              {/* Left: Vehicle info */}
                              <div className="flex-1 pr-4">
                                <h3 className="font-semibold text-gray-900 mb-2">
                                  {contractDetails?.vehicleName}
                                </h3>
                                <div className="flex items-center space-x-3">
                                  <Code className="text-purple" size={16} />
                                  <span>{contractDetails?.vehiclCode}</span>
                                </div>
                                <div className="flex items-center space-x-3">
                                  <Fuel className="text-purple" size={16} />
                                  <span>
                                    {contractDetails?.petrolType} (
                                    {contractDetails?.fuelReading}/10)
                                  </span>
                                </div>
                                <div className="flex items-center space-x-3">
                                  <GroupIcon
                                    className="text-purple"
                                    size={16}
                                  />
                                  <span>{contractDetails?.group}</span>
                                </div>
                              </div>

                              {/* Customer Details */}
                              <div className="flex-1 pl-4 border-l">
                                <h3 className="font-semibold text-gray-900 mb-2">
                                  {contractDetails?.customerName}
                                </h3>
                                <div className="flex items-center space-x-3">
                                  <Code className="text-purple" size={16} />
                                  <span>{contractDetails?.customerCode}</span>
                                </div>
                                <div className="flex items-center space-x-3">
                                  <Mail className="text-purple" size={16} />
                                  <span>{contractDetails?.email}</span>
                                </div>
                                <div className="flex items-center space-x-3">
                                  <Phone className="text-purple" size={16} />
                                  <span>{contractDetails?.phoneNumber}</span>
                                </div>
                              </div>
                            </div>

                            <div className="p-4 border rounded-lg bg-gray-50 flex justify-between">
                              {/* Left: Pick Up Details */}
                              <div className="flex-1 pr-4">
                                <h3 className="font-semibold text-gray-900 mb-2">
                                  Selected Add-Ons
                                </h3>
                                <ul className="list-none list-inside">
                                  {(contractDetails?.addOns ?? []).map(
                                    (item, idx) => (
                                      <li key={idx}>
                                        {item &&
                                          (console.log(item),
                                          (
                                            <>
                                              <div className="flex items-center space-x-3">
                                                <PlusCircle
                                                  className="text-purple"
                                                  size={16}
                                                />
                                                <span>
                                                  {item.addOnName} — €{" "}
                                                  {item.price}
                                                  {Number(item.addOnDetail) >
                                                    0 && (
                                                    <>
                                                      {" "}
                                                      × {item.addOnDetail} km
                                                    </>
                                                  )}
                                                </span>
                                              </div>
                                            </>
                                          ))}
                                      </li>
                                    )
                                  )}
                                </ul>
                              </div>

                              <div className="flex-1 pl-4 border-l">
                                <h3 className="font-semibold text-gray-900 mb-2">
                                  Inspection Report
                                </h3>
                                <ul>
                                  {(inspectionReport ?? []).map((item, idx) => (
                                    <li key={idx}>
                                      {item && (
                                        <>
                                          <div className="flex items-center space-x-3">
                                            <FileWarning
                                              className="text-purple"
                                              size={16}
                                            />
                                            <span>{item.remarks}</span>
                                          </div>
                                        </>
                                      )}
                                    </li>
                                  ))}
                                </ul>
                              </div>
                            </div>
                          </div>
                          {/* Right column with QR code and payment */}
                          <div className="basis-[35%] space-y-2">
                            <div className="grid grid-cols-2 lg:grid-cols-1 lg:gap-0 sm:grid-cols-2 bg-gray-50 p-4 rounded-lg border gap-2">
                              <div className="flex items-center rounded-lg justify-between mb-2 mt-2 bg-purple-200 p-2">
                                <span>
                                  Net Amount:
                                  <br />
                                  <b>
                                    €{" "}
                                    {(
                                      contractDetails?.totalAmount ?? 0
                                    ).toFixed(2)}
                                  </b>
                                </span>
                              </div>
                              <div className="flex items-center rounded-lg justify-between mb-2 mt-2 bg-red-200 p-2">
                                <span>
                                  Tax (19%):
                                  <br />
                                  <b>
                                    €{" "}
                                    {(contractDetails?.taxAmount ?? 0).toFixed(
                                      2
                                    )}
                                  </b>
                                </span>
                              </div>
                              <div className="flex items-center rounded-lg justify-between mb-2 mt-2 bg-gray-200 p-2">
                                <span className="">
                                  Discount:
                                  <br />
                                  <b>
                                    €{" "}
                                    {(contractDetails?.discount ?? 0).toFixed(
                                      2
                                    )}
                                  </b>
                                </span>
                              </div>
                              <div className="flex items-center rounded-lg justify-between mb-2 mt-2 bg-green-200 p-2">
                                <span>
                                  Gross Amount:
                                  <br />
                                  <b>
                                    €{" "}
                                    {(
                                      (contractDetails?.taxAmount ?? 0) +
                                      (contractDetails?.totalAmount ?? 0) -
                                      (contractDetails?.discount ?? 0)
                                    ).toFixed(2)}
                                  </b>
                                </span>
                              </div>
                            </div>
                          </div>
                        </div>
                        <div className="text-s mt-6">
                          I hereby confirm that I have carefully read, fully
                          understood, and agree to comply with all the terms and
                          conditions set forth in this rental agreement.
                        </div>
                        <div className="mx-auto flex justify-between items-center px-4">
                          {/* Left side */}
                          <div className="text-left">
                             <img
                                src={stamp}
                                alt="Approved Stamp"
                                className="h-20 inline-block"
                              /> <br /><span className="ml-4">Stamp</span>
                          </div>

                          {/* Right side */}
                          <div className="text-right">
                            {contractDetails?.signature ? (
                              <img
                                src={`${baseImageUrl}${contractDetails.signature}`}
                                alt="Customer Signature"
                                className="h-14 inline-block"
                              />
                            ) : (
                              <span className="text-gray-500">
                                No signature available
                              </span>
                            )}
                            <br />
                            <div className="text-xs">
                              {new Date(
                                (contractDetails?.createdOn ?? "").toString()
                              )
                                .toLocaleDateString("en-GB", {
                                  day: "2-digit",
                                  month: "2-digit",
                                  year: "numeric",
                                })
                                .replace(/\//g, "-")}
                            </div>
                             {contractDetails?.status?.toLowerCase() ===
                            "cancelled" ? (
                              <img
                                src={cancel}
                                alt="Cancelled"
                                className="h-10 inline-block"
                              />
                            ) : (
                              <>
                             
                              </>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            </div>
          </div>
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="mt-8 flex justify-center space-x-4 p-4"
          >
            <button
              onClick={handlePrint}
              className="px-6 py-2 btn-primary text-white rounded-lg"
            >
              Print
            </button>
          </motion.div>
        </div>
      </motion.div>
    </motion.div>
  );
};
export default PrintContractPopup;
