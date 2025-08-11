// src/components/ProfileSidebar.jsx
import React from "react";

export default function ProfileSidebar({ user, selectedOption, setSelectedOption }) {
  return (
    <aside className="bg-white/90 backdrop-blur-md rounded-2xl shadow-2xl p-8 border border-white/20 h-fit">
      <div className="flex flex-col items-center mb-8">
        <div className="relative mb-6">
          <img 
            src={user.photo} 
            alt="Profile" 
            className="w-32 h-32 rounded-full border-4 border-gradient-to-r from-blue-500 to-purple-500 shadow-2xl transform hover:scale-105 transition-all duration-300" 
          />
          <div className="absolute -bottom-2 -right-2 w-8 h-8 bg-green-500 rounded-full border-4 border-white shadow-lg"></div>
        </div>
        <h2 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-2">
          {user.name}
        </h2>
        <p className="text-gray-600 font-medium mb-1">{user.phone}</p>
        <p className="text-gray-500 font-medium">{user.email}</p>
      </div>

      <nav className="space-y-3">
        <button
          onClick={() => setSelectedOption("edit")}
          className={`w-full text-left px-6 py-4 rounded-xl transition-all duration-300 transform hover:scale-105 font-semibold ${
            selectedOption === "edit" 
              ? "bg-gradient-to-r from-blue-500 to-purple-600 text-white shadow-xl" 
              : "bg-gray-50 hover:bg-blue-50 text-gray-700 hover:text-blue-600 border border-gray-200 hover:border-blue-300"
          }`}
        >
          Edit Profile
        </button>

        <button
          onClick={() => setSelectedOption("bookings")}
          className={`w-full text-left px-6 py-4 rounded-xl transition-all duration-300 transform hover:scale-105 font-semibold ${
            selectedOption === "bookings" 
              ? "bg-gradient-to-r from-blue-500 to-purple-600 text-white shadow-xl" 
              : "bg-gray-50 hover:bg-blue-50 text-gray-700 hover:text-blue-600 border border-gray-200 hover:border-blue-300"
          }`}
        >
          All Bookings
        </button>
      </nav>
    </aside>
  );
}
