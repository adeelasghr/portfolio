import React, { useRef } from 'react';
import { Menu, Search } from 'lucide-react';
import ProfileDropdown from './ProfileDropdown';
import NotificationDropdown from './NotificationDropdown';
import avatar from '../../assets/images/avatar.jpg';

interface HeaderProps {
  toggleSidebar: () => void;
  profileDropdownOpen: boolean;
  toggleProfileDropdown: () => void;
}

const user = JSON.parse(localStorage.getItem("user") || "{}");
console.log(user);
const Header: React.FC<HeaderProps> = ({ 
  toggleSidebar, 
  profileDropdownOpen, 
  toggleProfileDropdown 
}) => {
  const dropdownRef = useRef<HTMLDivElement>(null);

  return (
    <header className="bg-white shadow-sm z-10">
      <div className="flex items-center justify-between p-4">
        <div className="flex items-center">
          <button 
            onClick={toggleSidebar} 
            className="p-2 rounded-md text-gray-500 hover:bg-gray-100 lg:hidden"
          >
            <Menu size={20} />
          </button>
          <h1 className="text-lg font-medium ml-2">Hello, {user.name}</h1>
        </div>
        <div className="flex items-center space-x-4">
          <NotificationDropdown />
              
          <div className="relative" ref={dropdownRef}>              
            <ProfileDropdown 
                isOpen={profileDropdownOpen}
                toggleOpen={toggleProfileDropdown}
                userName={user.name}
                email={user.email}
                avatarUrl={avatar}
              />

          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;