import React, { useState } from 'react';
import FacilityOwnerSidebar from '../components/FacilityOwnerSidebar';


const CourtManagement = () => {
  const [court, setCourt] = useState({
    courtName: '',
    sportType: '',
    pricingPerHour: '',
    operatingHoursStart: '',
    operatingHoursEnd: '',
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setCourt((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Submit court details (API call)
    console.log(court);
  };

  return (
    <div className="flex">
      <FacilityOwnerSidebar />
      <div className="max-w-3xl ml-10 p-6 bg-white rounded-xl shadow-lg">
        <h2 className="text-2xl font-bold mb-6">Court Management</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="text"
            name="courtName"
            placeholder="Court Name"
            value={court.courtName}
            onChange={handleChange}
            className="border border-gray-300 rounded px-4 py-2 w-full focus:outline-none focus:ring-2 focus:ring-indigo-500"
            required
          />

          <input
            type="text"
            name="sportType"
            placeholder="Sport Type"
            value={court.sportType}
            onChange={handleChange}
            className="border border-gray-300 rounded px-4 py-2 w-full focus:outline-none focus:ring-2 focus:ring-indigo-500"
            required
          />

          <input
            type="number"
            name="pricingPerHour"
            placeholder="Pricing Per Hour ($)"
            value={court.pricingPerHour}
            onChange={handleChange}
            min="0"
            className="border border-gray-300 rounded px-4 py-2 w-full focus:outline-none focus:ring-2 focus:ring-indigo-500"
            required
          />

          <div className="flex gap-4">
            <div className="flex-1">
              <label className="block mb-1 font-semibold">Operating Hours Start</label>
              <input
                type="time"
                name="operatingHoursStart"
                value={court.operatingHoursStart}
                onChange={handleChange}
                className="border border-gray-300 rounded px-4 py-2 w-full focus:outline-none focus:ring-2 focus:ring-indigo-500"
                required
              />
            </div>

            <div className="flex-1">
              <label className="block mb-1 font-semibold">Operating Hours End</label>
              <input
                type="time"
                name="operatingHoursEnd"
                value={court.operatingHoursEnd}
                onChange={handleChange}
                className="border border-gray-300 rounded px-4 py-2 w-full focus:outline-none focus:ring-2 focus:ring-indigo-500"
                required
              />
            </div>
          </div>

          <button
            type="submit"
            className="bg-indigo-600 text-white px-6 py-3 rounded hover:bg-indigo-700 transition"
          >
            Save Court
          </button>
        </form>
      </div>
    </div>
  );
};

export default CourtManagement;
