import React from 'react';
import StatCard from '../components/Dashboard/StatCard';
import SalesChart from '../components/Dashboard/SalesChart';
import ContractChart from '../components/Dashboard/ContractChart';
import ReservationsTable from '../components/Dashboard/ReservationsTable';

//Images
import vehicle from '../assets/images/vehicle.png';
import customer from '../assets/images/customer.png';
import reserve from '../assets/images/reserve.png';
import contract from '../assets/images/contract.png';
import VehicleChart from '../components/Dashboard/VehicleChart';

const Dashboard: React.FC = () => {
  return (
    <main className="flex-1 overflow-y-auto p-4 bg-gray-100 main-bg">
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard 
          title="Vehicles" 
          value="234" 
          icon={vehicle}
          color="bg-gradient-to-br from-blue-50 to-white"
        />
        <StatCard 
          title="Customers" 
          value="743" 
          icon={customer}
          color="bg-gradient-to-br from-purple-50 to-white"
        />
        <StatCard 
          title="Bookings" 
          value="96" 
          icon={reserve}
          color="bg-gradient-to-br from-green-50 to-white"
        />
        <StatCard 
          title="Contracts" 
          value="78" 
          icon={contract}
          color="bg-gradient-to-br from-pink-50 to-white"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-6">
        <SalesChart />
        <ContractChart />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-10 gap-4">
        <VehicleChart />
        <ReservationsTable />
      </div>
    </main>
  );
};

export default Dashboard;