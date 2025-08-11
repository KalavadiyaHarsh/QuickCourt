import React, { useState } from "react";
import { FaMapMarkerAlt, FaStar, FaSearch, FaFilter } from "react-icons/fa";
import { Link } from "react-router-dom";

const Venue = () => {
  const [search, setSearch] = useState("");
  const [sportType, setSportType] = useState("All Sport");
  const [priceRange, setPriceRange] = useState([0, 5500]);
  const [venueType, setVenueType] = useState("");
  const [rating, setRating] = useState(null);

  const venues = [
    {
      id: 1,
      name: "SBR Badminton",
      rating: 4.5,
      reviews: 6,
      location: "Vaishnodevi Cir",
      price: 250,
      tags: ["badminton", "Outdoor", "Top Rated", "Budget"],
      image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQKCe6TZjs0QRuT1RuuszyXJSuL6ne6rF50bg&s",
      type: "Outdoor",
      sport: "badminton"
    },
    {
      id: 2,
      name: "Arena Turf",
      rating: 2,
      reviews: 8,
      location: "Navrangpura",
      price: 500,
      tags: ["football", "Outdoor", "Top Rated", "Budget"],
      image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQgL5G58RA18xq5Qv0v_l4H8KXFxqxxntAn6g&s",
      type: "Outdoor",
      sport: "football"
    }
  ];

  // Filtering logic
  const filteredVenues = venues.filter((v) => {
    const matchName = v.name.toLowerCase().includes(search.toLowerCase());
    const matchSport = sportType === "All Sport" || v.sport === sportType.toLowerCase();
    const matchPrice = v.price >= priceRange[0] && v.price <= priceRange[1];
    const matchType = venueType === "" || v.type === venueType;
    const matchRating = rating === null || v.rating >= rating;
    return matchName && matchSport && matchPrice && matchType && matchRating;
  });

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
            </select>
          </div>

          {/* Price Range */}
          <div className="mb-6">
            <label className="block mb-3 font-semibold text-gray-700">Price range (per hour)</label>
            <input
              type="range"
              min="0"
              max="5500"
              value={priceRange[1]}
              onChange={(e) => setPriceRange([0, Number(e.target.value)])}
              className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer slider"
            />
            <div className="flex justify-between text-sm mt-2">
              <span className="font-medium">₹ {priceRange[0]}</span>
              <span className="font-medium">₹ {priceRange[1]}</span>
            </div>
          </div>

          {/* Venue Type */}
          <div className="mb-6">
            <label className="block mb-3 font-semibold text-gray-700">Choose Venue Type</label>
            <div className="space-y-2">
              <label className="flex items-center gap-3 p-2 rounded-lg hover:bg-blue-50 transition-colors duration-200">
                <input
                  type="radio"
                  name="venueType"
                  onChange={() => setVenueType("Indoor")}
                  checked={venueType === "Indoor"}
                  className="text-blue-600"
                /> 
                <span className="font-medium">Indoor</span>
              </label>
              <label className="flex items-center gap-3 p-2 rounded-lg hover:bg-blue-50 transition-colors duration-200">
                <input
                  type="radio"
                  name="venueType"
                  onChange={() => setVenueType("Outdoor")}
                  checked={venueType === "Outdoor"}
                  className="text-blue-600"
                /> 
                <span className="font-medium">Outdoor</span>
              </label>
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
              setPriceRange([0, 5500]);
              setVenueType("");
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
            Sports Venues in Ahmedabad
          </h2>
          <p className="text-gray-600 text-lg">
            Discover and Book Nearby Venues
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredVenues.map((venue) => (
            <div
              key={venue.id}
              className="bg-white/90 backdrop-blur-md rounded-2xl shadow-2xl overflow-hidden hover:shadow-3xl transition-all duration-500 transform hover:scale-105 border border-white/20 group"
            >
              <div className="relative overflow-hidden h-48">
                <img src={venue.image} alt={venue.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent"></div>
                <div className="absolute top-3 right-3 bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full">
                  <div className="flex items-center text-yellow-500 font-bold">
                    <FaStar className="mr-1" />
                    {venue.rating}
                  </div>
                </div>
              </div>
              <div className="p-6">
                <div className="flex justify-between items-start mb-3">
                  <h4 className="font-bold text-xl text-gray-800">{venue.name}</h4>
                </div>
                <div className="flex items-center text-gray-600 text-sm mb-3">
                  <FaMapMarkerAlt className="mr-2 text-red-500" />
                  {venue.location}
                </div>
                <div className="text-green-600 font-bold text-lg mb-3">
                  ₹ {venue.price} per hour
                </div>
                <div className="flex flex-wrap gap-2 mb-6">
                  {venue.tags.map((tag, index) => (
                    <span
                      key={index}
                      className="text-xs bg-gradient-to-r from-blue-100 to-purple-100 text-blue-700 px-3 py-1 rounded-full font-medium border border-blue-200"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
                <Link to={"/venuedetails"}>
                  <button
                    className="w-full inline-flex items-center justify-center px-6 py-3 rounded-full bg-gradient-to-r from-emerald-500 to-green-600 text-white font-semibold shadow-md hover:shadow-lg hover:from-emerald-600 hover:to-green-700 focus:outline-none focus:ring-2 focus:ring-emerald-400 focus:ring-offset-2 focus:ring-offset-white transition-all duration-200"
                  >
                    View Details
                  </button>
                </Link>
              </div>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
};

export default Venue;

