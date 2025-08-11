import React, { useMemo, useState } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

const NewBookingPage = () => {
  // Example court info (can be replaced by props or route data later)
  const court = {
    name: "Sunrise Tennis Court",
    sport: "Tennis",
    address: "123 Sports Avenue, City",
    rating: 4.8,
    hourlyRate: 500, // ₹ per hour
  };

  // State
  const [startDate, setStartDate] = useState(null);
  const [startTime, setStartTime] = useState(null);
  const [duration, setDuration] = useState(1);
  const [selectedCourts, setSelectedCourts] = useState([]);

  const courtsList = ["Court 1", "Court 2", "Court 3"];

  const totalPrice = useMemo(() => {
    const courtsCount = Math.max(1, selectedCourts.length);
    return duration * court.hourlyRate * courtsCount;
  }, [duration, selectedCourts.length]);

  const toggleCourtSelection = (courtName) => {
    setSelectedCourts((prev) =>
      prev.includes(courtName)
        ? prev.filter((c) => c !== courtName)
        : [...prev, courtName]
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-emerald-50">
      {/* Container */}
      <div className="max-w-6xl mx-auto px-4 py-10">
        {/* Title / Intro */}
        <div className="mb-8">
          <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight bg-gradient-to-r from-blue-700 via-purple-700 to-emerald-700 bg-clip-text text-transparent">
            Book Your Session
          </h1>
          <p className="text-gray-600 mt-2">
            Seamless booking experience with live summary and beautiful interactions.
          </p>
        </div>

        {/* Grid: Left form, Right summary */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left: Form */}
          <div className="lg:col-span-2 space-y-6">
            {/* Court Card */}
            <div className="bg-white/90 backdrop-blur-md rounded-2xl shadow-xl border border-white/20 p-6">
              <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3">
                <div>
                  <h2 className="text-2xl font-bold text-gray-900">{court.name}</h2>
                  <p className="text-gray-600">
                    {court.sport} • {court.address}
                  </p>
                </div>
                <div className="flex items-center gap-3">
                  <span className="px-3 py-1 rounded-full bg-yellow-100 text-yellow-700 font-semibold">⭐ {court.rating}</span>
                  <span className="px-3 py-1 rounded-full bg-emerald-100 text-emerald-700 font-semibold">₹{court.hourlyRate}/hr</span>
                </div>
              </div>
            </div>

            {/* Date */}
            <div className="bg-white/90 backdrop-blur-md rounded-2xl shadow-xl border border-white/20 p-6">
              <label className="block font-semibold text-gray-800 mb-2">Select Date</label>
              <DatePicker
                selected={startDate}
                onChange={(date) => setStartDate(date)}
                dateFormat="dd/MM/yyyy"
                placeholderText="Choose a date"
                className="w-full p-4 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all duration-300"
              />
            </div>

            {/* Time */}
            <div className="bg-white/90 backdrop-blur-md rounded-2xl shadow-xl border border-white/20 p-6">
              <label className="block font-semibold text-gray-800 mb-2">Start Time</label>
              <DatePicker
                selected={startTime}
                onChange={(time) => setStartTime(time)}
                showTimeSelect
                showTimeSelectOnly
                timeIntervals={30}
                timeCaption="Time"
                dateFormat="h:mm aa"
                placeholderText="Select time"
                className="w-full p-4 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all duration-300"
              />
            </div>

            {/* Duration */}
            <div className="bg-white/90 backdrop-blur-md rounded-2xl shadow-xl border border-white/20 p-6">
              <label className="block font-semibold text-gray-800">Duration (hours)</label>
              <div className="flex items-center gap-4 mt-3 p-3 bg-gray-50 rounded-xl">
                <button
                  type="button"
                  onClick={() => setDuration((d) => Math.max(1, d - 1))}
                  className="w-12 h-12 bg-gradient-to-r from-red-500 to-red-600 text-white rounded-xl shadow-md hover:shadow-lg transition-all duration-300 transform active:scale-95 font-bold text-xl"
                >
                  –
                </button>
                <span className="text-2xl font-bold text-gray-900 min-w-[3rem] text-center">{duration}</span>
                <button
                  type="button"
                  onClick={() => setDuration((d) => d + 1)}
                  className="w-12 h-12 bg-gradient-to-r from-emerald-500 to-emerald-600 text-white rounded-xl shadow-md hover:shadow-lg transition-all duration-300 transform active:scale-95 font-bold text-xl"
                >
                  +
                </button>
              </div>
            </div>

            {/* Courts */}
            <div className="bg-white/90 backdrop-blur-md rounded-2xl shadow-xl border border-white/20 p-6">
              <label className="block font-semibold text-gray-800">Select Court</label>
              <div className="flex flex-wrap gap-3 mt-3">
                {courtsList.map((c) => (
                  <button
                    key={c}
                    type="button"
                    onClick={() => toggleCourtSelection(c)}
                    className={`px-5 py-2.5 rounded-xl border-2 transition-all duration-300 transform active:scale-95 font-semibold ${
                      selectedCourts.includes(c)
                        ? "bg-gradient-to-r from-blue-500 to-purple-600 text-white border-blue-500 shadow-md"
                        : "bg-white text-gray-700 border-gray-200 hover:border-blue-300 hover:shadow-md"
                    }`}
                  >
                    {c}
                  </button>
                ))}
              </div>
            </div>

            {/* Confirm Button */}
            <div className="bg-white/70 rounded-2xl p-4">
              <button className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white px-8 py-4 rounded-xl hover:shadow-2xl transition-all duration-300 transform active:scale-95 font-bold text-lg shadow-xl">
                Confirm Booking
              </button>
            </div>
          </div>

          {/* Right: Summary */}
          <div className="lg:col-span-1">
            <div className="lg:sticky lg:top-6 space-y-4">
              <div className="bg-white/90 backdrop-blur-md rounded-2xl shadow-xl border border-white/20 p-6">
                <h3 className="text-xl font-bold text-gray-900 mb-4">Summary</h3>
                <div className="space-y-3">
                  <div className="flex items-center justify-between text-gray-700">
                    <span>Court</span>
                    <span className="font-medium">{court.name}</span>
                  </div>
                  <div className="flex items-center justify-between text-gray-700">
                    <span>Sport</span>
                    <span className="font-medium">{court.sport}</span>
                  </div>
                  <div className="flex items-center justify-between text-gray-700">
                    <span>Date</span>
                    <span className="font-medium">{startDate ? startDate.toLocaleDateString() : "—"}</span>
                  </div>
                  <div className="flex items-center justify-between text-gray-700">
                    <span>Start Time</span>
                    <span className="font-medium">{startTime ? startTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : "—"}</span>
                  </div>
                  <div className="flex items-center justify-between text-gray-700">
                    <span>Duration</span>
                    <span className="font-medium">{duration} hr</span>
                  </div>
                  <div className="flex items-center justify-between text-gray-700">
                    <span>Courts</span>
                    <span className="font-medium">{Math.max(1, selectedCourts.length)}</span>
                  </div>
                </div>

                <div className="h-px bg-gradient-to-r from-transparent via-gray-200 to-transparent my-5" />

                <div className="flex items-center justify-between text-lg font-bold text-gray-900">
                  <span>Total</span>
                  <span className="bg-gradient-to-r from-emerald-600 to-green-600 bg-clip-text text-transparent">₹{totalPrice}</span>
                </div>
              </div>

              <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-2xl border border-blue-100 p-4 text-sm text-gray-600">
                Tip: You can select multiple courts. Pricing updates live based on duration and number of courts.
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NewBookingPage; 