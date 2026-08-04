import { BrowserRouter, Routes, Route, Link } from "react-router-dom";
import "./App.css";

import Discover from "./pages/Discover";
import EventDetailPage from "./pages/EventDetailPage";
import Home from "./pages/Home";
import Profile from "./pages/Profile";
import Navbar from "./Navbar";

function App() {
  return (
    <BrowserRouter>
      <Navbar /> 
      <div className="app">
        
        <Routes>
          <Route path="/discover" element={<Discover />} />
          <Route path="/event/:slug" element={<EventDetailPage />} />
          <Route path="/" element={<Home />} />
          <Route path="/profile" element={<Profile />} />
        </Routes>
      </div>
    </BrowserRouter>
  );
}

export default App;
