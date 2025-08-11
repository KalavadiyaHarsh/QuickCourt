// src/pages/ProfilePage.jsx
import React, { useState } from "react";
import ProfileSidebar from "../components/ProfileSidebar"; // adjust path
import AllBookings from "../components/AllBookings";     // adjust path
import EditProfile from "../components/EditProfile";     // adjust path

export default function ProfilePage() {
  const [selectedOption, setSelectedOption] = useState("bookings"); // "edit" or "bookings"

  // keep user as state so EditProfile can update it
  const initialUser = {
    name: "John Doe",
    email: "john@example.com",
    phone: "+91 9876543210",
    photo: "man.png",
  };
  const [user, setUser] = useState(initialUser);

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
    // optional: toast or alert
    alert("Profile saved");
  };

  // reset profile to initial
  const handleResetProfile = () => {
    setUser(initialUser);
  };

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
