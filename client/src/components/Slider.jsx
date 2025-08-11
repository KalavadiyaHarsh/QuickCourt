import React, { useState } from "react";
import { FaMapMarkerAlt, FaStar } from "react-icons/fa";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import { Link } from "react-router-dom";

const Home = () => {
  const [location, setLocation] = useState("");

  const venues = [
    {
      id: 1,
      name: "SBR Badminton",
      rating: 4.5,
      reviews: 6,
      location: "Vaishnodevi Cir",
      tags: ["badminton", "Outdoor", "Top Rated", "Budget"],
      image: "t2.jpeg"
    },
    {
      id: 2,
      name: "Arena Turf",
      rating: 4.7,
      reviews: 10,
      location: "Navrangpura",
      tags: ["football", "Outdoor", "Top Rated", "Budget"],
      image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQKCe6TZjs0QRuT1RuuszyXJSuL6ne6rF50bg&s"
    },
    {
      id: 3,
      name: "Court Masters",
      rating: 4.2,
      reviews: 8,
      location: "Satellite",
      tags: ["tennis", "Indoor", "Budget"],
      image: "t1.jpeg"
    },
    {
      id: 4,
      name: "Smash House",
      rating: 4.9,
      reviews: 15,
      location: "Bopal",
      tags: ["badminton", "Indoor", "Top Rated"],
      image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQKCe6TZjs0QRuT1RuuszyXJSuL6ne6rF50bg&s"
    },
    {
      id: 5,
      name: "SBR Badminton",
      rating: 4.5,
      reviews: 6,
      location: "Vaishnodevi Cir",
      tags: ["badminton", "Outdoor", "Top Rated", "Budget"],
      image: "t4.jpeg"
    },
    {
      id: 6,
      name: "Arena Turf",
      rating: 4.7,
      reviews: 10,
      location: "Navrangpura",
      tags: ["football", "Outdoor", "Top Rated", "Budget"],
      image: "t3.jpeg"
    },
    {
      id: 7,
      name: "Court Masters",
      rating: 4.2,
      reviews: 8,
      location: "Satellite",
      tags: ["tennis", "Indoor", "Budget"],
      image: "t2.jpeg"
    },
    {
      id: 8,
      name: "Smash House",
      rating: 4.9,
      reviews: 15,
      location: "Bopal",
      tags: ["badminton", "Indoor", "Top Rated"],
      image: "t1.jpeg",
    }
  ];

  const sports = [
    { name: "Badminton", image: "badminton.jpg" },
    { name: "Football", image: "football.jpeg" },
    { name: "Cricket", image: "cricket.jpg" },
    { name: "Swimming", image: "t1.jpeg" },
    { name: "Tennis", image: "tennis.jpg" },
    { name: "Table Tennis", image: "table tennis.jpeg" }
  ];

  return (
    <div className="w-full relative">
      {/* Location Search */}
      <section className="grid grid-cols-1 md:grid-cols-2 gap-8 p-8 relative">
        {/* Left */}
        <div className="flex flex-col justify-center space-y-6">
          <div className="relative">
            <div className="flex items-center gap-3 border-2 border-white/20 rounded-2xl px-6 py-4 w-full max-w-md bg-white/80 backdrop-blur-md shadow-2xl transform hover:scale-105 transition-all duration-300">
              <FaMapMarkerAlt className="text-red-500 text-xl drop-shadow-lg" />
              <input
                type="text"
                placeholder="Enter your location"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                className="flex-1 outline-none bg-transparent text-gray-700 font-medium placeholder-gray-500"
              />
            </div>
          </div>
          <div className="space-y-4">
            <h2 className="text-4xl font-bold bg-gradient-to-r from-blue-600 via-purple-600 to-emerald-600 bg-clip-text text-transparent drop-shadow-lg">
              FIND PLAYERS & VENUES NEARBY
            </h2>
            <p className="text-gray-600 max-w-md text-lg leading-relaxed">
              Seamlessly explore sports venues and play with sports enthusiasts just like you!
            </p>
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

      {/* Book Venues Section */}
      <div className="flex justify-between items-center px-8 mt-12">
        <h3 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
          Book Venues
        </h3>
        <Link to={"/allvenue"}>
          <button className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-6 py-3 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 font-semibold">
            See all venues →
          </button>
        </Link>
      </div>

      {/* Swiper Slider */}
      <div className="px-8 mt-8">
        <Swiper
          modules={[Navigation]}
          navigation
          spaceBetween={24}
          slidesPerView={1}
          breakpoints={{
            640: { slidesPerView: 2 },
            1024: { slidesPerView: 4 }
          }}
        >
          {venues.map((venue) => (
            <SwiperSlide key={venue.id}>
              <div className="bg-white/90 backdrop-blur-md rounded-2xl shadow-2xl overflow-hidden hover:shadow-3xl transition-all duration-500 h-[380px] flex flex-col transform hover:scale-105 border border-white/20 group">
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
                <div className="p-6 flex-1 flex flex-col justify-between">
                  <div>
                    <h4 className="font-bold text-xl text-gray-800 mb-2">{venue.name}</h4>
                    <div className="flex items-center text-gray-600 text-sm mb-3">
                      <FaMapMarkerAlt className="mr-2 text-red-500" />
                      {venue.location}
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {venue.tags.map((tag, index) => (
                        <span
                          key={index}
                          className="text-xs bg-gradient-to-r from-blue-100 to-purple-100 text-blue-700 px-3 py-1 rounded-full font-medium border border-blue-200"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>
                  <div className="mt-4">
                    <span className="text-gray-500 text-sm">({venue.reviews} reviews)</span>
                  </div>
                </div>
              </div>
            </SwiperSlide>
          ))}
        </Swiper>
      </div>

      {/* Popular Sports Section */}
      <div className="px-8 mt-16 mb-8">
        <h3 className="text-3xl font-bold mb-8 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
          Popular Sports
        </h3>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-6">
          {sports.map((sport, index) => (
            <button
              key={index}
              className="flex flex-col items-center bg-white/90 backdrop-blur-md rounded-2xl shadow-xl overflow-hidden hover:shadow-2xl transition-all duration-500 transform hover:scale-110 border border-white/20 group"
              onClick={() => alert(`You selected ${sport.name}`)}
            >
              <div className="relative overflow-hidden w-full h-32">
                <img src={sport.image} alt={sport.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent"></div>
              </div>
              <span className="p-4 font-semibold text-gray-800 group-hover:text-blue-600 transition-colors duration-300">
                {sport.name}
              </span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Home;
