import { motion } from "framer-motion";
import {
  X,
  CheckCircle,
  Calendar,
  Car,
  Clock,
  Mail,
  MapPin,
  Phone,
  User,
} from "lucide-react";
import { useEffect, useState } from "react";
import { ContractBrief } from "../../interfaces/Contract";
import { getContractsBrief } from "../../api/contractApi";

const items = [
  {
    date: "2023-10-01",
    title: "Contract Created",
  },
  {
    date: "2023-10-02",
    title: "Vehicle Changed",
  },
  {
    date: "2023-10-03",
    title: "Contract Extended",
  },
  {
    date: "2023-10-04",
    title: "Contract Closed",
  },
];

interface ContractDetailsPopupProps {
  contractId: number;
  onClose: () => void;
}

const TimelineContractPopup: React.FC<ContractDetailsPopupProps> = ({
  contractId,
  onClose,
}) => {
  const [activeSubPopup, setActiveSubPopup] = useState<{
    type: string | null;
    contractId: number | null;
  }>({ type: null, contractId: null });

  const [contracts, setContracts] = useState<ContractBrief>();
  const [loading, setLoading] = useState(true);

// Fetching Contract
useEffect(() => {
  const loadContracts = async () => {
    try {
      const data = await getContractsBrief(contractId);

      // data is an array → pick first row
      const firstRow = (data as any)[0];

      if (firstRow) {
        setContracts(firstRow as ContractBrief);
        console.log(firstRow);
      }
    } catch (error) {
      console.error("Failed to fetch contract:", error);
    } finally {
      setLoading(false);
    }
  };

  loadContracts();
}, [contractId]);


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
          className="bg-white w-[700px] rounded-xl overflow-hidden shadow-2xl popup-bg"
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
            <h3 className="card-header text-xl mb-6">Contract Timeline</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 mt-4">
              <motion.div
                initial={{ x: -20, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ delay: 0.3 }}
                className="space-y-4"
              >
                {/* Left column with details */}
                <div className="flex-1 space-y-6 p-4">
                  {/* Vehicle Details */}
                  <div className="space-y-4">
                    <div className="flex items-center space-x-3">
                      <Car className="text-blue-500" size={24} />
                      <div>
                        <h3 className="font-semibold text-gray-900">
                          {contracts?.contractCode}
                        </h3>
                      </div>
                    </div>
                  </div>

                  {/* Customer Details */}
                  <div className="space-y-3">
                    <div className="flex items-center space-x-3">
                      <User className="text-blue-500" size={20} />
                      <span className="font-medium">{contracts?.client}</span>
                    </div>
                    <div className="flex items-center space-x-3">
                      <Mail className="text-blue-500" size={20} />
                      <span>{contracts?.contractCode}</span>
                    </div>
                    <div className="flex items-center space-x-3">
                      <Phone className="text-blue-500" size={20} />
                      <span>{contracts?.status}</span>
                    </div>
                  </div>

                  {/* Pickup & Return Details */}
                  <div className="space-y-3">
                    <div className="flex items-center space-x-3">
                      <MapPin className="text-blue-500" size={20} />
                      <span>{contracts?.start}</span>
                    </div>
                    <div className="flex items-center space-x-3">
                      <Calendar className="text-blue-500" size={20} />
                      <div>
                        {/* <p>Pickup: {contract.pickupDate}</p>
                        <p>Return: {contract.returnDate}</p> */}
                      </div>
                    </div>
                    <div className="flex items-center space-x-3">
                      <Clock className="text-blue-500" size={20} />
                      <div>
                        {/* <p>Time: {contract.pickupTime}</p>
                        <p>Return: {contract.returnTime}</p> */}
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
              {/* Right Column */}
              <motion.div
                initial={{ x: -20, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ delay: 0.3 }}
                className="space-y-4"
              >
                <div className="max-w-2xl mx-auto bg-white rounded-3xl shadow-lg overflow-hidden">
                  {/* Property Header */}
                  <div className="p-6 space-y-6">
                    {/* Timeline */}
                    <div className="space-y-6 pt-6">
                      {items.map((item, index) => (
                        <div key={index} className="flex gap-4">
                          <div className="relative">
                            <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                              <CheckCircle className="w-5 h-5 text-green-500" />
                            </div>
                            {index !== items.length - 1 && (
                              <div className="absolute top-8 left-1/2 bottom-0 w-0.5 bg-gray-200 -translate-x-1/2" />
                            )}
                          </div>
                          <div className="flex-1 pb-6">
                            <p className="text-gray-500 text-sm">{item.date}</p>
                            <h3 className="text-md font-semibold text-gray-900 mt-1">
                              {item.title}
                            </h3>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </motion.div>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </>
  );
};
export default TimelineContractPopup;
