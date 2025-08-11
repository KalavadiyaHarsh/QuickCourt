import React, { useState } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

const VenueBookingPage = () => {
  // Example court info
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
  const totalPrice = duration * court.hourlyRate;

  const toggleCourtSelection = (courtName) => {
    setSelectedCourts((prev) =>
      prev.includes(courtName)
        ? prev.filter((c) => c !== courtName)
        : [...prev, courtName]
    );
  };

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Top Navbar (updated to match screenshot) */}
      <div className="bg-gradient-to-r from-green-500 via-blue-500 to-blue-600 text-white px-6 py-3 flex justify-between items-center shadow-md">
        <div className="font-bold text-lg">QuickCourt</div>
        <div className="font-medium">Booking Log</div>
        <div className="flex items-center gap-2">
          <span>John Doe</span>
          <img
            src="man.png"
            alt="User"
            className="w-10 h-10 rounded-full border-2 border-white"
          />
        </div>
      </div>

      {/* Court Info */}
      <div className="max-w-4xl mx-auto mt-6 bg-white p-6 rounded-xl shadow-md">
        <h2 className="text-2xl font-bold">{court.name}</h2>
        <p className="text-gray-600">
          {court.sport} · {court.address}
        </p>
        <p className="mt-2 text-yellow-500">⭐ {court.rating}</p>
      </div>

      {/* Booking Form */}
      <div className="max-w-4xl mx-auto mt-6 bg-white p-6 rounded-xl shadow-md space-y-4">
        {/* Sport */}
        <div>
          <label className="block font-semibold">Sport</label>
          <input
            type="text"
            value={court.sport}
            readOnly
            className="mt-1 w-full border p-2 rounded-lg bg-gray-100"
          />
        </div>

        {/* Date Picker */}
        <div>
          <label className="block font-semibold">Select Date</label>
          <DatePicker
            selected={startDate}
            onChange={(date) => setStartDate(date)}
            dateFormat="dd/MM/yyyy"
            className="mt-1 w-full border p-2 rounded-lg"
            placeholderText="Choose a date"
          />
        </div>

        {/* Time Picker */}
        <div>
          <label className="block font-semibold">Start Time</label>
          <DatePicker
            selected={startTime}
            onChange={(time) => setStartTime(time)}
            showTimeSelect
            showTimeSelectOnly
            timeIntervals={30}
            timeCaption="Time"
            dateFormat="h:mm aa"
            className="mt-1 w-full border p-2 rounded-lg"
            placeholderText="Select time"
          />
        </div>

        {/* Duration */}
        <div>
          <label className="block font-semibold">Duration (hours)</label>
          <div className="flex items-center gap-3 mt-1">
            <button
              type="button"
              onClick={() => setDuration((d) => Math.max(1, d - 1))}
              className="px-3 py-1 bg-gray-200 rounded-lg"
            >
              –
            </button>
            <span className="text-lg font-bold">{duration}</span>
            <button
              type="button"
              onClick={() => setDuration((d) => d + 1)}
              className="px-3 py-1 bg-gray-200 rounded-lg"
            >
              +
            </button>
          </div>
        </div>

        {/* Court Selection */}
        <div>
          <label className="block font-semibold">Select Court</label>
          <div className="flex flex-wrap gap-3 mt-1">
            {courtsList.map((c) => (
              <button
                key={c}
                type="button"
                onClick={() => toggleCourtSelection(c)}
                className={`px-4 py-2 rounded-lg border ${
                  selectedCourts.includes(c)
                    ? "bg-blue-500 text-white"
                    : "bg-gray-100"
                }`}
              >
                {c}
              </button>
            ))}
          </div>
        </div>

        {/* Total Price */}
        <div className="text-xl font-bold text-right">Total: ₹{totalPrice}</div>

        {/* Book Button */}
        <div className="text-right">
          <button className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700">
            Book Now
          </button>
        </div>
      </div>
    </div>
  );
};

export default VenueBookingPage;
