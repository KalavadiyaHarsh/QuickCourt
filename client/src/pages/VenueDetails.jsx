import React, { useState, useEffect } from "react";
import { FaMapMarkerAlt, FaStar, FaClock, FaMap, FaSpinner } from "react-icons/fa";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination, Autoplay } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import { Link, useParams } from "react-router-dom";
import { fetchDataFromApi } from "../utils/api";

const VenueDetails = () => {
    const { id } = useParams();
    const [venue, setVenue] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // Fetch venue details from API
    useEffect(() => {
        const fetchVenue = async () => {
            try {
                setLoading(true);
                setError(null);
                
                const response = await fetchDataFromApi(`/api/users/venues/${id}`);
                
                if (response?.success) {
                    setVenue(response.data);
                } else {
                    setError(response?.message || "Failed to fetch venue details");
                }
            } catch (error) {
                console.error("Error fetching venue:", error);
                setError("Failed to fetch venue details");
            } finally {
                setLoading(false);
            }
        };

        if (id) {
            fetchVenue();
        }
    }, [id]);

    // Helper function to get image source with fallback
    const getImageSource = (photos, index = 0) => {
        if (photos && photos.length > index) {
            return photos[index];
        }
        // Return default venue image
        return "/football field.jpg";
    };

    // Helper function to format address
    const formatAddress = (address) => {
        if (!address) return "Address not available";
        return `${address.street}, ${address.city}, ${address.state} ${address.zip}`;
    };

    // Helper function to format operating hours
    const formatOperatingHours = (operatingHours) => {
        if (!operatingHours) return "Operating hours not available";
        
        const weekdays = operatingHours.weekdays;
        const weekends = operatingHours.weekends;
        
        return `Weekdays: ${weekdays.open} - ${weekdays.close} | Weekends: ${weekends.open} - ${weekends.close}`;
    };

    // Helper function to get court operating hours
    const getCourtOperatingHours = (courts) => {
        if (!courts || courts.length === 0) return null;
        return courts[0].operatingHours; // Use first court's operating hours
    };

    if (loading) {
        return (
            <div className="w-full p-6">
                <div className="flex items-center justify-center h-64">
                    <FaSpinner className="animate-spin text-4xl text-blue-600" />
                </div>
            </div>
        );
    }

    if (error || !venue) {
        return (
            <div className="w-full p-6">
                <div className="text-center py-12">
                    <p className="text-red-600 text-lg mb-4">{error || "Venue not found"}</p>
                    <Link to="/allvenue">
                        <button className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700">
                            Back to Venues
                        </button>
                    </Link>
                </div>
            </div>
        );
    }

    const courtOperatingHours = getCourtOperatingHours(venue.courts);

    return (
        <div className="w-full p-6">
            {/* Page intro area */}
            <header className="flex flex-col md:flex-row md:justify-between md:items-center mb-6">
                <div>
                    <h1 className="text-2xl font-bold">{venue.name}</h1>
                    <div className="flex items-center gap-2 text-gray-600">
                        <FaMapMarkerAlt className="text-red-500" />
                        {formatAddress(venue.address)}
                        <FaStar className="text-yellow-500 ml-4" /> 
                        {venue.rating || "N/A"} ({venue.totalReviews || 0} reviews)
                    </div>
                </div>
                <Link to={`/venue/${venue._id}`}>
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
                                delay: 3000,
                                disableOnInteraction: false,
                            }}
                            loop={true}
                            className="h-64"
                        >
                            {venue.photos && venue.photos.length > 0 ? (
                                venue.photos.map((photo, index) => (
                                    <SwiperSlide key={index}>
                                        <img
                                            src={photo}
                                            alt={`${venue.name} ${index + 1}`}
                                            className="w-full h-64 object-cover"
                                            onError={(e) => {
                                                e.target.src = "/football field.jpg";
                                            }}
                                        />
                                    </SwiperSlide>
                                ))
                            ) : (
                                // Fallback to default image
                                <SwiperSlide>
                                    <img
                                        src="/football field.jpg"
                                        alt="Default venue image"
                                        className="w-full h-64 object-cover"
                                    />
                                </SwiperSlide>
                            )}
                        </Swiper>
                    </div>

                    {/* Sports Available */}
                    <div>
                        <h2 className="text-lg font-semibold mb-3">Sports Available</h2>
                        <div className="flex flex-wrap gap-3">
                            {venue.sportsAvailable?.map((sport, idx) => (
                                <span
                                    key={idx}
                                    className="border rounded-lg px-4 py-2 bg-blue-50 text-blue-700 font-medium"
                                >
                                    {sport}
                                </span>
                            ))}
                        </div>
                    </div>

                    {/* Courts Information */}
                    <div>
                        <h2 className="text-lg font-semibold mb-3">Courts & Pricing</h2>
                        <div className="space-y-3">
                            {venue.courts?.map((court, idx) => (
                                <div key={court._id} className="border rounded-lg p-4 bg-gray-50">
                                    <div className="flex justify-between items-center mb-2">
                                        <h4 className="font-semibold">{court.name}</h4>
                                        <span className="text-green-600 font-bold">₹{court.pricePerHour}/hour</span>
                                    </div>
                                    <div className="text-sm text-gray-600">
                                        <p>Sport: {court.sport}</p>
                                        <p>Capacity: {court.capacity} players</p>
                                        {court.operatingHours && (
                                            <p>Hours: {court.operatingHours.weekdays.open} - {court.operatingHours.weekdays.close}</p>
                                        )}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Amenities */}
                    <div>
                        <h2 className="text-lg font-semibold mb-3">Amenities</h2>
                        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                            {venue.amenities?.map((amenity, idx) => (
                                <div key={idx} className="flex items-center gap-2 text-sm">
                                    ✅ {amenity}
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
                        {venue.reviews && venue.reviews.length > 0 ? (
                            <div className="space-y-4">
                                {venue.reviews.map((review, idx) => (
                                    <div key={review._id} className="border rounded-lg p-4">
                                        <div className="flex items-center gap-3 mb-3">
                                            <img 
                                                src={review.user.avatar || "/man.png"} 
                                                alt={review.user.fullName}
                                                className="w-10 h-10 rounded-full object-cover"
                                                onError={(e) => {
                                                    e.target.src = "/man.png";
                                                }}
                                            />
                                            <div>
                                                <div className="font-semibold">{review.user.fullName}</div>
                                                <div className="text-yellow-500 text-sm">
                                                    {"⭐".repeat(review.rating)}
                                                </div>
                                            </div>
                                        </div>
                                        <p className="text-gray-600 mb-2">{review.comment}</p>
                                        <small className="text-gray-400">
                                            {new Date(review.createdAt).toLocaleDateString()}
                                        </small>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <p className="text-gray-500">No reviews yet. Be the first to review!</p>
                        )}
                    </div>
                </div>

                {/* Right Sidebar */}
                <div className="space-y-6">
                    {/* Operating Hours */}
                    {courtOperatingHours && (
                        <div className="border rounded-lg p-4">
                            <div className="flex items-center gap-2 font-semibold mb-2">
                                <FaClock /> Operating Hours
                            </div>
                            <div className="text-sm space-y-1">
                                <p><strong>Weekdays:</strong> {courtOperatingHours.weekdays.open} - {courtOperatingHours.weekdays.close}</p>
                                <p><strong>Weekends:</strong> {courtOperatingHours.weekends.open} - {courtOperatingHours.weekends.close}</p>
                            </div>
                        </div>
                    )}

                    {/* Address */}
                    <div className="border rounded-lg p-4">
                        <div className="flex items-center gap-2 font-semibold mb-2">
                            <FaMapMarkerAlt /> Address
                        </div>
                        <p className="text-sm">{formatAddress(venue.address)}</p>
                    </div>

                    {/* Venue Info */}
                    <div className="border rounded-lg p-4">
                        <div className="space-y-2 text-sm">
                            <p><strong>Status:</strong> <span className={`capitalize ${venue.status === 'approved' ? 'text-green-600' : 'text-yellow-600'}`}>{venue.status}</span></p>
                            <p><strong>Member since:</strong> {new Date(venue.createdAt).toLocaleDateString()}</p>
                            {venue.owner && (
                                <p><strong>Owner:</strong> {venue.owner.fullName}</p>
                            )}
                        </div>
                    </div>

                    {/* Location Map */}
                    <div className="border rounded-lg p-4">
                        <div className="flex items-center gap-2 font-semibold mb-2">
                            <FaMap /> Location Map
                        </div>
                        <div className="bg-gray-200 rounded-lg h-40 flex items-center justify-center text-gray-500 text-sm">
                            Map integration coming soon
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default VenueDetails;
