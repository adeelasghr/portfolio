import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Sidebar from "./Sidebar";
import TopNavbar from "./TopNavbar";
import Dashboard from "../../pages/Dashboard";
import ListCustomers from "../../pages/Customers/ListCustomers";
import AddCustomers from "../../pages/Customers/AddCustomers";
import DetailCustomers from "../../pages/Customers/DetailCustomers";
import Login from "../../pages/Authentication/Login";
import { useEffect, useState } from "react";

const Header = () => {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);

  // Check screen size on initial load and when resized
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 1024) {
        setSidebarOpen(false);
      } else {
        setSidebarOpen(true);
      }
    };

    // Set initial state
    handleResize();

    // Add event listener
    window.addEventListener("resize", handleResize);

    // Clean up
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  const toggleProfileDropdown = () => {
    setProfileDropdownOpen(!profileDropdownOpen);
  };

  return (
    <>
      <Router>
        <div className="flex h-screen bg-gray-100 relative main-bg">
          {/* Overlay for mobile when sidebar is open */}
          {sidebarOpen && (
            <div
              className="lg:hidden fixed inset-0 bg-black bg-opacity-50 z-20"
              onClick={toggleSidebar}
            ></div>
          )}

          {/* Sidebar */}
          <Sidebar sidebarOpen={sidebarOpen} toggleSidebar={toggleSidebar} />

          {/* Main Content */}
          <div className="flex-1 flex flex-col overflow-hidden lg:ml-0">
            {/* Header */}
            <TopNavbar
              toggleSidebar={toggleSidebar}
              profileDropdownOpen={profileDropdownOpen}
              toggleProfileDropdown={toggleProfileDropdown}
            />

            {/* Page Content */}
            <Routes>
              <Route path="/" element={<Login />} />
              <Route path="/dashboard" element={<Dashboard />} />
              {/* Customers */}
              <Route path="/customers/list" element={<ListCustomers />} />
              <Route path="/customers/add" element={<AddCustomers />} />
              <Route path="/customers/details" element={<DetailCustomers />} />
            </Routes>
          </div>
        </div>
      </Router>
    </>
  );
};

export default Header;