import maintain from "../../assets/images/maintenance.png";
import InnerHeader from "../../components/Shared/InnerHeader";
import {
  Car,
  CheckCircle,
  Code,
  CreditCard,
  FileText,
  FileWarning,
  Group,
  RefreshCw,
  User,
} from "lucide-react";
import SearchableDropdown from "../Shared/SearchableDropdown";
import { getVehicleHistory, getVehicleStats } from "../../api/vehicleApi";
import { useState } from "react";
import type { VehicleHistoryI, VehicleStats } from "../../interfaces/Vehicle";
import { id } from "date-fns/locale";
import { useNavigate } from "react-router-dom";
import EmptyBlock from "../Shared/EmptyBlock";

const getIconForTitle = (title: string) => {
  switch (title) {
    case "Vehicle Added":
      return (
        <Car className="w-5 h-5" style={{ color: "rgb(117, 105, 202)" }} />
      );
    case "Contract Created":
      return (
        <FileText className="w-5 h-5" style={{ color: "rgb(117, 105, 202)" }} />
      );
    case "Contract Closed":
      return (
        <FileText className="w-5 h-5" style={{ color: "rgb(117, 105, 202)" }} />
      );
    case "Status Changed":
      return (
        <RefreshCw
          className="w-5 h-5"
          style={{ color: "rgb(117, 105, 202)" }}
        />
      );
    case "Damage Report":
      return (
        <FileWarning
          className="w-5 h-5"
          style={{ color: "rgb(117, 105, 202)" }}
        />
      );
    default:
      return (
        <CheckCircle
          className="w-5 h-5"
          style={{ color: "rgb(117, 105, 202)" }}
        />
      );
  }
};

