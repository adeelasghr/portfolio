import React, { useEffect, useState } from "react";
import { getNewCode, addCustomer } from "../../api/customerApi";
import MessageBox from "../../components/Shared/MessageBox";

import {
  Upload,
  X,
  Image,
  CheckCircle2,
  ArrowLeft,
  ArrowRight,
  CarFront,
  CodeSquare,
  User,
  Phone,
  Mail,
  Building,
  WalletCards,
} from "lucide-react";
import customer from "../../assets/images/customer.png";
import InnerHeader from "../../components/Shared/InnerHeader";
import ErrorModal from "../../components/Shared/ErrorModal";

const Customers: React.FC = () => {
  //State Variables
  const [currentStep, setCurrentStep] = useState(0);
  const [previewUrls, setPreviewUrls] = useState<string[]>([]);
  const [customerCode, setCustomerCode] = useState("");

  //Message Boxes
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [showErrorModal, setShowErrorModal] = useState<string[]>([]);

    const [showValidationErrorModal, setValidationErrorModal] = useState(false);
    const [validationErrorMessages, setvalidationErrorMessages] = useState<
      string[]
    >([]);
  

  const [formData, setFormData] = useState({
    // customerCode: "",
    firstName: "",
    lastName: "",
    email: "",
    dob: "",
    phoneNumber: "",
    picture: "",
    streetName: "",
    houseNo: "",
    postalCode: "",
    city: "",
    country: "",
    additionalInfo: "",
    passportNo: "",
    passportIssue: "",
    passportExpiry: "",
    idCardNo: "",
    idCardIssue: "",
    idCardExpiry: "",
    LicenseNo: "",
    licenseIssue: "",
    licenseExpiry: "",
    images: [] as File[],
  });

  //Fetching Custtomer Code
  useEffect(() => {
    const fetchCustomerCode = async () => {
      try {
        const code = await getNewCode();
        setCustomerCode(code as string);
      } catch (error) {
        console.error("Failed to get customer code:", error);
      }
    };

    fetchCustomerCode();
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  interface AddCustomerResult {
    errors?: string[];
    [key: string]: any;
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const data = new FormData();
    data.append("customerCode", customerCode);
    data.append("firstName", formData.firstName);
    data.append("lastName", formData.lastName);
    data.append("email", formData.email);
    data.append("dob", formData.dob);
    data.append("phoneNumber", formData.phoneNumber);
    data.append("picture", formData.picture);
    data.append("streetName", formData.streetName);
    data.append("houseNo", formData.houseNo);
    data.append("postalCode", formData.postalCode);
    data.append("city", formData.city);
    data.append("country", formData.country);
    data.append("additionalInfo", formData.additionalInfo);
    data.append("passportNo", formData.passportNo);
    data.append("passportIssue", formData.passportIssue);
    data.append("passportExpiry", formData.passportExpiry);
    data.append("idCardNo", formData.idCardNo);
    data.append("idCardIssue", formData.idCardIssue);
    data.append("idCardExpiry", formData.idCardExpiry);
    data.append("LicenseNo", formData.LicenseNo);
    data.append("licenseIssue", formData.licenseIssue);
    data.append("licenseExpiry", formData.licenseExpiry);
    data.append("picture", " ");

      // Append image files
  formData.images.forEach((file) => {
    data.append("CustomerDocs", file); 
  });

    const result = (await addCustomer(data)) as AddCustomerResult;

    if (result?.errors) {
      setShowErrorModal(result.errors);
    } else {
      setShowSuccessModal(true);
    }
  };

  const handleCloseModal = () => {
    //Closing all Message Boxes
    setShowErrorModal([]);
    setShowSuccessModal(false);
};

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
      setFormData((prev) => ({
        ...prev,
        images: [...prev.images, ...files],
      }));

      // Create preview URLs
      const newPreviewUrls = files.map((file) => URL.createObjectURL(file));
      setPreviewUrls((prev) => [...prev, ...newPreviewUrls]);
    }
  };

  interface CustomerStep {
    title: string;
    description: string;
  }

  const steps: CustomerStep[] = [
    {
      title: "Personal Information",
      description: "Enter personal information",
    },
    {
      title: "Address Details",
      description: "Put in address details",
    },
    {
      title: "Identification",
      description: "Add identification details",
    },
    {
      title: "Confirmation",
      description: "Review and confirm information",
    },
  ];

  const nextStep = () => {

    if (currentStep === 0) {
      // Validating age
      if (formData.dob) {
        const dob = new Date(formData.dob);
        const today = new Date();
        const age = today.getFullYear() - dob.getFullYear();
        const hasHadBirthdayThisYear =
          today.getMonth() > dob.getMonth() ||
          (today.getMonth() === dob.getMonth() &&
            today.getDate() >= dob.getDate());

        if (age < 18 || (age === 18 && !hasHadBirthdayThisYear)) {
          setvalidationErrorMessages([
            "Customer must be at least 18 years old.",
          ]);
          setValidationErrorModal(true);
          return;
        }
      }
    }

    const form = document.getElementById("customerForm") as HTMLFormElement;
    if (form && form.checkValidity()) {
      setCurrentStep((prev) => Math.min(prev + 1, steps.length - 1));
    } else {
      form?.reportValidity(); 
    }
  };

  const prevStep = () => {
    setCurrentStep((prev) => Math.max(prev - 1, 0));
  };

  const renderPersonalInfo = () => (
    <div className="mb-6">
      <div className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label
              htmlFor="customerCode"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Customer Code:
            </label>
            <input
              type="text"
              id="customerCode"
              name="customerCode"
              value={customerCode}
              onChange={handleChange}
              required
              readOnly
              placeholder="Customer Code"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
            />
          </div>

          <div>
            <label
              htmlFor="firstName"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              First Name:
            </label>
            <input
              type="text"
              id="firstName"
              name="firstName"
              required
              value={formData.firstName}
              onChange={handleChange}
              placeholder="First Name"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
            />
          </div>

          <div>
            <label
              htmlFor="lastName"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Last Name:
            </label>
            <input
              type="text"
              id="lastName"
              name="lastName"
              required
              value={formData.lastName}
              onChange={handleChange}
              placeholder="Last Name"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
            />
          </div>

          <div>
            <label
              htmlFor="dob"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              D.O.B:
            </label>
            <input
              type="date"
              id="dob"
              name="dob"
              required
              value={formData.dob}
              onChange={handleChange}
              placeholder="D.O.B"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
            />
          </div>

          <div>
            <label
              htmlFor="phone"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Phone:
            </label>
            <input
              type="tel"
              id="phoneNumber"
              name="phoneNumber"
              required
              value={formData.phoneNumber}
              onChange={handleChange}
              placeholder="Phone"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
            />
          </div>
          <div>
            <label
              htmlFor="email"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Email:
            </label>
            <input
              type="email"
              id="email"
              name="email"
              required
              value={formData.email}
              onChange={handleChange}
              placeholder="Email"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
            />
          </div>
        </div>
      </div>
    </div>
  );

  const renderAddressDetails = () => (
    <div className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label
            htmlFor="streetName"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            Street Name:
          </label>
          <input
            type="text"
            id="streetName"
            name="streetName"
            required
            value={formData.streetName}
            onChange={handleChange}
            placeholder="Street Name"
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
          />
        </div>

        <div>
          <label
            htmlFor="houseNo"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            House No:
          </label>
          <input
            type="text"
            id="houseNo"
            name="houseNo"
            required
            value={formData.houseNo}
            onChange={handleChange}
            placeholder="House No"
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
          />
        </div>

        <div>
          <label
            htmlFor="additionalInfo"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            Additional Info:
          </label>
          <input
            type="text"
            id="additionalInfo"
            name="additionalInfo"
            value={formData.additionalInfo}
            onChange={handleChange}
            placeholder="Additional Info"
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
          />
        </div>

        <div>
          <label
            htmlFor="postalCode"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            Postal Code:
          </label>
          <input
            type="text"
            id="postalCode"
            name="postalCode"
            required
            value={formData.postalCode}
            onChange={handleChange}
            placeholder="Postal Code"
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
          />
        </div>

        <div>
          <label
            htmlFor="city"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            City:
          </label>
          <input
            type="text"
            id="city"
            name="city"
            required
            value={formData.city}
            onChange={handleChange}
            placeholder="City"
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
          />
        </div>

        <div>
          <label
            htmlFor="country"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            Country:
          </label>
          <input
            type="text"
            id="country"
            name="country"
            required
            value={formData.country}
            onChange={handleChange}
            placeholder="Country"
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
          />
        </div>
      </div>
    </div>
  );

  const renderIdentificationInfo = () => (
    <div className="mb-6">
      <div className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div>
            <label
              htmlFor="passportNo"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Passport No:
            </label>
            <input
              type="text"
              id="passportNo"
              name="passportNo"
              required
              value={formData.passportNo}
              onChange={handleChange}
              placeholder="Passport No"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
            />
          </div>
          <div>
            <label
              htmlFor="passportIssue"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Passport Issue Date:
            </label>
            <input
              type="date"
              id="passportIssue"
              name="passportIssue"
              value={formData.passportIssue}
              onChange={handleChange}
              placeholder="License Issue Date"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
            />
          </div>

          <div>
            <label
              htmlFor="passportExpiry"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Passport Expiry Date:
            </label>
            <input
              type="date"
              id="passportExpiry"
              name="passportExpiry"
              value={formData.passportExpiry}
              onChange={handleChange}
              placeholder="License Expiry Date"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
            />
          </div>
          <div>
            <label
              htmlFor="idCardNo"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              ID Card No:
            </label>
            <input
              type="text"
              id="idCardNo"
              name="idCardNo"
              value={formData.idCardNo}
              onChange={handleChange}
              placeholder="ID Card No"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
            />
          </div>
          <div>
            <label
              htmlFor="idCardIssue"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              ID Card Issue Date:
            </label>
            <input
              type="date"
              id="idCardIssue"
              name="idCardIssue"
              value={formData.idCardIssue}
              onChange={handleChange}
              placeholder="License Issue Date"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
            />
          </div>

          <div>
            <label
              htmlFor="idCardExpiry"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              ID Card Expiry Date:
            </label>
            <input
              type="date"
              id="idCardExpiry"
              name="idCardExpiry"
              value={formData.idCardExpiry}
              onChange={handleChange}
              placeholder="License Expiry Date"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
            />
          </div>

          <div>
            <label
              htmlFor="LicenseNo"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              License Number:
            </label>
            <input
              type="text"
              id="LicenseNo"
              name="LicenseNo"
              required
              value={formData.LicenseNo}
              onChange={handleChange}
              placeholder="License Number"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
            />
          </div>

          <div>
            <label
              htmlFor="licenseIssueDate"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              License Issue Date:
            </label>
            <input
              type="date"
              id="licenseIssue"
              name="licenseIssue"
              required
              value={formData.licenseIssue}
              onChange={handleChange}
              placeholder="License Issue Date"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
            /> 
          </div>

          <div>
            <label
              htmlFor="licenseExpiryDate"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              License Expiry Date:
            </label>
            <input
              type="date"
              id="licenseExpiry"
              name="licenseExpiry"
              required
              value={formData.licenseExpiry}
              onChange={handleChange}
              placeholder="License Expiry Date"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
            />
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
          <h3 className="text-lg font-semibold text-purple">
            Customer Details
          </h3>
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
            {/* Customer Details */}
            <div className="space-y-3 p-2">
              <div className="flex items-center space-x-3">
                <CodeSquare className="text-blue-500" size={20} />
                <span>Code:</span>
                <span className="font-medium">{customerCode}</span>
              </div>
              <div className="flex items-center space-x-3">
                <User className="text-blue-500" size={20} />
                <span>Name:</span>
                <span className="font-medium">
                  {formData.firstName || "-"} {formData.lastName}
                </span>
              </div>
              <div className="flex items-center space-x-3">
                <CarFront className="text-blue-500" size={20} />
                <span>D.O.B:</span>
                <span className="font-medium">{formData.dob || "-"}</span>
              </div>
              <div className="flex items-center space-x-3">
                <Phone className="text-blue-500" size={20} />
                <span>Phone:</span>
                <span className="font-medium">
                  {formData.phoneNumber || "-"}
                </span>
              </div>
              <div className="flex items-center space-x-3">
                <Mail className="text-blue-500" size={20} />
                <span>Email:</span>
                <span className="font-medium">{formData.email || "-"}</span>
              </div>
              <div className="flex space-x-3">
                <Building className="text-blue-500" size={20} />
                <span>Addrs:</span>
                <span className="font-medium">
                  {formData.streetName} {formData.houseNo}
                  <br />
                  {formData.postalCode}, {formData.city}
                  <br />
                  {formData.country}
                </span>
              </div>
            </div>
          </div>

          {/* Right column with QR code and payment */}
          <div className="md:w-64 space-y-6">
            <div className="space-y-3 p-2">
              <div className="flex space-x-3">
                <WalletCards className="text-blue-500" size={20} />
                <span>Passport:</span>
                <span className="font-medium">
                  {formData.passportNo || "-"}
                  <br />
                  {formData.passportIssue}
                  <br />
                  {formData.passportExpiry}
                </span>
              </div>
              <div className="flex space-x-3">
                <WalletCards className="text-blue-500" size={20} />
                <span>ID Card:</span>
                <span className="font-medium">
                  {formData.idCardNo || "-"}
                  <br />
                  {formData.idCardIssue}
                  <br />
                  {formData.idCardExpiry}
                </span>
              </div>
              <div className="flex space-x-3">
                <WalletCards className="text-blue-500" size={20} />
                <span>License:</span>
                <span className="font-medium">
                  {formData.LicenseNo || "-"}
                  <br />
                  {/* {formData.licenseIssueDate}<br/> */}
                  {formData.licenseExpiry}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  const renderStepContent = () => {
    switch (currentStep) {
      case 0:
        return renderPersonalInfo();
      case 1:
        return renderAddressDetails();
      case 2:
        return renderIdentificationInfo();
      case 3:
        return renderConfirmation();
      default:
        return null;
    }
  };

  return (
    <>
      <div className="flex-1 overflow-y-auto p-4 bg-gray-100 main-bg">
        <div className="grid grid-cols-1 md:grid-cols-1 lg:grid-cols-1">
          <InnerHeader
            title="Add New Customer"
            breadcrum="Customers ➞ Add"
            icon={customer}
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
                  <form id="customerForm">{renderStepContent()}</form>
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
                          "customerForm"
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
                    {currentStep === steps.length - 1 ? "Add Customer" : "Next"}
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
                  Customer Documents
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
                  Upload docuents for customer here, <br />
                  you can upload multiple pictures
                </div>
              </div>
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
          title="Customer Added"
          primaryAction={{ label: "View Customers", path: "/customers/list" }}
          secondaryAction={{ label: "Go to Dashboard", path: "/dashboard" }}
        >
          The customer has been successfully added.
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

export default Customers;
