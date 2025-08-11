import React, { useState, useEffect, useContext } from "react";
import { MyContext } from "../App";
import { useNavigate } from "react-router-dom";
import { fetchDataFromApi, putData } from "../utils/api";
import { FaBuilding, FaSpinner, FaExclamationTriangle, FaCheckCircle, FaBan, FaSearch, FaMapMarkerAlt, FaUser, FaClock } from "react-icons/fa";
import { useScrollToTop } from "../hooks/useScrollToTop";

const FacilityApproval = () => {
  const context = useContext(MyContext);
  const navigate = useNavigate();
  const [venues, setVenues] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("pending");
  const [cityFilter, setCityFilter] = useState("all");

  useScrollToTop();

  // Check if user is admin
  useEffect(() => {
    const checkAdminAccess = () => {
      const userData = context.userData || JSON.parse(localStorage.getItem('userData') || '{}');
      
      if (!context.isLogin) {
        navigate('/login');
        return;
      }

      if (userData.role !== 'admin') {
        navigate('/');
        context.openAlertBox && context.openAlertBox("Access denied. Admin privileges required.", "error");
        return;
      }
    };

    checkAdminAccess();
  }, [context.isLogin, context.userData, navigate, context]);

  // Fetch venues
  useEffect(() => {
    const fetchVenues = async () => {
      try {
        setLoading(true);
        setError(null);

        const response = await fetchDataFromApi('/admin/venues');

        if (response?.success) {
          setVenues(response.data);
        } else {
          setError(response?.message || "Failed to fetch venues");
        }
      } catch (error) {
        console.error("Error fetching venues:", error);
        setError("Failed to fetch venues");
      } finally {
        setLoading(false);
      }
    };

    if (context.isLogin && context.userData?.role === 'admin') {
      fetchVenues();
    }
  }, [context.isLogin, context.userData]);

  // Handle venue status update
  const handleStatusUpdate = async (venueId, newStatus) => {
    try {
      const response = await putData(`/admin/venues/${venueId}/status`, { status: newStatus });

      if (response?.success) {
        // Update local state
        setVenues(prevVenues => 
          prevVenues.map(venue => 
            venue._id === venueId 
              ? { ...venue, status: newStatus }
              : venue
          )
        );
        
        context.openAlertBox && context.openAlertBox(
          `Venue ${newStatus === 'approved' ? 'approved' : 'rejected'} successfully`, 
          "success"
        );
      } else {
        context.openAlertBox && context.openAlertBox(
          response?.message || "Failed to update venue status", 
          "error"
        );
      }
    } catch (error) {
      console.error("Error updating venue status:", error);
      context.openAlertBox && context.openAlertBox("Failed to update venue status", "error");
    }
  };

  // Filter venues based on search and filters
  const filteredVenues = venues.filter(venue => {
    const matchesSearch = venue.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         venue.description?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === "all" || venue.status === statusFilter;
    const matchesCity = cityFilter === "all" || venue.address?.city === cityFilter;
    
    return matchesSearch && matchesStatus && matchesCity;
  });

  // Get unique cities for filter
  const uniqueCities = [...new Set(venues.map(venue => venue.address?.city).filter(Boolean))];

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

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-emerald-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-red-600 to-purple-600 bg-clip-text text-transparent mb-2">
            Venue Approval Management
          </h1>
          <p className="text-gray-600 text-lg">
            Review and approve pending venue submissions from facility owners.
          </p>
        </div>

        {/* Filters */}
        <div className="bg-white/90 backdrop-blur-md rounded-2xl shadow-xl p-6 border border-white/20 mb-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Search */}
            <div className="relative">
              <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Search venues..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            {/* Status Filter */}
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="all">All Status</option>
              <option value="pending">Pending</option>
              <option value="approved">Approved</option>
              <option value="rejected">Rejected</option>
            </select>

            {/* City Filter */}
            <select
              value={cityFilter}
              onChange={(e) => setCityFilter(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="all">All Cities</option>
              {uniqueCities.map(city => (
                <option key={city} value={city}>{city}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Venues Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredVenues.map((venue, index) => (
            <div key={venue._id || index} className="bg-white/90 backdrop-blur-md rounded-2xl shadow-xl border border-white/20 overflow-hidden">
              {/* Venue Image */}
              <div className="h-48 bg-gray-200 relative">
                {venue.photos && venue.photos.length > 0 ? (
                  <img
                    src={venue.photos[0]}
                    alt={venue.name}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      e.target.style.display = 'none';
                      e.target.nextSibling.style.display = 'flex';
                    }}
                  />
                ) : null}
                <div className="absolute inset-0 bg-gray-300 flex items-center justify-center text-gray-600 font-medium"
                     style={{ display: venue.photos && venue.photos.length > 0 ? 'none' : 'flex' }}>
                  <FaBuilding className="text-4xl" />
                </div>
                
                {/* Status Badge */}
                <div className="absolute top-4 right-4">
                  <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                    venue.status === 'approved' ? 'bg-green-100 text-green-800' :
                    venue.status === 'rejected' ? 'bg-red-100 text-red-800' :
                    'bg-yellow-100 text-yellow-800'
                  }`}>
                    {venue.status?.toUpperCase() || 'PENDING'}
                  </span>
                </div>
              </div>

              {/* Venue Details */}
              <div className="p-6">
                <h3 className="text-xl font-bold text-gray-800 mb-2">{venue.name}</h3>
                <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                  {venue.description || 'No description available'}
                </p>

                {/* Location */}
                <div className="flex items-center text-gray-500 text-sm mb-3">
                  <FaMapMarkerAlt className="mr-2" />
                  <span>
                    {venue.address?.street && `${venue.address.street}, `}
                    {venue.address?.city}, {venue.address?.state}
                  </span>
                </div>

                {/* Owner */}
                <div className="flex items-center text-gray-500 text-sm mb-3">
                  <FaUser className="mr-2" />
                  <span>{venue.owner?.fullName || 'Unknown Owner'}</span>
                </div>

                {/* Sports Available */}
                {venue.sportsAvailable && venue.sportsAvailable.length > 0 && (
                  <div className="mb-4">
                    <p className="text-sm text-gray-600 mb-2">Sports Available:</p>
                    <div className="flex flex-wrap gap-2">
                      {venue.sportsAvailable.map((sport, idx) => (
                        <span key={idx} className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full">
                          {sport}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {/* Rating */}
                {venue.rating && (
                  <div className="flex items-center mb-4">
                    <div className="flex text-yellow-400">
                      {[...Array(5)].map((_, i) => (
                        <span key={i} className={i < Math.floor(venue.rating) ? 'text-yellow-400' : 'text-gray-300'}>
                          ★
                        </span>
                      ))}
                    </div>
                    <span className="ml-2 text-sm text-gray-600">{venue.rating}</span>
                  </div>
                )}

                {/* Actions */}
                {venue.status === 'pending' && (
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleStatusUpdate(venue._id, 'approved')}
                      className="flex-1 bg-green-600 text-white py-2 px-4 rounded-lg hover:bg-green-700 transition-colors flex items-center justify-center gap-2"
                    >
                      <FaCheckCircle />
                      Approve
                    </button>
                    <button
                      onClick={() => handleStatusUpdate(venue._id, 'rejected')}
                      className="flex-1 bg-red-600 text-white py-2 px-4 rounded-lg hover:bg-red-700 transition-colors flex items-center justify-center gap-2"
                    >
                      <FaBan />
                      Reject
                    </button>
                  </div>
                )}

                {venue.status === 'approved' && (
                  <div className="text-center">
                    <span className="text-green-600 font-semibold flex items-center justify-center gap-2">
                      <FaCheckCircle />
                      Approved
                    </span>
                  </div>
                )}

                {venue.status === 'rejected' && (
                  <div className="text-center">
                    <span className="text-red-600 font-semibold flex items-center justify-center gap-2">
                      <FaBan />
                      Rejected
                    </span>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>

        {filteredVenues.length === 0 && (
          <div className="text-center py-12">
            <FaBuilding className="text-gray-400 text-4xl mx-auto mb-4" />
            <p className="text-gray-500 text-lg">No venues found</p>
            <p className="text-gray-400">Try adjusting your search or filters</p>
          </div>
        )}

        {/* Summary */}
        <div className="mt-8 bg-white/90 backdrop-blur-md rounded-2xl shadow-xl p-6 border border-white/20">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 text-center">
            <div>
              <p className="text-2xl font-bold text-blue-600">{venues.length}</p>
              <p className="text-gray-600">Total Venues</p>
            </div>
            <div>
              <p className="text-2xl font-bold text-yellow-600">
                {venues.filter(v => v.status === 'pending').length}
              </p>
              <p className="text-gray-600">Pending Approval</p>
            </div>
            <div>
              <p className="text-2xl font-bold text-green-600">
                {venues.filter(v => v.status === 'approved').length}
              </p>
              <p className="text-gray-600">Approved</p>
            </div>
            <div>
              <p className="text-2xl font-bold text-red-600">
                {venues.filter(v => v.status === 'rejected').length}
              </p>
              <p className="text-gray-600">Rejected</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FacilityApproval;
