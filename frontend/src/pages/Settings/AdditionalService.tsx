import InnerHeader from "../../components/Shared/InnerHeader";
import vehicle from "../../assets/images/vehicle.png";
import { AddOnsBrief } from "../../interfaces/AddOns";
import { Search } from "lucide-react";
import { useEffect, useState } from "react";
import { addAddOn, getAllAddOns, getNewCode } from "../../api/addOnApi";
import { baseImageUrl } from "../../utils/config";
import MessageBox from "../../components/Shared/MessageBox";

const AdditionalService: React.FC = () => {
  const [addOnsList, setAddOnsList] = useState<AddOnsBrief[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [addOnCode, setAddOnCode] = useState("");

  //Message Boxes
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [showErrorModal, setShowErrorModal] = useState<string[]>([]);

  const [formData, setFormData] = useState({
    addOnName: "",
    price: "",
    deatils: "",
    image: null as File | null
  });

  type AddAddOnResult = {
    errors?: string[];
    success?: boolean;
  };

  const handleCloseModal = () => {
    //Closing all Message Boxes
    setShowErrorModal([]);
    setShowSuccessModal(false);
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

  //Fetching AddOns
  useEffect(() => {
    const loadAddOns = async () => {
      try {
        const data = await getAllAddOns();
        setAddOnsList(data as AddOnsBrief[]);
        console.log(data);
      } catch (error) {
        console.error("Failed to fetch AddOns:", error);
      }
    };

    loadAddOns();
  }, []);

  // Fetching AddOn Code
  useEffect(() => {
    const fetchAddOnCode = async () => {
      try {
        const code = await getNewCode();
        setAddOnCode(code as string);
      } catch (error) {
        console.error("Failed to get addon code:", error);
      }
    };

    fetchAddOnCode();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const fd = new FormData();

    fd.append("AddOnName", formData.addOnName.toString());
    fd.append("Price", formData.price.toString());
    fd.append("Deatils", formData.deatils.toString());
    if (formData.image) {
        fd.append("Image", formData.image);
    }

    const result = await addAddOn(fd) as AddAddOnResult;
    console.log(result)
    if (result?.errors) {
      setShowErrorModal(result.errors);
    } else {
      setShowSuccessModal(true);
    }
  };

  // Filtering Data
  const filteredAdditional = addOnsList.filter((addit) => {
    const matchesSearch =
      addit.addOnName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      addit.addOnCode.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesSearch;
  });

  return (
    <>
    <div className="flex-1 overflow-y-auto p-4 bg-gray-100 main-bg">
      <div className="grid grid-cols-1 md:grid-cols-1 lg:grid-cols-1">
        <InnerHeader
          title="Additional Services"
          breadcrum="Settings ➞ Additional Services"
          icon={vehicle}
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-10 gap-4">
        {/* Add Customer Form */}
        <div className="lg:col-span-7 card float-left bg-white rounded-lg shadow-md overflow-hidden">
          <form className="p-6">
            {/* Personal Information */}
            <div className="mb-8">
              <div className="grid grid-cols-1 gap-6">
                <div className="mb-0">
                  <div className="relative">
                    <Search
                      className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                      size={18}
                    />
                    <input
                      type="text"
                      placeholder="Search additional service..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="pl-10 w-full p-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                </div>

                <div
                  className="grid grid-cols-1 md:grid-cols-4 gap-2"
                  style={{ overflowY: "scroll", height: "490px" }}
                >
                  {filteredAdditional.map((additional) => (
                    <div
                      key={additional.addOnID}
                      style={{ height: "fit-content" }}
                      className={`
              border rounded-lg p-2 cursor-pointer transition-all duration-300 `}
                    >
                      <div className="flex items-center justify-between mb-3">
                        <div>
                          <h3 className="text-lg font-semibold">
                            {additional.addOnName}
                          </h3>
                          <p className="text-gray-600 text-sm">
                            {additional.addOnCode}
                          </p>
                        </div>
                      </div>
                      <img
                        src={baseImageUrl + additional.image}
                        alt={additional.addOnName}
                        className="w-full h-32 object-cover rounded-lg mb-3"
                      />
                      <div className="space-y-1">
                        <p className="text-gray-600">
                          Price ${additional.price}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </form>
        </div>

        {/* Document Upload */}
        <form onSubmit={handleSubmit} className="lg:col-span-3 float-right bg-white rounded-lg shadow card p-6">
          <div className="flex justify-between items-center mt-2">
            <h3 className="w-full card-header text-xl">Add New Service</h3>
          </div>
          <div className="w-full">Enter the details below:</div>
          <div className="mt-6">
            <label
              htmlFor="additionalInfo"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Code:
            </label>
            <input
              type="text"
              name="addOnCode"
              value={addOnCode}
              placeholder="Additional Info"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
            />
          </div>

          <div className="mt-4">
            <label
              htmlFor="postalCode"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Service Title:
            </label>
            <input
              required
              type="text"
              name="addOnName"
              value={formData.addOnName}
              onChange={handleInputChange}
              placeholder="Enter Title"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
            />
          </div>

          <div className="mt-4">
            <label
              htmlFor="city"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Cost:
            </label>
            <input
              required
              type="number"
              name="price"
              value={formData.price}
              onChange={handleInputChange}
              placeholder="Enter Cost"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
            />
          </div>

          <div className="mt-4">
            <label
              htmlFor="postalCode"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Service Detail:
            </label>
            <input
              required
              type="text"
              name="deatils"
              value={formData.deatils}
              onChange={handleInputChange}
              placeholder="Enter Details"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
            />
          </div>

          <div className="mt-4">
            <label
              htmlFor="city"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Image:
            </label>
            <input
              required
              type="file"
              name="image"
              onChange={(e) => {
                if (e.target.files && e.target.files[0]) {
                  setFormData((prev) => ({
                    ...prev,
                    image: e.target.files![0],
                  }));
                }
              }}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
            />
          </div>

          <button
            type="submit"
            className="w-full mt-6 mb-4 py-3 bg-gradient-to-r from-blue-500 to-purple-500 text-white font-semibold rounded-lg btn-primary
            hover:shadow-md transition-all duration-200 hover:-translate-y-0.5 ml-auto mr-auto float-right"
          >
            ADD SERVICE
          </button>
        </form>
      </div>
    </div>

      {showSuccessModal && (
        <MessageBox
          onClose={handleCloseModal}
          code="green"
          title="AddOn Created"
          primaryAction={{ label: "View AddOns", path: "/addons" }}
          secondaryAction={{ label: "Go to Dashboard", path: "/dashboard" }}
        >
          The add on service has been successfully created.
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
            <ul className="list-none list-inside">
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
export default AdditionalService;
