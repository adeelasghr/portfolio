import { motion } from "framer-motion";
import { X, Code, Car, CarFront, CarIcon } from "lucide-react";
import { useEffect, useState } from "react";
import { getVehiclesBrief, updateVehicleStatus } from "../../api/vehicleApi";
import MessageBox from "../Shared/MessageBox";
import { VehiclesBrief } from "../../interfaces/Vehicle";

interface VehicleDetailsPopupProps {
  vehicleId: number;
  status: string;
  onClose: () => void;
}

const VehicleChangeStatusPopup: React.FC<VehicleDetailsPopupProps> = ({
  vehicleId: vehicleId,
  status: status,
  onClose,
}) => {
  const [vehData, setVehData] = useState<VehiclesBrief | null>(null);
 const [showSuccessModal, setShowSuccessModal] = useState(false);
 
 const handleUpdateStatus = () => {
    var newStatus ="Available";
      if(status == "Available"){
        newStatus = "Disable";
      }
      const result = updateVehicleStatus(vehicleId, newStatus);
      setShowSuccessModal(true);
      console.log(result);
      };

  useEffect(() => {
    const fetchVehicleInformation = async () => {
      try {
        const data = (await getVehiclesBrief(vehicleId)) as VehiclesBrief[];
        setVehData(data[0]);
      } catch (error) {
        console.error(error);
      }
    };

    fetchVehicleInformation();
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
            <h3 className="card-header text-xl mb-6">Change Status</h3>
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
                      <span>{vehData?.vehicleCode}</span>
                    </div>
                    <div className="flex items-center space-x-3">
                      <Car className="text-blue-500" size={20} />
                      <span>{vehData?.makeModel}</span>
                    </div>
                    <div className="flex items-center space-x-3">
                      <CarFront className="text-blue-500" size={20} />
                      <span>{vehData?.plateNumber}</span>
                    </div>

                    <div className="flex items-center space-x-3">
                      <CarIcon className="text-blue-500" size={20} />
                      <span>{vehData?.vehicleType}</span>
                    </div>
                  
                  </div>
                </div>
              </motion.div>
            </div>

            <motion.div
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.5 }}
              className="mt-8 flex space-x-4"
            >
              <button
                onClick={() => handleUpdateStatus()}
                className="px-6 py-2 mx-auto bg-purple text-white rounded-lg"
              >
                {status === "Available" ? "Disable Vehicle" : "Enable Vehicle"}
              </button>
            </motion.div>
          </div>
        </motion.div>
      </motion.div>

      {showSuccessModal && (
        <MessageBox
          onClose={()=>{}}
          code="green"
          title="Vehicle Status Updated"
          primaryAction={{ label: "View Vehicles", path: "/vehicles/" }}
          secondaryAction={{ label: "Go to Dashboard", path: "/dashboard" }}
        >The vehicle status has been successfully updated</MessageBox>
      )}
    </>
  );
};
export default VehicleChangeStatusPopup;
