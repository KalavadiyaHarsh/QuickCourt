import {
  ResponsiveContainer, LineChart, Line, CartesianGrid, XAxis, YAxis, Tooltip
} from "recharts";

const BookingActivityChart = ({ data }) => {
  return (
    <div className="bg-white p-6 rounded-2xl shadow">
      <h2 className="text-lg font-bold mb-4">Booking Activity Over Time</h2>
      <ResponsiveContainer width="100%" height={300}>
        <LineChart data={data}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="date" />
          <YAxis />
          <Tooltip />
          <Line type="monotone" dataKey="bookings" stroke="#3b82f6" strokeWidth={2} />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};

export default BookingActivityChart;
