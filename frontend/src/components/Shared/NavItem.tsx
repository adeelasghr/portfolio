import { ChevronRight } from 'lucide-react';
import React, { useState } from 'react';
import { Link } from 'react-router-dom';

interface NavItemProps {
  icon: React.ReactNode;
  label: string;
  active?: boolean;
  subItems?: { label: string; path: string }[];
}

const NavItem: React.FC<NavItemProps> = ({ icon, label, active = false, subItems }) => {
  const [isOpen, setIsOpen] = useState(false);
  
  const toggleSubmenu = () => {
    if (subItems?.length) {
      setIsOpen(!isOpen);
    }
  };

  return (
    <>
       <div 
        className={`
          sidebar-mebnu-item flex items-center px-4 py-3 cursor-pointer justify-between
          ${active ? 'active' : 'text-gray-600 hover:bg-gray-100'}
        `}
        onClick={toggleSubmenu}
      >
        <div className="flex items-center">
          <div className={`${active ? 'text-blue-600' : 'text-gray-500'}`}>
            {icon}
          </div>
          <span className="ml-3">{label}</span>
        </div>
        {subItems?.length && (
          <div className={`transition-transform duration-200 ${isOpen ? 'rotate-90' : ''}`}>
            <ChevronRight size={16} />
          </div>
        )}
      </div>

      {/* Submenu */}
      {subItems?.length && (
        <div 
          className={`
            overflow-hidden transition-all duration-200 ease-in-out
            ${isOpen ? 'max-h-48' : 'max-h-0'}
          `}
        >
          {subItems.map((item, index) => (
            <Link to={item.path} key={index}>
              <div
                key={index}
                className="flex items-center px-4 py-2 pl-12 cursor-pointer text-gray-600 hover:bg-gray-100"
              >
                <span className="text-sm">{item.label}</span>
              </div>
            </Link>
          ))}
        </div>
      )}
    </>
  )
};

export default NavItem;