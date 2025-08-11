import React, { useState } from "react";
import { FaMapMarkerAlt, FaStar } from "react-icons/fa";

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
      image: "https://via.placeholder.com/200x150",
      type: "Outdoor",
      sport: "badminton"
    },
    {
      id: 2,
      name: "Arena Turf",
      rating: 4.7,
      reviews: 8,
      location: "Navrangpura",
      price: 500,
      tags: ["football", "Outdoor", "Top Rated"],
      image: "https://via.placeholder.com/200x150",
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
    <div className="w-full flex flex-col md:flex-row">
      {/* Sidebar Filters */}
      <aside className="w-full md:w-1/4 border-r p-4 space-y-6 bg-gray-50">
        {/* Search */}
        <div>
          <label className="block mb-2 font-semibold">Search by venue name</label>
          <input
            type="text"
            placeholder="Search for venue"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full p-2 border rounded"
          />
        </div>

        {/* Sport Type */}
        <div>
          <label className="block mb-2 font-semibold">Filter by sport type</label>
          <select
            value={sportType}
            onChange={(e) => setSportType(e.target.value)}
            className="w-full p-2 border rounded"
          >
            <option>All Sport</option>
            <option>badminton</option>
            <option>football</option>
            <option>tennis</option>
          </select>
        </div>

        {/* Price Range */}
        <div>
          <label className="block mb-2 font-semibold">Price range (per hour)</label>
          <input
            type="range"
            min="0"
            max="5500"
            value={priceRange[1]}
            onChange={(e) => setPriceRange([0, Number(e.target.value)])}
            className="w-full"
          />
          <div className="flex justify-between text-sm">
            <span>₹ {priceRange[0]}</span>
            <span>₹ {priceRange[1]}</span>
          </div>
        </div>

        {/* Venue Type */}
        <div>
          <label className="block mb-2 font-semibold">Choose Venue Type</label>
          <div className="space-y-1">
            <label className="flex items-center gap-2">
              <input
                type="radio"
                name="venueType"
                onChange={() => setVenueType("Indoor")}
                checked={venueType === "Indoor"}
              /> Indoor
            </label>
            <label className="flex items-center gap-2">
              <input
                type="radio"
                name="venueType"
                onChange={() => setVenueType("Outdoor")}
                checked={venueType === "Outdoor"}
              /> Outdoor
            </label>
          </div>
        </div>

        {/* Rating */}
        <div>
          <label className="block mb-2 font-semibold">Rating</label>
          {[4, 3, 2, 1].map((r) => (
            <label key={r} className="flex items-center gap-2">
              <input
                type="radio"
                name="rating"
                onChange={() => setRating(r)}
                checked={rating === r}
              /> {r} stars & up
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
          className="bg-red-500 text-white px-4 py-2 rounded w-full"
        >
          Clear Filters
        </button>
      </aside>

      {/* Venues Grid */}
      <main className="flex-1 p-6">
        <h2 className="text-xl font-bold mb-6">
          Sports Venues in Ahmedabad: Discover and Book Nearby Venues
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredVenues.map((venue) => (
            <div
              key={venue.id}
              className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-lg transition"
            >
              <img src={venue.image} alt={venue.name} className="w-full h-40 object-cover" />
              <div className="p-4">
                <div className="flex justify-between items-center">
                  <h4 className="font-semibold">{venue.name}</h4>
                  <div className="flex items-center text-yellow-500">
                    <FaStar className="mr-1" />
                    {venue.rating}
                    <span className="text-gray-500 text-sm ml-1">({venue.reviews})</span>
                  </div>
                </div>
                <div className="flex items-center text-gray-600 text-sm mt-1">
                  <FaMapMarkerAlt className="mr-1" />
                  {venue.location}
                </div>
                <div className="text-green-600 font-semibold mt-1">
                  ₹ {venue.price} per hour
                </div>
                <div className="flex flex-wrap gap-2 mt-2">
                  {venue.tags.map((tag, index) => (
                    <span
                      key={index}
                      className="text-xs bg-gray-100 text-gray-700 px-2 py-1 rounded-full"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
                <button className="mt-3 w-full bg-green-500 text-white py-2 rounded hover:bg-green-600">
                  View Details
                </button>
              </div>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
};

export default Venue;
