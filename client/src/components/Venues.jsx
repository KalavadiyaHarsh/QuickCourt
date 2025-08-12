import React, { useState, useEffect } from "react";
import { FaMapMarkerAlt, FaStar, FaSearch, FaFilter, FaSpinner } from "react-icons/fa";
import { Link } from "react-router-dom";
import { fetchDataFromApi } from "../utils/api";
import { useScrollToTop } from "../hooks/useScrollToTop";

const Venue = () => {
  const [search, setSearch] = useState("");
  const [sportType, setSportType] = useState("All Sport");
  const [priceRange, setPriceRange] = useState([0, 5000]);
  const [city, setCity] = useState("");
  const [rating, setRating] = useState(null);
  const [venues, setVenues] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [pagination, setPagination] = useState({
    currentPage: 1,
    totalPages: 1,
    totalVenues: 0,
    hasNextPage: false,
    hasPrevPage: false
  });

  // Use custom hook for scroll to top
  useScrollToTop();
  useScrollToTop([search, sportType, priceRange, rating, city]);
  useScrollToTop([pagination.currentPage]);

  // Fetch venues from API
  const fetchVenues = async (page = 1) => {
    try {
      setLoading(true);
      setError(null);

      // Build query parameters
      const params = new URLSearchParams();
      if (search) params.append('search', search);
      if (sportType !== "All Sport") params.append('sport', sportType.toLowerCase());
      if (priceRange[0] > 0) params.append('minPrice', priceRange[0]);
      if (priceRange[1] < 5000) params.append('maxPrice', priceRange[1]);
      if (rating) params.append('rating', rating);
      if (city) params.append('city', city);
      params.append('page', page);
      params.append('limit', 10);

      const response = await fetchDataFromApi(`/api/users/venues?${params.toString()}`);

      if (response?.success) {
        setVenues(response.data);
        setPagination(response.pagination);
      } else {
        setError(response?.message || "Failed to fetch venues");
        setVenues([]);
      }
    } catch (error) {
      console.error("Error fetching venues:", error);
      setError("Failed to fetch venues");
      setVenues([]);
    } finally {
      setLoading(false);
    }
  };

  // Initial fetch
  useEffect(() => {
    fetchVenues();
  }, []);

  // Fetch when filters change
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      fetchVenues(1);
    }, 500);

    return () => clearTimeout(timeoutId);
  }, [search, sportType, priceRange, rating, city]);

  // Handle page change
  const handlePageChange = (newPage) => {
    fetchVenues(newPage);
  };

  // Helper function to get image source with fallback
  const getImageSource = (photos) => {
    if (photos && photos.length > 0) {
      return photos[0];
    }
    // Return default venue image
    return "/football field.jpg";
  };

  // Helper function to format address
  const formatAddress = (address) => {
    if (!address) return "Address not available";
    return `${address.street}, ${address.city}, ${address.state}`;
  };

  // Helper function to get starting price
  const getStartingPrice = (courts) => {
    if (!courts || courts.length === 0) return "Price not available";
    const prices = courts.map(court => court.pricePerHour).filter(price => price > 0);
    if (prices.length === 0) return "Price not available";
    return Math.min(...prices);
  };

  if (loading && venues.length === 0) {
    return (
      <div className="w-full flex flex-col md:flex-row gap-8 p-8">
        <div className="w-full md:w-1/4">
          <div className="bg-white/90 backdrop-blur-md rounded-2xl shadow-2xl p-6 border border-white/20">
            <div className="flex items-center gap-2 mb-6">
              <FaFilter className="text-blue-600 text-xl" />
              <h3 className="text-xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                Filters
              </h3>
            </div>
            <div className="animate-pulse space-y-4">
              <div className="h-10 bg-gray-200 rounded"></div>
              <div className="h-10 bg-gray-200 rounded"></div>
              <div className="h-10 bg-gray-200 rounded"></div>
            </div>
          </div>
        </div>
        <div className="flex-1">
          <div className="flex items-center justify-center h-64">
            <FaSpinner className="animate-spin text-4xl text-blue-600" />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full flex flex-col md:flex-row gap-8 p-8">
      {/* Sidebar Filters */}
      <aside className="w-full md:w-1/4 space-y-6">
        <div className="bg-white/90 backdrop-blur-md rounded-2xl shadow-2xl p-6 border border-white/20">
          <div className="flex items-center gap-2 mb-6">
            <FaFilter className="text-blue-600 text-xl" />
            <h3 className="text-xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              Filters
            </h3>
          </div>
          
          {/* Search */}
          <div className="mb-6">
            <label className="block mb-3 font-semibold text-gray-700">Search by venue name</label>
            <div className="relative">
              <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Search for venue"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full p-3 pl-10 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all duration-300 bg-white/80 backdrop-blur-sm"
              />
            </div>
          </div>

          {/* City */}
          <div className="mb-6">
            <label className="block mb-3 font-semibold text-gray-700">City</label>
            <input
              type="text"
              placeholder="Enter city name"
              value={city}
              onChange={(e) => setCity(e.target.value)}
              className="w-full p-3 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all duration-300 bg-white/80 backdrop-blur-sm"
            />
          </div>

          {/* Sport Type */}
          <div className="mb-6">
            <label className="block mb-3 font-semibold text-gray-700">Filter by sport type</label>
            <select
              value={sportType}
              onChange={(e) => setSportType(e.target.value)}
              className="w-full p-3 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all duration-300 bg-white/80 backdrop-blur-sm"
            >
              <option>All Sport</option>
              <option>badminton</option>
              <option>football</option>
              <option>tennis</option>
              <option>cricket</option>
              <option>table tennis</option>
            </select>
          </div>

          {/* Price Range */}
          <div className="mb-6">
            <label className="block mb-3 font-semibold text-gray-700">Price range (per hour)</label>
            <input
              type="range"
              min="0"
              max="5000"
              value={priceRange[1]}
              onChange={(e) => setPriceRange([0, Number(e.target.value)])}
              className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer slider"
            />
            <div className="flex justify-between text-sm mt-2">
              <span className="font-medium">₹ {priceRange[0]}</span>
              <span className="font-medium">₹ {priceRange[1]}</span>
            </div>
          </div>

          {/* Rating */}
          <div className="mb-6">
            <label className="block mb-3 font-semibold text-gray-700">Rating</label>
            {[4, 3, 2, 1].map((r) => (
              <label key={r} className="flex items-center gap-3 p-2 rounded-lg hover:bg-blue-50 transition-colors duration-200">
                <input
                  type="radio"
                  name="rating"
                  onChange={() => setRating(r)}
                  checked={rating === r}
                  className="text-blue-600"
                /> 
                <span className="font-medium">{r} stars & up</span>
              </label>
            ))}
          </div>

          {/* Clear Filters */}
          <button
            onClick={() => {
              setSearch("");
              setSportType("All Sport");
              setPriceRange([0, 5000]);
              setCity("");
              setRating(null);
            }}
            className="w-full bg-gradient-to-r from-red-500 to-red-600 text-white px-6 py-3 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 font-semibold"
          >
            Clear Filters
          </button>
        </div>
      </aside>

      {/* Venues Grid */}
      <main className="flex-1">
        <div className="mb-8">
          <h2 className="text-4xl font-bold mb-4 bg-gradient-to-r from-blue-600 via-purple-600 to-emerald-600 bg-clip-text text-transparent">
            Sports Venues
          </h2>
          <p className="text-gray-600 text-lg">
            Discover and Book Nearby Venues
          </p>
          {pagination.totalVenues > 0 && (
            <p className="text-gray-500 text-sm mt-2">
              Showing {venues.length} of {pagination.totalVenues} venues
            </p>
          )}
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
            <p className="text-red-600">{error}</p>
            <button 
              onClick={() => fetchVenues()} 
              className="mt-2 bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700"
            >
              Retry
            </button>
          </div>
        )}

        {venues.length === 0 && !loading ? (
          <div className="text-center py-12">
            <p className="text-gray-500 text-lg">No venues found matching your criteria</p>
            <button 
              onClick={() => fetchVenues()} 
              className="mt-4 bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700"
            >
              View All Venues
            </button>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
              {venues.map((venue) => (
                <div
                  key={venue._id}
                  className="bg-white/90 backdrop-blur-md rounded-2xl shadow-2xl overflow-hidden hover:shadow-3xl transition-all duration-500 transform hover:scale-105 border border-white/20 group flex flex-col"
                >
                  <div className="relative overflow-hidden h-48">
                    <img 
                      src={getImageSource(venue.photos)} 
                      alt={venue.name} 
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                      onError={(e) => {
                        e.target.src = "/football field.jpg";
                      }}
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent"></div>
                    <div className="absolute top-3 right-3 bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full">
                      <div className="flex items-center text-yellow-500 font-bold">
                        <FaStar className="mr-1" />
                        {venue.rating || "N/A"}
                      </div>
                    </div>
                  </div>
                  <div className="p-6 flex flex-col flex-grow">
                    <div className="flex justify-between items-start mb-3">
                      <h4 className="font-bold text-xl text-gray-800">{venue.name}</h4>
                    </div>
                    <div className="flex items-center text-gray-600 text-sm mb-3">
                      <FaMapMarkerAlt className="mr-2 text-red-500" />
                      {formatAddress(venue.address)}
                    </div>
                    <div className="text-green-600 font-bold text-lg mb-3">
                      ₹ {getStartingPrice(venue.courts)} per hour
                    </div>
                    <div className="flex flex-wrap gap-2 mb-4">
                      {venue.sportsAvailable?.map((sport, index) => (
                        <span
                          key={index}
                          className="text-xs bg-gradient-to-r from-blue-100 to-purple-100 text-blue-700 px-3 py-1 rounded-full font-medium border border-blue-200"
                        >
                          {sport}
                        </span>
                      ))}
                      {venue.courtCount && (
                        <span className="text-xs bg-green-100 text-green-700 px-3 py-1 rounded-full font-medium border border-green-200">
                          {venue.courtCount} courts
                        </span>
                      )}
                    </div>
                    <div className="mt-auto">
                      <Link to={`/venuedetails/${venue._id}`} className="block w-full">
                        <button
                          className="w-full inline-flex items-center justify-center px-6 py-3 rounded-full bg-gradient-to-r from-emerald-500 to-green-600 text-white font-semibold shadow-md hover:shadow-lg hover:from-emerald-600 hover:to-green-700 focus:outline-none focus:ring-2 focus:ring-emerald-400 focus:ring-offset-2 focus:ring-offset-white transition-all duration-200 transform hover:scale-105"
                        >
                          View Details
                        </button>
                      </Link>
                    </div>
                  </div>
                </div>
              ))}
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
          </>
        )}
      </main>
    </div>
  );
};

export default Venue;

