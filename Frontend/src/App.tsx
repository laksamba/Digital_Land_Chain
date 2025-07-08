import { BrowserRouter, Route, Routes } from "react-router-dom";
import Login from "./pages/Login";
import Register from "./pages/Register";
import DigitalLandChain from "./pages/LandingPage";
import CitizenForm from "./pages/Kycform";
import { Provider } from "react-redux";

import AdminDashboard from "./pages/AdminDashboard/AdminPage";
import { store } from "./Redux/store";
import AuthRoleRoute from "./components/AuthRolesRoute";
import Unauthorized from "./components/Unauthorized";
import CitizenDashboard from "./pages/CitizenDashboard/CitizenDashboard";
import LandOfficerDashboard from "./pages/OfficerDashboard/DashboardPage";

function App() {
  return (
    <Provider store={store}>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<DigitalLandChain />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/kyc" element={<CitizenForm />} />
          <Route path="/unauthorized" element={<Unauthorized/>} />

          {/* admin dashboard routes */}
          <Route
            path="/Admindashboard"
            element={
              <AuthRoleRoute allowedRoles={["admin"]}>
                <AdminDashboard />
              </AuthRoleRoute>
            }
          />

          {/* citizen dashboard routes */}
          <Route
            path="/citizendashboard"
            element={
              <AuthRoleRoute allowedRoles={["citizen"]}>
                <CitizenDashboard />
              </AuthRoleRoute>
            }
          />

          {/* officer dashboard routes */}
          <Route
            path="/Officerdashboard"
            element={
              <AuthRoleRoute allowedRoles={["land_officer"]}>
                <LandOfficerDashboard />
              </AuthRoleRoute>
            }
          />
        </Routes>
      </BrowserRouter>
    </Provider>
  );
}

export default App;
