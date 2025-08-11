import React, { useContext, useState } from 'react';
import { FaRegUser, FaBars, FaTimes } from 'react-icons/fa';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { MyContext } from '../App';
import { Button, Menu, MenuItem } from '@mui/material';
import { fetchDataFromApi } from '../utils/api';

const Header = () => {
  const { isLogin, userData, setIsLogin, setUserData, openAlertBox } = useContext(MyContext) || {};
  const [anchorEl, setAnchorEl] = useState(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

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

  const isActive = (path) => {
    return location.pathname === path;
  };

  const navLinks = [
    { path: '/venues', label: 'Venues' },
    { path: '/services', label: 'Services' },
    { path: '/about', label: 'About' },
    { path: '/contact', label: 'Contact' }
  ];

  return (
    <header className="bg-white/95 backdrop-blur-md border-b border-neutral-200 sticky top-0 z-50">
      <div className="container">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link
            to="/"
            className="text-2xl font-bold text-primary-600 hover:text-primary-700 transition-colors"
          >
            QuickCourt
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-8">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                className={`nav-link ${isActive(link.path) ? 'active' : ''}`}
              >
                {link.label}
              </Link>
            ))}
          </nav>

          {/* Auth Section */}
          <div className="flex items-center gap-4">
            {isLogin ? (
              <>
                <Button
                  onClick={handleClick}
                  aria-controls={open ? 'account-menu' : undefined}
                  aria-haspopup="true"
                  aria-expanded={open ? 'true' : undefined}
                  className="!text-neutral-700 !bg-neutral-100 hover:!bg-neutral-200 !px-4 !py-2 !rounded-lg !transition-all !duration-300"
                >
                  <FaRegUser className="mr-2" />
                  <span className="hidden sm:inline">{userData?.name || 'Profile'}</span>
                </Button>

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
                    <Link to="/profile" className="w-full block text-neutral-800 hover:text-primary-600">
                      Profile
                    </Link>
                  </MenuItem>
                  <MenuItem onClick={handleLogout} sx={{ color: 'red' }}>
                    Logout
                  </MenuItem>
                </Menu>
              </>
            ) : (
              <div className="hidden md:flex items-center gap-3">
                <Link to="/login" className="btn btn-outline btn-sm">
                  Login
                </Link>
                <Link to="/register" className="btn btn-primary btn-sm">
                  Register
                </Link>
              </div>
            )}

            {/* Mobile Menu Button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2 rounded-lg hover:bg-neutral-100 transition-colors"
            >
              {mobileMenuOpen ? <FaTimes /> : <FaBars />}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden border-t border-neutral-200 py-4">
            <nav className="flex flex-col space-y-2">
              {navLinks.map((link) => (
                <Link
                  key={link.path}
                  to={link.path}
                  className={`nav-link ${isActive(link.path) ? 'active' : ''}`}
                  onClick={() => setMobileMenuOpen(false)}
                >
                  {link.label}
                </Link>
              ))}
              {!isLogin && (
                <div className="flex flex-col gap-2 pt-4 border-t border-neutral-200">
                  <Link
                    to="/login"
                    className="btn btn-outline w-full justify-center"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    Login
                  </Link>
                  <Link
                    to="/register"
                    className="btn btn-primary w-full justify-center"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    Register
                  </Link>
                </div>
              )}
            </nav>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;
