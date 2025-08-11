import {
  ResponsiveContainer, LineChart, Line, CartesianGrid, XAxis, YAxis, Tooltip
} from "recharts";

const FacilityApprovalChart = ({ data }) => {
  return (
    <div className="bg-white p-6 rounded-2xl shadow">
      <h2 className="text-lg font-bold mb-4">Facility Approval Trend</h2>
      <ResponsiveContainer width="100%" height={300}>
        <LineChart data={data}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="month" />
          <YAxis />
          <Tooltip />
          <Line type="monotone" dataKey="approvals" stroke="#f59e0b" strokeWidth={2} />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};

export default FacilityApprovalChart;
