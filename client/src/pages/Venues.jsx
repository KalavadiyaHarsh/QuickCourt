import React, { useState, useEffect } from 'react';
import { FaMapMarkerAlt, FaStar, FaSearch, FaFilter, FaBasketballBall, FaFutbol, FaTableTennis } from 'react-icons/fa';
import { IoIosTennisball } from "react-icons/io";

import { Link } from 'react-router-dom';

const Venues = () => {
  const [venues, setVenues] = useState([]);
  const [filteredVenues, setFilteredVenues] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [sportType, setSportType] = useState('All Sports');
  const [priceRange, setPriceRange] = useState([0, 1000]);
  const [venueType, setVenueType] = useState('All');
  const [rating, setRating] = useState(null);

  // Sample venue data
  const sampleVenues = [
    {
      id: 1,
      name: "Sunrise Tennis Club",
      sport: "Tennis",
      location: "Downtown Sports Complex",
      price: 500,
      rating: 4.8,
      reviews: 124,
      image: "https://images.unsplash.com/photo-1551698618-1dfe5d97d256?w=400&h=300&fit=crop",
      tags: ["Indoor", "Professional", "Lighting"],
      type: "Indoor"
    },
    {
      id: 2,
      name: "Elite Basketball Court",
      sport: "Basketball",
      location: "Westside Arena",
      price: 300,
      rating: 4.6,
      reviews: 89,
      image: "https://images.unsplash.com/photo-1546519638-68e109498ffc?w=400&h=300&fit=crop",
      tags: ["Indoor", "Air Conditioned", "Scoreboard"],
      type: "Indoor"
    },
    {
      id: 3,
      name: "Greenfield Football Ground",
      sport: "Football",
      location: "Central Park",
      price: 400,
      rating: 4.7,
      reviews: 156,
      image: "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400&h=300&fit=crop",
      tags: ["Outdoor", "Natural Grass", "Floodlights"],
      type: "Outdoor"
    },
    {
      id: 4,
      name: "Pro Table Tennis Center",
      sport: "Table Tennis",
      location: "Sports Mall",
      price: 200,
      rating: 4.5,
      reviews: 67,
      image: "https://images.unsplash.com/photo-1606092195730-5d7b9af1efc5?w=400&h=300&fit=crop",
      tags: ["Indoor", "Professional Tables", "Coaching"],
      type: "Indoor"
    },
    {
      id: 5,
      name: "Riverside Tennis Academy",
      sport: "Tennis",
      location: "Riverside Drive",
      price: 600,
      rating: 4.9,
      reviews: 203,
      image: "https://images.unsplash.com/photo-1595435934249-5df7ed86e1c0?w=400&h=300&fit=crop",
      tags: ["Outdoor", "Clay Courts", "Professional"],
      type: "Outdoor"
    },
    {
      id: 6,
      name: "Community Basketball Hub",
      sport: "Basketball",
      location: "Community Center",
      price: 250,
      rating: 4.4,
      reviews: 78,
      image: "https://images.unsplash.com/photo-1546519638-68e109498ffc?w=400&h=300&fit=crop",
      tags: ["Indoor", "Community", "Affordable"],
      type: "Indoor"
    }
  ];

  useEffect(() => {
    // Simulate API call
    setTimeout(() => {
      setVenues(sampleVenues);
      setFilteredVenues(sampleVenues);
      setLoading(false);
    }, 1000);
  }, []);

  useEffect(() => {
    filterVenues();
  }, [search, sportType, priceRange, venueType, rating, venues]);

  const filterVenues = () => {
    let filtered = venues.filter(venue => {
      const matchesSearch = venue.name.toLowerCase().includes(search.toLowerCase()) ||
                           venue.location.toLowerCase().includes(search.toLowerCase());
      const matchesSport = sportType === 'All Sports' || venue.sport === sportType;
      const matchesPrice = venue.price >= priceRange[0] && venue.price <= priceRange[1];
      const matchesType = venueType === 'All' || venue.type === venueType;
      const matchesRating = !rating || venue.rating >= rating;

      return matchesSearch && matchesSport && matchesPrice && matchesType && matchesRating;
    });

    setFilteredVenues(filtered);
  };

  const clearFilters = () => {
    setSearch('');
    setSportType('All Sports');
    setPriceRange([0, 1000]);
    setVenueType('All');
    setRating(null);
  };

  const getSportIcon = (sport) => {
    switch (sport) {
      case 'Tennis': return IoIosTennisball ;
      case 'Basketball': return FaBasketballBall;
      case 'Football': return FaFutbol;
      case 'Table Tennis': return FaTableTennis;
      default: return IoIosTennisball ;
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="loading mb-4"></div>
          <p className="text-neutral-600">Loading venues...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="animate-fade-in">
      {/* Hero Section */}
      <section className="hero">
        <div className="container">
          <div className="hero-content text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-6">
              Sports Venues
            </h1>
            <p className="text-xl md:text-2xl opacity-90 max-w-3xl mx-auto">
              Discover and book the best sports venues in your area
            </p>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <section className="section">
        <div className="container">
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
            {/* Filters Sidebar */}
            <div className="lg:col-span-1">
              <div className="card">
                <div className="card-header">
                  <div className="flex items-center gap-2">
                    <FaFilter className="text-primary" />
                    <h3 className="text-xl font-bold">Filters</h3>
                  </div>
                </div>
                <div className="card-body space-y-6">
                  {/* Search */}
                  <div>
                    <label className="form-label">Search Venues</label>
                    <div className="relative">
                      <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-neutral-400" />
                      <input
                        type="text"
                        placeholder="Search venues..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        className="form-input pl-10"
                      />
                    </div>
                  </div>

                  {/* Sport Type */}
                  <div>
                    <label className="form-label">Sport Type</label>
                    <select
                      value={sportType}
                      onChange={(e) => setSportType(e.target.value)}
                      className="form-input form-select"
                    >
                      <option>All Sports</option>
                      <option>Tennis</option>
                      <option>Basketball</option>
                      <option>Football</option>
                      <option>Table Tennis</option>
                    </select>
                  </div>

                  {/* Price Range */}
                  <div>
                    <label className="form-label">Price Range (₹/hour)</label>
                    <div className="space-y-2">
                      <input
                        type="range"
                        min="0"
                        max="1000"
                        value={priceRange[1]}
                        onChange={(e) => setPriceRange([0, Number(e.target.value)])}
                        className="w-full slider"
                      />
                      <div className="flex justify-between text-sm">
                        <span>₹0</span>
                        <span>₹{priceRange[1]}</span>
                      </div>
                    </div>
                  </div>

                  {/* Venue Type */}
                  <div>
                    <label className="form-label">Venue Type</label>
                    <div className="space-y-2">
                      <label className="flex items-center gap-3 p-2 rounded-lg hover:bg-neutral-50 transition-colors">
                        <input
                          type="radio"
                          name="venueType"
                          value="All"
                          checked={venueType === 'All'}
                          onChange={(e) => setVenueType(e.target.value)}
                          className="text-primary"
                        />
                        <span>All Types</span>
                      </label>
                      <label className="flex items-center gap-3 p-2 rounded-lg hover:bg-neutral-50 transition-colors">
                        <input
                          type="radio"
                          name="venueType"
                          value="Indoor"
                          checked={venueType === 'Indoor'}
                          onChange={(e) => setVenueType(e.target.value)}
                          className="text-primary"
                        />
                        <span>Indoor</span>
                      </label>
                      <label className="flex items-center gap-3 p-2 rounded-lg hover:bg-neutral-50 transition-colors">
                        <input
                          type="radio"
                          name="venueType"
                          value="Outdoor"
                          checked={venueType === 'Outdoor'}
                          onChange={(e) => setVenueType(e.target.value)}
                          className="text-primary"
                        />
                        <span>Outdoor</span>
                      </label>
                    </div>
                  </div>

                  {/* Rating */}
                  <div>
                    <label className="form-label">Minimum Rating</label>
                    <div className="space-y-2">
                      {[4, 3, 2, 1].map((r) => (
                        <label key={r} className="flex items-center gap-3 p-2 rounded-lg hover:bg-neutral-50 transition-colors">
                          <input
                            type="radio"
                            name="rating"
                            value={r}
                            checked={rating === r}
                            onChange={(e) => setRating(Number(e.target.value))}
                            className="text-primary"
                          />
                          <span>{r}+ stars</span>
                        </label>
                      ))}
                    </div>
                  </div>

                  {/* Clear Filters */}
                  <button
                    onClick={clearFilters}
                    className="btn btn-outline w-full"
                  >
                    Clear Filters
                  </button>
                </div>
              </div>
            </div>

            {/* Venues Grid */}
            <div className="lg:col-span-3">
              <div className="mb-8">
                <h2 className="text-3xl font-bold mb-2">Sports Venues</h2>
                <p className="text-neutral-600">
                  Found {filteredVenues.length} venue{filteredVenues.length !== 1 ? 's' : ''}
                </p>
              </div>

              {filteredVenues.length === 0 ? (
                <div className="text-center py-12">
                  <div className="text-6xl mb-4">🏟️</div>
                  <h3 className="text-xl font-bold mb-2">No venues found</h3>
                  <p className="text-neutral-600 mb-4">Try adjusting your filters to find more venues</p>
                  <button onClick={clearFilters} className="btn btn-primary">
                    Clear All Filters
                  </button>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                  {filteredVenues.map((venue) => {
                    const SportIcon = getSportIcon(venue.sport);
                    return (
                      <div key={venue.id} className="card group">
                        <div className="relative overflow-hidden">
                          <img
                            src={venue.image}
                            alt={venue.name}
                            className="w-full h-48 object-cover group-hover:scale-110 transition-transform duration-500"
                          />
                          <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent"></div>
                          <div className="absolute top-3 right-3 bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full">
                            <div className="flex items-center text-warning-600 font-bold">
                              <FaStar className="mr-1" />
                              {venue.rating}
                            </div>
                          </div>
                          <div className="absolute top-3 left-3">
                            <SportIcon className="text-2xl text-white drop-shadow-lg" />
                          </div>
                        </div>
                        <div className="card-body">
                          <div className="flex justify-between items-start mb-3">
                            <h3 className="text-xl font-bold text-neutral-900">{venue.name}</h3>
                          </div>
                          <div className="flex items-center text-neutral-600 text-sm mb-3">
                            <FaMapMarkerAlt className="mr-2 text-primary" />
                            {venue.location}
                          </div>
                          <div className="text-success-600 font-bold text-lg mb-3">
                            ₹{venue.price} per hour
                          </div>
                          <div className="flex flex-wrap gap-2 mb-4">
                            {venue.tags.map((tag, index) => (
                              <span
                                key={index}
                                className="text-xs bg-primary-100 text-primary-700 px-3 py-1 rounded-full font-medium"
                              >
                                {tag}
                              </span>
                            ))}
                          </div>
                          <div className="flex items-center justify-between">
                            <span className="text-neutral-500 text-sm">
                              ({venue.reviews} reviews)
                            </span>
                            <Link to={`/venue/${venue.id}`}>
                              <button className="btn btn-primary btn-sm">
                                View Details
                              </button>
                            </Link>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Venues; 