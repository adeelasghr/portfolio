import { id } from "date-fns/locale";
import maintain from "../../assets/images/maintenance.png";
import InnerHeader from "../../components/Shared/InnerHeader";
import {
  Car,
  Code,
  CreditCard,
  Edit,
  Group,
  List,
  Settings,
  User,
} from "lucide-react";
import SearchableDropdown from "../../components/Shared/SearchableDropdown";
import { useState } from "react";
import { Vehicle } from "../../interfaces/Vehicle";
import { getvehicleDetails } from "../../api/vehicleApi";
import { baseImageUrl } from "../../utils/config";
import { AnimatePresence } from "framer-motion";
import MaintenanceEditPopup from "../../components/Popups/MaintenanceEditPopup";
import AddMaintenancePopup from "../../components/Popups/AddMaintenancePopup";
import AddInspectionPopup from "../../components/Popups/AddInspectionPopup";

const Maintenance: React.FC = () => {
  const [veh, setVeh] = useState<Vehicle | null>();
  const [vehID, setVehID] = useState<number | null>();
  const [selectedMainId, setSelectedMainId] = useState<number>(0);
  const [activePopup, setActivePopup] = useState<{
    type: string | null;
    vehId: number | null;
    vehCode?: string;
  }>({ type: null, vehId: null });

  const handleSelect = (id: number) => {
    setVehID(id);
    const fetchVehicle = async () => {
      try {
        const data = (await getvehicleDetails(id)) as Vehicle;
        setVeh(data);
        console.log(data);
      } catch (error) {
        console.error("Failed to fetch vehicle:", error);
      }
    };
    fetchVehicle();
  };

  const handleEdit = (mainId: string) => {
    setSelectedMainId(Number(mainId));
    setActivePopup({ type: "delete", vehId: Number(mainId) });
    console.log("Delete customer:", mainId);
  };

  return (
    <>
      <div className="flex-1 overflow-y-auto p-4 bg-gray-100 main-bg">
        <div className="grid grid-cols-1 md:grid-cols-1 lg:grid-cols-1">
          <InnerHeader
            title="Maintenance"
            breadcrum="Vehicles ➞ Maintenance List"
            icon={maintain}
          />
        </div>

        <div className="max-w-full">
          <div className="grid grid-cols-1 lg:grid-cols-10 gap-2">
            {/* First Column */}
            <div
              className="lg:col-span-2 rounded-lg shadow card p-2"
              style={{ minHeight: "70vh" }}
            >
              <div className="flex justify-between items-center mb-2 mt-2">
                <h3 className="w-full card-header text-xl">
                  <Car
                    size={20}
                    className="ml-2 mr-2 text-purple"
                    style={{ float: "left", marginTop: "2px" }}
                  />
                  Vehicle
                </h3>
              </div>
              <div className="mx-4">
                <SearchableDropdown onSelect={handleSelect} />
              </div>
              {veh && (
                <div className="p-4">
                  <div className="w-full p-4">
                    <h2 className="text-3xl text-gray-900">
                      {veh ? veh.brand : ""} {veh ? veh.plateNumber : ""}
                    </h2>
                    <p className="text-indigo-900">
                      Vehicle Added:{" "}
                      {veh?.createdOn
                        ? new Date(veh?.createdOn).toLocaleDateString("en-GB", {
                            day: "2-digit",
                            month: "short",
                            year: "numeric",
                          })
                        : "-"}
                    </p>
                    {/* <span
                    className="text-xs cursor-pointer"
                    onClick={() => id && handleEdit(veh ? veh.ID : "")}
                  >
                    (Edit Information)
                  </span> */}
                  </div>

                  {/* Contact Details */}
                  <div className=" grid grid-cols-1 gap-4 p-4 text-indigo-900">
                    <div className="flex items-center gap-3">
                      <Code size={20} className="text-indigo-600" />
                      <span>{veh ? veh.code : ""}</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <Group size={20} className="text-indigo-600" />
                      <span>{veh ? veh.group : ""}</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <CreditCard size={20} className="text-indigo-600" />
                      <span>€ {veh ? veh.dailyRate : ""} /day</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <User size={20} className="text-indigo-600" />
                      <span>{veh ? veh.status : ""}</span>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Second Column */}
            <div className="lg:col-span-5 float-right bg-white rounded-lg shadow card p-2">
              <div className="flex justify-between items-center mb-2 mt-2">
                <h3 className="w-full card-header text-xl">
                  <List
                    size={20}
                    className="ml-2 mr-2 text-purple"
                    style={{ float: "left", marginTop: "2px" }}
                  />
                  Maintenance Schedule
                </h3>
              </div>
              <div className="col-span-full" style={{ minHeight: "70vh" }}>
                <div>
                  {veh ? (
                    veh.maintenanceSchedule &&
                    veh.maintenanceSchedule.length > 0 ? (
                      <>
                        <div className="overflow-x-auto">
                          <table className="w-full border border-gray-200">
                            <thead className="bg-gray-50">
                              <tr>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                  Type
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                  Odometer
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                  Service Date
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                  Status
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                  Actions
                                </th>
                              </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-200">
                              {veh.maintenanceSchedule.map((maint) => (
                                <tr
                                  key={maint.serviceType}
                                  className="odd:bg-gray-50/30 even:bg-gray-50 hover:bg-gray-50"
                                >
                                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                    {maint.serviceName}
                                  </td>
                                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                    {maint.odometer}
                                  </td>
                                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                    {maint?.scheduleDate
                                      ? new Date(
                                          maint.scheduleDate
                                        ).toLocaleDateString("en-GB", {
                                          day: "2-digit",
                                          month: "short",
                                          year: "numeric",
                                        })
                                      : "-"}
                                  </td>
                                  <td className="px-6 py-4 whitespace-nowrap">
                                    <span
                                      className={`px-2 py-1 text-xs font-medium rounded-full ${
                                        maint.status === "Complete"
                                          ? "bg-green-100 text-green-800"
                                          : maint.status === "Overdue"
                                          ? "bg-red-100 text-red-800"
                                          : "bg-purple-100 text-black-800"
                                      }`}
                                    >
                                      {maint.status}
                                    </span>
                                  </td>
                                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                    <button
                                      onClick={() =>
                                        handleEdit(maint.serviceType.toString())
                                      }
                                      className="p-1 text-indigo-600 rounded-full transition-colors"
                                      title="Edit"
                                    >
                                      <Edit size={18} />
                                    </button>
                                  </td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        </div>
                        <button
                          className="mt-2 px-4 py-2 bg-purple-600 text-white text-xs rounded-lg mx-auto block"
                          onClick={() =>
                            setActivePopup({
                              type: "schedule",
                              vehId: vehID!,
                              vehCode: veh.code,
                            })
                          }
                        >
                          Add New Schedule
                        </button>
                      </>
                    ) : (
                      <div className="flex flex-col items-center justify-center h-full text-sm mt-12">
                        <p>This vehicle has no maintenance schedule.</p>
                        <button
                          className="mt-2 px-4 py-2 bg-purple-600 text-white text-s rounded-lg"
                          onClick={() =>
                            setActivePopup({
                              type: "schedule",
                              vehId: vehID!,
                              vehCode: veh.code,
                            })
                          }
                        >
                          Add Schedule
                        </button>
                      </div>
                    )
                  ) : (
                    <div className="flex items-center justify-center h-full min-h-[70vh] text-sm">
                      <p>Please select a vehicle to view its schedule.</p>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Third Column */}
            <div className="lg:col-span-3 float-right bg-white rounded-lg shadow card p-2">
              <div className="flex justify-between items-center mb-2 mt-2">
                <h3 className="w-full card-header text-xl">
                  <Settings
                    size={20}
                    className="ml-2 mr-2 text-purple"
                    style={{ float: "left", marginTop: "2px" }}
                  />
                  Inspection Report
                </h3>
              </div>
              <div className="col-span-full" style={{ minHeight: "70vh" }}>
                {veh ? (
                  <>
                    <div className="grid grid-cols-2 gap-4 p-4 rounded-lg">
                      {veh.inspections && veh.inspections.length > 0 ? (
                        <>
                          {veh.inspections.map((item, index) => (
                            <div
                              key={index}
                              className="flex flex-col items-center"
                            >
                              <img
                                src={`${baseImageUrl}${item.image}`}
                                alt={`Inspection ${index + 1}`}
                                className="w-full h-auto rounded-md object-cover"
                              />
                              <p className="text-sm text-center mt-2">
                                {item.remarks}
                              </p>
                            </div>
                          ))}

                          {/* Add New Inspection button AFTER the grid */}
                          <div className="col-span-2 flex justify-center mt-4">
                            <button
                              className="px-4 py-2 bg-purple-600 text-white text-xs rounded-lg"
                              onClick={() =>
                                setActivePopup({
                                  type: "inspection",
                                  vehId: vehID!,
                                  vehCode: veh.code,
                                })
                              }
                            >
                              Add New Inspection
                            </button>
                          </div>
                        </>
                      ) : (
                        <div className="flex flex-col items-center justify-center col-span-2 w-full text-sm">
                          <p className="mt-6 text-center">
                            This vehicle has no damages.
                          </p>
                          <button
                            className="mt-2 px-4 py-2 bg-purple-600 text-white text-s rounded-lg"
                            onClick={() =>
                              setActivePopup({
                                type: "inspection",
                                vehId: vehID!,
                                vehCode: veh.code,
                              })
                            }
                          >
                            Add Inspection
                          </button>
                        </div>
                      )}
                    </div>
                  </>
                ) : (
                  <div className="flex items-center justify-center h-full min-h-[70vh]">
                    <p className="text-sm text-center">
                      Please select a vehicle to view its report.
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      <AnimatePresence>
        {activePopup.type === "delete" && (
          <MaintenanceEditPopup
            mainId={selectedMainId}
            onClose={() => setActivePopup({ type: null, vehId: null })}
          />
        )}

        {activePopup.type === "schedule" && (
          <AddMaintenancePopup
            vehicleID={activePopup.vehId!}
            onClose={() => setActivePopup({ type: null, vehId: null })}
            vehicleCode={activePopup.vehCode!}
          />
        )}

        {activePopup.type === "inspection" && (
          <AddInspectionPopup
            vehicleID={activePopup.vehId!}
            onClose={() => setActivePopup({ type: null, vehId: null })}
            vehicleCode={activePopup.vehCode!}
          />
        )}
      </AnimatePresence>
    </>
  );
};

export default Maintenance;
