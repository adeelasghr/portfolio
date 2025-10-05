import React, { useEffect, useState } from "react";
import {
  Calendar,
  Clock,
  MapPin,
  Car,
  CreditCard,
  User,
  Phone,
  Mail,
  CheckCircle2,
  ArrowRight,
  ArrowLeft,
  Search,
  Users,
  UserPlus,
  ReceiptIcon,
} from "lucide-react";

import { Vehicle, VehiclePreview } from "../../interfaces/Vehicle";
import InnerHeader from "../../components/Shared/InnerHeader";
import reserve from "../../assets/images/reserve.png";
import { CustomersBrief } from "../../interfaces/Customer";
import BookingCard from "../../components/Bookings/BookingCard";
import defaultImage from "../../assets/images/reserve.png";
import { getvehiclePreview } from "../../api/vehicleApi";
import { getCustomersBrief } from "../../api/customerApi";
import ErrorModal from "../../components/Shared/ErrorModal";
import { addBooking } from "../../api/bookingApi";
import MessageBox from "../../components/Shared/MessageBox";

interface BookingStep {
  title: string;
  description: string;
}

const steps: BookingStep[] = [
  {
    title: "Select Vehicle",
    description: "Choose your preferred car",
  },
  {
    title: "Rental Details",
    description: "Pick-up and return details",
  },
  {
    title: "Customer Info",
    description: "Your contact information",
  },
  {
    title: "Confirmation",
    description: "Review and confirm booking",
  },
];

