import React from 'react';
import { Link } from 'react-router-dom';

const Footer = () => {
  return (
    <footer className="bg-gradient-to-r from-green-500 via-blue-500 to-blue-600 text-white px-6 py-4">
      <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-3">
        <p className="text-sm">© 2025 VenueBooking. All rights reserved.</p>
        <nav className="text-sm">
          <Link to="/" className="hover:underline">Home</Link>
          <span className="mx-2">|</span>
          <Link to="/about" className="hover:underline">About</Link>
          <span className="mx-2">|</span>
          <Link to="/contact" className="hover:underline">Contact</Link>
        </nav>
      </div>
    </footer>
  );
};

export default Footer; 