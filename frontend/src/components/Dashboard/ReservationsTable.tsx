import React, { useState } from 'react';
import { Search } from 'lucide-react';
import TableHeader from './TableHeader';
import StatusBadge from './StatusBadge';
import { Link } from 'react-router-dom';

// Reservation data type
interface Reservation {
  id: string;
  customerName: string;
  date: string;
  amount: number;
  status: 'Paid' | 'Pending' | 'Cancelled';
}

const ReservationsTable: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  
  // Sample reservation data
  const [reservations] = useState<Reservation[]>([
    { id: '#12458', customerName: 'Evan Shlee', date: '31/12/2020', amount: 458.00, status: 'Paid' },
    { id: '#12459', customerName: 'Randy Vaccaro', date: '25/12/2020', amount: 357.00, status: 'Pending' },
    { id: '#12460', customerName: 'Gretchen Philips', date: '22/12/2020', amount: 159.00, status: 'Paid' },
    { id: '#12461', customerName: 'Ashlynn Press', date: '29/11/2020', amount: 167.00, status: 'Cancelled' },
    { id: '#12462', customerName: 'Michael Johnson', date: '15/11/2020', amount: 245.00, status: 'Paid' },
  ]);


  // Filter and sort reservations
  const filteredReservations = reservations
    .filter(reservation => {
      const matchesSearch = reservation.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           reservation.id.toLowerCase().includes(searchTerm.toLowerCase());
      return matchesSearch;
    });

  return (
    <div className="lg:col-span-7 bg-white rounded-lg shadow p-6 card">
      <div className="flex justify-between items-center mb-6 mt-2">
      <h3 className="card-header text-xl">Recent Bookings</h3>
        
        <div className="flex flex-col md:flex-row space-y-3 md:space-y-0 md:space-x-3 w-full md:w-auto">
          {/* Search Input */}
          <div className="relative">
            <input
              type="text"
              placeholder="Search..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent w-full md:w-64"
            />
            <Search size={18} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
          </div>
          
          <Link to="/bookings/list" className="btn-primary">
            View All  
          </Link>
        </div>
      </div>
      
      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="bg-gray-50">
              <TableHeader 
                column="id" 
                label="Order No" 
              />
              <TableHeader 
                column="customerName" 
                label="Customer Name" 
              />
              <TableHeader 
                column="date" 
                label="Date" 
              />
              <TableHeader 
                column="amount" 
                label="Amount" 
              />
              <TableHeader 
                column="status" 
                label="Status"
              />
            </tr>
          </thead>
          <tbody>
            {filteredReservations.length > 0 ? (
              filteredReservations.map((reservation, index) => (
                <tr 
                  key={reservation.id} 
                  className={`
                    border-t border-gray-100 hover:bg-gray-50 transition-colors
                    ${index % 2 === 0 ? 'bg-white' : 'bg-gray-50/30'}
                  `}
                >
                  <td className="py-4 px-6 text-indigo-600">{reservation.id}</td>
                  <td className="py-4 px-6 text-gray-800">{reservation.customerName}</td>
                  <td className="py-4 px-6 text-gray-600">{reservation.date}</td>
                  <td className="py-4 px-6 text-gray-800">${reservation.amount.toFixed(2)}</td>
                  <td className="py-4 px-6">
                    <StatusBadge status={reservation.status} />
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={5} className="py-8 text-center text-gray-500">
                  No reservations found matching your filters.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ReservationsTable;