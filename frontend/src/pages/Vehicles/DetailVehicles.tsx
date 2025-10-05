import vehicle from "../../assets/images/vehicle.png";
import InnerHeader from "../../components/Shared/InnerHeader";
import EmptyBlock from "../../components/Shared/EmptyBlock";
import VehicleDetails from "../../components/Vehicles/VehicleDetails";
import { MaintenanceScheduleItem, Vehicle } from "../../interfaces/Vehicle";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { getvehicleDetails } from "../../api/vehicleApi";
import { CarFront, Calendar, CreditCard, User } from "lucide-react";
import { AnimatePresence } from "framer-motion";
import VehicleChangeStatusPopup from "../../components/Popups/VehicleChangeStatusPopup";
import { baseImageUrl } from "../../utils/config";

const DetailVehicle: React.FC = () => {
  const [activePopup, setActivePopup] = useState<{
    type: string | null;
    vehId: number | null;
  }>({ type: null, vehId: null });
  const [veh, setVeh] = useState<Vehicle | null>();
  const { id } = useParams();
  const navigate = useNavigate();

  // Fetching Vehicle data
  useEffect(() => {
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
  }, [id]);

  const handleChangeStatus = () => {
    setActivePopup({ type: "change", vehId: Number(id) });
  };

  const handleEdit = (vehicleId: string) => {
    navigate(`/vehicles/edit/${vehicleId}`);
  };

  const getUpcomingServiceDate = (
    scheduleList: MaintenanceScheduleItem[]
  ): string => {
    const upcoming = scheduleList
      .filter(
        (item) =>
          new Date(item.scheduleDate) > new Date() &&
          item.status === "Scheduled"
      )
      .sort(
        (a, b) =>
          new Date(a.scheduleDate).getTime() -
          new Date(b.scheduleDate).getTime()
      )[0];

    return upcoming
      ? new Date(upcoming.scheduleDate).toLocaleDateString("en-GB", {
          day: "2-digit",
          month: "short",
          year: "numeric",
        })
      : "not scheduled";
  };

  return (
    <>
      <div className="flex-1 overflow-y-auto p-4 bg-gray-100 main-bg">
        {/* Header */}
        <div className="grid grid-cols-1 md:grid-cols-1 lg:grid-cols-1">
          <InnerHeader
            title="Vehicle Details"
            breadcrum="Vehicles ➞ Details"
            icon={vehicle}
          />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-10 gap-4">
          <div
            className="lg:col-span-3 bg-white rounded-lg shadow card"
            style={{ padding: "35px" }}
          >
            <div>
              <div className="flex">
                <div className="w-1/4">
                  <div className="w-full aspect-square rounded-lg overflow-hidden mb-6">
                    {veh?.vehicleImages && veh.vehicleImages.length > 0 ? (
                      <img
                        src={`${baseImageUrl}${veh.vehicleImages[0].imagePath}`}
                        alt="Vehicle"
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <img
                        src="/default-avatar.png" // Update this to your actual default image path
                        alt="Default Vehicle"
                        className="w-full h-full object-cover"
                      />
                    )}
                  </div>
                </div>
                <div className="w-3/4 p-4">
                  <h2 className="text-3xl text-gray-900">
                    {veh ? veh.plateNumber : ""}
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
                  <span
                    className="text-xs cursor-pointer"
                    onClick={() => id && handleEdit(id)}
                  >
                    (Edit Information)
                  </span>
                </div>
              </div>
              <button
                onClick={() => handleChangeStatus()}
                className="mb-6 mt-2 w-full py-3 bg-gradient-to-r from-blue-500 to-purple-500 text-white font-semibold rounded-lg btn-primary
                hover:shadow-md transition-all duration-200 hover:-translate-y-0.5"
              >
                {veh?.status === "Available"
                  ? "DISABLE VEHICLE"
                  : "ENABLE VEHICLE"}
              </button>
              <p className="mt-2 text-gray-700">
                The vehicle {veh ? veh.plateNumber : ""} was added in the system
                on
                {veh?.createdOn
                  ? new Date(veh?.createdOn).toLocaleDateString("en-GB", {
                      day: "2-digit",
                      month: "short",
                      year: "numeric",
                    })
                  : "-"}
                . It has 0 contracts till date and its next maintenance is
                {getUpcomingServiceDate(veh?.maintenanceSchedule || [])}.
              </p>

              {/* Contact Details */}
              <div className="mt-6 space-y-4">
                <div className="flex items-center gap-3 text-indigo-900">
                  <CarFront size={20} className="text-indigo-600" />
                  <span>
                    {veh ? veh.brand : ""} {veh ? veh.model : ""}
                  </span>
                </div>
                <div className="flex items-center gap-3 text-indigo-900">
                  <Calendar size={20} className="text-indigo-600" />
                  <span>{veh ? veh.year : ""}</span>
                </div>
                <div className="flex items-center gap-3 text-indigo-900">
                  <CreditCard size={20} className="text-indigo-600" />
                  <span>€{veh ? veh.dailyRate : ""} /day</span>
                </div>
                <div className="flex items-center gap-3 text-indigo-900">
                  <User size={20} className="text-indigo-600" />
                  <span>{veh ? veh.status : ""}</span>
                </div>
              </div>
            </div>
          </div>

          <div className="lg:col-span-7">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <EmptyBlock title="Code:" value={veh ? veh.code : ""} />
              <EmptyBlock title="Contracts:" value="0" />
              <EmptyBlock
                title="Next Service:"
                value={getUpcomingServiceDate(veh?.maintenanceSchedule || [])}
              />
              <EmptyBlock title="Status:" value={veh ? veh.status : ""} />
            </div>

            {/* Tabs */}
            <div className="lg:col-span-7 bg-white rounded-lg shadow p-1 card mt-4">
              <div className="flex justify-between items-center mt-2">
                {veh && <VehicleDetails vehicle={veh} />}
              </div>
            </div>
          </div>
        </div>
      </div>

      <AnimatePresence>
        {activePopup.type === "change" && (
          <VehicleChangeStatusPopup
            status={veh ? veh.status : ""}
            vehicleId={Number(id)}
            onClose={() => setActivePopup({ type: null, vehId: null })}
          />
        )}
      </AnimatePresence>
    </>
  );
};

export default DetailVehicle;
