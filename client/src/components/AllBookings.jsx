// src/components/AllBookings.jsx
import React, { useState } from "react";

export default function AllBookings({ bookings = [], onCancelBooking }) {
  const [view, setView] = useState("all"); // all | cancelled

  const filtered = view === "cancelled" ? bookings.filter(b => b.status === "Cancelled") : bookings;

  return (
    <div>
      <h2 className="text-xl font-semibold mb-4">All Bookings</h2>

      <div className="flex gap-3 mb-4">
        <button className="bg-gray-200 px-3 py-1 rounded" onClick={() => setView("all")}>All</button>
        <button className="bg-gray-200 px-3 py-1 rounded" onClick={() => setView("cancelled")}>Cancelled</button>
      </div>

      <div className="space-y-6">
        {filtered.length === 0 && <div className="text-gray-500">No bookings.</div>}
        {filtered.map((b) => {
          const cancelByDate = new Date(b.cancelBy);
          const now = new Date();
          const canCancel = cancelByDate >= now && b.status !== "Cancelled";

          return (
            <div key={b.id} className="flex gap-4 bg-white shadow rounded-xl p-4 hover:shadow-md transition">
              <img src={b.image} alt={b.sport} className="w-24 h-24 object-cover rounded-lg" />

              <div className="flex-1">
                <h3 className="text-lg font-semibold">{b.sport}</h3>
                <p className="text-gray-600">{b.date} | {b.time}</p>
                <p className="text-gray-600">{b.location}</p>
                <p className="text-sm text-gray-500">Address: {b.address}</p>
                <p className="text-sm text-gray-500">Cancel till: <span className="font-medium">{b.cancelBy}</span></p>

                <div className="flex items-center gap-2 mt-2">
                  <span className="font-medium">Status:</span>
                  {b.status === "Confirmed" ? (
                    <input type="checkbox" checked readOnly className="accent-green-500" />
                  ) : (
                    <input type="checkbox" readOnly className="accent-gray-400" />
                  )}
                  <span>{b.status}</span>
                </div>
              </div>

              <div className="flex flex-col gap-2">
                {canCancel && (
                  <button
                    onClick={() => onCancelBooking(b.id)}
                    className="px-3 py-1 bg-[#ff5252] text-white rounded hover:bg-red-600 transition"
                  >
                    Cancel Booking
                  </button>
                )}
                <button className="px-3 py-1 border border-gray-300 rounded hover:bg-gray-100 transition">Write Review</button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
