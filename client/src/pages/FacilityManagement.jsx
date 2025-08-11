import React, { useState } from 'react';

const FacilityManagement = () => {
  const [facility, setFacility] = useState({
    name: '',
    location: '',
    description: '',
    sports: '',
    username: '',
    court: '',
    time: '',
    status: 'Booked',
    amenities: '',
    photos: [],
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFacility((prev) => ({ ...prev, [name]: value }));
  };

  const handlePhotoUpload = (e) => {
    const files = Array.from(e.target.files);
    setFacility((prev) => ({ ...prev, photos: files }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Handle form submit logic here (e.g., API call)
    console.log(facility);
  };

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white rounded-xl shadow-lg">
      <h2 className="text-2xl font-bold mb-6">Facility Management</h2>
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <input
            type="text"
            name="name"
            placeholder="Facility Name"
            value={facility.name}
            onChange={handleChange}
            className="border border-gray-300 rounded px-4 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            required
          />
          <input
            type="text"
            name="location"
            placeholder="Location"
            value={facility.location}
            onChange={handleChange}
            className="border border-gray-300 rounded px-4 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            required
          />
        </div>

        <textarea
          name="description"
          placeholder="Description"
          value={facility.description}
          onChange={handleChange}
          rows={3}
          className="border border-gray-300 rounded px-4 py-2 w-full focus:outline-none focus:ring-2 focus:ring-indigo-500"
          required
        />

        <input
          type="text"
          name="sports"
          placeholder="Sports Supported (comma separated)"
          value={facility.sports}
          onChange={handleChange}
          className="border border-gray-300 rounded px-4 py-2 w-full focus:outline-none focus:ring-2 focus:ring-indigo-500"
          required
        />

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <input
            type="text"
            name="username"
            placeholder="User Name"
            value={facility.username}
            onChange={handleChange}
            className="border border-gray-300 rounded px-4 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
          <input
            type="text"
            name="court"
            placeholder="Court"
            value={facility.court}
            onChange={handleChange}
            className="border border-gray-300 rounded px-4 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
          <input
            type="time"
            name="time"
            value={facility.time}
            onChange={handleChange}
            className="border border-gray-300 rounded px-4 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
        </div>

        <select
          name="status"
          value={facility.status}
          onChange={handleChange}
          className="border border-gray-300 rounded px-4 py-2 w-full focus:outline-none focus:ring-2 focus:ring-indigo-500"
          required
        >
          <option>Booked</option>
          <option>Cancelled</option>
          <option>Completed</option>
        </select>

        <textarea
          name="amenities"
          placeholder="Amenities Offered (comma separated)"
          value={facility.amenities}
          onChange={handleChange}
          rows={2}
          className="border border-gray-300 rounded px-4 py-2 w-full focus:outline-none focus:ring-2 focus:ring-indigo-500"
        />

        <div>
          <label className="block mb-2 font-semibold">Upload Photos</label>
          <input
            type="file"
            multiple
            accept="image/*"
            onChange={handlePhotoUpload}
            className="block w-full text-sm text-gray-600 file:mr-4 file:py-2 file:px-4
              file:rounded file:border-0 file:text-sm file:font-semibold
              file:bg-indigo-50 file:text-indigo-700 hover:file:bg-indigo-100"
          />
          <div className="flex flex-wrap mt-4 gap-3">
            {facility.photos.length > 0 &&
              facility.photos.map((file, idx) => {
                const url = URL.createObjectURL(file);
                return (
                  <img
                    key={idx}
                    src={url}
                    alt={`preview-${idx}`}
                    className="h-20 w-20 object-cover rounded"
                    onLoad={() => URL.revokeObjectURL(url)}
                  />
                );
              })}
          </div>
        </div>

        <button
          type="submit"
          className="bg-indigo-600 text-white px-6 py-3 rounded hover:bg-indigo-700 transition"
        >
          Save Facility
        </button>
      </form>
    </div>
  );
};

export default FacilityManagement;
