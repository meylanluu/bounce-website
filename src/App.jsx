import { BrowserRouter, Routes, Route, Link } from "react-router-dom";
import { AuthProvider } from "./data/authContext";
import "./App.css";

import Discover from "./pages/Discover";
import EventDetailPage from "./pages/EventDetailPage";
import Home from "./pages/Home";
import Profile from "./pages/Profile";
import Navbar from "./Navbar";
import Login from "./pages/Login"
import Register from "./pages/Register"

function App() {
  return (
    
    <AuthProvider>
      <BrowserRouter>
        <Navbar /> 
        <div className="app">
          
          <Routes>
            <Route path="/discover" element={<Discover />} />
            <Route path="/event/:slug" element={<EventDetailPage />} />
            <Route path="/" element={<Home />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
          </Routes>

        </div>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
