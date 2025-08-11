import React from 'react';
import { Link } from 'react-router-dom';

const Footer = () => {
  return (
    <footer className="bg-gradient-to-r from-emerald-500 via-blue-600 to-purple-700 text-white px-6 py-6 shadow-2xl border-t-4 border-white/20 relative overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent animate-pulse"></div>
      <div className="absolute bottom-0 left-0 w-full h-1 bg-gradient-to-r from-yellow-400 via-orange-500 to-red-500"></div>
      
      <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4 relative z-10">
        <p className="text-sm font-medium drop-shadow-lg">
          © 2025 <span className="bg-gradient-to-r from-yellow-200 to-orange-200 bg-clip-text text-transparent font-bold">VenueBooking</span>. All rights reserved.
        </p>
        <nav className="text-sm flex items-center gap-4">
          <Link to="/" className="hover:text-yellow-200 transition-all duration-300 font-medium transform hover:scale-110">
            Home
          </Link>
          <span className="text-white/50">|</span>
          <Link to="/about" className="hover:text-yellow-200 transition-all duration-300 font-medium transform hover:scale-110">
            About
          </Link>
          <span className="text-white/50">|</span>
          <Link to="/contact" className="hover:text-yellow-200 transition-all duration-300 font-medium transform hover:scale-110">
            Contact
          </Link>
        </nav>
      </div>
    </footer>
  );
};

export default Footer; 