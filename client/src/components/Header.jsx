import React from 'react';
import { FaCalendarCheck, FaRegUser } from "react-icons/fa";
import { Link } from 'react-router-dom';

const Header = () => {
  return (
    <div>
      <header className="text-gray-800 py-3">
        <div className="container mx-auto flex justify-between items-center">
          <span className="text-lg font-mono">QUICKCOURT</span>

          <button className="flex items-center gap-2">
            <FaCalendarCheck className="text-xl" />
            Book
          </button>

          <button className="flex items-center gap-2">
            <FaRegUser className="link text-xl" />
            <Link to={"/login"} className='link transition  text-[15px] font-[500] '>Login</Link> | <Link to={"/register"} className='link transition text-[15px] font-[500] '>Register</Link>

          </button>
        </div>
      </header>
    </div>
  );
}

export default Header;
