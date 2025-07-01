import { BrowserRouter, Route, Routes } from "react-router-dom";
import Login from "./pages/Login";
import Register from "./pages/Register";
import DigitalLandChain from "./pages/LandingPage";
import CitizenForm from "./pages/Kycform";

import AdminDashboard from "./pages/AdminDashboard/AdminPage";


function App() {


  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<DigitalLandChain />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/kyc" element={<CitizenForm/>} />
        <Route path="/Admimdashboard" element={<AdminDashboard />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
