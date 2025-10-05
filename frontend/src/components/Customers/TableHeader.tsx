import React from 'react';
import { ArrowUp, ArrowDown } from 'lucide-react';

interface TableHeaderProps {
  column: string;
  label: string;
  sortColumn: string | null;
  sortDirection: 'asc' | 'desc';
  onSort: (column: string) => void;
}

const TableHeader: React.FC<TableHeaderProps> = ({ 
  column, 
  label, 
  sortColumn, 
  sortDirection, 
  onSort 
}) => {
  return (
    <th 
      className="py-4 px-6 text-left text-sm font-medium text-gray-700 cursor-pointer"
      onClick={() => onSort(column)}
    >
      <div className="flex items-center space-x-1">
        <span>{label}</span>
        <div className="flex flex-col">
          <ArrowUp 
            size={12} 
            className={`${sortColumn === column && sortDirection === 'asc' ? 'text-indigo-600' : 'text-gray-400'}`} 
          />
          <ArrowDown 
            size={12} 
            className={`${sortColumn === column && sortDirection === 'desc' ? 'text-indigo-600' : 'text-gray-400'}`} 
          />
        </div>
      </div>
    </th>
  );
};

export default TableHeader;