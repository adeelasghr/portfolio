import React from 'react';

interface TableHeaderProps {
  column: string;
  label: string;
}

const TableHeader: React.FC<TableHeaderProps> = ({ 
  label
}) => {
  return (
    <th 
      className="py-4 px-6 text-left text-sm font-medium text-gray-700 cursor-pointer"
    >
      <div className="flex items-center space-x-1">
        <span>{label}</span>
        <div className="flex flex-col">
        </div>
      </div>
    </th>
  );
};

export default TableHeader;