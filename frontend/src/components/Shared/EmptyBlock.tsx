import React from 'react';

interface StatCardProps {
  title: string;
  value: string;
}

const EmptyBlock: React.FC<StatCardProps> = ({ title, value}) => {
  return (
    <div className={`bg-gradient-to-br from-purple-50 to-white rounded-lg shadow p-6 flex justify-between items-center img-bg`} style={{marginBottom: "0px"}}>
      <div style={{zIndex: "10"}}>
        <h5>{title}</h5>
        <p className="text-2xl mt-1">{value}</p>
      </div>
    </div>
  );
};

export default EmptyBlock;