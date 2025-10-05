import { motion } from "framer-motion";
import {
  X,
  Code,
  Check,
  User2,
  Car,
  Calendar,
  Trash2,
  MessageSquare,
} from "lucide-react";
import { useEffect, useState } from "react";
import MessageBox from "../Shared/MessageBox";
import { updateBookingStatus } from "../../api/bookingApi";
import { BookingsBrief } from "../../interfaces/Booking";
import { LookUp } from "../../interfaces/Shared";
import {
  getDamageCategory,
  getDamageLocations,
  getVehicleParts,
} from "../../api/inspectionApi";
import { addInspection } from "../../api/maintenanceApi";

interface PopupProps {
  vehicleID: number;
  vehicleCode: string;
  onClose: () => void;
}

const AddInspectionPopup: React.FC<PopupProps> = ({
  vehicleID: vehId,
  vehicleCode: vehCode,
  onClose,
}) => {

  //Error Handling
  const [error, setError] = useState<string | null>(null);

  //Success & Error Modal
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [showErrorModal, setShowErrorModal] = useState<string[]>([]);

  //Inspection

  type Inspection = {
    image: File | null;
    remarks: string;
    vehiclePart: number;
    damageCategory: number;
    damageLocation: number;
  };

  const [vehicleParts, setVehicleParts] = useState<LookUp[]>([]);
  const [damageLocations, setDamageLocations] = useState<LookUp[]>([]);
  const [damageCategory, setDamageCategory] = useState<LookUp[]>([]);
  const [inspectionList, setInspectionList] = useState<Inspection[]>([]);

  const [inspectionItem, setInspectionItem] = useState<Inspection>({
    damageCategory: 0,
    damageLocation: 0,
    vehiclePart: 0,
    remarks: "",
    image: null as File | null,
  });

  const handleAddInspection = () => {
    if (
      !inspectionItem.damageCategory ||
      !inspectionItem.damageLocation ||
      !inspectionItem.remarks ||
      !inspectionItem.image ||
      !inspectionItem.vehiclePart
    ) {
      setError("Please fill required fields");
      return;
    }
    else {
      setError(null);
    }

    setInspectionList((prev) => [...prev, inspectionItem]);
    setInspectionItem({
      damageCategory: 0,
      damageLocation: 0,
      vehiclePart: 0,
      remarks: "",
      image: null,
    });
  };

  const handleInspectionChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value, files } = e.target as HTMLInputElement;

    if (files && files.length > 0) {
      setInspectionItem((prev) => ({
        ...prev,
        image: files[0], // store the actual File object
      }));
    } else {
      setInspectionItem((prev) => ({
        ...prev,
        [name]: value,
      }));
    }
  };

  interface AddInspectionResult {
    errors?: string[];
    [key: string]: any;
  }

  const handleInspectionAdd = () => {

    const data = new FormData();

    (inspectionList ?? []).forEach((ins: any, i: number) => {
      data.append(
        `Inspection[${i}].DamageCategory`,
        String(ins.damageCategory ?? 0)
      );
      data.append(
        `Inspection[${i}].DamageLocation`,
        String(ins.damageLocation ?? 0)
      );
      data.append(`Inspection[${i}].VehiclePart`, String(ins.vehiclePart ?? 0));
      data.append(`Inspection[${i}].VehicleID`, vehId.toString());
      data.append(`Inspection[${i}].Remarks`, ins.remarks ?? "");
      if (ins.image instanceof File) {
        data.append(`Inspection[${i}].Image`, ins.image); 
      }
    });

    const result = addInspection(data) as AddInspectionResult;

    if (result?.errors) {
      setShowErrorModal(result.errors);
    } else {
      setShowSuccessModal(true);
    }
  };

  const handleRemoveInspection = (index: number) => {
    setInspectionList((prev) => prev.filter((_, i) => i !== index));
  };

  //Fetching Vehicle Parts
  useEffect(() => {
    const fetchVehicleParts = async () => {
      try {
        const response = await getVehicleParts();
        setVehicleParts(response as LookUp[]);
      } catch (error) {
        console.error("Failed to fetch Vehicle Parts", error);
      }
    };
    fetchVehicleParts();
  }, []);

  //Fetching Damage Category
  useEffect(() => {
    const fetchDamageCategory = async () => {
      try {
        const response = await getDamageCategory();
        setDamageCategory(response as LookUp[]);
        console.log(response);
      } catch (error) {
        console.error("Failed to fetch Damage Categories", error);
      }
    };
    fetchDamageCategory();
  }, []);

  //Fetching Damage Location
  useEffect(() => {
    const fetchDamageLocation = async () => {
      try {
        const response = await getDamageLocations();
        setDamageLocations(response as LookUp[]);
        console.log(response);
      } catch (error) {
        console.error("Failed to fetch Damage Location", error);
      }
    };
    fetchDamageLocation();
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
          className="bg-white rounded-xl overflow-hidden shadow-2xl popup-bg w-[700px] max-w-full"
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
              Add Inspection for {vehCode}
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-1">
              <motion.div
                initial={{ x: -20, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ delay: 0.3 }}
                className="space-y-4 mt-2"
              >
                <h3 className="text-lg font-semibold mb-4">
                  Inspection Report
                </h3>
                <div className="space-y-6">
                  <div className="space-y-4">
                    <div className="grid grid-cols-4 gap-4 mt-2">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Damage Category
                        </label>
                        <div className="relative">
                          <Car
                            className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                            size={18}
                          />
                          <select
                            name="damageCategory"
                            value={inspectionItem.damageCategory}
                            onChange={handleInspectionChange}
                            className="pl-10 w-full p-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          >
                            <option value="">Select category</option>
                            {damageCategory.map((type) => (
                              <option key={type.id} value={type.id}>
                                {type.name}
                              </option>
                            ))}
                          </select>
                        </div>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Damage Location
                        </label>
                        <div className="relative">
                          <Car
                            className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                            size={18}
                          />
                          <select
                            name="damageLocation"
                            value={inspectionItem.damageLocation}
                            onChange={handleInspectionChange}
                            className="pl-10 w-full p-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          >
                            <option value="">Select location</option>
                            {damageLocations.map((type) => (
                              <option key={type.id} value={type.id}>
                                {type.name}
                              </option>
                            ))}
                          </select>
                        </div>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Vehicle Part
                        </label>
                        <div className="relative">
                          <Car
                            className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                            size={18}
                          />
                          <select
                            name="vehiclePart"
                            value={inspectionItem.vehiclePart}
                            onChange={handleInspectionChange}
                            className="pl-10 w-full p-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          >
                            <option value="">Select group</option>
                            {vehicleParts.map((type) => (
                              <option key={type.id} value={type.id}>
                                {type.name}
                              </option>
                            ))}
                          </select>
                        </div>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Image
                        </label>
                        <div className="relative">
                          <input
                            type="file"
                            id="city"
                            name="city"
                            value=""
                            onChange={handleInspectionChange}
                            placeholder="Enter Cost"
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                          />
                        </div>
                      </div>
                    </div>
                    <div className="grid grid-cols-4 gap-4 mt-4">
                      {/* Remarks Input - 3/4 width */}
                      <div className="col-span-3">
                        <div className="relative">
                          <MessageSquare
                            className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                            size={18}
                          />
                          <input
                            name="remarks"
                            type="text"
                            placeholder="Enter remarks"
                            value={inspectionItem.remarks}
                            onChange={handleInspectionChange}
                            className="pl-10 w-full p-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          />
                        </div>
                      </div>

                      {/* Button - 1/4 width */}
                      <div className="col-span-1 flex justify-end items-center">
                        <button
                          type="button"
                          onClick={handleAddInspection}
                          className="w-full text-sm bg-purple text-white px-4 py-2 rounded"
                        >
                          Add Report
                        </button>
                      </div>
                    </div>
                    {error && (
                      <p className="text-red-500 text-center text-sm mb-2">{error}</p>
                    )}
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 mt-6">
                  {inspectionList.map((item, idx) => (
                    <div key={idx} className="border text-sm rounded-lg p-4 shadow-sm">
                      <p>
                        <button
                          type="button"
                          onClick={() => handleRemoveInspection(idx)}
                          className="float-right top-2 right-2 text-red-500 hover:text-red-600"
                        >
                          ✖
                        </button>
                        {damageCategory
                          .find((cat) => cat.id === Number(item.damageCategory))
                          ?.name.slice(0, 2) || item.damageCategory}{" "}
                        -{" "}
                        {damageLocations.find(
                          (loc) => loc.id === Number(item.damageLocation)
                        )?.name || item.damageLocation}{" "}
                        -{" "}
                        {vehicleParts.find((part) => part.id === Number(item.vehiclePart))
                          ?.name || item.vehiclePart}
                      </p>
                      <p>{item.remarks}</p>
                      {item.image && (
                        <img
                          src={
                            item.image instanceof File
                              ? URL.createObjectURL(item.image)
                              : item.image
                          }
                          alt="Damage"
                          className="w-full h-32 object-cover mt-2 rounded"
                        />
                      )}
                    </div>
                  ))}
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
                onClick={() => handleInspectionAdd()}
                disabled={inspectionList.length === 0} 
                className={`px-6 py-2 mx-auto border rounded-lg
                ${inspectionList.length === 0
                    ? "bg-gray-200 text-gray-500 border-gray-300 cursor-not-allowed"
                    : "bg-purple-100 text-purple-800 border-purple-800"}`}
                >
                Add Inspection Report
              </button>

            </motion.div>
          </div>
        </motion.div>
      </motion.div>

      {showSuccessModal && (
        <MessageBox
          onClose={() => { }}
          code="green"
          title="Report Added"
          primaryAction={{ label: "View Vehicle", path: "/vehicles/detail/" + vehId }}
          secondaryAction={{ label: "Go to Dashboard", path: "/dashboard" }}
        >
          The inspection report has been added successfully
        </MessageBox>
      )}
    </>
  );
};
export default AddInspectionPopup;
