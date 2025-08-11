// src/pages/ProfilePage.jsx
import React, { useState, useEffect, useContext } from "react";
import ProfileSidebar from "../components/ProfileSidebar";
import AllBookings from "../components/AllBookings";
import EditProfile from "../components/EditProfile";
import { MyContext } from "../App";
import { fetchDataFromApi } from "../utils/api";
import { useScrollToTop } from "../hooks/useScrollToTop";

export default function ProfilePage() {
  const [selectedOption, setSelectedOption] = useState("bookings");
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  const context = useContext(MyContext);

  // Use custom hook for scroll to top
  useScrollToTop();

  // Fetch user profile data from API
  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        setLoading(true);
        const response = await fetchDataFromApi("/api/users/profile");
        
        if (response?.success) {
          setUser(response.data);
          // Update context with fresh user data
          if (context.setUserData) {
            context.setUserData(response.data);
          }
          // Update localStorage with fresh user data
          localStorage.setItem("userData", JSON.stringify(response.data));
        } else {
          setError(response?.message || "Failed to fetch profile");
          context.openAlertBox("error", response?.message || "Failed to fetch profile");
        }
      } catch (error) {
        console.error("Error fetching profile:", error);
        setError("Failed to fetch profile data");
        context.openAlertBox("error", "Failed to fetch profile data");
      } finally {
        setLoading(false);
      }
    };

    fetchUserProfile();
  }, []); // Remove context dependency to prevent infinite reloading

  // bookings state (you can replace with real data later)
  const [bookings, setBookings] = useState([
    {
      id: 1,
      sport: "Skyline Badminton Court (Badminton)",
      date: "18 June 2025",
      time: "5:00 PM - 6:00 PM",
      location: "Rajkot, Gujarat",
      status: "Confirmed",
      cancelBy: "15 June 2025",
      image: "taines cork.jpg",
      address: "Near Station Road, Rajkot",
    },
    {
      id: 2,
      sport: "Aggentina Football Field",
      date: "10 June 2024",
      time: "5:00 PM - 6:00 PM",
      location: "Rajkot, Gujarat",
      status: "Cancelled",
      cancelBy: "07 June 2024",
      image: "football field.jpg",
      address: "Near Station Road, Rajkot",
    },
  ]);

  // cancel handler (updates booking status locally)
  const handleCancelBooking = (id) => {
    setBookings((prev) =>
      prev.map((b) => (b.id === id ? { ...b, status: "Cancelled" } : b))
    );
  };

  // save profile handler
  const handleSaveProfile = (updatedUser) => {
    setUser(updatedUser);
    // Update context and localStorage
    if (context.setUserData) {
      context.setUserData(updatedUser);
    }
    localStorage.setItem("userData", JSON.stringify(updatedUser));
    context.openAlertBox("success", "Profile updated successfully!");
  };

  // reset profile to initial
  const handleResetProfile = () => {
    // Fetch fresh data from API
    const fetchUserProfile = async () => {
      try {
        const response = await fetchDataFromApi("/api/users/profile");
        if (response?.success) {
          setUser(response.data);
          if (context.setUserData) {
            context.setUserData(response.data);
          }
          localStorage.setItem("userData", JSON.stringify(response.data));
          context.openAlertBox("success", "Profile reset to original data");
        }
      } catch (error) {
        context.openAlertBox("error", "Failed to reset profile");
      }
    };
    fetchUserProfile();
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-emerald-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading profile...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-emerald-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-600 mb-4">{error}</p>
          <button 
            onClick={() => window.location.reload()} 
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-emerald-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-600 mb-4">No user data available</p>
          <button 
            onClick={() => window.location.reload()} 
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
          >
            Refresh
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-emerald-50 p-8">
      <div className="flex flex-col lg:flex-row gap-8 max-w-7xl mx-auto">
        {/* Sidebar (left) */}
        <div className="lg:w-1/3">
          <ProfileSidebar
            user={user}
            selectedOption={selectedOption}
            setSelectedOption={setSelectedOption}
          />
        </div>

        {/* Right content */}
        <div className="lg:w-2/3">
          <div className="bg-white/90 backdrop-blur-md rounded-2xl shadow-2xl border border-white/20 overflow-hidden">
            <div className="p-8">
              {selectedOption === "bookings" ? (
                <AllBookings
                  bookings={bookings}
                  onCancelBooking={handleCancelBooking}
                />
              ) : (
                <EditProfile
                  user={user}
                  onSave={handleSaveProfile}
                  onReset={handleResetProfile}
                />
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
