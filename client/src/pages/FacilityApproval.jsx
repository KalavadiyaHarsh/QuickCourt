import Sidebar from "../components/admin/Sidebar";
import Topbar from "../components/admin/Topbar";
import Table from "../components/admin/Table";

const FacilityApproval = () => {
  const columns = ["facilityName", "ownerName", "status"];
  const data = [
    { facilityName: "Elite Badminton Court", ownerName: "John Doe", status: "Pending" },
    { facilityName: "City Turf", ownerName: "Jane Smith", status: "Pending" }
  ];

  const actions = [
    ({ row }) => (
      <button className="px-3 py-1 bg-green-500 text-white rounded">Approve</button>
    ),
    ({ row }) => (
      <button className="px-3 py-1 bg-red-500 text-white rounded">Reject</button>
    )
  ];

  return (
    <div className="flex">
      <Sidebar />
      <div className="flex-1">
        <Topbar />
        <div className="p-6">
          <h2 className="text-xl font-semibold mb-4">Facility Approval</h2>
          <Table columns={columns} data={data} actions={actions} />
        </div>
      </div>
    </div>
  );
};

export default FacilityApproval;