const VehicleHistoryI: React.FC = () => {
  const [vehicleHistory, setVehicleHistory] = useState<VehicleHistoryI | null>(
    null
  );
  const [vehicleStats, setVehicleStats] = useState<VehicleStats | null>(null);
  const navigate = useNavigate();

  const handleSelect = (id: number) => {
    console.log("Selected vehicle ID:", id);

    const fetchVehicleHistory = async () => {
      try {
        const response = await getVehicleHistory(id);
        console.log(response);
        setVehicleHistory(response as VehicleHistoryI);
      } catch (error) {
        console.error("Failed to fetch vehicle history", error);
      }
    };

    fetchVehicleHistory();

    //Getting Vehicle Stats
    const fetchVehicleStats = async () => {
      try {
        const response = await getVehicleStats(id);
        console.log(response);
        setVehicleStats(response as VehicleStats);
      } catch (error) {
        console.error("Failed to fetch vehicle history", error);
      }
    };

    fetchVehicleStats();
  };

  const handleEdit = (vehicleId: string) => {
    navigate(`/vehicles/edit/${vehicleId}`);
  };

  return (
    <div className="flex-1 overflow-y-auto p-4 bg-gray-100 main-bg">
      <div className="grid grid-cols-1 md:grid-cols-1 lg:grid-cols-1">
        <InnerHeader
          title="Vehicle History"
          breadcrum="Vehicles ➞ History"
          icon={maintain}
        />
      </div>

      <div className="max-w-full">
        <div className="grid grid-cols-1 lg:grid-cols-10 gap-2">
          {/* First Column */}
          <div
            className="lg:col-span-3 rounded-lg shadow card p-2"
            style={{ minHeight: "70vh" }}
          >
            <div className="flex justify-between items-center mb-2 mt-2">
              <h3 className="w-full card-header text-xl">
                <Car
                  size={20}
                  className="ml-2 mr-2 text-purple"
                  style={{ float: "left", marginTop: "2px" }}
                />
                Vehicle Detail
              </h3>
            </div>
            <div className="mx-4">
              <SearchableDropdown onSelect={handleSelect} />
            </div>
            {vehicleHistory && (
              <div className="p-4">

                  <div className="w-full p-4">
                    <h2 className="text-3xl text-gray-900">
                      {vehicleHistory ? vehicleHistory.vehicleName : ""}{" "}
                      {vehicleHistory ? vehicleHistory.plateNumber : ""}
                    </h2>
                    <p className="text-indigo-900">
                      Vehicle Added:{" "}
                      {vehicleHistory?.createdOn
                        ? new Date(
                            vehicleHistory?.createdOn
                          ).toLocaleDateString("en-GB", {
                            day: "2-digit",
                            month: "short",
                            year: "numeric",
                          })
                        : "-"}
                    </p>
                    <span
                      className="text-xs cursor-pointer"
                      onClick={() =>
                        id &&
                        handleEdit(
                          vehicleHistory ? vehicleHistory.vehicleID : ""
                        )
                      }
                    >
                      (Edit Information)
                    </span>
                  </div>
                  <p className="mt-2 text-gray-700">
                    The vehicle{" "}
                    {vehicleHistory ? vehicleHistory.plateNumber : ""} was added
                    in the system on
                    {vehicleHistory?.createdOn
                      ? new Date(vehicleHistory?.createdOn).toLocaleDateString(
                          "en-GB",
                          {
                            day: "2-digit",
                            month: "short",
                            year: "numeric",
                          }
                        )
                      : "-"}
                    . It has 0 contracts till date and its next maintenance is 
                    {/* {getUpcomingServiceDate(veh?.maintenanceSchedule || [])}. */}
                  </p>


                {/* Contact Details */}
                <div className="mt-6 grid grid-cols-2 gap-4 text-indigo-900">
                  <div className="flex items-center gap-3">
                    <Code size={20} className="text-indigo-600" />
                    <span>
                      {vehicleHistory ? vehicleHistory.vehicleCode : ""}
                    </span>
                  </div>
                  <div className="flex items-center gap-3">
                    <Group size={20} className="text-indigo-600" />
                    <span>{vehicleHistory ? vehicleHistory.group : ""}</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <CreditCard size={20} className="text-indigo-600" />
                    <span>
                      € {vehicleHistory ? vehicleHistory.dailyRate : ""} /day
                    </span>
                  </div>
                  <div className="flex items-center gap-3">
                    <User size={20} className="text-indigo-600" />
                    <span>{vehicleHistory ? vehicleHistory.status : ""}</span>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Second Column */}
          <div className="lg:col-span-5 float-right bg-white rounded-lg shadow card p-2">
            <div className="w-full h-full card rounded-xl shadow-lg overflow-y-scroll">
              <div className="p-6 space-y-6">
                <div className="space-y-2 pt-6">
                  {vehicleHistory?.history &&
                  vehicleHistory.history.length > 0 ? (
                    vehicleHistory.history.map((item, index) => (
                      <div key={index} className="flex gap-4">
                        <div className="relative">
                          <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center">
                            {getIconForTitle(item.eventType)}
                          </div>
                          {index !== vehicleHistory.history.length - 1 && (
                            <div className="absolute top-8 left-1/2 bottom-0 w-0.5 bg-gray-200 -translate-x-1/2" />
                          )}
                        </div>
                        <div className="flex-1 pb-2">
                          <p className="text-gray-500 text-sm">
                            {new Date(item.createdAt).toLocaleDateString(
                              "en-GB",
                              {
                                day: "2-digit",
                                month: "short",
                                year: "numeric",
                                hour: "2-digit",
                                minute: "2-digit",
                                hour12: false,
                              }
                            )}
                          </p>
                          <h3 className="text-sm font-semibold text-gray-900 mt-1">
                            {item.eventType}
                          </h3>
                          <p className="text-sm">{item.eventDescription}</p>
                        </div>
                      </div>
                    ))
                  ) : (
                    <p className="text-gray-500 text-sm">
                      No history found.
                      <br /> Please select a vehicle
                    </p>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Third Column */}
          <div className="lg:col-span-2 float-right rounded-lg ">
            <div className="mb-4">
              <EmptyBlock
                title="Vehicle Code:"
                value={vehicleHistory ? vehicleHistory.vehicleCode : "-"}
              />
            </div>
            <div className="mb-4">
              <EmptyBlock
                title="Total Contract:"
                value={String(vehicleStats?.totalContracts ?? 0)}
              />
            </div>
            <div className="mb-4">
              <EmptyBlock
                title="Total Income:"
                value={"€ " + String(vehicleStats?.totalIncome ?? 0)}
              />
            </div>
            <div className="mb-4">
              <EmptyBlock
                title="Total Expense:"
                value={"€ " + String(vehicleStats?.totalExpense ?? 0)}
              />
            </div>
            <div className="mb-4">
              <EmptyBlock
                title="Next Maintenance:"
                value={String(vehicleStats?.nextSchedule ?? "-")}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VehicleHistoryI;
