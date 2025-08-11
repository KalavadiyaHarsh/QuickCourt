import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { FaCalendarCheck, FaTableTennis, FaDollarSign, FaCalendarAlt } from 'react-icons/fa';
import KPICard from '../components/KPICard';
import BookingCalendar from '../components/BookingCalendar';
import BookingTrendsChart from '../components/BookingTrendsChart';
import EarningsChart from '../components/EarningsChart';
import PeakHoursChart from '../components/PeakHoursChart';
import { getDashboardData } from '../api/dashboardApi';
import FacilityOwnerSidebar from '../components/FacilityOwnerSidebar';

const FacilityOwnerDashboard = () => {
  const [data, setData] = useState(null);

  useEffect(() => {
    getDashboardData().then(setData);
  }, []);

  if (!data) return <div className="p-8">Loading dashboard...</div>;

  return (
    <div className="flex">
      <FacilityOwnerSidebar />
      <div className="p-8 bg-gray-50 min-h-screen">
        {/* Welcome Message */}
        <motion.h1
          className="text-3xl font-bold mb-6"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          Welcome back, Facility Owner! 👋
        </motion.h1>

        {/* KPI Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <KPICard title="Total Bookings" value={data.totalBookings} icon={<FaCalendarCheck />} />
          <KPICard title="Active Courts" value={data.activeCourts} icon={<FaTableTennis />} />
          <KPICard title="Earnings" value={`$${data.earnings}`} icon={<FaDollarSign />} />
        </div>

        {/* Charts & Calendar */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <BookingTrendsChart data={data.bookingTrends} />
          </div>
          <div>
            <BookingCalendar />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8">
          <EarningsChart data={data.earningsSummary} />
          <PeakHoursChart data={data.peakHours} />
        </div>
      </div>
    </div>
  );
};

export default FacilityOwnerDashboard;
