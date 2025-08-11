import React, { useState, useEffect } from "react";
import { FaMapMarkerAlt, FaStar, FaClock, FaMap } from "react-icons/fa";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination, Autoplay } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import { Link } from "react-router-dom";
// import axios from "axios"; // Uncomment when backend API is ready

const VenueDetails = ({ match }) => {
    const venueId = match?.params?.id || 1; // temporary until router params are working
    const [venue, setVenue] = useState(null);

    // Temporary mock data until API is ready
    const mockVenue = {
        id: "1",
        name: "SBR Badminton",
        location: "Satellite, Jodhpur Village",
        rating: 4.5,
        reviews: [
            { user: "Mitchell Admin", rating: 5, comment: "Nice turf, well maintained", date: "28 June 2025" },
            { user: "Alex", rating: 4, comment: "Good lighting", date: "29 June 2025" }
        ],
        sports: [
            { name: "Badminton" },
            { name: "Table Tennis" },
            { name: "Box Cricket" }
        ],
        amenities: [
            "Parking", "Restroom", "Refreshments", "CCTV Surveillance",
            "Centrally Air Conditioned Hall", "Seating Arrangement", "WiFi", "Library"
        ],
        description: "Tournament training venue. For more than 2 players Rs. 50 extra per person. Equipment available on rent.",
        operatingHours: "7:00 AM - 11:00 PM",
        address: "2nd Floor, Arcade Complex, Ahmedabad, Gujarat, India",
        mapUrl: "https://maps.google.com"
    };

    useEffect(() => {
        // API fetch will be added here later
        /*
        const fetchVenue = async () => {
          try {
            const { data } = await axios.get(`/api/facilities/${venueId}`);
            setVenue(data);
          } catch (error) {
            console.error(error);
          }
        };
        fetchVenue();
        */

        // For now, use mock data
        setVenue(mockVenue);
    }, [venueId]);

    if (!venue) return <div className="p-6">Loading...</div>;

    return (
        <div className="w-full p-6">
            {/* Header */}
            <header className="flex flex-col md:flex-row md:justify-between md:items-center mb-6">
                <div>
                    <h1 className="text-2xl font-bold">{venue.name}</h1>
                    <div className="flex items-center gap-2 text-gray-600">
                        <FaMapMarkerAlt className="text-red-500" />
                        {venue.location}
                        <FaStar className="text-yellow-500 ml-4" /> {venue.rating} ({venue.reviews?.length || 0})
                    </div>
                </div>
                <Link to={"/venuebooking"}>
                    <button className="bg-green-500 text-white px-6 py-2 rounded hover:bg-green-600 mt-4 md:mt-0">
                        Book This Venue
                    </button>
                </Link>
            </header>

            {/* Main Content */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Left Side: Carousel + Details */}
                <div className="lg:col-span-2 space-y-6">
                    {/* Image Carousel */}
                    <div className="rounded-lg overflow-hidden">
                        <Swiper
                            modules={[Navigation, Pagination, Autoplay]}
                            navigation
                            pagination={{ clickable: true }}
                            spaceBetween={10}
                            slidesPerView={1}
                            autoplay={{
                                delay: 3000, // 3 seconds
                                disableOnInteraction: false, // Keep playing after user swipes
                            }}
                            loop={true} // Infinite loop
                            className="h-64"
                        >
                            {venue?.images && venue.images.length > 0 ? (
                                venue.images.map((img, index) => (
                                    <SwiperSlide key={index}>
                                        <img
                                            src={img}
                                            alt={`Venue ${index + 1}`}
                                            className="w-full h-64 object-cover"
                                        />
                                    </SwiperSlide>
                                ))
                            ) : (
                                // Fallback demo images until API ready
                                [
                                    "https://images.unsplash.com/photo-1511204338744-5d4e9b3ffee0?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8N3x8Zm9vdGJhbGwlMjBmZWlsZCUyMHR1cmZ8ZW58MHx8MHx8fDA%3D",
                                    "/t2.jpg",
                                    "/t33.jpg",
                                    "data:image/jpeg;base64,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"].map((demo, index) => (
                                        <SwiperSlide key={index}>
                                            <img
                                                src={demo}
                                                alt={`Demo ${index + 1}`}
                                                className="w-full h-full "
                                            />
                                        </SwiperSlide>
                                    ))
                            )}
                        </Swiper>
                    </div>

                    {/* Sports Available */}
                    <div>
                        <h2 className="text-lg font-semibold mb-3">Sports Available</h2>
                        <div className="flex flex-wrap gap-3">
                            {venue.sports?.map((sport, idx) => (
                                <button
                                    key={idx}
                                    onClick={() => alert(`Show pricing for ${sport.name}`)}
                                    className="border rounded-lg px-4 py-2 hover:bg-blue-50"
                                >
                                    {sport.name}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Amenities */}
                    <div>
                        <h2 className="text-lg font-semibold mb-3">Amenities</h2>
                        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                            {venue.amenities?.map((a, idx) => (
                                <div key={idx} className="flex items-center gap-2 text-sm">
                                    ✅ {a}
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* About Venue */}
                    <div>
                        <h2 className="text-lg font-semibold mb-3">About Venue</h2>
                        <p className="text-gray-700">{venue.description}</p>
                    </div>

                    {/* Reviews */}
                    <div>
                        <h2 className="text-lg font-semibold mb-3">Player Reviews & Ratings</h2>
                        <div className="space-y-4">
                            {venue.reviews?.map((review, idx) => (
                                <div key={idx} className="border rounded-lg p-3">
                                    <div className="flex justify-between items-center mb-2">
                                        <span className="font-semibold">{review.user}</span>
                                        <span className="text-yellow-500">
                                            {"⭐".repeat(review.rating)}
                                        </span>
                                    </div>
                                    <p className="text-gray-600">{review.comment}</p>
                                    <small className="text-gray-400">{review.date}</small>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Right Sidebar */}
                <div className="space-y-6">
                    {/* Operating Hours */}
                    <div className="border rounded-lg p-4">
                        <div className="flex items-center gap-2 font-semibold mb-2">
                            <FaClock /> Operating Hours
                        </div>
                        <p>{venue.operatingHours}</p>
                    </div>

                    {/* Address */}
                    <div className="border rounded-lg p-4">
                        <div className="flex items-center gap-2 font-semibold mb-2">
                            <FaMapMarkerAlt /> Address
                        </div>
                        <p>{venue.address}</p>
                    </div>

                    {/* Location Map */}
                    <div className="border rounded-lg p-4">
                        <div className="flex items-center gap-2 font-semibold mb-2">
                            <FaMap /> Location Map
                        </div>
                        <iframe
                            title="map"
                            src={`https://www.google.com/maps/embed/v1/place?key=${import.meta.env.VITE_GOOGLE_MAPS_API_KEY
                                }&q=${encodeURIComponent(venue.address)}`}
                            className="w-full h-40 rounded-lg"
                            loading="lazy"
                            allowFullScreen
                        ></iframe>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default VenueDetails;
