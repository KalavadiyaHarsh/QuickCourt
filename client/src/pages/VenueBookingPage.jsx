import React, { useState } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

const VenueBookingPage = () => {
  const court = {
    name: "Sunrise Tennis Court",
    sport: "Tennis",
    address: "123 Sports Avenue, City",
    rating: 4.8,
    hourlyRate: 500,
  };

  const [startDate, setStartDate] = useState(null);
  const [startTime, setStartTime] = useState(null);
  const [duration, setDuration] = useState(1);
  const [selectedCourts, setSelectedCourts] = useState([]);

  const courtsList = ["Court 1", "Court 2", "Court 3"];
  const totalPrice = duration * court.hourlyRate;

  const toggleCourtSelection = (courtName) => {
    setSelectedCourts((prev) =>
      prev.includes(courtName)
        ? prev.filter((c) => c !== courtName)
        : [...prev, courtName]
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-emerald-50 p-6 md:p-10">
      {/* Court Info */}
      <div className="max-w-4xl mx-auto mb-8">
        <div className="bg-white/90 backdrop-blur-md rounded-2xl shadow-xl p-6 md:p-8 border border-white/20">
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-2xl md:text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              {court.name}
            </h2>
            <div className="flex items-center gap-2 bg-yellow-100 px-3 py-1.5 rounded-full">
              <span className="text-yellow-600 font-semibold text-sm md:text-base">⭐ {court.rating}</span>
            </div>
          </div>
          <p className="text-gray-600 text-base md:text-lg mb-2">
            {court.sport} • {court.address}
          </p>
          <div>
            <span className="text-green-600 font-bold text-lg md:text-xl">
              ₹{court.hourlyRate} / hour
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
              className="w-full p-3 md:p-4 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:ring-2 focus:ring-blue-200 text-base"
              placeholderText="Choose a date"
            />
          </div>

          {/* Time Picker */}
          <div className="space-y-1">
            <label className="block font-medium text-gray-700 text-lg">Start Time</label>
            <DatePicker
              selected={startTime}
              onChange={(time) => setStartTime(time)}
              showTimeSelect
              showTimeSelectOnly
              timeIntervals={30}
              timeCaption="Time"
              dateFormat="h:mm aa"
              className="w-full p-3 md:p-4 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:ring-2 focus:ring-blue-200 text-base"
              placeholderText="Select time"
            />
          </div>

          {/* Duration */}
          <div className="space-y-1">
            <label className="block font-medium text-gray-700 text-lg">Duration (hours)</label>
            <div className="flex items-center gap-4 p-3 bg-gray-50 rounded-xl">
              <button
                type="button"
                onClick={() => setDuration((d) => Math.max(1, d - 1))}
                className="w-10 h-10 md:w-12 md:h-12 bg-gradient-to-r from-red-500 to-red-600 text-white rounded-xl shadow-md hover:shadow-lg transition-all transform hover:scale-105 font-bold text-lg md:text-xl"
              >
                –
              </button>
              <span className="text-lg md:text-2xl font-bold text-gray-800 min-w-[2.5rem] text-center">
                {duration}
              </span>
              <button
                type="button"
                onClick={() => setDuration((d) => d + 1)}
                className="w-10 h-10 md:w-12 md:h-12 bg-gradient-to-r from-green-500 to-green-600 text-white rounded-xl shadow-md hover:shadow-lg transition-all transform hover:scale-105 font-bold text-lg md:text-xl"
              >
                +
              </button>
            </div>
          </div>

          {/* Court Selection */}
          <div className="space-y-1">
            <label className="block font-medium text-gray-700 text-lg">Select Court</label>
            <div className="flex flex-wrap gap-3">
              {courtsList.map((c) => (
                <button
                  key={c}
                  type="button"
                  onClick={() => toggleCourtSelection(c)}
                  className={`px-5 py-2.5 md:px-6 md:py-3 rounded-xl border-2 transition-all transform hover:scale-105 font-medium text-base ${
                    selectedCourts.includes(c)
                      ? "bg-gradient-to-r from-blue-500 to-purple-600 text-white border-blue-500 shadow-lg"
                      : "bg-white text-gray-700 border-gray-200 hover:border-blue-300 shadow-md"
                  }`}
                >
                  {c}
                </button>
              ))}
            </div>
          </div>

          {/* Total Price */}
          <div className="bg-gradient-to-r from-blue-50 to-purple-50 p-4 md:p-6 rounded-xl border border-blue-200">
            <div className="text-lg md:text-2xl font-bold text-right text-gray-800">
              Total:{" "}
              <span className="bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent">
                ₹{totalPrice}
              </span>
            </div>
          </div>

          {/* Book Button */}
          <div className="text-right pt-2">
            <button className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-6 py-3 md:px-8 md:py-4 rounded-xl hover:shadow-2xl transition-all transform hover:scale-105 font-bold text-lg shadow-lg">
              Book Now
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VenueBookingPage;
