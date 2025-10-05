import React, { useRef, useEffect } from 'react';
import { ChevronDown } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface ProfileDropdownProps {
  isOpen: boolean;
  toggleOpen: () => void;
  userName: string;
  email: string;
  avatarUrl: string;
}

const ProfileDropdown: React.FC<ProfileDropdownProps> = ({
  isOpen,
  toggleOpen,
  userName,
  email,
  avatarUrl
}) => {
  const dropdownRef = useRef<HTMLDivElement>(null);
  
  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        if (isOpen) toggleOpen();
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen, toggleOpen]);

  const navigate = useNavigate();
  
  const handleLogOut = () => {
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      navigate("/");
  };

  return (
    <div className="relative" ref={dropdownRef}>
      <div 
        className="flex items-center cursor-pointer"
        onClick={toggleOpen}
      >
        <img 
          src={avatarUrl} 
          alt="Profile" 
          className="h-8 w-8 rounded-full object-cover"
        />
        <div className="ml-2 hidden md:block">
          <div className="flex items-center">
            <span className="font-medium">{userName}</span>
            <ChevronDown size={16} className="ml-1" />
          </div>
        </div>
      </div>
      
      {/* Profile Dropdown with modern animation */}
      <div 
        className={`
          absolute right-0 mt-2 w-72 bg-white rounded-lg shadow-lg overflow-hidden z-50
          transition-all duration-300 ease-in-out origin-top-right
          ${isOpen 
            ? 'opacity-100 scale-100 translate-y-0' 
            : 'opacity-0 scale-95 -translate-y-2 pointer-events-none'}
        `}
      >
        <div className="p-6 flex flex-col items-center">
          <div className="w-20 h-20 rounded-full flex items-center justify-center">
             <img 
              src={avatarUrl} 
              alt="Profile" 
              className="rounded-full object-cover"
            />
          </div>
          <h3 className="text-xl font-bold text-gray-800">{userName}</h3>
          <p className="text-gray-600 mb-4">{email}</p>
          <button onClick={handleLogOut} className="w-full py-3 bg-gradient-to-r from-blue-500 to-purple-500 text-white font-semibold rounded-lg btn-primary
            hover:shadow-md transition-all duration-200 hover:-translate-y-0.5">
            SIGN OUT
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProfileDropdown;