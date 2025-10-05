import InnerHeader from "../../components/Shared/InnerHeader"
import custiomer from '../../assets/images/customer.png';
import { ChevronDown, ChevronUp, PenBox } from "lucide-react";
import { useEffect, useState } from "react";
import { addUser, getAllUsers, getNewCode } from "../../api/userApi";
import { UsersBrief } from "../../interfaces/User";
import MessageBox from "../../components/Shared/MessageBox";
import { AnimatePresence } from "framer-motion";
import ChangeUserStatusPopup from "../../components/Popups/ChangeUserStatusPopup";

const ManageUsers: React.FC = () => {
  const [usersList, setUsersList] = useState<UsersBrief[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [userCode, setUserCode] = useState("");
  const [activePopup, setActivePopup] = useState<{ type: string | null; userId: number | null }>({ type: null, userId: null });

  const [sortConfig, setSortConfig] = useState<{
    key: keyof UsersBrief;
    direction: "asc" | "desc";
  } | null>(null);

  //Message Boxes
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [showErrorModal, setShowErrorModal] = useState<string[]>([]);

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    role: "CSR",
  });

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

  // Fetching All users
  useEffect(() => {
    const loadAddOns = async () => {
      try {
        const data = await getAllUsers();
        setUsersList(data as UsersBrief[]);
        console.log(data);
      } catch (error) {
        console.error("Failed to fetch AddOns:", error);
      }
    };

    loadAddOns();
  }, []);

  // Fetching User Code
  useEffect(() => {
    const fetchUserCode = async () => {
      try {
        const code = await getNewCode();
        setUserCode(code as string);
      } catch (error) {
        console.error("Failed to get user code:", error);
      }
    };

    fetchUserCode();
  }, []);

  type AddUserResult = {
    errors?: string[];
    success?: boolean;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const fd = new FormData();

    // Step 1: Contract Details
    fd.append("Name", formData.name.toString());
    fd.append("Email", formData.email.toString());
      fd.append("Roles", formData.role.toString());

    const result = await addUser(fd) as AddUserResult;
    console.log(result)
    if (result?.errors) {
      console.log(result?.errors)
      setShowErrorModal(result.errors);
    } else {
      setShowSuccessModal(true);
    }
  };

  const handleSort = (key: keyof UsersBrief) => {
    let direction: "asc" | "desc" = "asc";
    if (
      sortConfig &&
      sortConfig.key === key &&
      sortConfig.direction === "asc"
    ) {
      direction = "desc";
    }
    setSortConfig({ key, direction });
  };

  // Filtering Data
  const filteredUsers = usersList
    .filter((addit) => {
      const matchesSearch =
        addit.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        addit.userCode.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesSearch;
    })

  return (
    <>
      <div className="flex-1 overflow-y-auto p-4 bg-gray-100 main-bg">
        <div className="grid grid-cols-1 md:grid-cols-1 lg:grid-cols-1">
          <InnerHeader
            title="User Management"
            breadcrum="Settings ➞ Manage Users"
            icon={custiomer}
          />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-10 gap-4">
          {/* Add Customer Form */}
          <div className="lg:col-span-7 card float-left bg-white rounded-lg shadow-md overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    {[
                      "Code",
                      "Name",
                      "Email",
                      "Role",
                      "Status",
                      "Actions",
                    ].map((header, index) => {
                      const key = header
                        .toLowerCase()
                        .replace(" ", "") as keyof UsersBrief;
                      return (
                        <th
                          key={header}
                          onClick={() => header !== "Actions" && handleSort(key)}
                          className={`px-6 py-3 text-left text-xs bg-white font-medium text-gray-500 uppercase tracking-wider ${header !== "Actions"
                              ? "cursor-pointer hover:bg-gray-100"
                              : ""
                            }`}
                        >
                          <div className="flex items-center gap-2">
                            {header}
                            {header !== "Actions" &&
                              sortConfig?.key === key &&
                              (sortConfig.direction === "asc" ? (
                                <ChevronUp size={14} />
                              ) : (
                                <ChevronDown size={14} />
                              ))}
                          </div>
                        </th>
                      );
                    })}
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {filteredUsers.map((users) => (
                    <tr key={users.userID} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        {users.userCode}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {users.name}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {users.email}
                      </td>
                       <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {users.roles}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span
                          className={`px-2 py-1 text-xs font-medium rounded-full ${users.status === "Active"
                              ? "bg-green-100 text-green-800"
                              : "bg-red-100 text-red-800"
                            }`}
                        >
                          {users.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => setActivePopup({ type: 'status', userId: Number(users.userID) })}
                            className="btn-sm p-1 text-green-600 hover:bg-green-50 rounded-full transition-colors"
                            title="Change Status"
                          >
                            <PenBox size={18} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="lg:col-span-3 float-right bg-white rounded-lg shadow card p-6">

            <div className="flex justify-between items-center mt-2">
              <h3 className="w-full card-header text-xl">Add New User</h3>
            </div>
            <div className="w-full">
              Enter the details below:
            </div>
            <div className="mt-6">
              <label
                htmlFor="contractCode"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Code:
              </label>
              <input
                type="text"
                name="contractCode"
                value={userCode}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
              />
            </div>

            <div className="mt-4">
              <label
                htmlFor="postalCode"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Full Name:
              </label>
              <input
                required
                type="text"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                placeholder="Enter Full Name"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
              />
            </div>

            <div className="mt-4">
              <label
                htmlFor="city"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Email Address:
              </label>
              <input
                required
                type="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                placeholder="Enter Email"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
              />
            </div>

            <div className="mt-4">
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          User Type
                        </label>
                        <div className="relative">
                          <select
                            required
                            name="role"
                            value={formData.role}
                            onChange={handleInputChange}
                            className=" w-full p-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          >
                            <option value="CSR">
                              Customer Representative
                            </option>
                              <option value="Manager">
                              Manager
                            </option>
                          </select>
                        </div>
                      </div>

            <button type="submit" className="w-full mt-6 mb-4 py-3 bg-gradient-to-r from-blue-500 to-purple-500 text-white font-semibold rounded-lg btn-primary
                  hover:shadow-md transition-all duration-200 hover:-translate-y-0.5 ml-auto mr-auto float-right"
            >
              ADD USER
            </button>

          </form>
        </div>
      </div>

      <AnimatePresence>
        {activePopup.type === 'status' && (
          <ChangeUserStatusPopup
            userID={activePopup.userId!}
            onClose={() => setActivePopup({ type: null, userId: null })}
          />
        )}
      </AnimatePresence>

      {showSuccessModal && (
        <MessageBox
          onClose={handleCloseModal}
          code="green"
          title="User Created"
          primaryAction={{ label: "View Users", path: "/users" }}
          secondaryAction={{ label: "Go to Dashboard", path: "/dashboard" }}
        >
          The user has been successfully created. The password will be sent to the user's email.
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
  )
}
export default ManageUsers;