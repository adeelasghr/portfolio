import customer from '../../assets/images/customer.png';
import CustomerTable from '../../components/Customers/CustomerTable';
import InnerHeader from '../../components/Shared/InnerHeader';


const Customers: React.FC = () => {
 
  return (
    <div className="flex-1 overflow-y-auto p-4 bg-gray-100 main-bg">
      <div className="grid grid-cols-1 md:grid-cols-1 lg:grid-cols-1">
        <InnerHeader 
          title="Customer List" 
          breadcrum="Customers ➞ All Customers" 
          icon={customer}
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-1 lg:grid-cols-1" style={{ minHeight: '70vh'}}>
        <CustomerTable />
      </div>
    </div>
  );
};

export default Customers;