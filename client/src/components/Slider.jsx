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
    <div className="w-full">


      {/* Location Search */}
      <section className="grid grid-cols-1 md:grid-cols-2 gap-4 p-6">
        {/* Left */}
        <div className="flex flex-col justify-center">
          <div className="flex items-center gap-2 border rounded-full px-4 py-2 w-full max-w-sm bg-white shadow-sm">
            <FaMapMarkerAlt className="text-red-500" />
            <input
              type="text"
              placeholder="Enter your location"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              className="flex-1 outline-none"
            />
          </div>
          <h2 className="mt-6 text-2xl font-bold">FIND PLAYERS & VENUES NEARBY</h2>
          <p className="mt-2 text-gray-600 max-w-md">
            Seamlessly explore sports venues and play with sports enthusiasts just like you!
          </p>
        </div>

        {/* Right */}
        <div className="flex justify-center items-center">
          <img
            src="https://media.istockphoto.com/id/1136317339/photo/sports-equipment-on-floor.jpg?s=612x612&w=0&k=20&c=-aI8u_Se89IC-HJZYH724ei5z-bIcSvRW6qUwyMtRyE="
            alt="Sports"
            className="hidden md:block rounded-xl shadow-lg w-full max-w-md"
          />
        </div>
      </section>

      {/* Book Venues Section */}
      <div className="flex justify-between items-center px-6 mt-8">
        <h3 className="text-xl font-bold">Book Venues</h3>
        <Link to={"/allvenue"}>
          <button className="text-blue-600 hover:underline">See all venues &gt;</button>
        </Link>
      </div>

      {/* Swiper Slider */}
      <div className="px-6 mt-4">
        <Swiper
          modules={[Navigation]}
          navigation
          spaceBetween={20}
          slidesPerView={1}
          breakpoints={{
            640: { slidesPerView: 2 },
            1024: { slidesPerView: 4 }
          }}
        >
          {venues.map((venue) => (
            <SwiperSlide key={venue.id}>
              <div className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-lg transition h-[320px] flex flex-col">
                <img src={venue.image} alt={venue.name} className="w-full h-40 object-cover" />
                <div className="p-4 flex-1 flex flex-col justify-between">
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
                </div>
              </div>
            </SwiperSlide>
          ))}
        </Swiper>
      </div>

      {/* Popular Sports Section */}
      <div className="px-6 mt-10">
        <h3 className="text-xl font-bold mb-4">Popular Sports</h3>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-4">
          {sports.map((sport, index) => (
            <button
              key={index}
              className="flex flex-col items-center bg-white rounded-xl shadow-md overflow-hidden hover:shadow-lg transition"
              onClick={() => alert(`You selected ${sport.name}`)}
            >
              <img src={sport.image} alt={sport.name} className="w-full h-28 " />
              <span className="p-2 font-medium">{sport.name}</span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Home;
