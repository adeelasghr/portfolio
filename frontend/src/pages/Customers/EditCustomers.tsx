import React, { useEffect, useState } from "react";
import {
  getCustomerDetails,
  updateCustomer,
} from "../../api/customerApi";

import { Upload, X, Image } from "lucide-react";
import customerIcon from "../../assets/images/customer.png";
import InnerHeader from "../../components/Shared/InnerHeader";
import { useParams } from "react-router-dom";
import { Customer } from "../../interfaces/Customer";
import { formatDateForInput } from "../../utils/dateFormatter";
import MessageBox from "../../components/Shared/MessageBox";

const EditCustomers: React.FC = () => {
  //State Variables
  const [previewUrls, setPreviewUrls] = useState<string[]>([]);
  const { id } = useParams();

  //Message Boxes
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [showErrorModal, setShowErrorModal] = useState<string[]>([]);

  const [formData, setFormData] = useState({
    id: "",
    customerCode: "",
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
    licenseNo: "",
    licenseIssue: "",
    licenseExpiry: "",
    // documents: [],
  });

  interface AddCustomerResult {
    errors?: string[];
    [key: string]: any;
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    formData.id = id ?? "";
    const result = (await updateCustomer(formData)) as AddCustomerResult;

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

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  useEffect(() => {
    const fetchCustomer = async () => {
      try {
        const data = (await getCustomerDetails(id)) as Customer;
        setFormData(data);
      } catch (error) {
        console.error("Failed to fetch customer:", error);
      }
    };

    console.log("Fetching customer with ID:", id);
    fetchCustomer();
  }, [id]);

  return (
    <>
      <div className="flex-1 overflow-y-auto p-4 bg-gray-100 main-bg">
        <div className="grid grid-cols-1 md:grid-cols-1 lg:grid-cols-1">
          <InnerHeader
            title="Edit Customer"
            breadcrum="Customers ➞ Edit"
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
                    Personal Information
                  </h4>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
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
                      value={formData.customerCode}
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
                      value={formData.dob ? formatDateForInput(formData.dob) : ""}
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
                <div className="flex justify-between items-center">
                  <h4 className="w-full card-header text-l mt-6">
                    Address Details
                  </h4>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
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
                <div className="flex justify-between items-center">
                  <h4 className="w-full card-header text-l mt-6">
                    Identification
                  </h4>
                </div>
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
                      htmlFor="licenseIssueDate"
                      className="block text-sm font-medium text-gray-700 mb-1"
                    >
                      Passport Issue Date:
                    </label>
                    <input
                      type="date"
                      id="passportIssue"
                      name="passportIssue"
                      value={
                        formData.passportIssue
                          ? formatDateForInput(formData.passportIssue)
                          : ""
                      }
                      onChange={handleChange}
                      placeholder="License Issue Date"
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                    />
                  </div>

                  <div>
                    <label
                      htmlFor="licenseExpiry"
                      className="block text-sm font-medium text-gray-700 mb-1"
                    >
                      Passport Expiry Date:
                    </label>
                    <input
                      type="date"
                      id="passportExpiry"
                      name="passportExpiry"
                      value={
                        formData.passportExpiry
                          ? formatDateForInput(formData.passportExpiry)
                          : ""
                      }
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
                      htmlFor="licenseIssueDate"
                      className="block text-sm font-medium text-gray-700 mb-1"
                    >
                      ID Card Issue Date:
                    </label>
                    <input
                      type="date"
                      id="idCardIssue"
                      name="idCardIssue"
                      value={
                        formData.idCardIssue
                          ? formatDateForInput(formData.idCardIssue)
                          : ""
                      }
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
                      ID Card Expiry Date:
                    </label>
                    <input
                      type="date"
                      id="idCardExpiry"
                      name="idCardExpiry"
                      value={
                        formData.idCardExpiry
                          ? formatDateForInput(formData.idCardExpiry)
                          : ""
                      }
                      onChange={handleChange}
                      placeholder="License Expiry Date"
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                    />
                  </div>

                  <div>
                    <label
                      htmlFor="licenseNo"
                      className="block text-sm font-medium text-gray-700 mb-1"
                    >
                      License Number:
                    </label>
                    <input
                      type="text"
                      id="LicenseNo"
                      name="LicenseNo"
                      required
                      value={formData.licenseNo}
                      onChange={handleChange}
                      placeholder="License Number"
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                    />
                  </div>

                  <div>
                    <label
                      htmlFor="licenseIssue"
                      className="block text-sm font-medium text-gray-700 mb-1"
                    >
                      License Issue Date:
                    </label>
                    <input
                      type="date"
                      id="licenseIssue"
                      name="licenseIssue"
                      required
                      value={
                        formData.licenseIssue
                          ? formatDateForInput(formData.licenseIssue)
                          : ""
                      }
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
                      value={
                        formData.licenseExpiry
                          ? formatDateForInput(formData.licenseExpiry)
                          : ""
                      }
                      onChange={handleChange}
                      placeholder="License Expiry Date"
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                    />
                  </div>
                </div>
                <div className="flex justify-between float-right">
                  <button type="submit"
                    className="w-full mt-10 mb-4 py-3 bg-gradient-to-r from-blue-500 to-purple-500 text-white font-semibold rounded-lg btn-primary
              hover:shadow-md transition-all duration-200 hover:-translate-y-0.5 ml-auto mr-auto float-right">
                    UPDATE CUSTOMER
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
                  Upload docuents for customer here, <br />
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
          title="Customer Updated"
          primaryAction={{ label: "View Customers", path: "/customers/list" }}
          secondaryAction={{ label: "Go to Dashboard", path: "/dashboard" }}
        >
          The customer has been updated.
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

export default EditCustomers;
