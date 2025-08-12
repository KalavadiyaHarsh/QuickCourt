import React, { useState, useEffect, useContext } from 'react';
import { Link } from 'react-router-dom';
import { FaFilter, FaSearch, FaStar, FaMapMarkerAlt } from 'react-icons/fa';
import { MyContext } from '../App';
import { fetchDataFromApi } from '../utils/api';
import { useScrollToTop } from "../hooks/useScrollToTop";

const Allvenue = () => {
  const context = useContext(MyContext);
  const [venues, setVenues] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // Filter states
  const [search, setSearch] = useState('');
  const [sportType, setSportType] = useState('All Sport');
  const [priceRange, setPriceRange] = useState([0, 5500]);
  const [venueType, setVenueType] = useState('');
  const [rating, setRating] = useState(null);

  useScrollToTop();

  // Fetch venues from API
  useEffect(() => {
    const fetchVenues = async () => {
      try {
        setLoading(true);
        setError(null);

        // Build query parameters
        const params = new URLSearchParams();
        if (search) params.append('search', search);
        if (sportType && sportType !== 'All Sport') params.append('sport', sportType);
        if (priceRange[1] < 5500) {
          params.append('minPrice', '0');
          params.append('maxPrice', priceRange[1].toString());
        }
        if (rating) params.append('rating', rating.toString());

        const response = await fetchDataFromApi(`/api/users/venues?${params.toString()}`);

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

    fetchVenues();
  }, [search, sportType, priceRange, rating]);

  // Filter venues based on local filters
  const filteredVenues = venues.filter(venue => {
    const matchesSearch = !search || 
      venue.name?.toLowerCase().includes(search.toLowerCase()) ||
      venue.description?.toLowerCase().includes(search.toLowerCase());
    
    const matchesSport = sportType === 'All Sport' || 
      venue.sportsAvailable?.includes(sportType.toLowerCase());
    
    const matchesPrice = venue.startingPrice <= priceRange[1];
    
    const matchesRating = !rating || venue.rating >= rating;
    
    return matchesSearch && matchesSport && matchesPrice && matchesRating;
  });

  // Helper function to get venue image
  const getVenueImage = (venue) => {
    if (venue.photos && venue.photos.length > 0) {
      return venue.photos[0];
    }
    // Return sport-specific fallback images
    if (venue.sportsAvailable && venue.sportsAvailable.length > 0) {
      const sport = venue.sportsAvailable[0];
      switch (sport) {
        case 'badminton': return '/badminton.jpg';
        case 'tennis': return '/tennis.jpg';
        case 'football': return '/football.jpeg';
        case 'cricket': return '/cricket.jpg';
        case 'table-tennis': return '/table tennis.jpeg';
        default: return '/football field.jpg';
      }
    }
    return '/football field.jpg';
  };

  // Helper function to format address
  const formatAddress = (venue) => {
    if (venue.address) {
      const { street, city, state } = venue.address;
      return [street, city, state].filter(Boolean).join(', ');
    }
    return 'Location not specified';
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-emerald-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading venues...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-emerald-50 flex items-center justify-center">
        <div className="text-center">
          <div className="text-red-500 text-6xl mb-4">⚠️</div>
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
            <label className="block mb-3 font-semibold text-gray-700">
              Search by venue name
            </label>
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

          {/* Sport Type */}
          <div className="mb-6">
            <label className="block mb-3 font-semibold text-gray-700">
              Filter by sport type
            </label>
            <select
              value={sportType}
              onChange={(e) => setSportType(e.target.value)}
              className="w-full p-3 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all duration-300 bg-white/80 backdrop-blur-sm"
            >
              <option>All Sport</option>
              <option>badminton</option>
              <option>tennis</option>
              <option>football</option>
              <option>cricket</option>
              <option>table-tennis</option>
            </select>
          </div>

          {/* Price Range */}
          <div className="mb-6">
            <label className="block mb-3 font-semibold text-gray-700">
              Price range (per hour)
            </label>
            <input
              type="range"
              min="0"
              max="5500"
              value={priceRange[1]}
              onChange={(e) =>
                setPriceRange([0, Number(e.target.value)])
              }
              className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer slider"
            />
            <div className="flex justify-between text-sm mt-2">
              <span className="font-medium">₹ {priceRange[0]}</span>
              <span className="font-medium">₹ {priceRange[1]}</span>
            </div>
          </div>

          {/* Rating */}
          <div className="mb-6">
            <label className="block mb-3 font-semibold text-gray-700">
              Rating
            </label>
            {[4, 3, 2, 1].map((r) => (
              <label
                key={r}
                className="flex items-center gap-3 p-2 rounded-lg hover:bg-blue-50 transition-colors duration-200"
              >
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
              setPriceRange([0, 5500]);
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
          {filteredVenues.length > 0 && (
            <p className="text-sm text-gray-500 mt-2">
              Showing {filteredVenues.length} venue{filteredVenues.length !== 1 ? 's' : ''}
            </p>
          )}
        </div>

        {filteredVenues.length === 0 ? (
          <div className="text-center py-12">
            <div className="text-gray-400 text-6xl mb-4">🏟️</div>
            <p className="text-gray-500 text-lg">No venues found</p>
            <p className="text-gray-400">Try adjusting your filters</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredVenues.map((venue) => (
              <div
                key={venue._id}
                className="bg-white/90 backdrop-blur-md rounded-2xl shadow-2xl overflow-hidden hover:shadow-3xl transition-all duration-500 transform hover:scale-105 border border-white/20 group flex flex-col"
              >
                <div className="relative overflow-hidden h-48">
                  <img
                    src={getVenueImage(venue)}
                    alt={venue.name}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                    onError={(e) => {
                      e.target.src = '/football field.jpg';
                    }}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent"></div>
                  <div className="absolute top-3 right-3 bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full">
                    <div className="flex items-center text-yellow-500 font-bold">
                      <FaStar className="mr-1" />
                      {venue.rating || 'N/A'}
                    </div>
                  </div>
                </div>
                <div className="p-6 flex flex-col flex-grow">
                  <div className="flex justify-between items-start mb-3">
                    <h4 className="font-bold text-xl text-gray-800">
                      {venue.name}
                    </h4>
                  </div>
                  <div className="flex items-center text-gray-600 text-sm mb-3">
                    <FaMapMarkerAlt className="mr-2 text-red-500" />
                    {formatAddress(venue)}
                  </div>
                  <div className="text-green-600 font-bold text-lg mb-3">
                    ₹ {venue.startingPrice || 'N/A'} per hour
                  </div>
                  <div className="flex flex-wrap gap-2 mb-6">
                    {venue.sportsAvailable?.map((sport, index) => (
                      <span
                        key={index}
                        className="text-xs bg-gradient-to-r from-blue-100 to-purple-100 text-blue-700 px-3 py-1 rounded-full font-medium border border-blue-200"
                      >
                        {sport}
                      </span>
                    )) || (
                      <span className="text-xs bg-gray-100 text-gray-600 px-3 py-1 rounded-full">
                        No sports specified
                      </span>
                    )}
                  </div>
                  <div className="mt-auto">
                    <Link to={`/venuedetails/${venue._id}`} className="block w-full">
                      <button className="w-full inline-flex items-center justify-center px-6 py-3 rounded-full bg-gradient-to-r from-emerald-500 to-green-600 text-white font-semibold shadow-md hover:shadow-lg hover:from-emerald-600 hover:to-green-700 focus:outline-none focus:ring-2 focus:ring-emerald-400 focus:ring-offset-2 focus:ring-offset-white transition-all duration-200 transform hover:scale-105">
                        View Details
                      </button>
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
};

export default Allvenue;
