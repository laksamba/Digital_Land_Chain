import { BrowserRouter, Route, Routes } from "react-router-dom";
import Login from "./pages/Login";
import Register from "./pages/Register";
import DigitalLandChain from "./pages/LandingPage";
import CitizenForm from "./Kycform";

function App() {


  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<DigitalLandChain />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/kyc" element={<CitizenForm/>} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
