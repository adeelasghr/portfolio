import vehicle from '../../assets/images/vehicle.png';
import InnerHeader from '../../components/Shared/InnerHeader';
import VehicleTable from '../../components/Vehicles/VehicleTable';


const ListVehicles: React.FC = () => {
 
  return (
    <div className="flex-1 overflow-y-auto p-4 bg-gray-100 main-bg">
      <div className="grid grid-cols-1 md:grid-cols-1 lg:grid-cols-1">
        <InnerHeader 
          title="Vehicle List" 
          breadcrum="Vehicles ➞ All Vehicle" 
          icon={vehicle}
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-1 lg:grid-cols-1" style={{ minHeight: '70vh'}}>
        <VehicleTable />
      </div>
    </div>
  );
};

export default ListVehicles;