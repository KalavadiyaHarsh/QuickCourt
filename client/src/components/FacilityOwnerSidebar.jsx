import React from "react";
import { NavLink } from "react-router-dom";
import { FaTachometerAlt, FaBuilding, FaTableTennis } from "react-icons/fa";

const FacilityOwnerSidebar = () => {
  const navItems = [
    { name: "Dashboard", path: "/owner", icon: <FaTachometerAlt /> },
    { name: "Facility Management", path: "/facility-management", icon: <FaBuilding /> },
    { name: "Court Management", path: "/court-management", icon: <FaTableTennis /> }
  ];

  return (
    <aside className="bg-gray-900 text-white w-64 h-screen sticky top-0 flex flex-col">
      <div className="px-6 py-4 text-2xl font-bold border-b border-gray-800">
        Owner Panel
      </div>

      <nav className="flex-1 p-4 space-y-2">
        {navItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            className={({ isActive }) =>
              `flex items-center gap-3 px-4 py-2 rounded-md transition ${
                isActive
                  ? "bg-blue-600 text-white"
                  : "text-gray-300 hover:bg-gray-800 hover:text-white"
              }`
            }
          >
            <span className="text-lg">{item.icon}</span>
            <span className="font-medium">{item.name}</span>
          </NavLink>
        ))}
      </nav>
    </aside>
  );
};

export default FacilityOwnerSidebar;
