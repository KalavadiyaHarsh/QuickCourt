import React, { useEffect, useState, createContext } from 'react';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import toast, { Toaster } from 'react-hot-toast';

import Layout from './components/Layout';

import Home from './pages/Home';
import Allvenue from './pages/Allvenue';
import VenueDetails from './pages/VenueDetails';
import Login from './pages/Login';
import Register from './pages/Register';
import Verify from './pages/Verify';
import ForgotPassword from './pages/ForgotPassword';
import ProfilePage from './pages/ProfilePage';
import FacilityOwnerDashboard from './pages/FacilityOwnerDashboard';
import CourtManagement from './pages/CourtManagement';
import FacilityManagement from './pages/FacilityManagement'
import NewBookingPage from './pages/NewBookingPage';
import AdminDashboard from "./pages/AdminDashboard";
import UserManagement from "./pages/UserManagement";
import FacilityApproval from "./pages/FacilityApproval";
import VenueBookingPage from './pages/VenueBookingPage';

import { fetchDataFromApi } from './utils/api';


const MyContext = createContext();

function App() {
  const [isLogin, setIsLogin] = useState(false);
  const [userData, setUserData] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem('accessToken');
    const storedUserData = localStorage.getItem('userData');
    
    if (token && storedUserData) {
      try {
        const parsedUserData = JSON.parse(storedUserData);
        setIsLogin(true);
        setUserData(parsedUserData);
      } catch (error) {
        console.error('Error parsing user data:', error);
        // Clear invalid data
        localStorage.removeItem('accessToken');
        localStorage.removeItem('refreshToken');
        localStorage.removeItem('userData');
        setIsLogin(false);
        setUserData(null);
      }
    } else {
      setIsLogin(false);
      setUserData(null);
    }
  }, []);

  const openAlertBox = (status, msg) => {
    if (status === 'success') toast.success(msg);
    if (status === 'error') toast.error(msg);
  };

  const values = {
    openAlertBox,
    isLogin,
    setIsLogin,
    setUserData,
    userData,
  };

  return (
    <div>
      <BrowserRouter>
        <MyContext.Provider value={values}>
          <Layout>
            
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/allvenue" element={<Allvenue />} />
              <Route path="/venuedetails/:id" element={<VenueDetails />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route path="/verify" element={<Verify />} />
              <Route path="/forgot-password" element={<ForgotPassword />} />
              <Route path="/profile" element={<ProfilePage />} />
              <Route path="/venue/:venueId/:courtId" element={<VenueBookingPage />} />
              
              {/* Admin Routes */}
              <Route path="/admin" element={<AdminDashboard />} />
              <Route path="/admin/users" element={<UserManagement />} />
              <Route path="/admin/venues" element={<FacilityApproval />} />
              
              {/* Facility Owner Routes */}
              <Route path="/Owner" element={<FacilityOwnerDashboard />} />
              <Route path="/facility-management" element={<FacilityManagement />} />
              <Route path="/court-management" element={<CourtManagement />} />
              
              {/* Additional Routes */}
              <Route path="/booking" element={<NewBookingPage />} />
              <Route path="/about" element={<div className='p-6'>About VenueBooking</div>} />
              <Route path="/contact" element={<div className='p-6'>Contact us</div>} />
            </Routes>
          </Layout>

        </MyContext.Provider>
      </BrowserRouter>
      <Toaster />
    </div>
  );
}

export default App;
export { MyContext };
