import reserve from '../../assets/images/reserve.png';
import BookingTable from '../../components/Bookings/BookingTable';
import InnerHeader from '../../components/Shared/InnerHeader';


const Bookings: React.FC = () => {
 
  return (
    <div className="flex-1 overflow-y-auto p-4 bg-gray-100 main-bg">
      <div className="grid grid-cols-1 md:grid-cols-1 lg:grid-cols-1">
        <InnerHeader 
          title="Booking List" 
          breadcrum="Bookings ➞ All Bookings" 
          icon={reserve}
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-1 lg:grid-cols-1" style={{ minHeight: '70vh'}}>
        <BookingTable />
      </div>
    </div>
  );
};

export default Bookings;