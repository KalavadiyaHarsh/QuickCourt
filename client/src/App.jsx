import React, { createContext, useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';

// Layout Components
import Layout from './components/Layout';

// Main Pages
import Home from './pages/Home';
import About from './pages/About';
import Services from './pages/Services';
import Contact from './pages/Contact';
import Venues from './pages/Venues';
import VenueDetails from './pages/VenueDetails';
import Booking from './pages/Booking';

// Auth Pages
import Login from './pages/Login';
import Register from './pages/Register';
import ForgotPassword from './pages/ForgotPassword';
import Verify from './pages/Verify';

// User Pages
import ProfilePage from './pages/ProfilePage';

// Admin Pages
import AdminDashboard from './pages/AdminDashboard';
import FacilityManagement from './pages/FacilityManagement';
import CourtManagement from './pages/CourtManagement';
import FacilityApproval from './pages/FacilityApproval';
import UserManagement from './pages/UserManagement';

// Owner Pages
import FacilityOwnerDashboard from './pages/FacilityOwnerDashboard';

// API Service
import { fetchDataFromApi } from './utils/api';

// Create Context
const MyContext = createContext();

function App() {
  const [isLogin, setIsLogin] = useState(false);
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);

  // Check authentication status on app load
  useEffect(() => {
    const checkAuthStatus = async () => {
      const token = localStorage.getItem('accesstoken');
      if (token) {
        try {
          const response = await fetchDataFromApi('/api/user/profile');
          if (response?.success) {
            setUserData(response.user);
            setIsLogin(true);
          } else {
            localStorage.removeItem('accesstoken');
            localStorage.removeItem('refreshToken');
          }
        } catch (error) {
          console.error('Auth check failed:', error);
          localStorage.removeItem('accesstoken');
          localStorage.removeItem('refreshToken');
        }
      }
      setLoading(false);
    };

    checkAuthStatus();
  }, []);

  // Alert function
  const openAlertBox = (type, message) => {
    // This will be handled by react-hot-toast
    if (type === 'success') {
      toast.success(message);
    } else if (type === 'error') {
      toast.error(message);
    } else {
      toast(message);
    }
  };

  const values = {
    isLogin,
    setIsLogin,
    userData,
    setUserData,
    openAlertBox,
    loading
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-neutral-50 to-primary-50">
        <div className="text-center">
          <div className="loading mb-4"></div>
          <p className="text-neutral-600">Loading QuickCourt...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="App">
      <BrowserRouter>
        <MyContext.Provider value={values}>
          <Layout>
            <Routes>
              {/* Public Routes */}
              <Route path="/" element={<Home />} />
              <Route path="/about" element={<About />} />
              <Route path="/services" element={<Services />} />
              <Route path="/contact" element={<Contact />} />
              <Route path="/venues" element={<Venues />} />
              <Route path="/venue/:id" element={<VenueDetails />} />
              <Route path="/booking" element={<Booking />} />
              
              {/* Auth Routes */}
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route path="/forgot-password" element={<ForgotPassword />} />
              <Route path="/verify" element={<Verify />} />
              
              {/* Protected User Routes */}
              <Route path="/profile" element={<ProfilePage />} />
              
              {/* Admin Routes */}
              <Route path="/admin" element={<AdminDashboard />} />
              <Route path="/admin/facilities" element={<FacilityManagement />} />
              <Route path="/admin/courts" element={<CourtManagement />} />
              <Route path="/admin/approvals" element={<FacilityApproval />} />
              <Route path="/admin/users" element={<UserManagement />} />
              
              {/* Owner Routes */}
              <Route path="/owner" element={<FacilityOwnerDashboard />} />
            </Routes>
          </Layout>
        </MyContext.Provider>
      </BrowserRouter>
      <Toaster 
        position="top-right"
        toastOptions={{
          duration: 4000,
          style: {
            background: 'white',
            color: '#1e293b',
            borderRadius: '12px',
            boxShadow: '0 10px 25px rgba(0, 0, 0, 0.1)',
            border: '1px solid #e2e8f0',
          },
          success: {
            iconTheme: {
              primary: '#16a34a',
              secondary: 'white',
            },
          },
          error: {
            iconTheme: {
              primary: '#dc2626',
              secondary: 'white',
            },
          },
        }}
      />
    </div>
  );
}

export default App;
export { MyContext };
