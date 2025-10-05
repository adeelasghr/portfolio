import { motion } from "framer-motion";
import {
  X
} from "lucide-react";
import { useState } from "react";
import { cancelContract } from "../../api/contractApi";
import MessageBox from "../Shared/MessageBox";

interface ContractDetailsPopupProps {
  contractId: number;
  onClose: () => void;
}

const ChangeContractPopup: React.FC<ContractDetailsPopupProps> = ({
  contractId,
  onClose,
}) => {
  
  const [formData, setFormData] = useState({
   remarks: "",
   contractID: contractId
  });

    //Message Boxes
    const [showSuccessModal, setShowSuccessModal] = useState(false);
    const [showErrorModal, setShowErrorModal] = useState<string[]>([]);
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData((prev) => ({ ...prev, remarks: e.target.value }));
  };

    interface AddVehicleResult {
    errors?: string[];
    [key: string]: any;
  }

    const handleCloseModal = () => {
    //Closing all Message Boxes
    setShowErrorModal([]);
    setShowSuccessModal(false);
  };


  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
  
       const result = (await cancelContract(contractId.toString(), formData.remarks.toString())) as AddVehicleResult;
      
      if (result?.errors) {
        setShowErrorModal(result.errors);
      } else {
        setShowSuccessModal(true);
      }
  };

  return (
    <>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4"
        onClick={onClose}
      >
        <form id="cancelContract"onSubmit={handleSubmit}>
        <motion.div
          initial={{ scale: 0, rotate: -10, y: 100 }}
          animate={{ scale: 1, rotate: 0, y: 0 }}
          exit={{ scale: 0, rotate: 10, y: -100 }}
          transition={{ type: "spring", damping: 15 }}
          className="bg-white w-[600px] rounded-xl overflow-hidden shadow-2xl popup-bg"
          onClick={(e) => e.stopPropagation()}
        >
          <div className="relative">
            <button
            type="button"
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
            <h3 className="card-header text-xl mb-6">Cancel Contract</h3>
            <div className="grid grid-cols-1 md:grid-cols-1 mt-4">

              {/* Right Column */}
              <motion.div
                initial={{ x: 20, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ delay: 0.4 }}
                className="space-y-4"
              >
                <div className="space-y-6">
                  <div className="lg:col-span-1 rounded-lg p-4">
                    <div className="col-span-full">
                      <div className="text-center">
                        You are about to cancel the contract, please enter a reason.
                        <div className="relative mt-2 mb-2">
                        
                          <input
                            name="remarks"
                            value={formData.remarks}
                            onChange={handleChange}
                            className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            </div>

            {/* Footer */}
            <motion.div
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.5 }}
              className="mt-8 flex justify-end space-x-4"
            >
              <button
                className="px-6 py-2 btn-primary text-white rounded-lg mx-auto"
                title="Settings"
              >
                Cancel Contract
              </button>
            </motion.div>
          </div>
        </motion.div>
        </form>
      </motion.div>

            {showSuccessModal && (
        <MessageBox
          onClose={handleCloseModal}
          code="green"
          title="Contract Cancelled"
          primaryAction={{ label: "View Contracts", path: "/contracts" }}
          secondaryAction={{ label: "Go to Dashboard", path: "/dashboard" }}
        >
          The contract has been cancelled successfully.
        </MessageBox>
      )}
    </>
  );
};
export default ChangeContractPopup;
