import React, { useEffect, useState } from "react";
import { updateCustomer } from "../../api/customerApi";

import {
  Upload,
  X,
  Image,
  Calendar,
  Car,
  CarFront,
  CodeSquare,
  EuroIcon,
  SquareCode,
  Gauge,
  Fuel,
  CarIcon,
  PianoIcon,
  GaugeCircle,
  Luggage,
} from "lucide-react";
import customerIcon from "../../assets/images/customer.png";
import InnerHeader from "../../components/Shared/InnerHeader";
import { useParams } from "react-router-dom";
import { formatDateForInput } from "../../utils/dateFormatter";
import MessageBox from "../../components/Shared/MessageBox";
import {
  getEditVehicleDetails,
  getModelsByBrandId,
  getVehicleBrand,
  getVehicleFuel,
  getVehicleTransmission,
  getVehicleTypes,
  updateVehicle,
} from "../../api/vehicleApi";
import { LookUp } from "../../interfaces/Shared";
import { EditVehicleDetails, Vehicle } from "../../interfaces/Vehicle";
import { code } from "framer-motion/client";

const EditVehicle: React.FC = () => {
  //State Variables
  const [previewUrls, setPreviewUrls] = useState<string[]>([]);
  const { id } = useParams();

  //Message Boxes
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [showErrorModal, setShowErrorModal] = useState<string[]>([]);

  //Dropdowns
  const [vehicleCode, setVehicleCode] = useState<string | null>(null);
  const [vehicleTypes, setVehicleTypes] = useState<LookUp[]>([]);
  const [vehicleBrands, setvehicleBrands] = useState<LookUp[]>([]);
  const [vehicleModel, setvehicleModels] = useState<LookUp[]>([]);
  const [vehicleTransmission, setVehicleTransmission] = useState<LookUp[]>([]);
  const [vehicleFuel, setVehicleFuel] = useState<LookUp[]>([]);
  const [error, setError] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    id: "",
    plateNumber: "",
    year: "",
    dailyRate: "",
    ac: "",
    noOfSeats: 0,
    color: "",
    mileage: "",
    luggage: "",
    insurance: "string",
    showOnWebsite: 0,
    vehicleTypeID: 0,
    brandID: 0,
    vehicleModelID: 0,
    transmissionID: 0,
    fuelTypeID: 0,
  });

  interface AddVehicleResult {
    errors?: string[];
    [key: string]: any;
  }

  const handleCloseModal = () => {
    //Closing all Message Boxes
    setShowErrorModal([]);
    setShowSuccessModal(false);
  };

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
    
  // const removeImage = (index: number) => {
  //   setFormData((prev) => ({
  //     ...prev,
  //     images: prev.documents.filter((_, i) => i !== index),
  //   }));

  //   // Revoke the URL to prevent memory leaks
  //   URL.revokeObjectURL(previewUrls[index]);
  //   setPreviewUrls((prev) => prev.filter((_, i) => i !== index));
  // };

  // const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
  //   const files = Array.from(e.target.files || []);
  //   if (files.length > 0) {
  //     setFormData((prev) => ({
  //       ...prev,
  //       images: [...prev.documents, ...files],
  //     }));

  //     // Create preview URLs
  //     const newPreviewUrls = files.map((file) => URL.createObjectURL(file));
  //     setPreviewUrls((prev) => [...prev, ...newPreviewUrls]);
  //   }
  // };

  
  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  useEffect(() => {
  const loadData = async () => {
    try {
      const [vehicle, types, brands, transmission, fuel] = await Promise.all([
        getEditVehicleDetails(id) as Promise<EditVehicleDetails>,      // Get vehicle details
        getVehicleTypes(),             // Get vehicle types
        getVehicleBrand(),             // Get vehicle brands
        getVehicleTransmission(),      // Get Fuel Types
        getVehicleFuel(),              // Get Fuel Types
      ]);

        const models = await getModelsByBrandId(vehicle.brandID);
        setVehicleCode(vehicle.vehicleCode);
        setvehicleModels(models as LookUp[]);
        setVehicleTypes(types as LookUp[]);
        setvehicleBrands(brands as LookUp[]);
        setVehicleTransmission(transmission as LookUp[]);
        setVehicleFuel(fuel as LookUp[]);

        console.log(vehicle);

    setFormData((prev) => ({
        ...prev,
        ...vehicle,
      }));
    } catch (error) {
      console.error("Failed to load edit vehicle data:", error);
    }
  };

  loadData();
}, [id]);


  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    formData.id = id ?? "";
    console.log(formData);
    const result = (await updateVehicle(formData)) as AddVehicleResult;

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
            title="Edit Vehicle"
            breadcrum="Vehicle ➞ Edit"
            icon={customerIcon}
          />
        </div>

        <div className="max-w-full">
          <div className="grid grid-cols-1 lg:grid-cols-7 gap-2">
            {/* Left Side Navigation */}
            {/* Main Content */}
            <div
              className="lg:col-span-5 rounded-lg  card p-6"
              style={{ minHeight: "70vh" }}
            >
              <form onSubmit={handleSubmit}>
                <div className="flex justify-between items-center">
                  <h4 className="w-full card-header text-l">
                    Basic Information
                  </h4>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">

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
                          value={vehicleCode? vehicleCode : ""}
                          onChange={handleChange}
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
                          onChange={handleChange}
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
                          onChange={handleChange}
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
                          onChange={handleChange}
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
                          onChange={handleChange}
                          className="pl-10 w-full p-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          placeholder="Enter vehicle year"
                        />
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
                          onChange={handleChange}
                          className="pl-10 w-full p-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          placeholder="Enter plate number"
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
                          onChange={handleChange}
                          className="pl-10 w-full p-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          placeholder="Enter daily rate"
                        />
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
                <div className="flex justify-between items-center">
                  <h4 className="w-full card-header text-l mt-6">
                    Technical Details
                  </h4>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
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
                          onChange={handleChange}
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
                          onChange={handleChange}
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
                          onChange={handleChange}
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
                          onChange={handleChange}
                          className="pl-10 w-full p-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          placeholder="Enter vehicle color"
                        />
                      </div>
                    </div>

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
                          onChange={handleChange}
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
                          name="luggage"
                          value={formData.luggage}
                          onChange={handleChange}
                          className="pl-10 w-full p-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          placeholder="Enter lugguage quantity"
                        />
                      </div>
                    </div>

                </div>
                <div className="flex justify-between float-right">
                  <button
                    type="submit"
                    className="w-full mt-10 mb-4 py-3 bg-gradient-to-r from-blue-500 to-purple-500 text-white font-semibold rounded-lg btn-primary
              hover:shadow-md transition-all duration-200 hover:-translate-y-0.5 ml-auto mr-auto float-right"
                  >
                    UPDATE VEHICLE
                  </button>
                </div>
              </form>
            </div>
            {/* Document Upload */}
            <div className="lg:col-span-2 float-right bg-white rounded-lg shadow card p-6">
              <div className="flex justify-between items-center mb-2 mt-2">
                <h3 className="w-full card-header text-xl">
                  <Image
                    size={20}
                    className="ml-2 mr-2 text-purple"
                    style={{ float: "left", marginTop: "2px" }}
                  />
                  Vehicle Documents
                </h3>
              </div>

              <div className="col-span-full">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                  {previewUrls.map((url, index) => (
                    <div key={index} className="relative group">
                      <img
                        src={url}
                        alt={`Vehicle preview ${index + 1}`}
                        className="w-full h-32 object-cover rounded-lg"
                      />
                      <button
                        type="button"
                        // onClick={() => removeImage(index)}
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
                        <span className="mx-auto">Upload Documents</span>
                        <input
                          type="file"
                          multiple
                          accept="image/*"
                          // onChange={handleImageUpload}
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
                  Upload documents for vehicle here, <br />
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
          title="Vehicle Updated"
          primaryAction={{ label: "View Vehicles", path: "/vehicles/list" }}
          secondaryAction={{ label: "Go to Dashboard", path: "/dashboard" }}
        >
          The vehicle has been updated.
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

export default EditVehicle;
