import React, { useState, useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import { MyContext } from "../App";
import { FaRegUser, FaBars, FaTimes, FaSignOutAlt, FaCog, FaUsers, FaBuilding, FaChartBar } from "react-icons/fa";

const Header = () => {
  const context = useContext(MyContext);
  const navigate = useNavigate();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);

  const handleLogout = () => {
    // Clear all data from localStorage
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
    localStorage.removeItem('userData');
    
    // Update context
    context.setIsLogin && context.setIsLogin(false);
    context.setUserData && context.setUserData(null);
    
    // Close menus
    setIsMenuOpen(false);
    setIsProfileMenuOpen(false);
    
    // Navigate to home
    navigate('/');
    
    // Show success message
    context.openAlertBox && context.openAlertBox("Logged out successfully", "success");
  };

  const getUserData = () => {
    if (context.userData) return context.userData;
    const stored = localStorage.getItem('userData');
    return stored ? JSON.parse(stored) : null;
  };

  const currentUser = getUserData();

  const isValidAvatar = (avatar) => {
    return avatar && avatar !== 'default.jpg' && avatar !== 'null' && avatar.trim() !== '';
  };

  const isAdmin = currentUser?.role === 'admin';

  return (
    <header className="bg-white/90 backdrop-blur-md shadow-lg border-b border-white/20 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2">
            <div className="w-10 h-10 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-xl">Q</span>
            </div>
            <span className="text-xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              QuickCourt
            </span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            <Link to="/" className="text-gray-700 hover:text-blue-600 transition-colors">
              Home
            </Link>
            <Link to="/allvenue" className="text-gray-700 hover:text-blue-600 transition-colors">
              Venues
            </Link>
            <Link to="/about" className="text-gray-700 hover:text-blue-600 transition-colors">
              About
            </Link>
            <Link to="/contact" className="text-gray-700 hover:text-blue-600 transition-colors">
              Contact
            </Link>
          </nav>

          {/* User Actions */}
          <div className="flex items-center space-x-4">
            {context.isLogin ? (
              <div className="relative">
                {/* User Profile Button */}
                <button
                  onClick={() => setIsProfileMenuOpen(!isProfileMenuOpen)}
                  className="flex items-center space-x-2 bg-white/80 backdrop-blur-sm rounded-xl px-4 py-2 border border-gray-200 hover:border-blue-300 transition-all duration-300 hover:shadow-md"
                >
                  <div className="w-8 h-8 rounded-full overflow-hidden bg-gray-200 flex items-center justify-center">
                    {isValidAvatar(currentUser?.avatar) ? (
                      <img
                        src={currentUser.avatar}
                        alt={currentUser?.fullName || currentUser?.name}
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          e.target.style.display = 'none';
                          e.target.nextSibling.style.display = 'flex';
                        }}
                      />
                    ) : null}
                    <FaRegUser className="text-gray-500 text-sm" style={{ display: isValidAvatar(currentUser?.avatar) ? 'none' : 'flex' }} />
                  </div>
                  <span className="text-gray-700 font-medium">
                    {currentUser?.fullName || currentUser?.name}
                  </span>
                </button>

                {/* Profile Dropdown Menu */}
                {isProfileMenuOpen && (
                  <div className="absolute right-0 mt-2 w-64 bg-white rounded-xl shadow-2xl border border-gray-200 py-2 z-50">
                    {/* User Info */}
                    <div className="px-4 py-3 border-b border-gray-100">
                      <p className="text-sm font-medium text-gray-900">
                        {currentUser?.fullName || currentUser?.name}
                      </p>
                      <p className="text-sm text-gray-500">{currentUser?.email}</p>
                      <p className="text-xs text-gray-400 capitalize">Role: {currentUser?.role}</p>
                    </div>

                    {/* Menu Items */}
                    <div className="py-2">
                      <Link
                        to="/profile"
                        onClick={() => setIsProfileMenuOpen(false)}
                        className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                      >
                        <FaRegUser className="mr-3 text-gray-400" />
                        My Profile
                      </Link>

                      {/* Admin Options - Only show for admin users */}
                      {isAdmin && (
                        <>
                          <div className="border-t border-gray-100 my-2"></div>
                          <div className="px-4 py-2">
                            <p className="text-xs font-medium text-gray-500 uppercase tracking-wide">Admin Panel</p>
                          </div>
                          <Link
                            to="/admin"
                            onClick={() => setIsProfileMenuOpen(false)}
                            className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                          >
                            <FaChartBar className="mr-3 text-gray-400" />
                            System Dashboard
                          </Link>
                          <Link
                            to="/admin/users"
                            onClick={() => setIsProfileMenuOpen(false)}
                            className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                          >
                            <FaUsers className="mr-3 text-gray-400" />
                            Manage Users
                          </Link>
                          <Link
                            to="/admin/venues"
                            onClick={() => setIsProfileMenuOpen(false)}
                            className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                          >
                            <FaBuilding className="mr-3 text-gray-400" />
                            Approve Venues
                          </Link>
                        </>
                      )}

                      {/* Facility Owner Options - Only show for facility_owner users */}
                      {currentUser?.role === 'facility_owner' && (
                        <>
                          <div className="border-t border-gray-100 my-2"></div>
                          <div className="px-4 py-2">
                            <p className="text-xs font-medium text-gray-500 uppercase tracking-wide">Facility Management</p>
                          </div>
                          <Link
                            to="/Owner"
                            onClick={() => setIsProfileMenuOpen(false)}
                            className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                          >
                            <FaChartBar className="mr-3 text-gray-400" />
                            My Dashboard
                          </Link>
                          <Link
                            to="/facility-management"
                            onClick={() => setIsProfileMenuOpen(false)}
                            className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                          >
                            <FaBuilding className="mr-3 text-gray-400" />
                            Manage Venues
                          </Link>
                          <Link
                            to="/court-management"
                            onClick={() => setIsProfileMenuOpen(false)}
                            className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                          >
                            <FaUsers className="mr-3 text-gray-400" />
                            Manage Courts
                          </Link>
                        </>
                      )}

                      {/* Logout */}
                      <div className="border-t border-gray-100 my-2"></div>
                      <button
                        onClick={handleLogout}
                        className="flex items-center w-full px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors"
                      >
                        <FaSignOutAlt className="mr-3 text-red-400" />
                        Logout
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div className="flex items-center space-x-4">
                <Link
                  to="/login"
                  className="text-gray-700 hover:text-blue-600 transition-colors font-medium"
                >
                  Login
                </Link>
                <Link
                  to="/register"
                  className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-6 py-2 rounded-xl hover:shadow-lg transition-all duration-300 transform hover:scale-105 font-medium"
                >
                  Sign Up
                </Link>
              </div>
            )}

            {/* Mobile Menu Button */}
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="md:hidden p-2 rounded-lg hover:bg-gray-100 transition-colors"
            >
              {isMenuOpen ? (
                <FaTimes className="text-gray-600 text-xl" />
              ) : (
                <FaBars className="text-gray-600 text-xl" />
              )}
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="md:hidden py-4 border-t border-gray-200">
            <nav className="flex flex-col space-y-4">
              <Link
                to="/"
                onClick={() => setIsMenuOpen(false)}
                className="text-gray-700 hover:text-blue-600 transition-colors"
              >
                Home
              </Link>
              <Link
                to="/allvenue"
                onClick={() => setIsMenuOpen(false)}
                className="text-gray-700 hover:text-blue-600 transition-colors"
              >
                Venues
              </Link>
              <Link
                to="/about"
                onClick={() => setIsMenuOpen(false)}
                className="text-gray-700 hover:text-blue-600 transition-colors"
              >
                About
              </Link>
              <Link
                to="/contact"
                onClick={() => setIsMenuOpen(false)}
                className="text-gray-700 hover:text-blue-600 transition-colors"
              >
                Contact
              </Link>
              
              {/* Admin Options in Mobile Menu */}
              {context.isLogin && isAdmin && (
                <>
                  <div className="border-t border-gray-200 pt-4">
                    <p className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-2">Admin Panel</p>
                    <Link
                      to="/admin"
                      onClick={() => setIsMenuOpen(false)}
                      className="flex items-center text-gray-700 hover:text-blue-600 transition-colors"
                    >
                      <FaChartBar className="mr-2 text-gray-400" />
                      System Dashboard
                    </Link>
                    <Link
                      to="/admin/users"
                      onClick={() => setIsMenuOpen(false)}
                      className="flex items-center text-gray-700 hover:text-blue-600 transition-colors mt-2"
                    >
                      <FaUsers className="mr-2 text-gray-400" />
                      Manage Users
                    </Link>
                    <Link
                      to="/admin/venues"
                      onClick={() => setIsMenuOpen(false)}
                      className="flex items-center text-gray-700 hover:text-blue-600 transition-colors mt-2"
                    >
                      <FaBuilding className="mr-2 text-gray-400" />
                      Approve Venues
                    </Link>
                  </div>
                </>
              )}

              {/* Facility Owner Options in Mobile Menu */}
              {context.isLogin && currentUser?.role === 'facility_owner' && (
                <>
                  <div className="border-t border-gray-200 pt-4">
                    <p className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-2">Facility Management</p>
                    <Link
                      to="/Owner"
                      onClick={() => setIsMenuOpen(false)}
                      className="flex items-center text-gray-700 hover:text-blue-600 transition-colors"
                    >
                      <FaChartBar className="mr-2 text-gray-400" />
                      My Dashboard
                    </Link>
                    <Link
                      to="/facility-management"
                      onClick={() => setIsMenuOpen(false)}
                      className="flex items-center text-gray-700 hover:text-blue-600 transition-colors mt-2"
                    >
                      <FaBuilding className="mr-2 text-gray-400" />
                      Manage Venues
                    </Link>
                    <Link
                      to="/court-management"
                      onClick={() => setIsMenuOpen(false)}
                      className="flex items-center text-gray-700 hover:text-blue-600 transition-colors mt-2"
                    >
                      <FaUsers className="mr-2 text-gray-400" />
                      Manage Courts
                    </Link>
                  </div>
                </>
              )}
            </nav>
          </div>
        )}
      </div>

      {/* Click outside to close dropdowns */}
      {(isProfileMenuOpen || isMenuOpen) && (
        <div
          className="fixed inset-0 z-40"
          onClick={() => {
            setIsProfileMenuOpen(false);
            setIsMenuOpen(false);
          }}
        />
      )}
    </header>
  );
};

export default Header;
