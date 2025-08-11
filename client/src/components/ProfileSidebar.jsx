// src/components/ProfileSidebar.jsx
import React from "react";

export default function ProfileSidebar({ user, selectedOption, setSelectedOption }) {
  return (
    <aside className="w-full md:w-1/4 bg-white shadow-lg p-6">
      <div className="flex flex-col items-center">
        <img src={user.photo} alt="Profile" className="w-24 h-24 rounded-full mb-3 border-4 border-teal-500" />
        <h2 className="text-lg font-semibold">{user.name}</h2>
        <p className="text-gray-600">{user.phone}</p>
        <p className="text-gray-500">{user.email}</p>
      </div>

      <nav className="mt-6 space-y-2">
        <button
          onClick={() => setSelectedOption("edit")}
          className={`w-full text-left px-4 py-2 rounded-lg ${selectedOption === "edit" ? "bg-teal-600 text-white" : "hover:bg-teal-100"}`}
        >
          Edit Profile
        </button>

        <button
          onClick={() => setSelectedOption("bookings")}
          className={`w-full text-left px-4 py-2 rounded-lg ${selectedOption === "bookings" ? "bg-teal-600 text-white" : "hover:bg-teal-100"}`}
        >
          All Bookings
        </button>
      </nav>
    </aside>
  );
}
