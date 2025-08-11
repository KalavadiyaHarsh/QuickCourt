// src/api/dashboardApi.js

const getDashboardData = async () => {
  // Simulated API delay
  await new Promise(resolve => setTimeout(resolve, 500));

  return {
    totalBookings: 245,
    activeCourts: 6,
    earnings: 3250,
    bookingTrends: [
      { name: 'Mon', bookings: 20 },
      { name: 'Tue', bookings: 35 },
      { name: 'Wed', bookings: 25 },
      { name: 'Thu', bookings: 40 },
      { name: 'Fri', bookings: 50 },
      { name: 'Sat', bookings: 75 },
      { name: 'Sun', bookings: 60 },
    ],
    earningsSummary: [
      { month: 'Jan', earnings: 400 },
      { month: 'Feb', earnings: 700 },
      { month: 'Mar', earnings: 1200 },
      { month: 'Apr', earnings: 800 },
      { month: 'May', earnings: 950 },
    ],
    peakHours: [
      { hour: '8 AM', bookings: 12 },
      { hour: '10 AM', bookings: 18 },
      { hour: '12 PM', bookings: 25 },
      { hour: '2 PM', bookings: 20 },
      { hour: '4 PM', bookings: 30 },
      { hour: '6 PM', bookings: 35 },
    ]
  };
};

export { getDashboardData };
