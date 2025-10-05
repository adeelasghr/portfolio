import React from 'react';

interface InnerHeaderProps {
  breadcrum: string;
  title: string;
  icon: string;
}

const InnerHeader: React.FC<InnerHeaderProps> = ({ breadcrum, title, icon }) => {
  return (
    <div className='rounded-lg shadow p-4 flex justify-between items-center img-bg bg-gradient-to-br from-purple-50 to-white' style={{marginBottom: '15px'}}>
      <div>
        <p className="text-3xl mt-1">{title}</p>
        <h6>{breadcrum}</h6>
      </div>
      <div className="w-16 h-16 flex items-center justify-center">
        <img src={icon} alt={breadcrum} className="w-full h-full object-contain" style={{zIndex: "9"}} />
      </div>
    </div>
  );
};

export default InnerHeader;