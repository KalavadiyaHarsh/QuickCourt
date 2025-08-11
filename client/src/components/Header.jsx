import React, { useContext, useState } from 'react';
import { FaRegUser } from "react-icons/fa";
import { Link, useNavigate } from 'react-router-dom';
import { MyContext } from '../App';
import { Button, Menu, MenuItem } from '@mui/material';
import { fetchDataFromApi } from '../utils/api';

const Header = () => {
  const { isLogin, userData, setIsLogin, setUserData, openAlertBox } = useContext(MyContext) || {};
  const [anchorEl, setAnchorEl] = useState(null);
  const navigate = useNavigate();

  const open = Boolean(anchorEl);
  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleLogout = () => {
    setAnchorEl(null);

    // API call for logout
    fetchDataFromApi("/api/user/logout")
      .then((res) => {
        if (res?.success) {
          localStorage.removeItem('accesstoken');
          localStorage.removeItem('refreshToken');
          localStorage.removeItem('token');
          setUserData && setUserData(null);
          setIsLogin && setIsLogin(false);
          openAlertBox && openAlertBox('success', 'Logged out successfully');
          navigate('/');
        } else {
          openAlertBox && openAlertBox('error', res?.message || 'Logout failed');
        }
      })
      .catch((err) => {
        console.error("Error logging out:", err);
        openAlertBox && openAlertBox('error', 'Something went wrong');
      });
  };

  return (
    <header className="bg-gradient-to-r from-emerald-500 via-blue-600 to-purple-700 text-white px-6 py-4 flex justify-between items-center shadow-2xl border-b-4 border-white/20 backdrop-blur-sm relative">
      {/* Animated background */}
      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent animate-pulse pointer-events-none"></div>
      <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-yellow-400 via-orange-500 to-red-500 pointer-events-none"></div>

      {/* Logo */}
      <Link
        to="/"
        className="text-2xl font-bold tracking-wider relative z-10 transform hover:scale-105 transition-all duration-300 drop-shadow-lg focus:outline-none focus:ring-2 focus:ring-white/50 rounded-xl"
      >
        <span className="bg-gradient-to-r from-white to-yellow-200 bg-clip-text text-transparent">QuickCourt</span>
      </Link>

      {/* Nav Links */}
      <nav className="hidden md:flex items-center gap-8 relative z-10">
        <Link to="/allvenue" className=" hover:text-yellow-200 transition-all duration-300 font-medium transform hover:scale-110 focus:outline-none focus:ring-2 focus:ring-white/40 rounded-md">
          Venues
        </Link>
        
      </nav>

      {/* Profile / Login */}
      <div className="flex items-center gap-4 relative z-50">
        {isLogin ? (
          <>
            <Button
              onClick={handleClick}
              aria-controls={open ? 'account-menu' : undefined}
              aria-haspopup="true"
              aria-expanded={open ? 'true' : undefined}
              className="!text-white flex items-center gap-3 bg-white/15 hover:bg-white/25 backdrop-blur-md px-4 py-2 rounded-xl border border-white/20 transition-all duration-300 transform hover:scale-105 hover:shadow-xl"
            >
              <FaRegUser className="text-xl drop-shadow-lg" />
              <span className="hidden sm:inline font-medium">{userData?.name || 'Profile'}</span>
            </Button>

            {/* Dropdown Menu */}
            <Menu
              anchorEl={anchorEl}
              id="account-menu"
              open={open}
              onClose={handleClose}
              PaperProps={{
                sx: {
                  mt: 1.5,
                  borderRadius: 2,
                  overflow: 'hidden',
                  boxShadow: '0px 4px 20px rgba(0,0,0,0.15)',
                },
              }}
              transformOrigin={{ horizontal: 'right', vertical: 'top' }}
              anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
            >
              <MenuItem onClick={handleClose}>
                <Link to="/profile" className="w-full block text-gray-800 hover:text-blue-600">
                  Profile
                </Link>
              </MenuItem>
              <MenuItem onClick={handleLogout} sx={{ color: 'red' }}>
                Logout
              </MenuItem>
            </Menu>
          </>
        ) : (
          <div className="flex items-center gap-3">
            <Link to="/login" className="bg-gradient-to-r from-white to-gray-100 text-blue-700 font-semibold px-4 py-2 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 border border-white/50">
              Login
            </Link>
            <Link to="/register" className="bg-gradient-to-r from-blue-800 to-purple-800 text-white font-semibold px-4 py-2 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 border border-white/20">
              Register
            </Link>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;
