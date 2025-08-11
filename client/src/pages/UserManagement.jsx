import Sidebar from "../components/admin/Sidebar";
import Topbar from "../components/admin/Topbar";
import Table from "../components/admin/Table";

const UserManagement = () => {
  const columns = ["name", "email", "role"];
  const data = [
    { name: "John Doe", email: "john@example.com", role: "User" },
    { name: "Jane Smith", email: "jane@example.com", role: "Owner" }
  ];

  const actions = [
    ({ row }) => (
      <button className="px-3 py-1 bg-blue-500 text-white rounded">Edit</button>
    ),
    ({ row }) => (
      <button className="px-3 py-1 bg-red-500 text-white rounded">Delete</button>
    )
  ];

  return (
    <div className="flex">
      <Sidebar />
      <div className="flex-1 ml-64">
        <Topbar />
        <div className="p-6">
          <h2 className="text-xl font-semibold mb-4">User Management</h2>
          <Table columns={columns} data={data} actions={actions} />
        </div>
      </div>
    </div>
  );
};

export default UserManagement;
