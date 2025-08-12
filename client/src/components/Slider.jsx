import React from "react";
import { FaMapMarkerAlt, FaStar } from "react-icons/fa";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Autoplay } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import { Link } from "react-router-dom";

const Slider = () => {
  // Sample featured venues for the slider
  const featuredVenues = [
    {
      id: 1,
      name: "Elite Sports Complex",
      rating: 4.8,
      location: "Mumbai, Maharashtra",
      image: "/football field.jpg",
      sport: "Multi-sport"
    },
    {
      id: 2,
      name: "Ace Tennis Club",
      rating: 4.9,
      location: "Bangalore, Karnataka",
      image: "/tennis.jpg",
      sport: "Tennis"
    },
    {
      id: 3,
      name: "Champions Arena",
      rating: 4.6,
      location: "Delhi, Delhi",
      image: "/badminton.jpg",
      sport: "Multi-sport"
    },
    {
      id: 4,
      name: "Metro Sports Center",
      rating: 4.4,
      location: "Pune, Maharashtra",
      image: "/football.jpeg",
      sport: "Multi-sport"
    }
  ];

  return (
    <div className="w-full">
      {/* Featured Venues Slider */}
      <div className="px-8 mt-16 mb-8">
        <h3 className="text-3xl font-bold mb-8 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
          Featured Venues
        </h3>
        <Swiper
          modules={[Navigation, Autoplay]}
          navigation
          spaceBetween={24}
          slidesPerView={1}
          autoplay={{
            delay: 5000,
            disableOnInteraction: false,
          }}
          loop={true}
          breakpoints={{
            640: { slidesPerView: 2 },
            1024: { slidesPerView: 3 },
            1280: { slidesPerView: 4 }
          }}
        >
          {featuredVenues.map((venue) => (
            <SwiperSlide key={venue.id}>
              <div className="bg-white/90 backdrop-blur-md rounded-2xl shadow-2xl overflow-hidden hover:shadow-3xl transition-all duration-500 h-[380px] flex flex-col transform hover:scale-105 border border-white/20 group">
                <div className="relative overflow-hidden h-48">
                  <img 
                    src={venue.image} 
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
                      <span className="text-xs bg-gradient-to-r from-blue-100 to-purple-100 text-blue-700 px-3 py-1 rounded-full font-medium border border-blue-200">
                        {venue.sport}
                      </span>
                    </div>
                  </div>
                  <div className="mt-4">
                    <Link to="/allvenue">
                      <button className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white px-4 py-2 rounded-lg hover:from-blue-700 hover:to-purple-700 transition-all transform hover:scale-105 font-medium">
                        Explore Venues
                      </button>
                    </Link>
                  </div>
                </div>
              </div>
            </SwiperSlide>
          ))}
        </Swiper>
      </div>
    </div>
  );
};

export default Slider;
