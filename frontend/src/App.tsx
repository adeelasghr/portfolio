import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { Navigate } from "react-router-dom";

import Dashboard from "./pages/Dashboard";
import ListCustomers from "./pages/Customers/ListCustomers";
import AddCustomers from "./pages/Customers/AddCustomers";
import DetailCustomers from "./pages/Customers/DetailCustomers";
import Login from "./pages/Authentication/Login";
import Layout from "./components/Shared/Layout";
import ListBookings from "./pages/Bookings/ListBookings";
import AddBookings from "./pages/Bookings/AddBookings";
import ListContracts from "./pages/Contracts/ListContracts";
import ListVehicles from "./pages/Vehicles/ListVehicles";
import AddContract from "./pages/Contracts/AddContract";
import AddVehicle from "./pages/Vehicles/AddVehicles";
import AdditionalService from "./pages/Settings/AdditionalService";
import DetailVehicle from "./pages/Vehicles/DetailVehicles";
import Maintenance from "./pages/Vehicles/Maintenance";
import BookingCalendar from "./pages/Bookings/BookingCalendar";
import ContractCalendar from "./pages/Contracts/ContractCalendar";
import ManageUsers from "./pages/Settings/ManageUsers";
import EditCustomers from "./pages/Customers/EditCustomers";
import EditVehicle from "./pages/Vehicles/EditVehicle";
import VehicleHistoryI from "./components/Vehicles/VehicleHistory";
import EditContract from "./pages/Contracts/EditContract";
import ListInvoices from "./pages/Finance/ListInvoices";
import PrivateRoute from "./routes/PrivateRoute";

// Register ChartJS components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend
);

function App() {
  return (
    <Router>
      <Routes>
        {/* Pages without Layout */}
        <Route path="/" element={<Login />} />

          {/* Login Restricted */}
          <Route
            path="/*"
            element={
              <PrivateRoute>
                <Routes>
                <Route element={<Layout />}>
                   {/* Dashboard */}
                   <Route path="/dashboard" element={<Dashboard />} />
                  {/* Customer Pages */}
                  <Route
                    path="/customers"
                    element={<Navigate to="/customers/list" replace />}
                  />
                  <Route path="/customers/list" element={<ListCustomers />} />
                  <Route path="/customers/add" element={<AddCustomers />} />
                  <Route
                    path="/customers/edit/:id"
                    element={<EditCustomers />}
                  />
                  <Route
                    path="/customers/detail/:id"
                    element={<DetailCustomers />}
                  />
                  {/* Booking Pages */}
                  <Route
                    path="/bookings"
                    element={<Navigate to="/bookings/list" replace />}
                  />
                  <Route path="/bookings/list" element={<ListBookings />} />
                  <Route path="/bookings/add" element={<AddBookings />} />
                  <Route
                    path="/bookings/calendar"
                    element={<BookingCalendar />}
                  />
                  {/* Contract Pages */}
                  <Route
                    path="/contracts"
                    element={<Navigate to="/contracts/list" replace />}
                  />
                  <Route path="/contracts/list" element={<ListContracts />} />
                  <Route path="/contracts/add" element={<AddContract />} />
                  <Route
                    path="/contracts/calendar"
                    element={<ContractCalendar />}
                  />
                  <Route
                    path="/contracts/edit/:id"
                    element={<EditContract />}
                  />
                  {/* Vehicle Pages */}
                  <Route
                    path="/vehicles"
                    element={<Navigate to="/vehicles/list" replace />}
                  />
                  <Route path="/vehicles/list" element={<ListVehicles />} />
                  <Route path="/vehicles/add" element={<AddVehicle />} />
                  <Route path="/vehicles/edit/:id" element={<EditVehicle />} />
                  <Route
                    path="/vehicles/detail/:id"
                    element={<DetailVehicle />}
                  />
                  <Route
                    path="/vehicles/history"
                    element={<VehicleHistoryI />}
                  />
                  {/* Maintenance Pages */}
                  <Route
                    path="/maintenance"
                    element={<Navigate to="/vehicles/maintenance" replace />}
                  />
                  <Route
                    path="/vehicles/maintenance"
                    element={<Maintenance />}
                  />
                  {/* Inspection Pages */}
                  <Route
                    path="/inspection/list"
                    element={<Navigate to="/vehicles/maintenance" replace />}
                  />
                  <Route
                    path="/inspection/add"
                    element={<Navigate to="/vehicles/maintenance" replace />}
                  />
                  {/* Settings Pages */}
                  <Route
                    path="/settings/additional-services"
                    element={<AdditionalService />}
                  />
                  <Route path="/settings/users" element={<ManageUsers />} />
                  {/* Settings Pages */}
                  <Route
                    path="/users"
                    element={<Navigate to="/settings/users" replace />}
                  />
                  <Route
                    path="/addons"
                    element={
                      <Navigate to="/settings/additional-services" replace />
                    }
                  />
                  {/* Finance Pages */}
                  <Route path="/finance/invoices" element={<ListInvoices />} />
                </Route>
                </Routes>
              </PrivateRoute>
            }
          />
      </Routes>
    </Router>
  );
}

export default App;
