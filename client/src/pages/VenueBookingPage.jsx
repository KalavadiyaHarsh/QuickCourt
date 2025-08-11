import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { fetchDataFromApi, postData } from "../utils/api";
import { FaMapMarkerAlt, FaStar, FaSpinner, FaCalendarAlt, FaClock, FaCreditCard } from "react-icons/fa";

const VenueBookingPage = () => {
  const { venueId, courtId } = useParams();
  const navigate = useNavigate();
  
  const [venue, setVenue] = useState(null);
  const [court, setCourt] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [bookingLoading, setBookingLoading] = useState(false);

  // Booking form state
  const [startDate, setStartDate] = useState(null);
  const [selectedTimeSlots, setSelectedTimeSlots] = useState([]);
  const [paymentMethod, setPaymentMethod] = useState("card");

  // Fetch venue and court data
  useEffect(() => {
    const fetchVenueData = async () => {
      try {
        setLoading(true);
        setError(null);

        // Fetch venue details
        const venueResponse = await fetchDataFromApi(`/api/users/venues/${venueId}`);
        
        if (venueResponse?.success) {
          setVenue(venueResponse.data);
          
          // Find the specific court
          const foundCourt = venueResponse.data.courts.find(c => c._id === courtId);
          if (foundCourt) {
            setCourt(foundCourt);
          } else {
            setError("Court not found");
          }
        } else {
          setError(venueResponse?.message || "Failed to fetch venue details");
        }
      } catch (error) {
        console.error("Error fetching venue data:", error);
        setError("Failed to fetch venue data");
      } finally {
        setLoading(false);
      }
    };

    if (venueId && courtId) {
      fetchVenueData();
    }
  }, [venueId, courtId]);

  // Generate time slots based on court operating hours
  const generateTimeSlots = () => {
    if (!court?.operatingHours) return [];

    const slots = [];
    const { weekdays } = court.operatingHours;
    const startHour = parseInt(weekdays.open.split(':')[0]);
    const endHour = parseInt(weekdays.close.split(':')[0]);

    for (let hour = startHour; hour < endHour; hour++) {
      const startTime = `${hour.toString().padStart(2, '0')}:00`;
      const endTime = `${(hour + 1).toString().padStart(2, '0')}:00`;
      
      slots.push({
        startTime,
        endTime,
        price: court.pricePerHour,
        isAvailable: true // This would be checked against actual availability
      });
    }

    return slots;
  };

  const timeSlots = generateTimeSlots();

  // Handle time slot selection
  const toggleTimeSlot = (slot) => {
    setSelectedTimeSlots(prev => {
      const isSelected = prev.some(s => s.startTime === slot.startTime && s.endTime === slot.endTime);
      if (isSelected) {
        return prev.filter(s => !(s.startTime === slot.startTime && s.endTime === slot.endTime));
      } else {
        return [...prev, slot];
      }
    });
  };

  // Calculate total price
  const totalPrice = selectedTimeSlots.reduce((total, slot) => total + slot.price, 0);

  // Handle booking submission
  const handleBooking = async () => {
    if (!startDate || selectedTimeSlots.length === 0) {
      alert("Please select a date and at least one time slot");
      return;
    }

    setBookingLoading(true);

    try {
      const bookingData = {
        courtId: court._id,
        venueId: venue._id,
        date: startDate.toISOString().split('T')[0],
        timeSlots: selectedTimeSlots.map(slot => ({
          startTime: slot.startTime,
          endTime: slot.endTime
        })),
        paymentMethod: paymentMethod,
        transactionId: `txn_${Date.now()}_${Math.random().toString(36).substr(2, 9)}` // Generate unique transaction ID
      };

      const response = await postData("/api/users/bookings", bookingData);

      if (response?.success) {
        alert("Booking created successfully!");
        navigate("/profile"); // Redirect to profile page to see the booking
      } else {
        alert(response?.message || "Failed to create booking");
      }
    } catch (error) {
      console.error("Error creating booking:", error);
      alert("Failed to create booking");
    } finally {
      setBookingLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-emerald-50 flex items-center justify-center">
        <FaSpinner className="animate-spin text-4xl text-blue-600" />
      </div>
    );
  }

  if (error || !venue || !court) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-emerald-50 p-6">
        <div className="max-w-4xl mx-auto text-center py-12">
          <p className="text-red-600 text-lg mb-4">{error || "Venue or court not found"}</p>
          <button 
            onClick={() => navigate("/allvenue")} 
            className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700"
          >
            Back to Venues
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-emerald-50 p-6 md:p-10">
      {/* Venue & Court Info */}
      <div className="max-w-4xl mx-auto mb-8">
        <div className="bg-white/90 backdrop-blur-md rounded-2xl shadow-xl p-6 md:p-8 border border-white/20">
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-2xl md:text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              {venue.name}
            </h2>
            <div className="flex items-center gap-2 bg-yellow-100 px-3 py-1.5 rounded-full">
              <span className="text-yellow-600 font-semibold text-sm md:text-base">⭐ {venue.rating || "N/A"}</span>
            </div>
          </div>
          <p className="text-gray-600 text-base md:text-lg mb-2">
            {court.name} • {court.sport}
          </p>
          <div className="flex items-center gap-4 text-sm text-gray-600 mb-2">
            <div className="flex items-center gap-1">
              <FaMapMarkerAlt className="text-red-500" />
              <span>{venue.address.street}, {venue.address.city}</span>
            </div>
            <div className="flex items-center gap-1">
              <FaClock className="text-green-500" />
              <span>{court.operatingHours?.weekdays.open} - {court.operatingHours?.weekdays.close}</span>
            </div>
          </div>
          <div>
            <span className="text-green-600 font-bold text-lg md:text-xl">
              ₹{court.pricePerHour} / hour
            </span>
          </div>
        </div>
      </div>

      {/* Booking Form */}
      <div className="max-w-4xl mx-auto">
        <div className="bg-white/90 backdrop-blur-md rounded-2xl shadow-xl p-6 md:p-8 border border-white/20 space-y-6">
          <h3 className="text-xl md:text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            Book Your Session
          </h3>

          {/* Sport */}
          <div className="space-y-1">
            <label className="block font-medium text-gray-700 text-lg">Sport</label>
            <input
              type="text"
              value={court.sport}
              readOnly
              className="w-full p-3 md:p-4 border-2 border-gray-200 rounded-xl bg-gray-50 text-base text-gray-700"
            />
          </div>

          {/* Date Picker */}
          <div className="space-y-1">
            <label className="block font-medium text-gray-700 text-lg">Select Date</label>
            <DatePicker
              selected={startDate}
              onChange={(date) => setStartDate(date)}
              dateFormat="dd/MM/yyyy"
              minDate={new Date()}
              className="w-full p-3 md:p-4 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:ring-2 focus:ring-blue-200 text-base"
              placeholderText="Choose a date"
            />
          </div>

          {/* Time Slots */}
          <div className="space-y-1">
            <label className="block font-medium text-gray-700 text-lg">Select Time Slots</label>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
              {timeSlots.map((slot, index) => (
                <button
                  key={index}
                  type="button"
                  onClick={() => toggleTimeSlot(slot)}
                  className={`p-3 rounded-xl border-2 transition-all transform hover:scale-105 font-medium text-sm ${
                    selectedTimeSlots.some(s => s.startTime === slot.startTime && s.endTime === slot.endTime)
                      ? "bg-gradient-to-r from-blue-500 to-purple-600 text-white border-blue-500 shadow-lg"
                      : "bg-white text-gray-700 border-gray-200 hover:border-blue-300 shadow-md"
                  }`}
                >
                  <div className="font-bold">{slot.startTime} - {slot.endTime}</div>
                  <div className="text-xs opacity-75">₹{slot.price}</div>
                </button>
              ))}
            </div>
            {selectedTimeSlots.length > 0 && (
              <p className="text-sm text-gray-600 mt-2">
                Selected: {selectedTimeSlots.length} slot(s)
              </p>
            )}
          </div>

          {/* Payment Method */}
          <div className="space-y-1">
            <label className="block font-medium text-gray-700 text-lg">Payment Method</label>
            <select
              value={paymentMethod}
              onChange={(e) => setPaymentMethod(e.target.value)}
              className="w-full p-3 md:p-4 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:ring-2 focus:ring-blue-200 text-base"
            >
              <option value="card">Credit/Debit Card</option>
              <option value="upi">UPI</option>
              <option value="netbanking">Net Banking</option>
              <option value="wallet">Digital Wallet</option>
            </select>
          </div>

          {/* Total Price */}
          <div className="bg-gradient-to-r from-blue-50 to-purple-50 p-4 md:p-6 rounded-xl border border-blue-200">
            <div className="text-lg md:text-2xl font-bold text-right text-gray-800">
              Total:{" "}
              <span className="bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent">
                ₹{totalPrice}
              </span>
            </div>
            {selectedTimeSlots.length > 0 && (
              <p className="text-sm text-gray-500 text-right mt-1">
                {selectedTimeSlots.length} hour(s) × ₹{court.pricePerHour}
              </p>
            )}
          </div>

          {/* Book Button */}
          <div className="text-right pt-2">
            <button 
              onClick={handleBooking}
              disabled={!startDate || selectedTimeSlots.length === 0 || bookingLoading}
              className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-6 py-3 md:px-8 md:py-4 rounded-xl hover:shadow-2xl transition-all transform hover:scale-105 font-bold text-lg shadow-lg disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
            >
              {bookingLoading ? (
                <div className="flex items-center gap-2">
                  <FaSpinner className="animate-spin" />
                  Creating Booking...
                </div>
              ) : (
                "Book Now"
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VenueBookingPage;
