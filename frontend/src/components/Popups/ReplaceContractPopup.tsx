import { motion } from "framer-motion";
import {
  ArrowLeft,
  ArrowRight,
  Image,
  Calendar,
  Car,
  CarFront,
  CheckCircle2,
  CodeSquare,
  CreditCard,
  Fuel,
  Gauge,
  GaugeCircleIcon,
  Luggage,
  PaintBucket,
  Search,
  Upload,
  X,
  List,
} from "lucide-react";
import { useState } from "react";
import { Vehicle } from "../../../interfaces/Vehicle";

interface ReplaceContractPopupProps {
  contractId: number;
  onClose: () => void;
}

const ReplaceContractPopup: React.FC<ReplaceContractPopupProps> = ({
  contractId,
  onClose,
}) => {
  const [currentStep, setCurrentStep] = useState(0);
  const [searchQuery, setSearchQuery] = useState("");
  const [previewUrls, setPreviewUrls] = useState<string[]>([]);
  const [formData, setFormData] = useState({
    selectedVehicle: "",
    pickupLocation: "",
    pickupDate: "",
    pickupTime: "",
    returnDate: "",
    returnTime: "",
    fullName: "",
    email: "",
    phone: "",
    cardNumber: "",
    expiryDate: "",
    bookingNo: "",
    cvv: "",
    report: [],
    Images: [],
  });

  const nextStep = () => {
    setCurrentStep((prev) => Math.min(prev + 1, steps.length - 1));
  };

  const prevStep = () => {
    setCurrentStep((prev) => Math.max(prev - 1, 0));
  };

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const vehicles: Vehicle[] = [
    {
      id: "1",
      category: "Economy",
      name: "Toyota Corolla",
      price: 50,
      image:
        "https://images.unsplash.com/photo-1550355291-bbee04a92027?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
      seats: 4,
      transmission: "Auto",
      ac: true,
      status: "Available",
      licensePlate: "",
      dailyRate: 0,
      location: "",
      imageUrl: "",
      mileage: 0,
      lastRental: "",
      nextService: "",
      code: "",
      images: [],
    },
    {
      id: "3",
      category: "Luxury",
      name: "BMW 5 Series",
      price: 120,
      image:
        "https://images.unsplash.com/photo-1555215695-3004980ad54e?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
      seats: 5,
      transmission: "Auto",
      ac: true,
      status: "Available",
      licensePlate: "",
      dailyRate: 0,
      location: "",
      imageUrl: "",
      mileage: 0,
      lastRental: "",
      nextService: "",
      code: "",
      images: [],
    },
    {
      id: "4",
      category: "SUV",
      name: "Tesla Model X",
      price: 150,
      image:
        "https://images.unsplash.com/photo-1566008885218-90abf9200ddb?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
      seats: 7,
      transmission: "Auto",
      ac: true,
      status: "Available",
      licensePlate: "",
      dailyRate: 0,
      location: "",
      imageUrl: "",
      mileage: 0,
      lastRental: "",
      nextService: "",
      code: "",
      images: [],
    },
    {
      id: "5",
      category: "Sports",
      name: "Porsche 911",
      price: 200,
      image:
        "https://images.unsplash.com/photo-1503376780353-7e6692767b70?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
      seats: 2,
      transmission: "Auto",
      ac: true,
      status: "Available",
      licensePlate: "",
      dailyRate: 0,
      location: "",
      imageUrl: "",
      mileage: 0,
      lastRental: "",
      nextService: "",
      code: "",
      images: [],
    },
    {
      id: "6",
      category: "Luxury SUV",
      name: "Range Rover",
      price: 180,
      image:
        "https://images.unsplash.com/photo-1606664515524-ed2f786a0bd6?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
      seats: 5,
      transmission: "Auto",
      ac: true,
      status: "Available",
      licensePlate: "",
      dailyRate: 0,
      location: "",
      imageUrl: "",
      mileage: 0,
      lastRental: "",
      nextService: "",
      code: "",
      images: [],
    },
  ];

  const filteredVehicles = vehicles.filter(
    (vehicle) =>
      vehicle.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      vehicle.category.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (files.length > 0) {
      setFormData((prev) => ({ ...prev, images: [...prev.Images, ...files] }));

      // Create preview URLs
      const newPreviewUrls = files.map((file) => URL.createObjectURL(file));
      setPreviewUrls((prev) => [...prev, ...newPreviewUrls]);
    }
  };

  interface VehicleStep {
    title: string;
    description: string;
  }
  const steps: VehicleStep[] = [
    {
      title: "Current Vehicle",
      description: "Enter current information",
    },
    {
      title: "New Vehicle",
      description: "Enter new information",
    },
    {
      title: "Confirmation",
      description: "Review and confirm information",
    },
  ];

  const renderConfirmation = () => (
    <div className="space-y-4">
      <div className="">
        <div className="flex items-center space-x-2">
          <CheckCircle2 className="text-purple" size={20} />
          <h3 className="text-lg font-semibold text-purple">Confirm Details</h3>
        </div>

        <div className="grid grid-cols-2 gap-4 mt-6">
          {/* Left column with details */}
          <div className="flex-1 space-y-6">
            {/* Vehicle Details */}
            <div className="space-y-3 p-4">
              <div className="flex items-center space-x-3">
                <CodeSquare className="text-blue-500" size={20} />
                <span>Code:</span>
                <span className="font-medium">VC0001</span>
              </div>
              <div className="flex items-center space-x-3">
                <Car className="text-blue-500" size={20} />
                <span>Type</span>
                <span className="font-medium">Sedan</span>
              </div>
              <div className="flex items-center space-x-3">
                <CarFront className="text-blue-500" size={20} />
                <span>Make/Model</span>
                <span className="font-medium">Toyota Camry</span>
              </div>
              <div className="flex items-center space-x-3">
                <Calendar className="text-blue-500" size={20} />
                <span>Year</span>
                <span className="font-medium">2020</span>
              </div>
              <div className="flex items-center space-x-3">
                <CodeSquare className="text-blue-500" size={20} />
                <span>Plate Number</span>
                <span className="font-medium">B-12345</span>
              </div>
              <div className="flex items-center space-x-3">
                <CreditCard className="text-blue-500" size={20} />
                <span>Cost</span>
                <span className="font-medium">€50 /day</span>
              </div>
            </div>
          </div>

          {/* Right column with QR code and payment */}
          <div className="md:w-64 space-y-6">
            <div className="space-y-3 p-4">
              <div className="flex items-center space-x-3">
                <Gauge className="text-blue-500" size={20} />
                <span>Fuel Type</span>
                <span className="font-medium">Automatic</span>
              </div>
              <div className="flex items-center space-x-3">
                <Fuel className="text-blue-500" size={20} />
                <span>Transmission:</span>
                <span className="font-medium">Electric</span>
              </div>
              <div className="flex items-center space-x-3">
                <Car className="text-blue-500" size={20} />
                <span>No. Of Seats</span>
                <span className="font-medium">5</span>
              </div>
              <div className="flex items-center space-x-3">
                <PaintBucket className="text-blue-500" size={20} />
                <span>Color</span>
                <span className="font-medium">White</span>
              </div>
              <div className="flex items-center space-x-3">
                <GaugeCircleIcon className="text-blue-500" size={20} />
                <span>Mileage</span>
                <span className="font-medium">125000</span>
              </div>
              <div className="flex items-center space-x-3">
                <Luggage className="text-blue-500" size={20} />
                <span>Lugguage Capacity:</span>
                <span className="font-medium">2</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  const renderExistingVehicle = () => (
    <div>
      <div className="flex items-center space-x-2">
        <CheckCircle2 className="text-purple" size={20} />
        <h3 className="text-lg font-semibold text-purple">Current Vehicle</h3>
      </div>

      <div className="grid grid-cols-2 gap-4 mt-6">
        {/* Left column with details */}
        <div className="flex-1 space-y-6">
          {/* Vehicle Details */}
          <div className="space-y-3 p-4">
            <div className="flex items-center space-x-3">
              <CodeSquare className="text-blue-500" size={20} />
              <span>Code:</span>
              <span className="font-medium">VC0001</span>
            </div>
            <div className="flex items-center space-x-3">
              <Car className="text-blue-500" size={20} />
              <span>Type</span>
              <span className="font-medium">Sedan</span>
            </div>
            <div className="flex items-center space-x-3">
              <CarFront className="text-blue-500" size={20} />
              <span>Make/Model</span>
              <span className="font-medium">Toyota Camry</span>
            </div>
            <div className="flex items-center space-x-3">
              <Calendar className="text-blue-500" size={20} />
              <span>Year</span>
              <span className="font-medium">2020</span>
            </div>
            <div className="flex items-center space-x-3">
              <CodeSquare className="text-blue-500" size={20} />
              <span>Plate Number</span>
              <span className="font-medium">B-12345</span>
            </div>
            <div className="flex items-center space-x-3">
              <CreditCard className="text-blue-500" size={20} />
              <span>Cost</span>
              <span className="font-medium">€50 /day</span>
            </div>
          </div>
        </div>

        {/* Right column with QR code and payment */}
        <div className="md:w-64 space-y-6">
          <div className="space-y-3 p-4">
            <div className="flex items-center space-x-3">
              <Gauge className="text-blue-500" size={20} />
              <span>Fuel Type</span>
              <span className="font-medium">Automatic</span>
            </div>
            <div className="flex items-center space-x-3">
              <Fuel className="text-blue-500" size={20} />
              <span>Transmission:</span>
              <span className="font-medium">Electric</span>
            </div>
            <div className="flex items-center space-x-3">
              <Car className="text-blue-500" size={20} />
              <span>No. Of Seats</span>
              <span className="font-medium">5</span>
            </div>
            <div className="flex items-center space-x-3">
              <PaintBucket className="text-blue-500" size={20} />
              <span>Color</span>
              <span className="font-medium">White</span>
            </div>
            <div className="flex items-center space-x-3">
              <GaugeCircleIcon className="text-blue-500" size={20} />
              <span>Mileage</span>
              <span className="font-medium">125000</span>
            </div>
            <div className="flex items-center space-x-3">
              <Luggage className="text-blue-500" size={20} />
              <span>Lugguage Capacity:</span>
              <span className="font-medium">2</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  const renderNewVehicle = () => (
    <div>
      <div className="mb-6">
        <div className="relative">
          <Search
            className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
            size={18}
          />
          <input
            type="text"
            placeholder="Search by vehicle name or category..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10 w-full p-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>
      </div>
      <div
        className="grid grid-cols-1 md:grid-cols-3 gap-4"
        style={{ overflowY: "scroll", height: "450px" }}
      >
        {filteredVehicles.map((vehicle) => (
          <div
            key={vehicle.id}
            style={{ height: "fit-content" }}
            className={`
              border rounded-lg p-2 cursor-pointer transition-all duration-300 
              ${
                formData.selectedVehicle === vehicle.category
                  ? "border-purple-2 bg-blue-50 bg-white"
                  : "border-gray-200 hover:border-blue-300 "
              }
            `}
            onClick={() =>
              handleInputChange({
                target: {
                  name: "selectedVehicle",
                  value: vehicle.category,
                },
              } as React.ChangeEvent<HTMLInputElement>)
            }
          >
            <div className="flex items-center justify-between mb-3">
              <div>
                <h3 className="text-lg font-semibold">{vehicle.name}</h3>
                <p className="text-sm text-gray-500">{vehicle.category}</p>
              </div>
              <Car
                className={
                  formData.selectedVehicle === vehicle.category
                    ? "text-purple"
                    : "text-gray-400"
                }
              />
            </div>
            <img
              src={vehicle.image}
              alt={vehicle.name}
              className="w-full h-16 object-cover rounded-lg mb-3"
            />
            <div className="space-y-1">
              <p className="text-gray-600">From ${vehicle.price}/day</p>
              <p className="text-sm text-gray-500">
                • {vehicle.seats} seats • {vehicle.transmission}
                {vehicle.ac && "• A/C"}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  const renderStepContent = () => {
    switch (currentStep) {
      case 0:
        return renderExistingVehicle();
      case 1:
        return renderNewVehicle();
      case 2:
        return renderConfirmation();
      default:
        return null;
    }
  };

  const removeImage = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      images: prev.Images.filter((_, i) => i !== index),
    }));

    // Revoke the URL to prevent memory leaks
    URL.revokeObjectURL(previewUrls[index]);
    setPreviewUrls((prev) => prev.filter((_, i) => i !== index));
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
        <motion.div
          initial={{ scale: 0, rotate: -10, y: 100 }}
          animate={{ scale: 1, rotate: 0, y: 0 }}
          exit={{ scale: 0, rotate: 10, y: -100 }}
          transition={{ type: "spring", damping: 15 }}
          className="bg-white w-[70vm] rounded-xl overflow-hidden popup-bg shadow-2xl"
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
            <h3 className="card-header text-xl mb-6">Replace Vehicle</h3>
            <div className="grid grid-cols-1 md:grid-cols-1 gap-8">
              <motion.div
                initial={{ x: -20, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ delay: 0.3 }}
                className="space-y-4"
              >
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
                        <div className="mb-6">{renderStepContent()}</div>

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
                            onClick={
                              currentStep === steps.length - 1
                                ? () => console.log("Submit booking", formData)
                                : nextStep
                            }
                            className="btn-primary flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 text-sm"
                          >
                            {currentStep === steps.length - 1
                              ? "Add Vehicle"
                              : "Next"}
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
                        <div className="relative">
                <Gauge
                  className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                  size={18}
                />
                <input
                  type="text"
                  name="phone"
                  value={formData.phone}
                  onChange={() => {}}
                  className="pl-10 w-full p-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Enter odometer"
                />
              </div>
              <div className="relative mt-2">
                <Fuel
                  className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                  size={18}
                />
                <input
                  type="text"
                  name="phone"
                  value={formData.phone}
                  onChange={() => {}}
                  className="pl-10 w-full p-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Enter Fuel Level"
                />
              </div>
            <div className="relative mt-2 mb-2">
            <List
                className="absolute left-3 mt-6 transform -translate-y-1/2 text-gray-400"
                size={18}
              />
              <textarea
                name="remarks"
                value=""
                className="pl-10 w-full p-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Enter remarks"
              />
            </div>
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
              </motion.div>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </>
  );
};
export default ReplaceContractPopup;
