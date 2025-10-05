import { motion } from "framer-motion";
import { X, Trash2 } from "lucide-react";
import { useEffect, useState } from "react";
import MessageBox from "../Shared/MessageBox";

import { LookUp } from "../../interfaces/Shared";
import { addMaintenance, getMaintenanceType } from "../../api/maintenanceApi";

interface PopupProps {
  vehicleID: number;
  vehicleCode: string;
  onClose: () => void;
}

const AddMaintenancePopup: React.FC<PopupProps> = ({
  vehicleID: vehId,
  vehicleCode: vehCode,
  onClose,
}) => {
  //Success & Error Modal
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [showErrorModal, setShowErrorModal] = useState<string[]>([]);

  console.log("Vehicle ID in Popup:", vehId);
  //Error Handling
  const [error, setError] = useState<string | null>(null);

  // Maintenance Section
  type MaintenanceItem = {
    VehicleID: string;
    ServiceType: string;
    ServiceName: string;
    Odometer: string;
    ScheduleDate: string;
    Status: string;
  };

  const [maintenanceType, setMaintenanceType] = useState<LookUp[]>([]);
  const [maintenanceList, setMaintenanceList] = useState<MaintenanceItem[]>([]);
  const [newItem, setNewItem] = useState<MaintenanceItem>({
    VehicleID: vehId.toString(),
    ServiceType: "",
    Odometer: "",
    ScheduleDate: "",
    ServiceName: "",
    Status: "",
  });

  const handleScheduleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setNewItem((prev) => ({ ...prev, [name]: value }));
  };
  const handleAddItem = () => {
    const { ServiceType, Odometer, ScheduleDate } = newItem;

    // Required fields check
    if (!ServiceType || !Odometer || !ScheduleDate) {
      setError("All fields are required.");
      return;
    }

    // Duplicate check (type + date as unique combo)
    const isDuplicate = maintenanceList.some(
      (item) =>
        item.ServiceType === ServiceType && item.ScheduleDate === ScheduleDate
    );
    if (isDuplicate) {
      setError("This maintenance entry already exists.");
      return;
    }

    // Add to list
    setMaintenanceList([...maintenanceList, newItem]);
    setNewItem({
      VehicleID: vehId.toString(),
      ServiceType: "",
      Odometer: "",
      ScheduleDate: "",
      Status: "",
      ServiceName: "",
    });
    setError(null);
  };
  const handleRemoveItem = (index: number) => {
    setMaintenanceList((prev) => prev.filter((_, i) => i !== index));
  };

  interface AddMaintenanceResult {
    errors?: string[];
    [key: string]: any;
  }

  const handleUpdateStatus = async () => {

    const data = new FormData();

    data.append(
      "MaintenanceSchedule",
      JSON.stringify(maintenanceList)
    );


    const result = (await addMaintenance(data)) as AddMaintenanceResult;

    if (result?.errors) {
      setShowErrorModal(result.errors);
    } else {
      setShowSuccessModal(true);
    }

  };

  //Fetching Maintenance Type
  useEffect(() => {
    const fetchMaintenanceType = async () => {
      try {
        const response = await getMaintenanceType();
        setMaintenanceType(response as LookUp[]);
        console.log(response);
      } catch (error) {
        console.error("Failed to fetch vehicle fuel", error);
      }
    };
    fetchMaintenanceType();
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
            <h3 className="card-header text-xl mb-6">
              Add Schedule for {vehCode}
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-1">
              <motion.div
                initial={{ x: -20, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ delay: 0.3 }}
                className="space-y-4 mt-2"
              >
                <h3 className="text-lg font-semibold mb-4">
                  Maintenance Details
                </h3>
                <div className="flex gap-2 mb-4">
                  <select
                    name="ServiceType"
                    value={newItem.ServiceType}
                    onChange={handleScheduleChange}
                    className="border p-2 rounded"
                  >
                    <option value="0">Select type</option>
                    {maintenanceType.map((type) => (
                      <option key={type.id} value={type.id}>
                        {type.name}
                      </option>
                    ))}
                  </select>
                  <input
                    type="text"
                    name="Odometer"
                    value={newItem.Odometer}
                    onChange={handleScheduleChange}
                    className="border p-2 rounded"
                    placeholder="Odometer"
                  />
                  <input
                    type="date"
                    name="ScheduleDate"
                    value={newItem.ScheduleDate}
                    onChange={handleScheduleChange}
                    className="border p-2 rounded"
                  />
                  <button
                    type="button"
                    onClick={handleAddItem}
                    className="bg-purple text-white px-4 py-2 rounded"
                  >
                    Add
                  </button>
                </div>
                {error && (
                  <p className="text-red-500 text-center text-sm mb-2">
                    {error}
                  </p>
                )}
                <table className="w-full border mt-4">
                  <thead>
                    <tr className="bg-gray-100 text-sm">
                      <th className="border p-2 text-left">Type</th>
                      <th className="border p-2 text-center">Odometer</th>
                      <th className="border p-2 text-center">Date</th>
                      <th className="border p-2">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {maintenanceList.map((item, index) => (
                      <tr key={index}>
                        <td className="border p-2 text-left align-middle">
                          {maintenanceType.find(
                            (type) => String(type.id) === item.ServiceType
                          )?.name || "N/A"}
                        </td>
                        <td className="border p-2 text-center align-middle">
                          {item.Odometer}
                        </td>
                        <td className="border p-2 text-center align-middle">
                          {item.ScheduleDate}
                        </td>
                        <td className="border p-2 text-center align-middle">
                          <button
                            onClick={() => handleRemoveItem(index)}
                            className="text-red-600 hover:underline text-center"
                          >
                            <Trash2 size={18} />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
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
                disabled={maintenanceList.length === 0} // disable if no items
                className={`px-6 py-2 mx-auto border rounded-lg
                ${maintenanceList.length === 0
                    ? "bg-gray-200 text-gray-500 border-gray-300 cursor-not-allowed"
                    : "bg-purple-100 text-purple-800 border-purple-800"}`}
                >
                Add Maintenance Schedule
              </button>


            </motion.div>
          </div>
        </motion.div>
      </motion.div>

      {showSuccessModal && (
        <MessageBox
          onClose={() => { }}
          code="green"
          title="Maintenance Added"
          primaryAction={{ label: "View Vehicle", path: "/vehicles/detail/" + vehId }}
          secondaryAction={{ label: "Go to Dashboard", path: "/dashboard" }}
        >
          The schedule has been successfully added.
        </MessageBox>
      )}
    </>
  );
};
export default AddMaintenancePopup;