import { NavLink } from "react-router-dom";

const Sidebar = () => {
  const menuItems = [
    { name: "Dashboard", path: "/admin" },
    { name: "User Management", path: "/admin/users" },
    { name: "Facility Approval", path: "/admin/facilities" }
  ];

  return (
    <div className="bg-gray-900 text-white h-screen p-4 w-64 sticky top-0 ">
      <h2 className="text-2xl font-bold mb-6">QuickCourt Admin</h2>
      <nav className="flex flex-col space-y-2">
        {menuItems.map((item) => (
          <NavLink
            key={item.name}
            to={item.path}
            className={({ isActive }) =>
              `px-3 py-2 rounded-md hover:bg-gray-700 ${isActive ? "bg-gray-700" : ""}`
            }
          >
            {item.name}
          </NavLink>
        ))}
      </nav>
    </div>
  );
};

export default Sidebar;
