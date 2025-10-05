import { LayoutDashboard, Users, Car, Calendar, FileText, Settings, X, CheckCircle2Icon, CreditCardIcon } from 'lucide-react';
import NavItem from './NavItem';
import { Link, useLocation } from 'react-router-dom';
import logo from '../../assets/images/logo.png';

interface SidebarProps {
  sidebarOpen: boolean;
  toggleSidebar: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ sidebarOpen, toggleSidebar }) => {

  const location = useLocation();

    const customerSubItems = [
      { label: 'Customers List', path: '/customers/list' },
      { label: 'Add Customer', path: '/customers/add' },
      // { label: 'Customer Details', path: '/customers/details' }
    ];
    const vehicleSubItems = [
      { label: 'Vehicle List', path: '/vehicles/list' },
      { label: 'Add Vehicle', path: '/vehicles/add' },
      { label: 'Vehicle History', path: '/vehicles/history' },
      { label: 'Maintenance', path: '/vehicles/maintenance' }
    ];
    const bopokingSubItems = [
      { label: 'Booking Calendar', path: '/bookings/calendar' },
      { label: 'Bookings List', path: '/bookings/list' },
      { label: 'Make a Booking', path: '/bookings/add' }
    ];
    const contractSubItems = [
      { label: 'Contract Calendar', path: '/contracts/calendar' },
      { label: 'Contract List', path: '/contracts/list' },
      { label: 'Make New Contract', path: '/contracts/add' }
    ];
     const financeSubItems = [
      { label: 'Invoices', path: '/finance/invoices' }
    ];
    const settingsSubItems = [
      { label: 'Users Management', path: '/settings/users' },
      { label: 'Additional Services', path: '/settings/additional-services' }
    ];
    
  return (
    <div className={`
      ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'} 
      lg:translate-x-0 
      w-64 fixed lg:static h-full bg-white shadow-md transition-all duration-300 flex flex-col z-30 nav
    `}>
      {/* Logo */}
      <div className="p-4 flex items-center justify-start">
        <div className="text-pink-500 p-2 rounded-md">
          <img src={logo} alt="Logo" className="w-12 h-12" />
        </div>
        <span className="text-xl font-semibold">DeutPak</span>
        
        {/* Close button for mobile */}
        <button 
          onClick={toggleSidebar}
          className="ml-auto p-1 rounded-md text-gray-500 hover:bg-gray-100 lg:hidden"
        >
          <X size={20} />
        </button>
      </div>

      {/* Navigation */}
      <nav className="flex-1 mt-6">
        <Link to="/dashboard">
          <NavItem icon={<LayoutDashboard size={20} style={{color: '#7569ca'}} />} label="Dashboard" active={location.pathname === '/dashboard'} />
        </Link>

          <NavItem 
            icon={<Users size={20} style={{color: '#7569ca'}} />} 
            label="Customers" 
            subItems={customerSubItems}
            active={location.pathname.includes("/customer")} 
          />

        <NavItem 
            icon={<Car size={20} style={{color: '#7569ca'}}  />} 
            label="Vehicles"
            subItems={vehicleSubItems}
            active={location.pathname.includes("/vehicle")} 
             />

        <NavItem 
            icon={<Calendar size={20} style={{color: '#7569ca'}}  />} 
            label="Bookings" 
            subItems={bopokingSubItems}
            active={location.pathname.includes("/booking")} 
          />

        <NavItem 
            icon={<FileText size={20} style={{color: '#7569ca'}}  />} 
            label="Contracts" 
            subItems={contractSubItems}
            active={location.pathname.includes("/contract")} 
          />

        {/* <NavItem 
            icon={<CheckCircle2Icon size={20} style={{color: '#7569ca'}}  />} 
            label="Inspection" 
            subItems={inspectionSubItems}
            active={location.pathname.includes("/inspections")} 
          /> */}

          <NavItem 
            icon={<CreditCardIcon size={20} style={{color: '#7569ca'}}  />} 
            label="Finance" 
            subItems={financeSubItems}
            active={location.pathname.includes("/finance")} 
          />

        <NavItem 
            icon={<Settings size={20} style={{color: '#7569ca'}}  />} 
            label="Settings" 
            subItems={settingsSubItems}
            active={location.pathname.includes("/setting")} 
          />

      </nav>
    </div>
  );
};

export default Sidebar;