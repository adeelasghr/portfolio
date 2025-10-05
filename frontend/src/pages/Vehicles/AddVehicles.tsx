import React, { useEffect, useState } from "react";
import {
  Calendar,
  CreditCard,
  CheckCircle2,
  ArrowRight,
  ArrowLeft,
  CodeSquare,
  Car,
  CarFront,
  SquareCode,
  Gauge,
  Fuel,
  Luggage,
  GaugeCircle,
  PianoIcon,
  CarIcon,
  EuroIcon,
  PaintBucket,
  GaugeCircleIcon,
  Upload,
  X,
  Image,
  Trash2,
  OptionIcon,
  MessageSquare,
} from "lucide-react";

import InnerHeader from "../../components/Shared/InnerHeader";
import vehicle from "../../assets/images/vehicle.png";
import {
  addVehicle,
  getModelsByBrandId,
  getNewCode,
  getVehicleBrand,
  getVehicleFuel,
  getVehicleGroup,
  getVehicleTransmission,
  getVehicleTypes,
} from "../../api/vehicleApi";
import { LookUp } from "../../interfaces/Shared";
import { getMaintenanceType } from "../../api/maintenanceApi";
import MessageBox from "../../components/Shared/MessageBox";
import {
  getDamageCategory,
  getDamageLocations,
  getVehicleParts,
} from "../../api/inspectionApi";

interface VehicleStep {
  title: string;
  description: string;
}

const steps: VehicleStep[] = [
  {
    title: "Basic Information",
    description: "Enter basic information",
  },
  {
    title: "Technical Details",
    description: "Put in additional information",
  },
  {
    title: "Maintenance Details",
    description: "Set the maintenance schedule",
  },
  {
    title: "Inspection Report",
    description: "Add inspsection details",
  },
  {
    title: "Confirmation",
    description: "Review and confirm information",
  },
];

type Inspection = {
  image: File | null;
  remarks: string;
  vehiclePart: number;
  damageCategory: number;
  damageLocation: number;
};

const AddVehicle: React.FC = () => {
  const [currentStep, setCurrentStep] = useState(0);
  const [previewUrls, setPreviewUrls] = useState<string[]>([]);
  const [vehicleCode, setVehicleCode] = useState("");
  const [maintenanceList, setMaintenanceList] = useState<MaintenanceItem[]>([]);
  //Dropdowns
  const [vehicleTypes, setVehicleTypes] = useState<LookUp[]>([]);
  const [vehicleGroups, setVehicleGroups] = useState<LookUp[]>([]);
  const [vehicleBrands, setvehicleBrands] = useState<LookUp[]>([]);
  const [vehicleModel, setvehicleModels] = useState<LookUp[]>([]);
  const [vehicleTransmission, setVehicleTransmission] = useState<LookUp[]>([]);
  const [vehicleFuel, setVehicleFuel] = useState<LookUp[]>([]);
  const [maintenanceType, setMaintenanceType] = useState<LookUp[]>([]);
  const [inspectionList, setInspectionList] = useState<Inspection[]>([]);

  //Inspection
  const [vehicleParts, setVehicleParts] = useState<LookUp[]>([]);
  const [damageLocations, setDamageLocations] = useState<LookUp[]>([]);
  const [damageCategory, setDamageCategory] = useState<LookUp[]>([]);

  const [inspectionItem, setInspectionItem] = useState<Inspection>({
    damageCategory: 0,
    damageLocation: 0,
    vehiclePart: 0,
    remarks: "",
    image: null as File | null,
  });

  //Images
  const [imageFiles, setImageFiles] = useState<File[]>([]);

  //Error Handling
  const [error, setError] = useState<string | null>(null);

  //Message Boxes
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [showErrorModal, setShowErrorModal] = useState<string[]>([]);

  const [formData, setFormData] = useState({
    vehicleTypeID: 0,
    brandID: 0,
    groupID: 0,
    vehicleModelID: 0,
    year: "",
    plateNumber: "",
    dailyRate: 0,
    fuelTypeID: 0,
    transmissionID: 0,
    noOfSeats: 0,
    color: "",
    lugguage: "",
    features: "",
    mileage: "",
    showOnWebsite: true,
    MaintenanceSchedule: maintenanceList,
    images: [] as File[],
  });

  const [newItem, setNewItem] = useState<MaintenanceItem>({
    ServiceType: "",
    Odometer: "",
    ScheduleDate: "",
    ServiceName: "",
    Status: "",
  });

  const handleRemoveInspection = (index: number) => {
    setInspectionList((prev) => prev.filter((_, i) => i !== index));
  };

  // Updating Maintenance List
  useEffect(() => {
    setFormData((prev) => ({
      ...prev,
      MaintenanceSchedule: maintenanceList,
    }));
  }, [maintenanceList]);

  //Fetching Vehicle Code
  useEffect(() => {
    const fetchVehicleCode = async () => {
      try {
        const code = await getNewCode();
        setVehicleCode(code as string);
      } catch (error) {
        console.error("Failed to get vehicle code:", error);
      }
    };

    fetchVehicleCode();
  }, []);

  //Fetching Vehicle Types
  useEffect(() => {
    const fetchVehicleTypes = async () => {
      try {
        const response = await getVehicleTypes();
        setVehicleTypes(response as LookUp[]);
        console.log(response);
      } catch (error) {
        console.error("Failed to fetch vehicle types", error);
      }
    };
    fetchVehicleTypes();
  }, []);

  //Fetching Vehicle Brand
  useEffect(() => {
    const fetchVehicleBrands = async () => {
      try {
        const response = await getVehicleBrand();
        setvehicleBrands(response as LookUp[]);
        console.log(response);
      } catch (error) {
        console.error("Failed to fetch vehicle brand", error);
      }
    };
    fetchVehicleBrands();
  }, []);

  //Fetching Vehicle Model
  useEffect(() => {
    if (formData.brandID) {
      const fetchModels = async () => {
        const res = await getModelsByBrandId(formData.brandID);
        setvehicleModels(res as LookUp[]);
      };
      fetchModels();
    } else {
      setvehicleModels([]); // Clear if brand is not selected
    }
  }, [formData.brandID]);

  //Fetching Vehicle Transmissions
  useEffect(() => {
    const fetchVehicleTransmission = async () => {
      try {
        const response = await getVehicleTransmission();
        setVehicleTransmission(response as LookUp[]);
        console.log(response);
      } catch (error) {
        console.error("Failed to fetch vehicle transmission", error);
      }
    };
    fetchVehicleTransmission();
  }, []);

  //Fetching Vehicle Fuel
  useEffect(() => {
    const fetchVehicleFuel = async () => {
      try {
        const response = await getVehicleFuel();
        setVehicleFuel(response as LookUp[]);
        console.log(response);
      } catch (error) {
        console.error("Failed to fetch vehicle fuel", error);
      }
    };
    fetchVehicleFuel();
  }, []);

  //Fetching Vehicle Groups
  useEffect(() => {
    const fetchVehicleGroup = async () => {
      try {
        const response = await getVehicleGroup();
        setVehicleGroups(response as LookUp[]);
        console.log(response);
      } catch (error) {
        console.error("Failed to fetch vehicle group", error);
      }
    };
    fetchVehicleGroup();
  }, []);

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

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // Maintenance Section
  type MaintenanceItem = {
    ServiceType: string;
    ServiceName: string;
    Odometer: string;
    ScheduleDate: string;
    Status: string;
  };

  const handleAddInspection = () => {
    if (
      !inspectionItem.damageCategory ||
      !inspectionItem.damageLocation ||
      !inspectionItem.remarks ||
      !inspectionItem.image ||
      !inspectionItem.vehiclePart
    ) {
      alert("Please fill required fields");
      return;
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
  // Wizard
  const nextStep = () => {
    const form = document.getElementById("vehicleForm") as HTMLFormElement;
    if (form && form.checkValidity()) {
      setCurrentStep((prev) => Math.min(prev + 1, steps.length - 1));
    } else {
      form?.reportValidity();
    }
  };
  const prevStep = () => {
    setCurrentStep((prev) => Math.max(prev - 1, 0));
  };
  const renderBasicInfo = () => (
    <div className="mb-6">
      <div className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Vehicle Code
            </label>
            <div className="relative">
              <CodeSquare
                className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                size={18}
              />
              <input
                type="text"
                name="fullName"
                value={vehicleCode}
                onChange={handleInputChange}
                className="pl-10 w-full p-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Enter your full name"
              />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Type
            </label>
            <div className="relative">
              <CarFront
                className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                size={18}
              />
              <select
                required
                name="vehicleTypeID"
                value={formData.vehicleTypeID}
                onChange={handleInputChange}
                className="pl-10 w-full p-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="">Select type</option>
                {vehicleTypes.map((type) => (
                  <option key={type.id} value={type.id}>
                    {type.name}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Group
            </label>
            <div className="relative">
              <Car
                className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                size={18}
              />
              <select
                required
                name="groupID"
                value={formData.groupID}
                onChange={handleInputChange}
                className="pl-10 w-full p-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="">Select group</option>
                {vehicleGroups.map((type) => (
                  <option key={type.id} value={type.id}>
                    {type.name}
                  </option>
                ))}
              </select>
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Brand
            </label>
            <div className="relative">
              <Car
                className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                size={18}
              />
              <select
                required
                name="brandID"
                value={formData.brandID}
                onChange={handleInputChange}
                className="pl-10 w-full p-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="">Select brand</option>
                {vehicleBrands.map((type) => (
                  <option key={type.id} value={type.id}>
                    {type.name}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Model
            </label>
            <div className="relative">
              <Car
                className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                size={18}
              />
              <select
                required
                name="vehicleModelID"
                value={formData.vehicleModelID}
                onChange={handleInputChange}
                className="pl-10 w-full p-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="">Select Model</option>
                {vehicleModel.map((type) => (
                  <option key={type.id} value={type.id}>
                    {type.name}
                  </option>
                ))}
              </select>
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Plate Number
            </label>
            <div className="relative">
              <SquareCode
                className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                size={18}
              />
              <input
                required
                type="text"
                name="plateNumber"
                value={formData.plateNumber}
                onChange={handleInputChange}
                className="pl-10 w-full p-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Enter plate number"
              />
            </div>
          </div>
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Year
            </label>
            <div className="relative">
              <Calendar
                className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                size={18}
              />
              <input
                required
                type="text"
                name="year"
                value={formData.year}
                onChange={handleInputChange}
                className="pl-10 w-full p-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Enter vehicle year"
              />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Daily Rate
            </label>
            <div className="relative">
              <EuroIcon
                className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                size={18}
              />
              <input
                required
                type="number"
                name="dailyRate"
                value={formData.dailyRate}
                onChange={handleInputChange}
                className="pl-10 w-full p-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Enter daily rate"
              />
            </div>
          </div>
        </div>
        <div className="flex flex-col gap-1">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Show on Website
          </label>

          <div className="relative inline-block w-12 mr-2 align-middle select-none transition duration-200 ease-in">
            <input
              type="checkbox"
              name="showOnWebsite"
              id="toggleShowOnWebsite"
              checked={formData.showOnWebsite}
              onChange={() =>
                setFormData((prev) => ({
                  ...prev,
                  showOnWebsite: !prev.showOnWebsite,
                }))
              }
              className="toggle-checkbox absolute block w-4 h-4 rounded-full bg-white border-4 appearance-none cursor-pointer"
            />
            <label
              htmlFor="toggleShowOnWebsite"
              className="toggle-label block overflow-hidden h-6 rounded-full bg-gray-300 cursor-pointer"
            ></label>
          </div>

          {/* <span className="align-middle">
            {formData.showOnWebsite ? "Yes" : "No"}
          </span> */}
        </div>
      </div>
    </div>
  );
  const renderMaintenanceDetails = () => (
    <>
      <h3 className="text-lg font-semibold mb-4">Maintenance Schedule</h3>
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
        <p className="text-red-500 text-center text-sm mb-2">{error}</p>
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
    </>
  );
  const renderTechnicalInfo = () => (
    <div className="mb-6">
      <div className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Transmission
            </label>
            <div className="relative">
              <Gauge
                className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                size={18}
              />
              <select
                required
                name="transmissionID"
                value={formData.transmissionID}
                onChange={handleInputChange}
                className="pl-10 w-full p-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="">Select transmission</option>
                {vehicleTransmission.map((type) => (
                  <option key={type.id} value={type.id}>
                    {type.name}
                  </option>
                ))}
              </select>
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Fuel Type
            </label>
            <div className="relative">
              <Fuel
                className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                size={18}
              />
              <select
                required
                name="fuelTypeID"
                value={formData.fuelTypeID}
                onChange={handleInputChange}
                className="pl-10 w-full p-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="">Select Fuel</option>
                {vehicleFuel.map((type) => (
                  <option key={type.id} value={type.id}>
                    {type.name}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              No. Of Seats
            </label>
            <div className="relative">
              <CarIcon
                className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                size={18}
              />
              <input
                required
                type="text"
                name="noOfSeats"
                value={formData.noOfSeats}
                onChange={handleInputChange}
                className="pl-10 w-full p-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Enter no. of seats"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Color
            </label>
            <div className="relative">
              <PianoIcon
                className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                size={18}
              />
              <input
                required
                type="text"
                name="color"
                value={formData.color}
                onChange={handleInputChange}
                className="pl-10 w-full p-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Enter vehicle color"
              />
            </div>
          </div>
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Mileage
            </label>
            <div className="relative">
              <GaugeCircle
                className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                size={18}
              />
              <input
                required
                type="number"
                name="mileage"
                value={formData.mileage}
                onChange={handleInputChange}
                className="pl-10 w-full p-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Enter vehicle mileage"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Lugguage
            </label>
            <div className="relative">
              <Luggage
                className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                size={18}
              />
              <input
                required
                type="number"
                name="lugguage"
                value={formData.lugguage}
                onChange={handleInputChange}
                className="pl-10 w-full p-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Enter lugguage quantity"
              />
            </div>
          </div>
        </div>
        <div className="grid grid-cols-1 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Features
            </label>
            <div className="relative">
              <OptionIcon
                className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                size={18}
              />
              <input
                required
                type="text"
                name="features"
                value={formData.features}
                onChange={handleInputChange}
                className="pl-10 w-full p-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Enter vehicle features"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
  const renderConfirmation = () => (
    <div className="space-y-4">
      <div className="">
        <div className="flex items-center space-x-2">
          <CheckCircle2 className="text-purple" size={20} />
          <h3 className="text-lg font-semibold text-purple">Vehicle Details</h3>
        </div>

        <div className="mt-2 space-y-3">
          <div className="flex justify-between py-2 border-b">
            <span className="text-gray-600">
              Please make sure to confirm the vehicle details before submitting.
              You can go back to change the details anytime.
            </span>
          </div>
        </div>
        <div className="grid grid-cols-2 gap-4 mt-6">
          {/* Left column with details */}
          <div className="flex-1 space-y-6">
            {/* Vehicle Details */}
            <div className="space-y-3 p-4">
              <div className="flex items-center space-x-3">
                <CodeSquare className="text-blue-500" size={20} />
                <span>Code:</span>
                <span className="font-medium">{vehicleCode}</span>
              </div>
              <div className="flex items-center space-x-3">
                <Car className="text-blue-500" size={20} />
                <span>Type</span>
                <span className="font-medium">
                  {vehicleTypes.find(
                    (type) =>
                      type.id.toString() === formData.vehicleTypeID.toString()
                  )?.name || "N/A"}
                </span>
              </div>
              <div className="flex items-center space-x-3">
                <CarFront className="text-blue-500" size={20} />
                <span>Brand/Model</span>
                <span className="font-medium">
                  {vehicleBrands.find(
                    (type) => type.id.toString() === formData.brandID.toString()
                  )?.name || "N/A"}{" "}
                  {vehicleModel.find(
                    (type) =>
                      type.id.toString() === formData.vehicleModelID.toString()
                  )?.name || "N/A"}
                </span>
              </div>
              <div className="flex items-center space-x-3">
                <Calendar className="text-blue-500" size={20} />
                <span>Year</span>
                <span className="font-medium">{formData.year}</span>
              </div>
              <div className="flex items-center space-x-3">
                <CodeSquare className="text-blue-500" size={20} />
                <span>Plate Number</span>
                <span className="font-medium">{formData.plateNumber}</span>
              </div>
              <div className="flex items-center space-x-3">
                <CreditCard className="text-blue-500" size={20} />
                <span>Rate</span>
                <span className="font-medium"> €{formData.dailyRate} /day</span>
              </div>
            </div>
          </div>

          {/* Right column with QR code and payment */}
          <div className="md:w-64 space-y-6">
            <div className="space-y-3 p-4">
              <div className="flex items-center space-x-3">
                <Gauge className="text-blue-500" size={20} />
                <span>Fuel Type</span>
                <span className="font-medium">
                  {vehicleFuel.find(
                    (type) =>
                      type.id.toString() === formData.fuelTypeID.toString()
                  )?.name || "N/A"}
                </span>
              </div>
              <div className="flex items-center space-x-3">
                <Fuel className="text-blue-500" size={20} />
                <span>Transmission:</span>
                <span className="font-medium">
                  {vehicleTransmission.find(
                    (type) =>
                      type.id.toString() === formData.transmissionID.toString()
                  )?.name || "N/A"}
                </span>
              </div>
              <div className="flex items-center space-x-3">
                <Car className="text-blue-500" size={20} />
                <span>No. Of Seats</span>
                <span className="font-medium">{formData.noOfSeats}</span>
              </div>
              <div className="flex items-center space-x-3">
                <PaintBucket className="text-blue-500" size={20} />
                <span>Color</span>
                <span className="font-medium">{formData.color}</span>
              </div>
              <div className="flex items-center space-x-3">
                <GaugeCircleIcon className="text-blue-500" size={20} />
                <span>Mileage</span>
                <span className="font-medium">{formData.mileage}</span>
              </div>
              <div className="flex items-center space-x-3">
                <Luggage className="text-blue-500" size={20} />
                <span>Lugguage Capacity:</span>
                <span className="font-medium">{formData.lugguage}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
  const renderInspection = () => (
    <>
      {" "}
      <h3 className="text-lg font-semibold mb-4">Inspection Report</h3>
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
                Add Image
              </button>
            </div>
          </div>
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
    </>
  );
  const renderStepContent = () => {
    switch (currentStep) {
      case 0:
        return renderBasicInfo();
      case 1:
        return renderTechnicalInfo();
      case 2:
        return renderMaintenanceDetails();
      case 3:
        return renderInspection();
      case 4:
        return renderConfirmation();
      default:
        return null;
    }
  };

  // Images
  const removeImage = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      images: prev.images.filter((_, i) => i !== index),
    }));

    // Revoke the URL to prevent memory leaks
    URL.revokeObjectURL(previewUrls[index]);
    setPreviewUrls((prev) => prev.filter((_, i) => i !== index));
  };
  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (files.length > 0) {
      setFormData((prev) => ({ ...prev, images: [...prev.images, ...files] }));

      // Create preview URLs
      const newPreviewUrls = files.map((file) => URL.createObjectURL(file));
      setPreviewUrls((prev) => [...prev, ...newPreviewUrls]);
    }
  };

  const handleCloseModal = () => {
    //Closing all Message Boxes
    setShowErrorModal([]);
    setShowSuccessModal(false);
  };

  interface AddVehicleResult {
    errors?: string[];
    [key: string]: any;
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const data = new FormData();

    // Append scalar values
    data.append("PlateNumber", formData.plateNumber);
    data.append("Year", formData.year.toString());
    data.append("DailyRate", formData.dailyRate.toString());
    data.append("AC", "true");
    data.append("NoOfSeats", formData.noOfSeats.toString());
    data.append("Color", formData.color);
    data.append("Mileage", formData.mileage.toString());
    data.append("Luggage", formData.lugguage.toString());
    data.append("Features", formData.features);
    data.append("ShowOnWebsite", formData.showOnWebsite.toString());
    data.append("VehicleTypeID", formData.vehicleTypeID.toString());
    data.append("BrandID", formData.brandID.toString());
    data.append("GroupID", formData.groupID.toString());
    data.append("VehicleModelID", formData.vehicleModelID.toString());
    data.append("TransmissionID", formData.transmissionID.toString());
    data.append("FuelTypeID", formData.fuelTypeID.toString());

    // Append image files
    formData.images.forEach((file) => {
      data.append("VehicleImages", file);
    });

    // Append maintenance schedule as a JSON string
    data.append(
      "MaintenanceSchedule",
      JSON.stringify(formData.MaintenanceSchedule)
    );

    // Step 6: Inspection
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
      data.append(`Inspection[${i}].VehicleID`, String(0));
      data.append(`Inspection[${i}].Remarks`, ins.remarks ?? "");
      if (ins.image instanceof File) {
        data.append(`Inspection[${i}].Image`, ins.image); // binds to IFormFile Image
      }
    });

    const result = (await addVehicle(data)) as AddVehicleResult;

    if (result?.errors) {
      setShowErrorModal(result.errors);
    } else {
      setShowSuccessModal(true);
    }
  };

  return (
    <>
      <div className="flex-1 overflow-y-auto p-4 bg-gray-100 main-bg">
        <div className="grid grid-cols-1 md:grid-cols-1 lg:grid-cols-1">
          <InnerHeader
            title="Add New Vehicle"
            breadcrum="Vehicle ➞ New Vehicle"
            icon={vehicle}
          />
        </div>

        <div className="max-w-full">
          <div className="grid grid-cols-1 lg:grid-cols-10 gap-2">
            {/* Left Side Navigation */}
            <div
              className="lg:col-span-2 rounded-lg shadow card p-2"
              style={{ minHeight: "70vh" }}
            >
              {steps.map((step, index) => (
                <div
                  key={step.title}
                  className={`
                  mb-4 p-3 cursor-pointer transition-all
                  ${
                    index === currentStep
                      ? "bg-blue-50 border-l-4 border-purple bg-gray-50"
                      : "hover:bg-gray-50"
                  }
                `}
                  onClick={() => setCurrentStep(index)}
                >
                  <div className="flex items-center">
                    <div
                      className={`
                    w-6 h-6 rounded-full flex items-center justify-center text-sm
                    ${
                      index <= currentStep
                        ? "bg-purple text-white"
                        : "bg-gray-200 text-gray-600"
                    }
                  `}
                    >
                      {index + 1}
                    </div>
                    <div className="ml-3">
                      <div className="font-medium text-gray-900">
                        {step.title}
                      </div>
                      <div className="text-xs text-gray-500">
                        {step.description}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Main Content */}
            <div
              className="lg:col-span-5 rounded-lg  card p-2"
              style={{ minHeight: "70vh" }}
            >
              <div
                className="rounded-lg shadow-lg p-6"
                style={{ minHeight: "70vh" }}
              >
                <div className="mb-6">
                  <form id="vehicleForm">{renderStepContent()}</form>
                </div>

                {/* Navigation Buttons */}
                <div className="flex justify-between mt-6 stick-to-bottom">
                  <button
                    onClick={prevStep}
                    className={`
                    flex items-center px-4 py-2 rounded-lg text-sm
                    ${
                      currentStep === 0
                        ? "opacity-50 cursor-not-allowed bg-gray-100 text-gray-400"
                        : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                    }
                  `}
                    disabled={currentStep === 0}
                  >
                    <ArrowLeft size={16} className="mr-2" />
                    Previous
                  </button>

                  <button
                    style={{ float: "right", marginRight: "70px" }}
                    onClick={(e) => {
                      e.preventDefault();

                      if (currentStep === steps.length - 1) {
                        const form = document.getElementById(
                          "vehicleForm"
                        ) as HTMLFormElement;
                        if (form?.checkValidity()) {
                          handleSubmit(e);
                        } else {
                          form?.reportValidity();
                        }
                      } else {
                        nextStep();
                      }
                    }}
                    className="btn-primary flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 text-sm"
                  >
                    {currentStep === steps.length - 1 ? "Add Vehicle" : "Next"}
                    {currentStep !== steps.length - 1 && (
                      <ArrowRight
                        size={16}
                        className="ml-2"
                        style={{ float: "right", marginTop: "2px" }}
                      />
                    )}
                  </button>
                </div>
              </div>
            </div>

            {/* Document Upload */}
            <div className="lg:col-span-3 float-right bg-white rounded-lg shadow card p-6">
              <div className="flex justify-between items-center mb-2 mt-2">
                <h3 className="w-full card-header text-xl">
                  <Image
                    size={20}
                    className="ml-2 mr-2 text-purple"
                    style={{ float: "left", marginTop: "2px" }}
                  />
                  Vehicle Images
                </h3>
              </div>

              <div className="col-span-full">
                <div className="grid grid-cols-2 md:grid-cols-2 gap-4 mb-4">
                  {previewUrls.map((url, index) => (
                    <div key={index} className="relative group">
                      <img
                        src={url}
                        alt={`Vehicle preview ${index + 1}`}
                        className="w-full h-32 object-cover rounded-lg"
                      />
                      <button
                        type="button"
                        onClick={() => removeImage(index)}
                        className="absolute top-2 right-2 p-1 bg-red-500 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        <X size={16} />
                      </button>
                    </div>
                  ))}
                </div>

                <div className="flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-lg">
                  <div className="space-y-1 text-center">
                    <Upload className="mx-auto h-12 w-12 text-gray-400" />
                    <div className="flex text-sm text-gray-600">
                      <label className="mx-auto relative cursor-pointer rounded-md font-medium text-purple-600">
                        <span className="mx-auto">Upload images</span>
                        <input
                          type="file"
                          multiple
                          accept="image/*"
                          onChange={handleImageUpload}
                          className="sr-only"
                        />
                      </label>
                    </div>
                    <p className="text-xs text-gray-500">
                      PNG, JPG, GIF up to 10MB
                    </p>
                  </div>
                </div>
                <div className="w-full text-sm text-center mt-2">
                  Upload pictures for vehicle here, <br />
                  you can upload multiple pictures
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {showSuccessModal && (
        <MessageBox
          onClose={handleCloseModal}
          code="green"
          title="Vehicle Added"
          primaryAction={{ label: "View Vehicles", path: "/vehicles/list" }}
          secondaryAction={{ label: "Go to Dashboard", path: "/dashboard" }}
        >
          The vehicle has been successfully added.
        </MessageBox>
      )}

      {showErrorModal.length > 0 && (
        <MessageBox
          onClose={handleCloseModal}
          code="red"
          title="Something went wrong!"
          primaryAction={{ label: "Go Back", path: "" }}
          secondaryAction={{ label: "", path: "" }}
        >
          <p className="pb-6">Fix the following errors, and try again.</p>
          <div className="bg-red-100 text-red-800 p-4 text-left rounded-md mb-4">
            <ul className="list-disc list-inside">
              {showErrorModal.map((err, idx) => (
                <li key={idx}>{err}</li>
              ))}
            </ul>
          </div>
        </MessageBox>
      )}
    </>
  );
};

export default AddVehicle;