const BookingPage: React.FC = () => {
  const [currentStep, setCurrentStep] = useState(0);
  const [vehicles, setVehicles] = useState<VehiclePreview[]>([]);
  const [customers, setCustomers] = useState<CustomersBrief[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [isNewCustomer, setIsNewCustomer] = useState(true);
  const [customerSearchQuery, setCustomerSearchQuery] = useState("");

  //Message Boxes
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [showErrorModal, setShowErrorModal] = useState<string[]>([]);

  const [showValidationErrorModal, setValidationErrorModal] = useState(false);
  const [validationErrorMessages, setvalidationErrorMessages] = useState<
    string[]
  >([]);

  const baseImageUrl = "https://backend.deutpak.com";

  const locations = [
    { id: "1", label: "Tempelhof Office" },
    { id: "3", label: "Berlin Airport" },
  ];

    const handleCloseModal = () => {
    //Closing all Message Boxes
    setShowErrorModal([]);
    setShowSuccessModal(false);
};

const getTodayString = () => {
   const today = new Date();
  const tomorrow = new Date(today);
  tomorrow.setDate(today.getDate() + 1);
  return tomorrow.toISOString().split("T")[0];
};

  interface BookingFormData {
    // Step 1: Booking Dates
    PickUpLocID: string;
    DropOffLocID: string;
    PickUpDate: string;
    PickUpTime: string;
    DropOffDate: string;
    DropOffTime: string;

    // Step 2: Vehicle Selection
    vehicleID: string;
    vehicleTypeID: string;
    
    // Step 3: Personal Details
    ClientID?: string;
    FirstName: string;
    LastName: string;
    Email: string;
    Phone: string;
    DOB: string;
    passportNo: string;
    address: string;
    city: string;
    country: string;
    licenseNo: string;
    licenseExpiry: string;

    // Step 4: Payment
    Payment: string;
  }

  const filters = [
    { id: "1", label: "Mini" },
    { id: "2", label: "Economy" },
    { id: "3", label: "Compact" },
    { id: "4", label: "StationWagon" },
    { id: "5", label: "SUV" },
    { id: "6", label: "Electric" },
    { id: "7", label: "PeopleCarrier" },
    { id: "8", label: "Transporter" },
  ];

  const [formData, setFormData] = useState<BookingFormData>({
    // Step 1: Booking Dates
    PickUpLocID: "",
    DropOffLocID: "",
    PickUpDate: "",
    DropOffDate: "",
    PickUpTime: "10:00",
    DropOffTime: "10:00",
    // Step 2: Vehicle Selection
    vehicleID: "",
    vehicleTypeID: "",
    // Step 3: Personal Details
    ClientID: "0",
    FirstName: "",
    LastName: "",
    Email: "",
    Phone: "",
    DOB: "",
    passportNo: "",
    address: "",
    city: "",
    country: "",
    licenseNo: "",
    licenseExpiry: "",
    // Step 4: Payment
    Payment: "",
  });

  //Fetching Vehicles (By Type)
  useEffect(() => {
    const fetchVehicles = async () => {
      try {
        const data = (await getvehiclePreview(
          formData.vehicleTypeID
        )) as Vehicle[];

        const mappedVehicles: VehiclePreview[] = data.map((veh: any) => ({
          id: veh.id.toString(),
          name: veh.name,
          plateNumber: veh.plateNumber,
          type: veh.type,
          category: veh.type?.toLowerCase().replace(/\s/g, ""),
          image: veh.image ? `${baseImageUrl}${veh.image}` : defaultImage,
          price: veh.dailyRate,
          tag: "",
          feul: veh.feul,
          group: veh.group,
          seats: veh.noOfSeats.toString(),
          bags: veh.luggage || 0,
          transmission: veh.transmission || "Automatic",
          hasAC: veh.ac,
          features: veh.features ? veh.features.split(",") : [],
        }));

        setVehicles(mappedVehicles);
      } catch (error) {
        console.error("Failed to fetch vehicles", error);
      }
    };

    fetchVehicles();
  }, [formData.vehicleTypeID]);

  //Fetching Customers
  useEffect(() => {
    const loadCustomers = async () => {
      try {
        const data = await getCustomersBrief();
        setCustomers(data as CustomersBrief[]);
      } catch (error) {
        console.error("Failed to fetch customers:", error);
      }
    };

    loadCustomers();
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

  const filteredCustomers = customers.filter(
    (customer) =>
      customer.fullName
        .toLowerCase()
        .includes(customerSearchQuery.toLowerCase()) ||
      customer.email
        .toLowerCase()
        .includes(customerSearchQuery.toLowerCase()) ||
      customer.code.toLowerCase().includes(customerSearchQuery.toLowerCase())
  );

  const nextStep = () => {
    const form = document.getElementById("bookingForm") as HTMLFormElement;

    // Check for required vehicle selection at Step 0
    if (currentStep === 0) {
      if (!formData.vehicleTypeID || !formData.vehicleID) {
        setvalidationErrorMessages([
          "Please select a vehicle before proceeding",
        ]);
        setValidationErrorModal(true);
        return;
      }
    }

    // STEP 2: Validate booking date & time
    if (currentStep === 1) {
      const pickup = new Date(`${formData.PickUpDate}T${formData.PickUpTime}`);
      const dropoff = new Date(`${formData.DropOffDate}T${formData.DropOffTime}`);

      const durationMs = dropoff.getTime() - pickup.getTime();
      const durationHours = durationMs / (1000 * 60 * 60);

      // Check if pickup is before dropoff
      if (pickup >= dropoff) {
        setvalidationErrorMessages(["Return date & time must be after pickup date & time."]);
          setValidationErrorModal(true);
        return;
      }

      // Check for minimum booking duration
      const vehicleType = formData.vehicleTypeID;
      const minHours = vehicleType === "7" || vehicleType === "8" ? 6 : 24;

      if (durationHours < minHours) {
        setvalidationErrorMessages([
          `Booking must be at least ${minHours} hours for this vehicle.`,
        ]);
          setValidationErrorModal(true);
        return;
      }
    }

    // Step 2: Customer Validation
    if (currentStep === 2) {
      const isExistingCustomer = !isNewCustomer && !!formData.ClientID;
      const isNewCustomerFilled =
        isNewCustomer &&
        formData.FirstName &&
        formData.LastName &&
        formData.Email &&
        formData.DOB &&
        formData.address &&
        formData.city &&
        formData.country &&
        formData.passportNo &&
        formData.licenseExpiry &&
        formData.licenseNo &&
        formData.Phone;

      if (!isExistingCustomer && !isNewCustomerFilled) {
        setvalidationErrorMessages([
          "Please select an existing customer or fill out new customer details.",
        ]);
        setValidationErrorModal(true);
        return;
      }

        // Validating age
        if (isNewCustomer && formData.DOB) {
          const dob = new Date(formData.DOB);
          const today = new Date();
          const age = today.getFullYear() - dob.getFullYear();
          const hasHadBirthdayThisYear = (
            today.getMonth() > dob.getMonth() ||
            (today.getMonth() === dob.getMonth() && today.getDate() >= dob.getDate())
          );

          if (age < 18 || (age === 18 && !hasHadBirthdayThisYear)) {
            setvalidationErrorMessages(["Customer must be at least 18 years old."]);
            setValidationErrorModal(true);
            return;
          }
        }

        // Validating license expiry
        if (isNewCustomer && formData.licenseExpiry && formData.DropOffDate) {
            const licenseExpiry = new Date(formData.licenseExpiry);
            const returnDate = new Date(formData.DropOffDate);

            if (licenseExpiry <= returnDate) {
              setvalidationErrorMessages([
                "Driving license must be valid beyond the return date of the booking.",
              ]);
               setValidationErrorModal(true);
              return;
            }
        }
    }

    if (form && form.checkValidity()) {
      setCurrentStep((prev) => Math.min(prev + 1, steps.length - 1));
    } else {
      form?.reportValidity();
    }
  };

  const prevStep = () => {
    setCurrentStep((prev) => Math.max(prev - 1, 0));
  };

  const filteredVehicles = vehicles.filter(
    (vehicle) =>
      vehicle.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      vehicle.category.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const renderVehicleSelection = () => (
    <div>
      <div className="">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Vehicle Type
        </label>
        <select
          required
          name="vehicleTypeID"
          value={formData.vehicleTypeID}
          onChange={handleInputChange}
          className="w-1/2 p-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        >
          <option value="">Select a type</option>
          {filters.map((filter) => (
            <option key={filter.id} value={filter.id}>
              {filter.label}
            </option>
          ))}
        </select>
      </div>
      <div className="mb-4 mt-2">
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
                formData.vehicleID === vehicle.id
                  ? "border-purple-2 bg-blue-50 bg-white"
                  : "border-gray-200 hover:border-blue-300 "
              }
            `}
            onClick={() =>
              handleInputChange({
                target: { name: "vehicleID", value: vehicle.id },
              } as React.ChangeEvent<HTMLInputElement>)
            }
          >
            <div className="flex items-center justify-between mb-3">
              <div>
                <h3 className="text-l font-semibold">
                  {vehicle.name} - ({vehicle.plateNumber})
                </h3>
                <p className="text-sm text-gray-500">{vehicle.group}</p>
              </div>
              <Car
                className={
                  formData.vehicleID === vehicle.id
                    ? "text-purple"
                    : "text-gray-400"
                }
              />
            </div>
            <img
              src={vehicle.image}
              alt={vehicle.name}
              className="w-full h-32 rounded-lg mb-3"
            />
            <div className="flex space-x-2">
              <p className="text-sm text-left text-gray-600 w-1/2">
                {vehicle.feul}
              </p>
              <p className="text-sm text-right text-gray-600 w-1/2">
                €{vehicle.price}/day
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  const renderRentalDetails = () => (
    <div className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Pick-up Location
          </label>
          <select
            required
            name="PickUpLocID"
            value={formData.PickUpLocID}
            onChange={handleInputChange}
            className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="">Select location</option>
            {locations.map((filter) => (
              <option key={filter.id} value={filter.id}>
                {filter.label}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Drop-off Location
          </label>
          <select
            required
            name="DropOffLocID"
            value={formData.DropOffLocID}
            onChange={handleInputChange}
            className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="">Select location</option>
            {locations.map((filter) => (
              <option key={filter.id} value={filter.id}>
                {filter.label}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Pick-up Date
          </label>
          <div className="relative">
            <Calendar
              className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
              size={18}
            />
            <input
              min={getTodayString()}
              type="date"
              required
              name="PickUpDate"
              value={formData.PickUpDate}
              onChange={handleInputChange}
              className="pl-10 w-full p-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Pick-up Time
          </label>
          <div className="relative">
            <Clock
              className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
              size={18}
            />
            <input
              required
              type="time"
              name="PickUpTime"
              value={formData.PickUpTime}
              onChange={handleInputChange}
              className="pl-10 w-full p-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Return Date
          </label>
          <div className="relative">
            <Calendar
              className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
              size={18}
            />
            <input
              min={formData.PickUpDate}
              required
              type="date"
              name="DropOffDate"
              value={formData.DropOffDate}
              onChange={handleInputChange}
              className="pl-10 w-full p-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Return Time
          </label>
          <div className="relative">
            <Clock
              className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
              size={18}
            />
            <input
              required
              type="time"
              name="DropOffTime"
              value={formData.DropOffTime}
              onChange={handleInputChange}
              className="pl-10 w-full p-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
        </div>
      </div>
    </div>
  );

  const renderPersonalInfo = () => (
    <div className="space-y-6">
      <div className="flex space-x-4">
        <button
          type="button"
          className={`flex items-center px-4 py-2 text-sm rounded-lg ${
            isNewCustomer
              ? "bg-purple text-white"
              : "bg-gray-100 text-gray-700 hover:bg-gray-200"
          }`}
          onClick={() => setIsNewCustomer(true)}
        >
          <UserPlus size={20} className="mr-2" />
          New Customer
        </button>
        <button
          type="button"
          className={`flex items-center px-4 py-2 text-sm rounded-lg ${
            !isNewCustomer
              ? "bg-purple text-white"
              : "bg-gray-100 text-gray-700 hover:bg-gray-200"
          }`}
          onClick={() => setIsNewCustomer(false)}
        >
          <Users size={20} className="mr-2" />
          Existing Customer
        </button>
      </div>

      {!isNewCustomer && (
        <div className="space-y-4">
          <div className="relative">
            <Search
              className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
              size={18}
            />
            <input
              type="text"
              placeholder="Search customers by their code, name or email..."
              value={customerSearchQuery}
              onChange={(e) => setCustomerSearchQuery(e.target.value)}
              className="pl-10 w-full p-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          <div
            className="grid grid-cols-1 md:grid-cols-2 space-y-2 overflow-y-auto gap-4"
            style={{ overflowY: "scroll", height: "400px" }}
          >
            {filteredCustomers.map((customers) => (
              <div
                key={customers.id}
                style={{ margin: "8px 0 0" }}
                className={`p-4 border rounded-lg cursor-pointer transition-all duration-300
          ${
            Number(formData.ClientID) === customers.id
              ? "border-purple-2 bg-blue-50 bg-white"
              : "border-gray-200 hover:border-blue-300"
          }`}
                onClick={() => {
                  const isSameCustomer = Number(formData.ClientID) === customers.id;
                  handleInputChange({
                    target: {
                      name: "ClientID",
                      value: isSameCustomer ? "" : customers.id,
                    },
                  } as React.ChangeEvent<HTMLInputElement>);
                }}
              >
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-medium">{customers.fullName}</h3>
                    <p className="text-sm text-gray-500">{customers.code}</p>
                    <p className="text-sm text-gray-500">{customers.email}</p>
                  </div>
                  <User
                    className={
                      Number(formData.ClientID) === customers.id
                        ? "text-blue-500"
                        : "text-gray-400"
                    }
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {isNewCustomer && (
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                First Name
              </label>
              <div className="relative">
                <User
                  className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                  size={18}
                />
                <input
                  type="text"
                  name="FirstName"
                  value={formData.FirstName}
                  onChange={handleInputChange}
                  className="pl-10 w-full p-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Enter your full name"
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Last Name
              </label>
              <div className="relative">
                <User
                  className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                  size={18}
                />
                <input
                  type="text"
                  name="LastName"
                  value={formData.LastName}
                  onChange={handleInputChange}
                  className="pl-10 w-full p-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Enter your full name"
                />
              </div>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Email Address
              </label>
              <div className="relative">
                <Mail
                  className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                  size={18}
                />
                <input
                  type="email"
                  name="Email"
                  value={formData.Email}
                  onChange={handleInputChange}
                  className="pl-10 w-full p-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Enter your email"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Phone Number
              </label>
              <div className="relative">
                <Phone
                  className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                  size={18}
                />
                <input
                  type="tel"
                  name="Phone"
                  value={formData.Phone}
                  onChange={handleInputChange}
                  className="pl-10 w-full p-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Enter your phone number"
                />
              </div>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                D.O.B
              </label>
              <div className="relative">
                <Calendar
                  className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                  size={18}
                />
                <input
                  type="date"
                  name="DOB"
                  value={formData.DOB}
                  onChange={handleInputChange}
                  className="pl-10 w-full p-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Address
              </label>
              <div className="relative">
                <MapPin
                  className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                  size={18}
                />
                <input
                  type="text"
                  name="address"
                  value={formData.address}
                  onChange={handleInputChange}
                  className="pl-10 w-full p-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Enter your card number"
                />
              </div>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                City
              </label>
              <input
                type="text"
                name="city"
                value={formData.city}
                onChange={handleInputChange}
                className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Enter a city"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Country
              </label>
              <input
                type="text"
                name="country"
                value={formData.country}
                onChange={handleInputChange}
                className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Enter a country"
              />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Passport No.
              </label>
              <input
                type="text"
                name="passportNo"
                value={formData.passportNo}
                onChange={handleInputChange}
                className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Enter Passport No"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Driving License Number
              </label>
              <input
                type="text"
                name="licenseNo"
                value={formData.licenseNo}
                onChange={handleInputChange}
                className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Enter License No"
              />
            </div>
          </div>
           <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                License Expiry
              </label>
              <div className="relative">
                <Calendar
                  className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                  size={18}
                />
                <input
                  type="date"
                  name="licenseExpiry"
                  value={formData.licenseExpiry}
                  onChange={handleInputChange}
                  className="pl-10 w-full p-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );

  const renderConfirmation = () => (
    <div className="space-y-4">
      <div className="">
        <div className="flex items-center space-x-2">
          <CheckCircle2 className="text-purple" size={20} />
          <h3 className="text-lg font-semibold text-purple">Booking Summary</h3>
        </div>

        <div className="mt-4 space-y-3">
          <div className="flex justify-between py-2 border-b">
            <span className="text-gray-600">
              Please make sure to confirm the booking details before submitting.
              You can go back to change the details anytime.
            </span>
          </div>
        </div>
        <div className="grid grid-cols-2 gap-4 mt-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Payment
            </label>
            <div className="relative">
              <User
                className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                size={18}
              />
              <select
                name="payment"
                value={formData.Payment}
                onChange={handleInputChange}
                className="pl-10 w-full p-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="cash">UnPaid</option>
                <option value="credit">Paid</option>
              </select>
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Reference Number
            </label>
            <div className="relative">
              <ReceiptIcon
                className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                size={18}
              />
              <input
                type="text"
                name="cardNumber"
                //value={formData.cardNumber}
                onChange={handleInputChange}
                className="pl-10 w-full p-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Enter the receipt number"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  const renderStepContent = () => {
    switch (currentStep) {
      case 0:
        return renderVehicleSelection();
      case 1:
        return renderRentalDetails();
      case 2:
        return renderPersonalInfo();
      case 3:
        return renderConfirmation();
      default:
        return null;
    }
  };

  //Selecting Details for Booking Card
  const selectedVehicle = vehicles.find((v) => v.id === formData.vehicleID);
  const selectedCustomer = customers.find((c) => c.id === Number(formData.ClientID));

 interface AddBookingResult {
    errors?: string[];
    [key: string]: any;
  }
  return (
    <>
      <div className="flex-1 overflow-y-auto p-4 bg-gray-100 main-bg">
        <div className="grid grid-cols-1 md:grid-cols-1 lg:grid-cols-1">
          <InnerHeader
            title="Make New Booking"
            breadcrum="Bookings ➞ New Bookings"
            icon={reserve}
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
                  <form id="bookingForm">{renderStepContent()}</form>
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
                          "bookingForm"
                        ) as HTMLFormElement;
                        if (form?.checkValidity()) {
                          console.log(formData);
                           const result = (addBooking(formData)) as AddBookingResult;
    
                            if (result?.errors) {
                              setShowErrorModal(result.errors);
                            } else {
                              setShowSuccessModal(true);
                            }
                        } else {
                          form?.reportValidity();
                        }
                      } else {
                        nextStep();
                      }
                    }}
                    className="btn-primary flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 text-sm"
                  >
                    {currentStep === steps.length - 1
                      ? "Confirm Booking"
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

            {/* Reservation Card */}
            <div
              className="lg:col-span-3 rounded-lg shadow card p-2"
              style={{ minHeight: "70vh" }}
            >
              <BookingCard
                booking={formData}
                vehicle={selectedVehicle}
                customer={selectedCustomer}
              />
            </div>
          </div>
        </div>
      </div>

      <ErrorModal
        show={showValidationErrorModal}
        errors={validationErrorMessages}
        onClose={() => setValidationErrorModal(false)}
      />


       {showSuccessModal && (
        <MessageBox
          onClose={handleCloseModal}
          code="green"
          title="Booking Added"
          primaryAction={{ label: "View Bookings", path: "/bookings" }}
          secondaryAction={{ label: "Go to Dashboard", path: "/dashboard" }}
        >
          The booking has been successfully made.
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

export default BookingPage;
