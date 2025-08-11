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


import { fetchDataFromApi } from './utils/api';


const MyContext = createContext();

function App() {
  const [isLogin, setIsLogin] = useState(false);
  const [userData, setUserData] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem('accesstoken');
    if (token) {
      setIsLogin(true);
      fetchDataFromApi('/api/user/user-details').then((res) => {
        setUserData(res.data);
      });
    } else {
      setIsLogin(false);
    }
  }, [isLogin]);

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
              <Route path="/venuedetails" element={<VenueDetails />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route path="/verify" element={<Verify />} />
              <Route path="/forgot-password" element={<ForgotPassword />} />
              <Route path="/profile" element={<ProfilePage />} />
              <Route path="/Owner" element={<FacilityOwnerDashboard />} />
              <Route path="/facility-management" element={<FacilityManagement />} />
              <Route path="/court-management" element={<CourtManagement />} />
              <Route path="/booking" element={<NewBookingPage />} />
              <Route path="/about" element={<div className='p-6'>About VenueBooking</div>} />
              <Route path="/contact" element={<div className='p-6'>Contact us</div>} />
              <Route path="/admin" element={<AdminDashboard />} />
              <Route path="/admin/users" element={<UserManagement />} />
              <Route path="/admin/facilities" element={<FacilityApproval />} />
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
