import React from 'react';

interface StatusBadgeProps {
  status: 'Paid' | 'Pending' | 'Cancelled';
}

const StatusBadge: React.FC<StatusBadgeProps> = ({ status }) => {
  let bgColor = '';
  let textColor = '';
  
  switch (status) {
    case 'Paid':
      bgColor = 'bg-indigo-100';
      textColor = 'text-indigo-800';
      break;
    case 'Pending':
      bgColor = 'bg-amber-100';
      textColor = 'text-amber-800';
      break;
    case 'Cancelled':
      bgColor = 'bg-red-100';
      textColor = 'text-red-800';
      break;
    default:
      bgColor = 'bg-gray-100';
      textColor = 'text-gray-800';
  }
  
  return (
    <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${bgColor} ${textColor}`}>
      {status}
    </span>
  );
};

export default StatusBadge;