import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import HomePage from "./pages/HomePage";

import ProfilePage from "./pages/ProfilePage";
import VenueBookingPage from "./pages/VenueBookingPage";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/profile" element={<ProfilePage />} />
        <Route path="/venue" element={< VenueBookingPage />} />
      </Routes>
    </Router>
  );
}

export default App;
