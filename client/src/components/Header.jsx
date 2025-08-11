import React, { useContext } from 'react';
import { FaCalendarCheck, FaRegUser } from "react-icons/fa";
import { Link } from 'react-router-dom';
import { MyContext } from '../App';

const Header = () => {
  const { isLogin, userData } = useContext(MyContext) || {};

  return (
    <header className="bg-gradient-to-r from-green-500 via-blue-500 to-blue-600 text-white px-6 py-3 flex justify-between items-center shadow-md">
      <Link to="/" className="text-lg font-bold tracking-wide">VenueBooking</Link>

      <nav className="hidden md:flex items-center gap-6">
        <Link to="/allvenue" className="hover:underline">Venues</Link>
        <Link to="/venue" className="hover:underline">Book</Link>
      </nav>

      <div className="flex items-center gap-3">
        {isLogin ? (
          <Link to="/profile" className="flex items-center gap-2 bg-white/10 hover:bg-white/20 px-3 py-1 rounded-md">
            <FaRegUser className="text-xl" />
            <span className="hidden sm:inline">{userData?.name || 'Profile'}</span>
          </Link>
        ) : (
          <div className="flex items-center gap-2">
            <Link to="/login" className="bg-white text-blue-700 font-medium px-3 py-1 rounded-md hover:bg-gray-100">Login</Link>
            <Link to="/register" className="bg-blue-800 text-white font-medium px-3 py-1 rounded-md hover:bg-blue-900">Register</Link>
          </div>
        )}
      </div>
    </header>
  );
}

export default Header;
