import { AnimatePresence, motion } from "framer-motion";
import { X, MapPin, Clock, User, Code, Fuel } from "lucide-react";
import { useEffect, useState } from "react";
import CloseContractPopup from "./CloseContractPopup";
import ReplaceContractPopup from "./ReplaceContractPopup";
import ChangeContractPopup from "./ChangeContractPopup";
import { getContractOverview } from "../../api/contractApi";
import { ContractDetails, ContractOverview } from "../../interfaces/Contract";

interface ContractDetailsPopupProps {
  contractId: number;
  onClose: () => void;
}

const locations = [
  { id: "1", label: "Tempelhof Office" },
  { id: "3", label: "Berlin Airport" },
];

const SettingsContractPopup: React.FC<ContractDetailsPopupProps> = ({
  contractId,
  onClose,
}) => {
  const [activeSubPopup, setActiveSubPopup] = useState<{
    type: string | null;
    contractId: number | null;
  }>({ type: null, contractId: null });
  const [contractDetails, setContractDetails] = useState<ContractOverview>();
  const [loading, setLoading] = useState(true);

  // Fetching Contract Data
  useEffect(() => {
    const loadContract = async () => {
      try {
        const data = await getContractOverview(contractId);
        setContractDetails(data as ContractOverview);
      } catch (error) {
        console.error("Failed to fetch contract:", error);
      } finally {
        setLoading(false);
      }
    };
    loadContract();
  }, []);

  return (
    <>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4"
        onClick={onClose}
      >
        <motion.div
          initial={{ scale: 0, rotate: -10, y: 100 }}
          animate={{ scale: 1, rotate: 0, y: 0 }}
          exit={{ scale: 0, rotate: 10, y: -100 }}
          transition={{ type: "spring", damping: 15 }}
          className="bg-white rounded-xl overflow-hidden shadow-2xl popup-bg"
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
          <div className="p-8">
            <h3 className="card-header text-xl mb-6">
              Contract: {contractDetails?.contractCode}
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-1 gap-8 mt-4">
              <motion.div
                initial={{ x: -20, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ delay: 0.3 }}
                className="space-y-4"
              >
                <div className="flex-1 space-y-2">
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
                                l.id === String(contractDetails?.pickupLocID)
                            )?.label
                          }
                        </span>
                      </div>
                      <div className="flex items-center space-x-3">
                        <Clock className="text-purple" size={16} />
                        <span>
                          {new Date(contractDetails?.pickupDateTime ?? "")
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
                                l.id === String(contractDetails?.dropOffLocID)
                            )?.label
                          }
                        </span>
                      </div>
                      <div className="flex items-center space-x-3">
                        <Clock className="text-purple" size={16} />
                        <span>
                          {new Date(contractDetails?.dropOffDateTime ?? "")
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
                        Vehicle:
                      </h3>
                      <div className="flex items-center space-x-3">
                        <Code className="text-purple" size={16} />
                        <span>{contractDetails?.vehicleCode}</span>
                      </div>
                      <div className="flex items-center space-x-3">
                        <Fuel className="text-purple" size={16} />
                        <span>{contractDetails?.vehicleName}</span>
                      </div>
                    </div>

                    {/* Customer Details */}
                    <div className="flex-1 pl-4 border-l">
                      <h3 className="font-semibold text-gray-900 mb-2">
                        Customer:
                      </h3>
                      <div className="flex items-center space-x-3">
                        <Code className="text-purple" size={16} />
                        <span>{contractDetails?.customerCode}</span>
                      </div>
                      <div className="flex items-center space-x-3">
                        <User className="text-purple" size={16} />
                        <span> {contractDetails?.customerName}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            </div>

            <motion.div
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.5 }}
              className="mt-8 ml-4 space-x-4"
            >
              <button
                onClick={() =>
                  setActiveSubPopup({ type: "replace", contractId: contractId })
                }
                className="px-6 py-2 rounded-lg bg-red-700 text-white"
              >
                Cancel Contract
              </button>
              <button
                onClick={() =>
                  setActiveSubPopup({ type: "close", contractId: contractId })
                }
                className={"px-6 py-2 rounded-lg text-white bg-purple"}
              >
                Close Contract
              </button>
            </motion.div>
          </div>
        </motion.div>
      </motion.div>

      <AnimatePresence>
        {activeSubPopup.type === "close" && (
          <CloseContractPopup
            contractId={contractId}
            onClose={() => setActiveSubPopup({ type: null, contractId: null })}
          />
        )}

        {activeSubPopup.type === "replace" && (
          <ChangeContractPopup
            contractId={contractId}
            onClose={() => setActiveSubPopup({ type: null, contractId: null })}
          />
        )}

      
      </AnimatePresence>
    </>
  );
};
export default SettingsContractPopup;
