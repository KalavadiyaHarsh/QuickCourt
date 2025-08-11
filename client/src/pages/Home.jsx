import React, { useState, useEffect, useRef } from 'react';
import Slider from '../components/Slider';
import { fetchDataFromApi } from '../utils/api';
import { FaMapMarkerAlt, FaStar, FaSpinner, FaSearch, FaFilter } from 'react-icons/fa';
import { Link } from 'react-router-dom';

const Home = () => {
  const [homeData, setHomeData] = useState(null);
  const [popularVenues, setPopularVenues] = useState([]);
  const [sports, setSports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // Search state
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [searchLoading, setSearchLoading] = useState(false);
  const [showSearchResults, setShowSearchResults] = useState(false);
  
  // Refs for click outside handling
  const searchRef = useRef(null);

  // Fetch home data
  useEffect(() => {
    const fetchHomeData = async () => {
      try {
        setLoading(true);
        setError(null);

        // Fetch home data
        const homeResponse = await fetchDataFromApi('/api/home');
        if (homeResponse?.success) {
          setHomeData(homeResponse.data);
        }

        // Fetch popular venues
        const popularResponse = await fetchDataFromApi('/api/users/venues/popular');
        if (popularResponse?.success) {
          setPopularVenues(popularResponse.data);
        }

        // Fetch sports data
        const sportsResponse = await fetchDataFromApi('/api/home/sports');
        if (sportsResponse?.success) {
          setSports(sportsResponse.data);
        }

      } catch (error) {
        console.error("Error fetching home data:", error);
        setError("Failed to fetch home data");
      } finally {
        setLoading(false);
      }
    };

    fetchHomeData();
  }, []);

  // Click outside handler
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (searchRef.current && !searchRef.current.contains(event.target)) {
        setShowSearchResults(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  // Search venues
  const searchVenues = async (query) => {
    if (!query.trim()) {
      setSearchResults([]);
      setShowSearchResults(false);
      return;
    }

    setSearchLoading(true);
    try {
      const response = await fetchDataFromApi(`/api/home/search?q=${encodeURIComponent(query)}&limit=5`);
      if (response?.success) {
        setSearchResults(response.data);
        setShowSearchResults(true);
      }
    } catch (error) {
      console.error("Error searching venues:", error);
    } finally {
      setSearchLoading(false);
    }
  };

  // Handle search input change
  const handleSearchChange = (e) => {
    const query = e.target.value;
    setSearchQuery(query);
    
    if (query.trim()) {
      const timeoutId = setTimeout(() => searchVenues(query), 500);
      return () => clearTimeout(timeoutId);
    } else {
      setSearchResults([]);
      setShowSearchResults(false);
    }
  };

  // Helper function to get image source with fallback
  const getImageSource = (photos, sportType = null) => {
    if (photos && photos.length > 0) {
      return photos[0];
    }
    
    // Return relevant static image based on sport type
    if (sportType) {
      const sportImages = {
        'badminton': '/badminton.jpg',
        'tennis': '/tennis.jpg',
        'football': '/football.jpeg',
        'cricket': '/cricket.jpg',
        'basketball': '/football.jpeg', // Using football as fallback
        'table-tennis': '/table tennis.jpeg',
        'squash': '/tennis.jpg', // Using tennis as fallback
        'volleyball': '/football.jpeg' // Using football as fallback
      };
      return sportImages[sportType] || '/football field.jpg';
    }
    
    return '/football field.jpg';
  };

  // Helper function to get sport image
  const getSportImage = (sportName) => {
    const sportImages = {
      'badminton': '/badminton.jpg',
      'tennis': '/tennis.jpg',
      'football': '/football.jpeg',
      'cricket': '/cricket.jpg',
      'basketball': '/football.jpeg',
      'table-tennis': '/table tennis.jpeg',
      'squash': '/tennis.jpg',
      'volleyball': '/football.jpeg',
      'swimming': '/t1.jpeg'
    };
    return sportImages[sportName.toLowerCase()] || '/football field.jpg';
  };

  if (loading) {
    return (
      <div className="w-full flex items-center justify-center h-64">
        <FaSpinner className="animate-spin text-4xl text-blue-600" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="w-full text-center py-12">
        <p className="text-red-600 text-lg mb-4">{error}</p>
        <button 
          onClick={() => window.location.reload()} 
          className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700"
        >
          Retry
        </button>
      </div>
    );
  }

  return (
    <div className="w-full relative">
      {/* Hero Section with Search */}
      <section className="grid grid-cols-1 md:grid-cols-2 gap-8 p-8 relative">
        {/* Left */}
        <div className="flex flex-col justify-center space-y-6">
          <div className="relative" ref={searchRef}>
            <div className="flex items-center gap-3 border-2 border-white/20 rounded-2xl px-6 py-4 w-full max-w-md bg-white/80 backdrop-blur-md shadow-2xl transform hover:scale-105 transition-all duration-300">
              <FaSearch className="text-blue-500 text-xl drop-shadow-lg" />
              <input
                type="text"
                placeholder="Search for venues, sports, or cities..."
                value={searchQuery}
                onChange={handleSearchChange}
                className="flex-1 outline-none bg-transparent text-gray-700 font-medium placeholder-gray-500"
              />
              {searchLoading && <FaSpinner className="animate-spin text-blue-500" />}
            </div>
            
            {/* Search Results Dropdown */}
            {showSearchResults && searchResults.length > 0 && (
              <div className="absolute top-full left-0 right-0 mt-2 bg-white rounded-xl shadow-2xl border border-gray-200 z-50 max-h-80 overflow-y-auto">
                {searchResults.map((venue) => (
                  <Link 
                    key={venue._id} 
                    to={`/venuedetails/${venue._id}`}
                    onClick={() => setShowSearchResults(false)}
                  >
                    <div className="p-4 hover:bg-gray-50 border-b border-gray-100 last:border-b-0">
                      <div className="flex items-center gap-3">
                        <img 
                          src={getImageSource(venue.photos, venue.sportsAvailable?.[0])} 
                          alt={venue.name}
                          className="w-12 h-12 rounded-lg object-cover"
                          onError={(e) => {
                            e.target.src = getImageSource(null, venue.sportsAvailable?.[0]);
                          }}
                        />
                        <div>
                          <h4 className="font-semibold text-gray-800">{venue.name}</h4>
                          <p className="text-sm text-gray-600">
                            {venue.address?.city}, {venue.address?.state}
                          </p>
                          <p className="text-xs text-gray-500">
                            {venue.sportsAvailable?.join(', ')} • ₹{venue.startingPrice}/hour
                          </p>
                        </div>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </div>
          
          <div className="space-y-4">
            <h2 className="text-4xl font-bold bg-gradient-to-r from-blue-600 via-purple-600 to-emerald-600 bg-clip-text text-transparent drop-shadow-lg">
              FIND PLAYERS & VENUES NEARBY
            </h2>
            <p className="text-gray-600 max-w-md text-lg leading-relaxed">
              Seamlessly explore sports venues and play with sports enthusiasts just like you!
            </p>
            
            {/* Stats */}
            {homeData?.stats && (
              <div className="flex gap-6 text-sm">
                <div className="text-center">
                  <div className="text-2xl font-bold text-blue-600">{homeData.stats.totalVenues}</div>
                  <div className="text-gray-600">Venues</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-purple-600">{homeData.stats.totalSports}</div>
                  <div className="text-gray-600">Sports</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-emerald-600">{homeData.stats.totalBookings}</div>
                  <div className="text-gray-600">Bookings</div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Right */}
        <div className="flex justify-center items-center">
          <div className="relative group">
            <img
              src="https://media.istockphoto.com/id/1136317339/photo/sports-equipment-on-floor.jpg?s=612x612&w=0&k=20&c=-aI8u_Se89IC-HJZYH724ei5z-bIcSvRW6qUwyMtRyE="
              alt="Sports"
              className="hidden md:block rounded-2xl shadow-2xl w-full max-w-md transform group-hover:scale-105 transition-all duration-500 border-4 border-white/20"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent rounded-2xl"></div>
          </div>
        </div>
      </section>

      {/* Popular Venues Section */}
      <div className="flex justify-between items-center px-8 mt-12">
        <h3 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
          Popular Venues
        </h3>
        <Link to={"/allvenue"}>
          <button className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-6 py-3 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 font-semibold">
            See all venues →
          </button>
        </Link>
      </div>

      {/* Venues Grid */}
      <div className="px-8 mt-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {popularVenues.map((venue) => (
            <div key={venue._id} className="bg-white/90 backdrop-blur-md rounded-2xl shadow-2xl overflow-hidden hover:shadow-3xl transition-all duration-500 transform hover:scale-105 border border-white/20 group">
              <div className="relative overflow-hidden h-48">
                <img 
                  src={getImageSource(venue.photos, venue.sportsAvailable?.[0])} 
                  alt={venue.name} 
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                  onError={(e) => {
                    e.target.src = getImageSource(null, venue.sportsAvailable?.[0]);
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
              <div className="p-6">
                <h4 className="font-bold text-xl text-gray-800 mb-2">{venue.name}</h4>
                <div className="flex items-center text-gray-600 text-sm mb-3">
                  <FaMapMarkerAlt className="mr-2 text-red-500" />
                  {venue.address?.city}, {venue.address?.state}
                </div>
                <p className="text-gray-600 text-sm mb-3" style={{ 
                  display: '-webkit-box',
                  WebkitLineClamp: 2,
                  WebkitBoxOrient: 'vertical',
                  overflow: 'hidden'
                }}>{venue.description}</p>
                <div className="flex flex-wrap gap-2 mb-3">
                  {venue.sportsAvailable?.map((sport, index) => (
                    <span
                      key={index}
                      className="text-xs bg-gradient-to-r from-blue-100 to-purple-100 text-blue-700 px-3 py-1 rounded-full font-medium border border-blue-200"
                    >
                      {sport}
                    </span>
                  ))}
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-green-600 font-bold">₹{venue.startingPrice || "N/A"}/hour</span>
                  <Link to={`/venuedetails/${venue._id}`}>
                    <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors text-sm">
                      View Details
                    </button>
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Popular Sports Section */}
      <div className="px-8 mt-16 mb-8">
        <h3 className="text-3xl font-bold mb-8 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
          Popular Sports
        </h3>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-6">
          {sports.map((sport, index) => (
            <Link 
              key={sport._id || index} 
              to={`/allvenue?sport=${sport.sport}`}
              className="flex flex-col items-center bg-white/90 backdrop-blur-md rounded-2xl shadow-xl overflow-hidden hover:shadow-2xl transition-all duration-500 transform hover:scale-110 border border-white/20 group"
            >
              <div className="relative overflow-hidden w-full h-32">
                <img 
                  src={getSportImage(sport.sport)} 
                  alt={sport.displayName} 
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                  onError={(e) => {
                    e.target.src = getSportImage('badminton'); // Fallback to badminton
                  }}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent"></div>
              </div>
              <div className="p-4 text-center">
                <span className="font-semibold text-gray-800 group-hover:text-blue-600 transition-colors duration-300">
                  {sport.displayName}
                </span>
                <div className="text-xs text-gray-500 mt-1">
                  {sport.venueCount} venues • ₹{sport.avgPrice}/hr
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>

      {/* Slider Component */}
      <Slider />
    </div>
  );
}

export default Home;