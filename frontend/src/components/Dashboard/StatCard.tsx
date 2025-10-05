import React from 'react';

interface StatCardProps {
  title: string;
  value: string;
  icon: string;
  color: string;
}

const StatCard: React.FC<StatCardProps> = ({ title, value, icon, color }) => {
  return (
    <div className={`${color} rounded-lg shadow p-6 flex justify-between items-center img-bg`}>
      <div>
        <h5>{title}</h5>
        <p className="text-3xl mt-1">{value}</p>
      </div>
      <div className="w-16 h-16 flex items-center justify-center">
        <img src={icon} alt={title} className="w-full h-full object-contain" style={{zIndex: "9"}} />
      </div>
    </div>
  );
};

export default StatCard;