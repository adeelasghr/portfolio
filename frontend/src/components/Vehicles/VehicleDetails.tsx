import React, { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import {
  Building,
  Car,
  Edit,
  Image,
  Gauge,
  CheckCheck,
} from "lucide-react";
import { MaintenanceScheduleItem, Vehicle } from "../../interfaces/Vehicle";
import { baseImageUrl } from "../../utils/config";

interface TabData {
  id: string;
  label: string;
  icon: React.ReactNode;
  content: React.ReactNode;
}
interface VehicleDetailsProps {
  vehicle: Vehicle;
}
const VehicleDetails: React.FC<VehicleDetailsProps> = ({ vehicle }) => {
  const [activePopup, setActivePopup] = useState<{
    type: string | null;
    mainId: number | null;
  }>({ type: null, mainId: null });
  const [activeTab, setActiveTab] = useState("contact");
  const [selectedMainId, setSelectedMainId] = useState<number>(0);
  console.log(vehicle);

  const tabs: TabData[] = [
    {
      id: "contact",
      label: "Technical Info",
      icon: <Car size={18} />,
      content: (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <label className="text-sm text-gray-500">Vehicle Type:</label>
            <p className="text-lg font-medium">{vehicle.type}</p>
          </div>
          <div>
            <label className="text-sm text-gray-500">Transmission:</label>
            <p className="text-lg font-medium">{vehicle.transmission}</p>
          </div>
          <div>
            <label className="text-sm text-gray-500">Fuel Type:</label>
            <p className="text-lg font-medium">{vehicle.fuelType}</p>
          </div>
          <div>
            <label className="text-sm text-gray-500">No. Of Seats:</label>
            <p className="text-lg font-medium">{vehicle.noOfSeats} Seats</p>
          </div>
          <div>
            <label className="text-sm text-gray-500">Color:</label>
            <p className="text-lg font-medium">{vehicle.color}</p>
          </div>
          <div>
            <label className="text-sm text-gray-500">Mileage:</label>
            <p className="text-lg font-medium">{vehicle.mileage}</p>
          </div>
          <div>
            <label className="text-sm text-gray-500">Lugguage:</label>
            <p className="text-lg font-medium">{vehicle.luggage} bags</p>
          </div>
          <div>
            <label className="text-sm text-gray-500">Group:</label>
            <p className="text-lg font-medium">{vehicle.group}</p>
          </div>
          <div>
            <label className="text-sm text-gray-500">Features:</label>
            <p className="text-lg font-medium">{vehicle.features}</p>
          </div>
        </div>
      ),
    },
    {
      id: "identification",
      label: "Contract History",
      icon: <Building size={18} />,
      content: (
        <div className="space-y-6">
          <div className="bg-gray-50 p-4 rounded-lg">
            <p className="text-gray-600">No contract found</p>
          </div>
        </div>
      ),
    },
    {
      id: "vehicles",
      label: "Maintenance Schedule",
      icon: <Gauge size={18} />,
      content: (
        <div className="space-y-6">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th
                  className="text-sm text-black font-medium"
                  style={{ textAlign: "left", padding: "10px 25px" }}
                >
                  Type
                </th>
                <th
                  className="text-sm text-black font-medium"
                  style={{ textAlign: "left", padding: "10px 25px" }}
                >
                  Date
                </th>
                <th
                  className="text-sm text-black font-medium"
                  style={{ textAlign: "left", padding: "10px 25px" }}
                >
                  Odometer
                </th>
                <th
                  className="text-sm text-black font-medium"
                  style={{ textAlign: "left", padding: "10px 25px" }}
                >
                  Status
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {vehicle.maintenanceSchedule.map(
                (item: MaintenanceScheduleItem) => (
                  <tr key={item.serviceType} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {item.serviceName}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {item?.scheduleDate.split(" ")[0]}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {item.odometer}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      <span
                        className={`px-2 py-1 text-xs font-medium rounded-full ${
                          item.status === "Complete"
                            ? "bg-green-100 text-green-800"
                            : item.status === "Overdue"
                            ? "bg-red-100 text-red-800"
                            : "bg-purple-100 text-black-800"
                        }`}
                      >
                        {item.status}
                      </span>
                    </td>
                  </tr>
                )
              )}
            </tbody>
          </table>
        </div>
      ),
    },
    {
      id: "inspection",
      label: "Inspection",
      icon: <CheckCheck size={18} />,
      content: (
        <div className="space-y-6">
          <div className="grid grid-cols-5 gap-4 bg-gray-50 p-4 rounded-lg">
            {vehicle.inspections && vehicle.inspections.length > 0 ? (
              vehicle.inspections.map((img, index) => (
                <div key={index} className="flex flex-col items-center">
                  <img
                    src={`${baseImageUrl}${img.image}`}
                    alt={`Inspection ${index + 1}`}
                    className="w-full h-auto rounded-md object-cover"
                  />
                  <p className="text-sm text-center mt-2">{img.remarks}</p>
                </div>
              ))
            ) : (
              <p className="col-span-5 text-center">No inspection report</p>
            )}
          </div>
        </div>
      ),
    },
    {
      id: "documents",
      label: "Pictures",
      icon: <Image size={18} />,
      content: (
        <div className="space-y-6">
          <div className="grid grid-cols-3 gap-4 bg-gray-50 p-4 rounded-lg">
            <p className="w-full">
              {vehicle.vehicleImages && vehicle.vehicleImages.length > 0 ? (
                vehicle.vehicleImages.map((img, index) => (
                  <img
                    key={index}
                    src={`${baseImageUrl}${img.imagePath}`}
                    alt=""
                  />
                ))
              ) : (
                <p>No images uploaded</p>
              )}
            </p>
          </div>
        </div>
      ),
    },
  ];


  return (
    <>
      <div
        className="bg-white rounded-lg shadow-md overflow-hidden"
        style={{
          width: "100%",
          minHeight: "50vh",
          backgroundColor: "rgba(255, 255, 255, 0.6)",
        }}
      >
        {/* Tabs */}
        <div className="border-b border-gray-200">
          <div className="flex overflow-x-auto">
            {tabs.map((tab) => (
              <button
                style={{ fontSize: "17px" }}
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`relative px-6 py-4 flex items-center gap-2 whitespace-nowrap
                ${
                  activeTab === tab.id
                    ? "active-tab"
                    : "text-gray-500 hover:text-gray-700"
                }`}
              >
                {tab.icon}
                {tab.label}
                {activeTab === tab.id && (
                  <motion.div
                    layoutId="activeTab"
                    className="absolute bottom-0 left-0 right-0 h-0.5 according-tab-bg"
                    initial={false}
                    transition={{ type: "spring", stiffness: 500, damping: 30 }}
                  />
                )}
              </button>
            ))}
          </div>
        </div>

        {/* Tab Content */}
        <div className="p-6">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
          >
            {tabs.find((tab) => tab.id === activeTab)?.content}
          </motion.div>
        </div>
      </div>

    </>
  );
};

export default VehicleDetails;
