import { BrowserRouter, Route, Routes } from "react-router-dom";
import Login from "./pages/Login";
import Register from "./pages/Register";
import DigitalLandChain from "./pages/LandingPage";
import CitizenForm from "./pages/Kycform";
import Dashboard from "./pages/Dashboard";

function App() {


  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<DigitalLandChain />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/kyc" element={<CitizenForm/>} />
        <Route path="/dashboard" element={<Dashboard />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
