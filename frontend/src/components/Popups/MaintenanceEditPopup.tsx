import { motion } from "framer-motion";
import { X, Code, Calendar, File, Gauge, Settings } from "lucide-react";
import { useEffect, useState } from "react";
import MessageBox from "../Shared/MessageBox";
import { MaintenanceBrief } from "../../interfaces/Maintenance";
import {
  getMaintenanceByID,
  updateMaintenanceStatus,
} from "../../api/maintenanceApi";

interface MaintenanceEditPopupProps {
  mainId: number;
  onClose: () => void;
}

const MaintenanceEditPopup: React.FC<MaintenanceEditPopupProps> = ({
  mainId,
  onClose,
}) => {
  const [mainData, setMainData] = useState<MaintenanceBrief | null>(null);
  const [showSuccessModal, setShowSuccessModal] = useState(false);

  const handleChange = async (status: string) => {
    const data = (await updateMaintenanceStatus(
      mainId,
      status
    )) as MaintenanceBrief;
    setMainData(data);
    setShowSuccessModal(true);
  };

  useEffect(() => {
    const fetchMaintenanceData = async () => {
      try {
        const data = (await getMaintenanceByID(mainId)) as MaintenanceBrief;
        setMainData(data);
        console.log(data);
      } catch (error) {
        console.error(error);
      }
    };

    fetchMaintenanceData();
  }, []);

  return (
    <>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black/40 bg-opacity-50 z-50 flex items-center justify-center p-4 backdrop-blur-sm"
        onClick={onClose}
      >
        <motion.div
          initial={{ scale: 0, rotate: -10, y: 100 }}
          animate={{ scale: 1, rotate: 0, y: 0 }}
          exit={{ scale: 0, rotate: 10, y: -100 }}
          transition={{ type: "spring", damping: 15 }}
          className="bg-white rounded-xl overflow-hidden shadow-2xl popup-bg"
          onClick={(e) => e.stopPropagation()}
          style={{ minWidth: "300px" }}
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
            <h3 className="card-header text-xl mb-6">Update Schedule</h3>
            <div className="grid grid-cols-1 md:grid-cols-1">
              <motion.div
                initial={{ x: -20, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ delay: 0.3 }}
                className="space-y-4 mt-6"
              >
                {/* Left column with details */}
                <div className="flex-1 space-y-6">
                  {/* Customer Details */}
                  <div className="space-y-3">
                    <div className="flex items-center space-x-3">
                      <Code className="text-blue-500" size={20} />
                      <span>{mainData?.plateNumber}</span>
                    </div>
                    <div className="flex items-center space-x-3">
                      <Gauge className="text-blue-500" size={20} />
                      <span>{mainData?.odometer}</span>
                    </div>
                    <div className="flex items-center space-x-3">
                      <Settings className="text-blue-500" size={20} />
                      <span>{mainData?.serviceType}</span>
                    </div>

                    <div className="flex items-center space-x-3">
                      <Calendar className="text-blue-500" size={20} />
                      <span>{mainData?.serviceDate
                      ? new Date(mainData.serviceDate).toLocaleDateString(
                          "en-GB",
                          {
                            day: "2-digit",
                            month: "short",
                            year: "numeric",
                          }
                        )
                      : "-"}</span>
                    </div>
                    <div className="flex items-center space-x-3">
                      <File className="text-blue-500" size={20} />
                      <span>{mainData?.status}</span>
                    </div>
                  </div>
                </div>
              </motion.div>
            </div>

            {mainData?.status !== "Complete" && (
              <motion.div
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.5 }}
                className="mt-8 flex space-x-4"
              >
                {mainData?.status !== "In-Service" && (
                <button
                  onClick={() => handleChange("In-Service")}
                  className="px-6 py-2 mx-auto bg-purple-700 text-white rounded-lg"
                >
                  Send Vehicle
                </button>
                 )}
                  {mainData?.status == "In-Service" && (
                <button
                  onClick={() => handleChange("Complete")}
                  className="px-6 py-2 mx-auto bg-green-700 text-white rounded-lg"
                >
                  Mark as Complete
                </button>
                   )}
              </motion.div>
              
            )}
          </div>
        </motion.div>
      </motion.div>

      {showSuccessModal && (
        <MessageBox
          onClose={() => {}}
          code="green"
          title="Change Status"
          primaryAction={{ label: "View Maintenance", path: "/maintenance/" }}
          secondaryAction={{ label: "Go to Dashboard", path: "/dashboard" }}
        >
          The maintenance status has been successfully updated
        </MessageBox>
      )}
    </>
  );
};
export default MaintenanceEditPopup;
