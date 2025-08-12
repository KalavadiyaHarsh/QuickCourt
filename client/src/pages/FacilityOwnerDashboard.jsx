import React, { useState, useEffect, useContext } from "react";
import { MyContext } from "../App";
import { useNavigate } from "react-router-dom";
import { fetchDataFromApi } from "../utils/api";
import { FaUsers, FaBuilding, FaChartBar, FaCalendar, FaSpinner, FaExclamationTriangle } from "react-icons/fa";
import { useScrollToTop } from "../hooks/useScrollToTop";

const FacilityOwnerDashboard = () => {
  const context = useContext(MyContext);
  const navigate = useNavigate();
  const [dashboardData, setDashboardData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Use custom hook for scroll to top
  useScrollToTop();

  // Check if user is facility owner
  useEffect(() => {
    const checkFacilityOwnerAccess = () => {
      const userData = context.userData || JSON.parse(localStorage.getItem('userData') || '{}');
      
      if (!context.isLogin) {
        navigate('/login');
        return;
      }

      if (userData.role !== 'facility_owner') {
        navigate('/');
        context.openAlertBox && context.openAlertBox("Access denied. Facility owner privileges required.", "error");
        return;
      }
    };

    checkFacilityOwnerAccess();
  }, [context.isLogin, context.userData, navigate, context]);

  // Fetch facility owner dashboard data
  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setLoading(true);
        setError(null);

        const response = await fetchDataFromApi('/api/facility-owner/dashboard');

        if (response?.success) {
          setDashboardData(response.data);
        } else {
          setError(response?.message || "Failed to fetch dashboard data");
        }
      } catch (error) {
        console.error("Error fetching dashboard data:", error);
        setError("Failed to fetch dashboard data");
      } finally {
        setLoading(false);
      }
    };

    if (context.isLogin && context.userData?.role === 'facility_owner') {
      fetchDashboardData();
    }
  }, [context.isLogin, context.userData]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-emerald-50 flex items-center justify-center">
        <FaSpinner className="animate-spin text-4xl text-blue-600" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-emerald-50 p-6">
        <div className="max-w-4xl mx-auto text-center py-12">
          <FaExclamationTriangle className="text-red-500 text-6xl mx-auto mb-4" />
          <p className="text-red-600 text-lg mb-4">{error}</p>
          <button 
            onClick={() => window.location.reload()} 
            className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  if (!dashboardData) {
    return null;
  }

  const { stats, recentVenues, recentBookings } = dashboardData;

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-emerald-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-2">
            Facility Owner Dashboard
          </h1>
          <p className="text-gray-600 text-lg">
            Welcome back, {context.userData?.fullName || 'Facility Owner'}! Here's what's happening with your venues.
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white/90 backdrop-blur-md rounded-2xl shadow-xl p-6 border border-white/20">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm font-medium">Total Venues</p>
                <p className="text-3xl font-bold text-blue-600">{stats.totalVenues}</p>
              </div>
              <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
                <FaBuilding className="text-blue-600 text-xl" />
              </div>
            </div>
          </div>

          <div className="bg-white/90 backdrop-blur-md rounded-2xl shadow-xl p-6 border border-white/20">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm font-medium">Total Courts</p>
                <p className="text-3xl font-bold text-purple-600">{stats.totalCourts}</p>
              </div>
              <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center">
                <FaBuilding className="text-purple-600 text-xl" />
              </div>
            </div>
          </div>

          <div className="bg-white/90 backdrop-blur-md rounded-2xl shadow-xl p-6 border border-white/20">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm font-medium">Total Bookings</p>
                <p className="text-3xl font-bold text-emerald-600">{stats.totalBookings}</p>
              </div>
              <div className="w-12 h-12 bg-emerald-100 rounded-xl flex items-center justify-center">
                <FaCalendar className="text-emerald-600 text-xl" />
              </div>
            </div>
          </div>

          <div className="bg-white/90 backdrop-blur-md rounded-2xl shadow-xl p-6 border border-white/20">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm font-medium">Total Revenue</p>
                <p className="text-3xl font-bold text-green-600">₹{stats.totalRevenue}</p>
              </div>
              <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center">
                <FaChartBar className="text-green-600 text-xl" />
              </div>
            </div>
          </div>
        </div>

        {/* Recent Activity */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Recent Venues */}
          <div className="bg-white/90 backdrop-blur-md rounded-2xl shadow-xl p-6 border border-white/20">
            <h3 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
              <FaBuilding className="text-purple-600" />
              Recent Venues
            </h3>
            <div className="space-y-3">
              {recentVenues && recentVenues.length > 0 ? (
                recentVenues.map((venue, index) => (
                  <div key={venue._id || index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div>
                      <p className="font-medium text-gray-800">{venue.name}</p>
                      <p className="text-sm text-gray-600">
                        {venue.address?.city}, {venue.address?.state}
                      </p>
                      <p className="text-xs text-gray-500 capitalize">{venue.status}</p>
                    </div>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                      venue.status === 'approved' ? 'bg-green-100 text-green-800' :
                      venue.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                      'bg-red-100 text-red-800'
                    }`}>
                      {venue.status}
                    </span>
                  </div>
                ))
              ) : (
                <p className="text-gray-500 text-center py-4">No venues yet</p>
              )}
            </div>
          </div>

          {/* Recent Bookings */}
          <div className="bg-white/90 backdrop-blur-md rounded-2xl shadow-xl p-6 border border-white/20">
            <h3 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
              <FaCalendar className="text-emerald-600" />
              Recent Bookings
            </h3>
            <div className="space-y-3">
              {recentBookings && recentBookings.length > 0 ? (
                recentBookings.map((booking, index) => (
                  <div key={booking._id || index} className="p-3 bg-gray-50 rounded-lg">
                    <div className="flex justify-between items-start mb-2">
                      <p className="font-medium text-gray-800">
                        {booking.user?.fullName || 'Unknown User'}
                      </p>
                      <span className="text-sm font-bold text-green-600">
                        ₹{booking.totalAmount}
                      </span>
                    </div>
                    <p className="text-sm text-gray-600">{booking.venue?.name}</p>
                    <div className="flex gap-2 mt-2">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                        booking.bookingStatus === 'confirmed' ? 'bg-green-100 text-green-800' :
                        booking.bookingStatus === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                        'bg-red-100 text-red-800'
                      }`}>
                        {booking.bookingStatus}
                      </span>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                        booking.paymentStatus === 'paid' ? 'bg-green-100 text-green-800' :
                        'bg-yellow-100 text-yellow-800'
                      }`}>
                        {booking.paymentStatus}
                      </span>
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-gray-500 text-center py-4">No bookings yet</p>
              )}
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="mt-8 bg-white/90 backdrop-blur-md rounded-2xl shadow-xl p-6 border border-white/20">
          <h3 className="text-xl font-bold text-gray-800 mb-4">Quick Actions</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <button
              onClick={() => navigate('/facility-management')}
              className="p-4 bg-blue-50 hover:bg-blue-100 rounded-xl border border-blue-200 transition-colors text-left"
            >
              <FaBuilding className="text-blue-600 text-xl mb-2" />
              <p className="font-medium text-blue-800">Create New Venue</p>
              <p className="text-sm text-blue-600">Add a new sports venue to your portfolio</p>
            </button>

            <button
              onClick={() => navigate('/court-management')}
              className="p-4 bg-purple-50 hover:bg-purple-100 rounded-xl border border-purple-200 transition-colors text-left"
            >
              <FaBuilding className="text-purple-600 text-xl mb-2" />
              <p className="font-medium text-purple-800">Manage Courts</p>
              <p className="text-sm text-purple-600">Add and manage courts within your venues</p>
            </button>

            <button
              onClick={() => navigate('/allvenue')}
              className="p-4 bg-emerald-50 hover:bg-emerald-100 rounded-xl border border-emerald-200 transition-colors text-left"
            >
              <FaChartBar className="text-emerald-600 text-xl mb-2" />
              <p className="font-medium text-emerald-800">View All Venues</p>
              <p className="text-sm text-emerald-600">Browse and monitor all venue listings</p>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FacilityOwnerDashboard;
