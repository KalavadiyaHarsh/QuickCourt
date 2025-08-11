import React, { useState } from 'react';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';

const BookingCalendar = () => {
  const [date, setDate] = useState(new Date());

  return (
    <div className="bg-white p-4 rounded-2xl shadow">
      <h2 className="text-lg font-bold mb-4">Booking Calendar</h2>
      <Calendar value={date} onChange={setDate} />
    </div>
  );
};

export default BookingCalendar;
