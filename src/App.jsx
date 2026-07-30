import { BrowserRouter, Routes, Route, Link } from "react-router-dom";
import "./App.css";

import Discover from "./pages/Discover";
import EventDetailPage from "./pages/EventDetailPage";
import Home from "./pages/Home";
import Profile from "./pages/Profile";
import Navbar from "./Navbar";

function App() {
  return (
    <>
    <BrowserRouter>
      <div className="app">
        <Navbar /> 
        <Routes>
          <Route path="/discover" element={<Discover />} />
          <Route path="/event" element={<EventDetailPage />} />
          <Route path="/home" element={<Home />} />
          <Route path="/profile" element={<Profile />} />
        </Routes>
      </div>
    </BrowserRouter>
    </>
  );
}

export default App;
