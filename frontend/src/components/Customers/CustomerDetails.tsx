import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Phone, Building, Car, CreditCard, FileText } from 'lucide-react';
import { Customer } from '../../interfaces/Customer';
import { baseImageUrl } from '../../utils/config';

interface TabData {
  id: string;
  label: string;
  icon: React.ReactNode;
  content: React.ReactNode;
}
interface CustomerDetailsProps {
  customer: Customer;
}
const CustomerDetails: React.FC<CustomerDetailsProps> = ({ customer }) => {
  const [activeTab, setActiveTab] = useState('contact');
  
  const tabs: TabData[] = [
    {
      id: 'contact',
      label: 'Contact Info',
      icon: <Phone size={18} />,
      content: (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <label className="text-sm text-gray-500">Street Name:</label>
            <p className="text-lg font-medium">{customer?.streetName}</p>
          </div>
          <div>
            <label className="text-sm text-gray-500">House No:</label>
            <p className="text-lg font-medium">{customer?.houseNo}</p>
          </div>
          <div>
            <label className="text-sm text-gray-500">Additional Address:</label>
            <p className="text-lg font-medium">{customer?.additionalInfo || '-'}</p>
          </div>
          <div>
            <label className="text-sm text-gray-500">Mobile Number:</label>
            <p className="text-lg font-medium">{customer?.phoneNumber}</p>
          </div>
          <div>
            <label className="text-sm text-gray-500">Email:</label>
            <p className="text-lg font-medium">{customer?.email}</p>
          </div>
          <div>
            <label className="text-sm text-gray-500">Pin Code:</label>
            <p className="text-lg font-medium">{customer?.postalCode}</p>
          </div>
          <div>
            <label className="text-sm text-gray-500">Town/City:</label>
            <p className="text-lg font-medium">{customer?.city}</p>
          </div>
          <div>
            <label className="text-sm text-gray-500">Country:</label>
            <p className="text-lg font-medium">{customer?.country}</p>
          </div>
        </div>
      ),
    },
    {
      id: 'identification',
      label: 'Identification',
      icon: <Building size={18} />,
      content: (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div>
              <label className="text-sm text-gray-500">Passport Number:</label>
              <p className="text-lg font-medium">{customer?.passportNo}</p>
            </div>
             <div>
              <label className="text-sm text-gray-500">Passport Issue:</label>
              <p className="text-lg font-medium">{customer?.passportIssue ? new Date(customer.passportIssue).toLocaleDateString('en-GB', {
                day: '2-digit',
                month: 'short',
                year: 'numeric'
              }) : '-'}</p>
            </div>
             <div>
              <label className="text-sm text-gray-500">Passport Expiry:</label>
              <p className="text-lg font-medium">{customer?.passportExpiry ? new Date(customer.passportExpiry).toLocaleDateString('en-GB', {
                day: '2-digit',
                month: 'short',
                year: 'numeric'
              }) : '-'}</p>
            </div>
          </div>
           <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div>
              <label className="text-sm text-gray-500">ID Card Number:</label>
              <p className="text-lg font-medium">{customer?.idCardNo || '-'}</p>
            </div>
             <div>
              <label className="text-sm text-gray-500">ID Card Issue:</label>
              <p className="text-lg font-medium">{customer?.idCardIssue ? new Date(customer.idCardIssue).toLocaleDateString('en-GB', {
                day: '2-digit',
                month: 'short',
                year: 'numeric'
              }) : '-'}</p>
            </div>
             <div>
              <label className="text-sm text-gray-500">ID Card Expiry:</label>
              <p className="text-lg font-medium">{customer?.idCardExpiry ? new Date(customer.idCardExpiry).toLocaleDateString('en-GB', {
                day: '2-digit',
                month: 'short',
                year: 'numeric'
              }) : '-'}</p>
            </div>
          </div>
           <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div>
              <label className="text-sm text-gray-500">License Number:</label>
              <p className="text-lg font-medium">{customer?.licenseNo}</p>
            </div>
             <div>
              <label className="text-sm text-gray-500">License Issue:</label>
              <p className="text-lg font-medium">{customer?.licenseIssue ? new Date(customer.licenseIssue).toLocaleDateString('en-GB', {
                day: '2-digit',
                month: 'short',
                year: 'numeric'
              }) : '-'}</p>
            </div>
             <div>
              <label className="text-sm text-gray-500">License Expiry:</label>
              <p className="text-lg font-medium">{customer?.licenseExpiry ? new Date(customer.licenseExpiry).toLocaleDateString('en-GB', {
                day: '2-digit',
                month: 'short',
                year: 'numeric'
              }) : '-'}</p>
            </div>
          </div>
        </div>
      ),
    },
    {
      id: 'vehicles',
      label: 'Rented Vehicles',
      icon: <Car size={18} />,
      content: (
        <div className="space-y-6">
          <div className="bg-gray-50 p-4 rounded-lg">
            <h3 className="font-medium mb-2">Currently Rented</h3>
            <p className="text-gray-600">No vehicles currently rented</p>
          </div>
          <div className="bg-gray-50 p-4 rounded-lg">
            <h3 className="font-medium mb-2">Rental History</h3>
            <p className="text-gray-600">No previous rentals found</p>
          </div>
        </div>
      ),
    },
    {
      id: 'financials',
      label: 'Financials',
      icon: <CreditCard size={18} />,
      content: (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div>
              <label className="text-sm text-gray-500">Payment Method:</label>
              <p className="text-lg font-medium">Credit Card</p>
            </div>
            <div>
              <label className="text-sm text-gray-500">Account Status:</label>
              <p className="text-lg font-medium">Active</p>
            </div>
          </div>
        </div>
      ),
    },
    {
      id: 'documents',
      label: 'Documents',
      icon: <FileText size={18} />,
      content: (
        <div className="space-y-6">
  <div className="bg-gray-50 p-4 rounded-lg">
    {customer.customerDocs && customer.customerDocs.length > 0 ? (
      <div className="grid grid-cols-4 gap-4">
        {customer.customerDocs.map((img, index) => (
          <img
            key={index}
            src={`${baseImageUrl}${img}`}
            alt={`Document ${index + 1}`}
            className="w-full h-auto rounded-md object-cover"
          />
        ))}
      </div>
    ) : (
      <p>No documents uploaded</p>
    )}
  </div>
</div>

      ),
    },
  ];

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden" 
        style={{ width: '100%', minHeight: '50vh', backgroundColor: 'rgba(255, 255, 255, 0.6)' }}>
      {/* Tabs */}
      <div className="border-b border-gray-200">
        <div className="flex overflow-x-auto">
          {tabs.map((tab) => (
            <button
                style={{ fontSize: '17px' }}
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`relative px-6 py-4 flex items-center gap-2 whitespace-nowrap
                ${activeTab === tab.id
                  ? 'active-tab'
                  : 'text-gray-500 hover:text-gray-700'
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
          {tabs.find(tab => tab.id === activeTab)?.content}
        </motion.div>
      </div>
    </div>
  );
};

export default CustomerDetails;