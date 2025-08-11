import {
  ResponsiveContainer, PieChart, Pie, Cell, Tooltip, Legend
} from "recharts";

const COLORS = ["#3b82f6", "#10b981", "#f59e0b", "#ef4444", "#8b5cf6"];

const MostActiveSportsChart = ({ data }) => {
  return (
    <div className="bg-white p-6 rounded-2xl shadow">
      <h2 className="text-lg font-bold mb-4">Most Active Sports</h2>
      <ResponsiveContainer width="100%" height={300}>
        <PieChart>
          <Pie
            data={data}
            cx="50%"
            cy="50%"
            outerRadius={100}
            dataKey="value"
            label
          >
            {data.map((entry, index) => (
              <Cell key={index} fill={COLORS[index % COLORS.length]} />
            ))}
          </Pie>
          <Tooltip />
          <Legend />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
};

export default MostActiveSportsChart;
