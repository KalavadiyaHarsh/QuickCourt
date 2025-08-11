import React from 'react';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import Home from './pages/Home';
import Login from './pages/Login';
import Allvenue from './pages/Allvenue';
import VenueDetails from './pages/VenueDetails';

const App = () => {
  return (
    <BrowserRouter>
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/allvenue" element={<Allvenue />} />
      <Route path="/venuedetails" element={<VenueDetails />} />
      <Route path="/login" element={<Login />} />
    </Routes>
    </BrowserRouter>
  );
}

export default App;
