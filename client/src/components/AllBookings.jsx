// src/components/AllBookings.jsx
import React, { useState, useEffect } from "react";
import { fetchDataFromApi, putData } from "../utils/api";
import { FaMapMarkerAlt, FaCalendarAlt, FaClock, FaCreditCard, FaSpinner } from "react-icons/fa";

export default function AllBookings() {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [view, setView] = useState("all"); // all | confirmed | cancelled | pending
  const [pagination, setPagination] = useState({
    currentPage: 1,
    totalPages: 1,
    totalBookings: 0,
    hasNextPage: false,
    hasPrevPage: false
  });

  // Fetch user bookings from API
  const fetchBookings = async (page = 1, status = "") => {
    try {
      setLoading(true);
      setError(null);

      // Build query parameters
      const params = new URLSearchParams();
      if (status && status !== "all") params.append('status', status);
      params.append('page', page);
      params.append('limit', 10);

      const response = await fetchDataFromApi(`/api/users/bookings?${params.toString()}`);

      if (response?.success) {
        setBookings(response.data);
        setPagination(response.pagination);
      } else {
        setError(response?.message || "Failed to fetch bookings");
        setBookings([]);
      }
    } catch (error) {
      console.error("Error fetching bookings:", error);
      setError("Failed to fetch bookings");
      setBookings([]);
    } finally {
      setLoading(false);
    }
  };

  // Initial fetch
  useEffect(() => {
    fetchBookings();
  }, []);

  // Fetch when view changes
  useEffect(() => {
    const status = view === "all" ? "" : view;
    fetchBookings(1, status);
  }, [view]);

  // Handle page change
  const handlePageChange = (newPage) => {
    const status = view === "all" ? "" : view;
    fetchBookings(newPage, status);
  };

  // Handle booking cancellation
  const handleCancelBooking = async (booking) => {
    if (!window.confirm("Are you sure you want to cancel this booking?")) {
      return;
    }

    try {
      const cancelData = {
        courtId: booking.court._id,
        venueId: booking.venue._id,
        date: new Date(booking.date).toISOString().split('T')[0],
        timeSlots: booking.timeSlots.map(slot => ({
          startTime: slot.startTime,
          endTime: slot.endTime
        })),
        paymentMethod: booking.paymentMethod,
        transactionId: booking.transactionId
      };

      const response = await putData(`/api/users/bookings/${booking._id}/cancel`, cancelData);

      if (response?.success) {
        // Refresh bookings
        const status = view === "all" ? "" : view;
        fetchBookings(pagination.currentPage, status);
        alert("Booking cancelled successfully");
      } else {
        alert(response?.message || "Failed to cancel booking");
      }
    } catch (error) {
      console.error("Error cancelling booking:", error);
      alert("Failed to cancel booking");
    }
  };

  // Helper function to format date
  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  // Helper function to format time slots
  const formatTimeSlots = (timeSlots) => {
    return timeSlots.map(slot => `${slot.startTime} - ${slot.endTime}`).join(', ');
  };

  // Helper function to get status color
  const getStatusColor = (status) => {
    switch (status.toLowerCase()) {
      case 'confirmed':
        return 'text-green-600 bg-green-100';
      case 'cancelled':
        return 'text-red-600 bg-red-100';
      case 'pending':
        return 'text-yellow-600 bg-yellow-100';
      default:
        return 'text-gray-600 bg-gray-100';
    }
  };

  // Helper function to get payment status color
  const getPaymentStatusColor = (status) => {
    switch (status.toLowerCase()) {
      case 'paid':
        return 'text-green-600 bg-green-100';
      case 'pending':
        return 'text-yellow-600 bg-yellow-100';
      case 'failed':
        return 'text-red-600 bg-red-100';
      default:
        return 'text-gray-600 bg-gray-100';
    }
  };

  if (loading && bookings.length === 0) {
    return (
      <div className="flex items-center justify-center h-64">
        <FaSpinner className="animate-spin text-4xl text-blue-600" />
      </div>
    );
  }

  return (
    <div>
      <h2 className="text-2xl font-semibold mb-6 text-gray-800">My Bookings</h2>

      {/* Filter Tabs */}
      <div className="flex gap-3 mb-6">
        {['all', 'confirmed', 'pending', 'cancelled'].map((tab) => (
          <button
            key={tab}
            onClick={() => setView(tab)}
            className={`px-4 py-2 rounded-lg font-medium transition-colors ${
              view === tab
                ? 'bg-blue-600 text-white'
                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
            }`}
          >
            {tab.charAt(0).toUpperCase() + tab.slice(1)}
          </button>
        ))}
      </div>

      {/* Bookings Count */}
      {pagination.totalBookings > 0 && (
        <p className="text-gray-600 mb-4">
          Showing {bookings.length} of {pagination.totalBookings} bookings
        </p>
      )}

      {/* Error Message */}
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
          <p className="text-red-600">{error}</p>
          <button 
            onClick={() => fetchBookings()} 
            className="mt-2 bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700"
          >
            Retry
          </button>
        </div>
      )}

      {/* Bookings List */}
      <div className="space-y-6">
        {bookings.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-500 text-lg">No bookings found</p>
            <p className="text-gray-400 text-sm mt-2">
              {view === "all" 
                ? "You haven't made any bookings yet." 
                : `No ${view} bookings found.`
              }
            </p>
          </div>
        ) : (
          bookings.map((booking) => (
            <div key={booking._id} className="bg-white shadow-lg rounded-xl p-6 hover:shadow-xl transition-shadow">
              <div className="flex flex-col lg:flex-row gap-6">
                {/* Venue Image */}
                <div className="lg:w-1/4">
                  <img 
                    src="/football field.jpg" 
                    alt={booking.venue.name} 
                    className="w-full h-32 object-cover rounded-lg"
                  />
                </div>

                {/* Booking Details */}
                <div className="flex-1 space-y-4">
                  <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
                    <div>
                      <h3 className="text-xl font-bold text-gray-800">{booking.venue.name}</h3>
                      <p className="text-gray-600">{booking.court.name} - {booking.court.sport}</p>
                    </div>
                    <div className="flex gap-2">
                      <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(booking.bookingStatus)}`}>
                        {booking.bookingStatus}
                      </span>
                      <span className={`px-3 py-1 rounded-full text-sm font-medium ${getPaymentStatusColor(booking.paymentStatus)}`}>
                        {booking.paymentStatus}
                      </span>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="flex items-center gap-2 text-gray-600">
                      <FaCalendarAlt className="text-blue-500" />
                      <span>{formatDate(booking.date)}</span>
                    </div>
                    <div className="flex items-center gap-2 text-gray-600">
                      <FaClock className="text-green-500" />
                      <span>{formatTimeSlots(booking.timeSlots)}</span>
                    </div>
                    <div className="flex items-center gap-2 text-gray-600">
                      <FaMapMarkerAlt className="text-red-500" />
                      <span>{booking.venue.address.street}, {booking.venue.address.city}</span>
                    </div>
                    <div className="flex items-center gap-2 text-gray-600">
                      <FaCreditCard className="text-purple-500" />
                      <span>₹{booking.totalAmount}</span>
                    </div>
                  </div>

                  <div className="text-sm text-gray-500">
                    <p>Booking ID: {booking._id}</p>
                    <p>Created: {new Date(booking.createdAt).toLocaleDateString()}</p>
                    {booking.transactionId && (
                      <p>Transaction: {booking.transactionId}</p>
                    )}
                  </div>
                </div>

                {/* Actions */}
                <div className="lg:w-1/4 flex flex-col gap-3">
                  {booking.canCancel && booking.bookingStatus === 'confirmed' && (
                    <button
                      onClick={() => handleCancelBooking(booking)}
                      className="w-full px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors font-medium"
                    >
                      Cancel Booking
                    </button>
                  )}
                  <button className="w-full px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors">
                    View Details
                  </button>
                  <button className="w-full px-4 py-2 border border-blue-300 text-blue-700 rounded-lg hover:bg-blue-50 transition-colors">
                    Write Review
                  </button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Pagination */}
      {pagination.totalPages > 1 && (
        <div className="flex justify-center items-center gap-2 mt-8">
          <button
            onClick={() => handlePageChange(pagination.currentPage - 1)}
            disabled={!pagination.hasPrevPage}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg disabled:bg-gray-300 disabled:cursor-not-allowed hover:bg-blue-700"
          >
            Previous
          </button>
          
          <span className="px-4 py-2 text-gray-600">
            Page {pagination.currentPage} of {pagination.totalPages}
          </span>
          
          <button
            onClick={() => handlePageChange(pagination.currentPage + 1)}
            disabled={!pagination.hasNextPage}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg disabled:bg-gray-300 disabled:cursor-not-allowed hover:bg-blue-700"
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
}
