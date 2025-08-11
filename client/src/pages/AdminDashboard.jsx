import Sidebar from "../components/admin/Sidebar";
import Topbar from "../components/admin/Topbar";
import StatCard from "../components/admin/StatCard";
import BookingActivityChart from "../components/admin/BookingActivityChart";
import UserRegistrationChart from "../components/admin/UserRegistrationChart";
import FacilityApprovalChart from "../components/admin/FacilityApprovalChart";
import MostActiveSportsChart from "../components/admin/MostActiveSportsChart";
import EarningsChart from "../components/admin/EarningsChart";

const AdminDashboard = () => {
  // Dummy data for now
  const bookingData = [
    { date: "Jan", bookings: 40 },
    { date: "Feb", bookings: 55 },
    { date: "Mar", bookings: 75 },
  ];
  const registrationData = [
    { month: "Jan", registrations: 100 },
    { month: "Feb", registrations: 150 },
    { month: "Mar", registrations: 200 },
  ];
  const approvalData = [
    { month: "Jan", approvals: 10 },
    { month: "Feb", approvals: 15 },
    { month: "Mar", approvals: 8 },
  ];
  const sportsData = [
    { name: "Badminton", value: 40 },
    { name: "Tennis", value: 25 },
    { name: "Football", value: 20 },
    { name: "Table Tennis", value: 15 },
  ];
  const earningsData = [
    { month: "Jan", earnings: 1200 },
    { month: "Feb", earnings: 1500 },
    { month: "Mar", earnings: 1800 },
  ];

  return (
    <div className="flex">
      <Sidebar />
      <div className="flex-1">
        <Topbar />
        {/* Global Stats */}
        <div className="p-6 grid grid-cols-1 md:grid-cols-4 gap-6">
          <StatCard title="Total Users" value="1,240" />
          <StatCard title="Total Facility Owners" value="320" />
          <StatCard title="Total Bookings" value="4,560" />
          <StatCard title="Total Active Courts" value="85" />
        </div>

        {/* Charts */}
        <div className="p-6 grid grid-cols-1 lg:grid-cols-2 gap-6">
          <BookingActivityChart data={bookingData} />
          <UserRegistrationChart data={registrationData} />
          <FacilityApprovalChart data={approvalData} />
          <MostActiveSportsChart data={sportsData} />
          <EarningsChart data={earningsData} />
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
