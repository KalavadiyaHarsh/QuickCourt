import React, { useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { MyContext } from '../App';
import { fetchDataFromApi, postData } from '../utils/api';
import { FaPlus, FaSpinner, FaExclamationTriangle, FaCheckCircle, FaTrash, FaEdit, FaMapMarkerAlt, FaClock, FaMoneyBillWave } from 'react-icons/fa';
import { useScrollToTop } from '../hooks/useScrollToTop';

const CourtManagement = () => {
  const context = useContext(MyContext);
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);
  const [courts, setCourts] = useState([]);
  const [venues, setVenues] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [editingCourt, setEditingCourt] = useState(null);
  
  const [court, setCourt] = useState({
    courtName: '',
    sportType: '',
    pricingPerHour: '',
    operatingHoursStart: '',
    operatingHoursEnd: '',
    venueId: ''
  });

  useScrollToTop();

  // Check if user is facility owner
  useEffect(() => {
    const checkFacilityOwnerAccess = () => {
      const userData = context.userData || JSON.parse(localStorage.getItem('userData') || '{}');
      
      if (!context.isLogin) {
        navigate('/login');
        return;
      }

      if (userData.role !== 'facility_owner') {
        navigate('/');
        context.openAlertBox && context.openAlertBox("Access denied. Facility owner privileges required.", "error");
        return;
      }
    };

    checkFacilityOwnerAccess();
  }, [context.isLogin, context.userData, navigate, context]);

  // Fetch venues and courts
  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch venues first
        const venuesResponse = await fetchDataFromApi('/api/facility-owner/venues');
        if (venuesResponse?.success) {
          setVenues(venuesResponse.data);
          // Set first venue as default if available
          if (venuesResponse.data.length > 0 && !court.venueId) {
            setCourt(prev => ({ ...prev, venueId: venuesResponse.data[0]._id }));
          }
        }

        // Fetch courts
        const courtsResponse = await fetchDataFromApi('/api/facility-owner/courts');
        if (courtsResponse?.success) {
          setCourts(courtsResponse.data);
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    if (context.isLogin && context.userData?.role === 'facility_owner') {
      fetchData();
    }
  }, [context.isLogin, context.userData]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setCourt((prev) => ({ ...prev, [name]: value }));
  };

  const resetForm = () => {
    setCourt({
      courtName: '',
      sportType: '',
      pricingPerHour: '',
      operatingHoursStart: '',
      operatingHoursEnd: '',
      venueId: venues.length > 0 ? venues[0]._id : ''
    });
    setEditingCourt(null);
    setError(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!court.courtName || !court.sportType || !court.pricingPerHour || !court.operatingHoursStart || !court.operatingHoursEnd || !court.venueId) {
      setError('Please fill in all required fields');
      return;
    }

    try {
      setLoading(true);
      setError(null);

      const response = await postData('/api/facility-owner/courts', court);

      if (response?.success) {
        setSuccess(true);
        context.openAlertBox && context.openAlertBox('Court created successfully!', 'success');
        
        // Add new court to the list
        setCourts(prev => [response.data, ...prev]);
        
        // Reset form and hide it
        resetForm();
        setShowForm(false);
        
        // Hide success message after 3 seconds
        setTimeout(() => setSuccess(false), 3000);
      } else {
        setError(response?.message || 'Failed to create court');
      }
    } catch (error) {
      console.error('Error creating court:', error);
      setError('Failed to create court. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (courtToEdit) => {
    setEditingCourt(courtToEdit);
    setCourt({
      courtName: courtToEdit.name,
      sportType: courtToEdit.sport,
      pricingPerHour: courtToEdit.pricePerHour.toString(),
      operatingHoursStart: courtToEdit.operatingHours?.weekdays?.open || '',
      operatingHoursEnd: courtToEdit.operatingHours?.weekdays?.close || '',
      venueId: courtToEdit.venue._id
    });
    setShowForm(true);
  };

  const handleDelete = async (courtId) => {
    if (window.confirm('Are you sure you want to delete this court?')) {
      try {
        // You'll need to implement delete court API
        const response = await fetchDataFromApi(`/api/facility-owner/courts/${courtId}`, { method: 'DELETE' });
        
        if (response?.success) {
          setCourts(prev => prev.filter(c => c._id !== courtId));
          context.openAlertBox && context.openAlertBox('Court deleted successfully!', 'success');
        }
      } catch (error) {
        console.error('Error deleting court:', error);
        context.openAlertBox && context.openAlertBox('Failed to delete court', 'error');
      }
    }
  };

  if (!context.isLogin || context.userData?.role !== 'facility_owner') {
    return null;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-emerald-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-red-600 to-purple-600 bg-clip-text text-transparent mb-2">
            Court Management
          </h1>
          <p className="text-gray-600 text-lg">
            Manage courts within your venues
          </p>
        </div>

        {/* Success Message */}
        {success && (
          <div className="mb-6 bg-green-50 border border-green-200 rounded-lg p-4">
            <div className="flex items-center">
              <FaCheckCircle className="text-green-500 mr-2" />
              <span className="text-green-800">Court created successfully!</span>
            </div>
          </div>
        )}

        {/* Error Message */}
        {error && (
          <div className="mb-6 bg-red-50 border border-red-200 rounded-lg p-4">
            <div className="flex items-center">
              <FaExclamationTriangle className="text-red-500 mr-2" />
              <span className="text-red-800">{error}</span>
            </div>
          </div>
        )}

        {/* Add Court Button */}
        <div className="mb-6">
          <button
            onClick={() => {
              setShowForm(!showForm);
              if (!showForm) {
                resetForm();
              }
            }}
            className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-6 py-3 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 font-semibold flex items-center gap-2"
          >
            <FaPlus />
            {showForm ? 'Cancel' : 'Add New Court'}
          </button>
        </div>

        {/* Court Creation Form */}
        {showForm && (
          <div className="bg-white/90 backdrop-blur-md rounded-2xl shadow-xl p-8 border border-white/20 mb-8">
            <h2 className="text-2xl font-bold mb-6 text-gray-800">
              {editingCourt ? 'Edit Court' : 'Create New Court'}
            </h2>
            
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block mb-2 font-semibold text-gray-700">
                    Court Name *
                  </label>
                  <input
                    type="text"
                    name="courtName"
                    placeholder="Enter court name"
                    value={court.courtName}
                    onChange={handleChange}
                    className="w-full p-3 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all duration-300"
                    required
                  />
                </div>

                <div>
                  <label className="block mb-2 font-semibold text-gray-700">
                    Venue *
                  </label>
                  <select
                    name="venueId"
                    value={court.venueId}
                    onChange={handleChange}
                    className="w-full p-3 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all duration-300"
                    required
                  >
                    <option value="">Select a venue</option>
                    {venues.map(venue => (
                      <option key={venue._id} value={venue._id}>
                        {venue.name} - {venue.address?.city}, {venue.address?.state}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block mb-2 font-semibold text-gray-700">
                    Sport Type *
                  </label>
                  <select
                    name="sportType"
                    value={court.sportType}
                    onChange={handleChange}
                    className="w-full p-3 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all duration-300"
                    required
                  >
                    <option value="">Select sport type</option>
                    <option value="badminton">Badminton</option>
                    <option value="tennis">Tennis</option>
                    <option value="table-tennis">Table Tennis</option>
                    <option value="basketball">Basketball</option>
                    <option value="football">Football</option>
                    <option value="volleyball">Volleyball</option>
                    <option value="squash">Squash</option>
                    <option value="cricket">Cricket</option>
                  </select>
                </div>

                <div>
                  <label className="block mb-2 font-semibold text-gray-700">
                    Price Per Hour (₹) *
                  </label>
                  <input
                    type="number"
                    name="pricingPerHour"
                    placeholder="Enter price per hour"
                    value={court.pricingPerHour}
                    onChange={handleChange}
                    min="0"
                    step="100"
                    className="w-full p-3 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all duration-300"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block mb-2 font-semibold text-gray-700">
                    Operating Hours Start *
                  </label>
                  <input
                    type="time"
                    name="operatingHoursStart"
                    value={court.operatingHoursStart}
                    onChange={handleChange}
                    className="w-full p-3 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all duration-300"
                    required
                  />
                </div>

                <div>
                  <label className="block mb-2 font-semibold text-gray-700">
                    Operating Hours End *
                  </label>
                  <input
                    type="time"
                    name="operatingHoursEnd"
                    value={court.operatingHoursEnd}
                    onChange={handleChange}
                    className="w-full p-3 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all duration-300"
                    required
                  />
                </div>
              </div>

              <div className="flex gap-4">
                <button
                  type="submit"
                  disabled={loading}
                  className="flex-1 bg-gradient-to-r from-green-600 to-emerald-600 text-white px-8 py-3 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loading ? (
                    <div className="flex items-center justify-center">
                      <FaSpinner className="animate-spin mr-2" />
                      {editingCourt ? 'Updating...' : 'Creating...'}
                    </div>
                  ) : (
                    editingCourt ? 'Update Court' : 'Create Court'
                  )}
                </button>
                
                <button
                  type="button"
                  onClick={() => {
                    setShowForm(false);
                    resetForm();
                  }}
                  className="px-8 py-3 border-2 border-gray-300 text-gray-700 rounded-xl hover:bg-gray-50 transition-all duration-300"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Courts List */}
        <div className="bg-white/90 backdrop-blur-md rounded-2xl shadow-xl border border-white/20 overflow-hidden">
          <div className="p-6 border-b border-gray-200">
            <h3 className="text-xl font-bold text-gray-800">
              Your Courts ({courts.length})
            </h3>
          </div>

          {courts.length === 0 ? (
            <div className="text-center py-12">
              <div className="text-gray-400 text-6xl mb-4">🏟️</div>
              <p className="text-gray-500 text-lg">No courts found</p>
              <p className="text-gray-400">Create your first court to get started</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Court
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Venue
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Sport
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Price/Hour
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Operating Hours
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {courts.map((courtItem) => (
                    <tr key={courtItem._id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900">
                          {courtItem.name}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">
                          {courtItem.venue?.name || 'Unknown'}
                        </div>
                        <div className="text-sm text-gray-500">
                          {courtItem.venue?.address?.city}, {courtItem.venue?.address?.state}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-blue-100 text-blue-800 capitalize">
                          {courtItem.sport}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        ₹{courtItem.pricePerHour}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {courtItem.operatingHours?.weekdays?.open} - {courtItem.operatingHours?.weekdays?.close}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <div className="flex space-x-2">
                          <button
                            onClick={() => handleEdit(courtItem)}
                            className="text-blue-600 hover:text-blue-900"
                          >
                            <FaEdit className="text-sm" />
                          </button>
                          <button
                            onClick={() => handleDelete(courtItem._id)}
                            className="text-red-600 hover:text-red-900"
                          >
                            <FaTrash className="text-sm" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CourtManagement;
