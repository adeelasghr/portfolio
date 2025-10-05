
import InnerHeader from "../../components/Shared/InnerHeader";
import EmptyBlock from "../../components/Shared/EmptyBlock";
import CustomerDetails from "../../components/Customers/CustomerDetails";
import { Cake, Mail, MapPin, Phone, User } from "lucide-react";
import { useEffect, useState } from "react";
import { Customer } from "../../interfaces/Customer";
import { useNavigate, useParams } from "react-router-dom";
import { getCustomerDetails } from "../../api/customerApi";
import imgCustomer from "../../assets/images/customer.png";
import avatar from "../../assets/images/avatar.jpg";

const Customers: React.FC = () => {
    const [customer, setCustomer] = useState<Customer | null>(null);
    const { id } = useParams();
    const navigate = useNavigate();
      
      const handleEdit = (customerId: string) => {
     navigate(`/customers/edit/${customerId}`);
  };

      useEffect(() => {
        const fetchCustomer = async () => {
          try {
            const data = await getCustomerDetails(id) as Customer;
            setCustomer(data);
          } catch (error) {
            console.error("Failed to fetch customer:", error);
          }
        };
    
        console.log("Fetching customer with ID:", id);
        fetchCustomer();
      }, [id]);

  return (
    <div className="flex-1 overflow-y-auto p-4 bg-gray-100 main-bg">
      {/* Header */}
      <div className="grid grid-cols-1 md:grid-cols-1 lg:grid-cols-1">
        <InnerHeader
          title="Customer Details"
          breadcrum="Customers ➞ Details"
          icon={imgCustomer}
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-10 gap-4">

        <div className="lg:col-span-3 bg-white rounded-lg shadow card"
          style={{ padding: '35px' }}>
         {/* Customer Info */}
      <div>
        <div className="flex">
          <div className="w-1/4">
            <div className="w-full aspect-square rounded-lg overflow-hidden mb-6">
              <img
                src={avatar}
                alt="Ruben Dokidis"
                className="w-full h-full object-cover"
              />
            </div>
          </div>
          <div className="w-3/4 p-4">
            <h2 className="text-3xl text-gray-900">{customer?.firstName} {customer?.lastName}</h2>
            <p className="text-indigo-900">
              Added: {customer?.createdAt ? new Date(customer.createdAt).toLocaleDateString('en-GB', {
                day: '2-digit',
                month: 'long',
                year: 'numeric'
              }) : 'N/A'}
              <br/> <span className="text-xs cursor-pointer"  onClick={() => id && handleEdit(id)}>(Edit Information)</span>
            </p>
          </div>
        </div>
        <button className="mb-6 mt-2 w-full py-3 bg-gradient-to-r from-blue-500 to-purple-500 text-white font-semibold rounded-lg btn-primary
            hover:shadow-md transition-all duration-200 hover:-translate-y-0.5">
            CONTACT {customer?.firstName} {customer?.lastName}
          </button>
        <p className="mt-2 text-gray-700">
          {customer?.firstName} is a customer of DeutPak since {customer?.createdAt ? new Date(customer.createdAt).toLocaleDateString('en-GB', {
                day: '2-digit',
                month: 'long',
                year: 'numeric'
              }) : 'N/A'}. He is from {customer?.city} and has
          0 contracts with us. He has spent €0 so far.
        </p>

        {/* Contact Details */}
        <div className="mt-6 space-y-4">
          <div className="flex items-center gap-3 text-indigo-900">
            <MapPin size={20} className="text-indigo-600" />
            <span>{customer?.city}, {customer?.country}</span>
          </div>
          <div className="flex items-center gap-3 text-indigo-900">
            <Cake size={20} className="text-indigo-600" />
            <span>{customer?.dob ? new Date(customer.dob).toLocaleDateString('en-GB', {
                day: '2-digit',
                month: 'long',
                year: 'numeric'
              }) : 'N/A'}</span>
          </div>
          <div className="flex items-center gap-3 text-indigo-900">
            <Phone size={20} className="text-indigo-600" />
            <span>{customer?.phoneNumber}</span>
          </div>
          <div className="flex items-center gap-3 text-indigo-900">
            <Mail size={20} className="text-indigo-600" />
            <span>{customer?.email}</span>
          </div>
          <div className="flex items-center gap-3 text-indigo-900">
            <User size={20} className="text-indigo-600" />
            <span>Active</span>
          </div>
        </div>
      </div>
        </div>

        <div className="lg:col-span-7">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <EmptyBlock title="Code:" value={customer?.customerCode || ""} />
            <EmptyBlock title="Contracts:" value="0" />
            <EmptyBlock title="Total Paid:" value="€0" />
            <EmptyBlock title="Outstanding:" value="€0" />
          </div>

          {/* Tabs */}
          <div className="lg:col-span-7 bg-white rounded-lg shadow p-1 card mt-4">
            <div className="flex justify-between items-center mt-2">
                {customer && <CustomerDetails customer={customer} />}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Customers;