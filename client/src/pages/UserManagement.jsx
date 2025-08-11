import React, { useState, useEffect, useContext } from "react";
import { MyContext } from "../App";
import { useNavigate } from "react-router-dom";
import { fetchDataFromApi, putData } from "../utils/api";
import { FaUsers, FaSpinner, FaExclamationTriangle, FaCheckCircle, FaBan, FaEye, FaSearch } from "react-icons/fa";
import { useScrollToTop } from "../hooks/useScrollToTop";

const UserManagement = () => {
  const context = useContext(MyContext);
  const navigate = useNavigate();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [roleFilter, setRoleFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");

  useScrollToTop();

  // Check if user is admin
  useEffect(() => {
    const checkAdminAccess = () => {
      const userData = context.userData || JSON.parse(localStorage.getItem('userData') || '{}');
      
      if (!context.isLogin) {
        navigate('/login');
        return;
      }

      if (userData.role !== 'admin') {
        navigate('/');
        context.openAlertBox && context.openAlertBox("Access denied. Admin privileges required.", "error");
        return;
      }
    };

    checkAdminAccess();
  }, [context.isLogin, context.userData, navigate, context]);

  // Fetch users
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        setLoading(true);
        setError(null);

        const response = await fetchDataFromApi('/admin/users');

        if (response?.success) {
          setUsers(response.data);
        } else {
          setError(response?.message || "Failed to fetch users");
        }
      } catch (error) {
        console.error("Error fetching users:", error);
        setError("Failed to fetch users");
      } finally {
        setLoading(false);
      }
    };

    if (context.isLogin && context.userData?.role === 'admin') {
      fetchUsers();
    }
  }, [context.isLogin, context.userData]);

  // Handle user status update
  const handleStatusUpdate = async (userId, newStatus) => {
    try {
      const response = await putData(`/admin/users/${userId}/status`, { status: newStatus });

      if (response?.success) {
        // Update local state
        setUsers(prevUsers => 
          prevUsers.map(user => 
            user._id === userId 
              ? { ...user, status: newStatus }
              : user
          )
        );
        
        context.openAlertBox && context.openAlertBox(
          `User status updated to ${newStatus}`, 
          "success"
        );
      } else {
        context.openAlertBox && context.openAlertBox(
          response?.message || "Failed to update user status", 
          "error"
        );
      }
    } catch (error) {
      console.error("Error updating user status:", error);
      context.openAlertBox && context.openAlertBox("Failed to update user status", "error");
    }
  };

  // Filter users based on search and filters
  const filteredUsers = users.filter(user => {
    const matchesSearch = user.fullName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         user.email?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesRole = roleFilter === "all" || user.role === roleFilter;
    const matchesStatus = statusFilter === "all" || user.status === statusFilter;
    
    return matchesSearch && matchesRole && matchesStatus;
  });

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-emerald-50 flex items-center justify-center">
        <FaSpinner className="animate-spin text-4xl text-blue-600" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-emerald-50 p-6">
        <div className="max-w-4xl mx-auto text-center py-12">
          <FaExclamationTriangle className="text-red-500 text-6xl mx-auto mb-4" />
          <p className="text-red-600 text-lg mb-4">{error}</p>
          <button 
            onClick={() => window.location.reload()} 
            className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-emerald-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-red-600 to-purple-600 bg-clip-text text-transparent mb-2">
            User Management
          </h1>
          <p className="text-gray-600 text-lg">
            Manage all users in the system, update their status, and monitor their activities.
          </p>
        </div>

        {/* Filters */}
        <div className="bg-white/90 backdrop-blur-md rounded-2xl shadow-xl p-6 border border-white/20 mb-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Search */}
            <div className="relative">
              <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Search users..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            {/* Role Filter */}
            <select
              value={roleFilter}
              onChange={(e) => setRoleFilter(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="all">All Roles</option>
              <option value="user">User</option>
              <option value="facility_owner">Facility Owner</option>
              <option value="admin">Admin</option>
            </select>

            {/* Status Filter */}
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="all">All Status</option>
              <option value="active">Active</option>
              <option value="suspended">Suspended</option>
              <option value="pending">Pending</option>
            </select>
          </div>
        </div>

        {/* Users Table */}
        <div className="bg-white/90 backdrop-blur-md rounded-2xl shadow-xl border border-white/20 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    User
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Role
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Joined
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredUsers.map((user, index) => (
                  <tr key={user._id || index} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="flex-shrink-0 h-10 w-10">
                          <div className="h-10 w-10 rounded-full bg-gray-300 flex items-center justify-center">
                            {user.avatar && user.avatar !== 'default.jpg' ? (
                              <img
                                className="h-10 w-10 rounded-full object-cover"
                                src={user.avatar}
                                alt={user.fullName}
                                onError={(e) => {
                                  e.target.style.display = 'none';
                                  e.target.nextSibling.style.display = 'flex';
                                }}
                              />
                            ) : null}
                            <div className="h-10 w-10 rounded-full bg-gray-300 flex items-center justify-center text-gray-600 font-medium" 
                                 style={{ display: user.avatar && user.avatar !== 'default.jpg' ? 'none' : 'flex' }}>
                              {user.fullName?.charAt(0)?.toUpperCase() || 'U'}
                            </div>
                          </div>
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-medium text-gray-900">
                            {user.fullName || 'Unknown'}
                          </div>
                          <div className="text-sm text-gray-500">{user.email}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                        user.role === 'admin' ? 'bg-red-100 text-red-800' :
                        user.role === 'facility_owner' ? 'bg-purple-100 text-purple-800' :
                        'bg-blue-100 text-blue-800'
                      }`}>
                        {user.role?.replace('_', ' ').toUpperCase() || 'USER'}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                        user.status === 'active' ? 'bg-green-100 text-green-800' :
                        user.status === 'suspended' ? 'bg-red-100 text-red-800' :
                        'bg-yellow-100 text-yellow-800'
                      }`}>
                        {user.status?.toUpperCase() || 'UNKNOWN'}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {user.createdAt ? new Date(user.createdAt).toLocaleDateString() : 'N/A'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <div className="flex space-x-2">
                        {user.status === 'active' ? (
                          <button
                            onClick={() => handleStatusUpdate(user._id, 'suspended')}
                            className="text-red-600 hover:text-red-900 flex items-center gap-1"
                          >
                            <FaBan className="text-sm" />
                            Suspend
                          </button>
                        ) : (
                          <button
                            onClick={() => handleStatusUpdate(user._id, 'active')}
                            className="text-green-600 hover:text-green-900 flex items-center gap-1"
                          >
                            <FaCheckCircle className="text-sm" />
                            Activate
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {filteredUsers.length === 0 && (
            <div className="text-center py-12">
              <FaUsers className="text-gray-400 text-4xl mx-auto mb-4" />
              <p className="text-gray-500 text-lg">No users found</p>
              <p className="text-gray-400">Try adjusting your search or filters</p>
            </div>
          )}
        </div>

        {/* Summary */}
        <div className="mt-8 bg-white/90 backdrop-blur-md rounded-2xl shadow-xl p-6 border border-white/20">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 text-center">
            <div>
              <p className="text-2xl font-bold text-blue-600">{users.length}</p>
              <p className="text-gray-600">Total Users</p>
            </div>
            <div>
              <p className="text-2xl font-bold text-green-600">
                {users.filter(u => u.status === 'active').length}
              </p>
              <p className="text-gray-600">Active Users</p>
            </div>
            <div>
              <p className="text-2xl font-bold text-red-600">
                {users.filter(u => u.status === 'suspended').length}
              </p>
              <p className="text-gray-600">Suspended Users</p>
            </div>
            <div>
              <p className="text-2xl font-bold text-purple-600">
                {users.filter(u => u.role === 'facility_owner').length}
              </p>
              <p className="text-gray-600">Facility Owners</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserManagement;
