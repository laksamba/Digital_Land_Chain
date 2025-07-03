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
        </Routes>
      </BrowserRouter>
    </Provider>
  );
}

export default App;
