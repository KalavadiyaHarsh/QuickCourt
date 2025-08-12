// src/components/ProfileSidebar.jsx
import React from "react";

export default function ProfileSidebar({ user, selectedOption, setSelectedOption }) {
  // Helper function to get avatar source
  const getAvatarSrc = () => {
    if (user?.avatar && user.avatar !== 'default.jpg') {
      return user.avatar;
    }
    // Return default avatar from public folder
    return "/man.png";
  };

  // Helper function to get display name
  const getDisplayName = () => {
    return user?.fullName || user?.name || 'User';
  };

  // Helper function to get display email
  const getDisplayEmail = () => {
    return user?.email || 'No email available';
  };

  // Helper function to get user status
  const getUserStatus = () => {
    if (user?.status === 'active') {
      return { text: 'Active', color: 'bg-green-500' };
    }
    return { text: 'Inactive', color: 'bg-gray-500' };
  };

  const statusInfo = getUserStatus();

  return (
    <aside className="bg-white/90 backdrop-blur-md rounded-2xl shadow-2xl p-8 border border-white/20 h-fit">
      <div className="flex flex-col items-center mb-8">
        <div className="relative mb-6">
          <img 
            src={getAvatarSrc()} 
            alt="Profile" 
            className="w-32 h-32 rounded-full border-4 border-gradient-to-r from-blue-500 to-purple-500 shadow-2xl transform hover:scale-105 transition-all duration-300 object-cover" 
            onError={(e) => {
              e.target.src = "/man.png";
            }}
          />
          <div className={`absolute -bottom-2 -right-2 w-8 h-8 ${statusInfo.color} rounded-full border-4 border-white shadow-lg flex items-center justify-center`}>
            <span className="text-white text-xs font-bold">{statusInfo.text.charAt(0)}</span>
          </div>
        </div>
        <h2 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-2 text-center">
          {getDisplayName()}
        </h2>
        <p className="text-gray-600 font-medium mb-1">{getDisplayEmail()}</p>
        {user?.role && (
          <p className="text-gray-500 font-medium capitalize">{user.role}</p>
        )}
        {user?.isVerified !== undefined && (
          <div className="flex items-center gap-2 mt-2">
            <span className={`w-2 h-2 rounded-full ${user.isVerified ? 'bg-green-500' : 'bg-red-500'}`}></span>
            <span className="text-sm text-gray-600">
              {user.isVerified ? 'Verified' : 'Not Verified'}
            </span>
          </div>
        )}
        {user?.createdAt && (
          <p className="text-xs text-gray-400 mt-2">
            Member since {new Date(user.createdAt).toLocaleDateString()}
          </p>
        )}
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
