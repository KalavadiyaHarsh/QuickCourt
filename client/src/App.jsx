import React, { createContext, useState } from 'react';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import Home from './pages/Home';
import Login from './pages/Login';
import Verify from './pages/Verify';
import Register from './pages/Register';
import ForgotPassword from './pages/ForgotPassword';
import toast, { Toaster } from 'react-hot-toast';

// Create context
export const MyContext = createContext();

const App = () => {
  const [isLogin, setIsLogin] = useState(false);
  const [userData, setUserData] = useState(null);

  // Simple alert box function
  const openAlertBox = (status, msg) => {
    if (status === 'success') toast.success(msg);
    if (status === 'error') toast.error(msg);
  };

  // Values passed into context
  const contextValues = {
    isLogin,
    setIsLogin,
    userData,
    setUserData,
    openAlertBox
  };

  return (
    <MyContext.Provider value={contextValues}>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/verify" element={<Verify />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/register" element={<Register />} />
        </Routes>
      </BrowserRouter>
      <Toaster />
    </MyContext.Provider>
  );
};

export default App;
