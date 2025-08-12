import React, { useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { MyContext } from '../App';
import { fetchDataFromApi, postData } from '../utils/api';
import { FaBuilding, FaMapMarkerAlt, FaSpinner, FaExclamationTriangle, FaCheckCircle } from 'react-icons/fa';
import { useScrollToTop } from '../hooks/useScrollToTop';

const FacilityManagement = () => {
  const context = useContext(MyContext);
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);
  
  const [facility, setFacility] = useState({
    name: '',
    address: {
      street: '',
      city: '',
      state: '',
      zip: ''
    },
    description: '',
    sportsAvailable: [],
    amenities: [],
    photos: []
  });

  const [sportsInput, setSportsInput] = useState('');
  const [amenitiesInput, setAmenitiesInput] = useState('');

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

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name.includes('.')) {
      const [parent, child] = name.split('.');
      setFacility(prev => ({
        ...prev,
        [parent]: {
          ...prev[parent],
          [child]: value
        }
      }));
    } else {
      setFacility(prev => ({ ...prev, [name]: value }));
    }
  };

  const handleSportsInput = (e) => {
    if (e.key === 'Enter' && sportsInput.trim()) {
      e.preventDefault();
      const newSport = sportsInput.trim().toLowerCase();
      if (!facility.sportsAvailable.includes(newSport)) {
        setFacility(prev => ({
          ...prev,
          sportsAvailable: [...prev.sportsAvailable, newSport]
        }));
      }
      setSportsInput('');
    }
  };

  const handleAmenitiesInput = (e) => {
    if (e.key === 'Enter' && amenitiesInput.trim()) {
      e.preventDefault();
      const newAmenity = amenitiesInput.trim().toLowerCase();
      if (!facility.amenities.includes(newAmenity)) {
        setFacility(prev => ({
          ...prev,
          amenities: [...prev.amenities, newAmenity]
        }));
      }
      setAmenitiesInput('');
    }
  };

  const removeSport = (sportToRemove) => {
    setFacility(prev => ({
      ...prev,
      sportsAvailable: prev.sportsAvailable.filter(sport => sport !== sportToRemove)
    }));
  };

  const removeAmenity = (amenityToRemove) => {
    setFacility(prev => ({
      ...prev,
      amenities: prev.amenities.filter(amenity => amenity !== amenityToRemove)
    }));
  };

  const handlePhotoUpload = (e) => {
    const files = Array.from(e.target.files);
    setFacility(prev => ({ ...prev, photos: files }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Check required fields
    const missingFields = [];
    if (!facility.name) missingFields.push('Venue Name');
    if (!facility.address.city) missingFields.push('City');
    if (!facility.address.state) missingFields.push('State');
    if (facility.sportsAvailable.length === 0) missingFields.push('At least one sport');
    
    if (missingFields.length > 0) {
      setError(`Please fill in the following required fields: ${missingFields.join(', ')}`);
      return;
    }

    try {
      setLoading(true);
      setError(null);

      // Create FormData for file uploads
      const formData = new FormData();
      formData.append('name', facility.name);
      formData.append('description', facility.description);
      formData.append('sportsAvailable', JSON.stringify(facility.sportsAvailable));
      formData.append('amenities', JSON.stringify(facility.amenities));
      
      // Add address fields (flattened for FormData compatibility)
      formData.append('street', facility.address.street);
      formData.append('city', facility.address.city);
      formData.append('state', facility.address.state);
      formData.append('zip', facility.address.zip);

      // Add photos
      facility.photos.forEach(photo => {
        formData.append('photos', photo);
      });

      // Debug: Log what's being sent
      console.log('Form data being sent:');
      for (let [key, value] of formData.entries()) {
        console.log(key, value);
      }

      const response = await postData('/api/facility-owner/venues', formData);

      if (response?.success) {
        setSuccess(true);
        context.openAlertBox && context.openAlertBox('Venue created successfully!', 'success');
        
        // Reset form
        setFacility({
          name: '',
          address: { street: '', city: '', state: '', zip: '' },
          description: '',
          sportsAvailable: [],
          amenities: [],
          photos: []
        });
        
        // Reset input fields
        setSportsInput('');
        setAmenitiesInput('');
        
        // Redirect to dashboard after a delay
        setTimeout(() => {
          navigate('/Owner');
        }, 2000);
      } else {
        setError(response?.message || 'Failed to create venue');
      }
    } catch (error) {
      console.error('Error creating venue:', error);
      setError('Failed to create venue. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (!context.isLogin || context.userData?.role !== 'facility_owner') {
    return null;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-emerald-50 p-6">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-8 text-center">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-red-600 to-purple-600 bg-clip-text text-transparent mb-2">
            Create New Venue
          </h1>
          <p className="text-gray-600 text-lg">
            Add a new sports venue to your portfolio
          </p>
        </div>

        {/* Success Message */}
        {success && (
          <div className="mb-6 bg-green-50 border border-green-200 rounded-lg p-4">
            <div className="flex items-center">
              <FaCheckCircle className="text-green-500 mr-2" />
              <span className="text-green-800">Venue created successfully! Redirecting to dashboard...</span>
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

        <div className="bg-white/90 backdrop-blur-md rounded-2xl shadow-xl p-8 border border-white/20">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Basic Information */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block mb-2 font-semibold text-gray-700">
                  Venue Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="name"
                  placeholder="Enter venue name"
                  value={facility.name}
                  onChange={handleChange}
                  className={`w-full p-3 border-2 rounded-xl focus:ring-2 transition-all duration-300 ${
                    facility.name ? 'border-green-300 focus:border-green-500 focus:ring-green-200' : 'border-gray-200 focus:border-blue-500 focus:ring-blue-200'
                  }`}
                  required
                />
              </div>
              <div>
                <label className="block mb-2 font-semibold text-gray-700">
                  Description
                </label>
                <textarea
                  name="description"
                  placeholder="Describe your venue"
                  value={facility.description}
                  onChange={handleChange}
                  rows={3}
                  className="w-full p-3 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all duration-300"
                />
              </div>
            </div>

            {/* Address */}
            <div>
              <label className="block mb-2 font-semibold text-gray-700">
                Address <span className="text-red-500">*</span>
              </label>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <input
                  type="text"
                  name="address.street"
                  placeholder="Street Address"
                  value={facility.address.street}
                  onChange={handleChange}
                  className="w-full p-3 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all duration-300"
                />
                <input
                  type="text"
                  name="address.city"
                  placeholder="City *"
                  value={facility.address.city}
                  onChange={handleChange}
                  className={`w-full p-3 border-2 rounded-xl focus:ring-2 transition-all duration-300 ${
                    facility.address.city ? 'border-green-300 focus:border-green-500 focus:ring-green-200' : 'border-gray-200 focus:border-blue-500 focus:ring-blue-200'
                  }`}
                  required
                />
                <input
                  type="text"
                  name="address.state"
                  placeholder="State *"
                  value={facility.address.state}
                  onChange={handleChange}
                  className={`w-full p-3 border-2 rounded-xl focus:ring-2 transition-all duration-300 ${
                    facility.address.state ? 'border-green-300 focus:border-green-500 focus:ring-green-200' : 'border-gray-200 focus:border-blue-500 focus:ring-blue-200'
                  }`}
                  required
                />
                <input
                  type="text"
                  name="address.zip"
                  placeholder="ZIP Code"
                  value={facility.address.zip}
                  onChange={handleChange}
                  className="w-full p-3 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all duration-300"
                />
              </div>
            </div>

            {/* Sports Available */}
            <div>
              <label className="block mb-2 font-semibold text-gray-700">
                Sports Available <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <input
                  type="text"
                  placeholder="Type sport and press Enter (e.g., badminton, tennis)"
                  value={sportsInput}
                  onChange={(e) => setSportsInput(e.target.value)}
                  onKeyPress={handleSportsInput}
                  className={`w-full p-3 border-2 rounded-xl focus:ring-2 transition-all duration-300 ${
                    facility.sportsAvailable.length > 0 ? 'border-green-300 focus:border-green-500 focus:ring-green-200' : 'border-gray-200 focus:border-blue-500 focus:ring-blue-200'
                  }`}
                />
                <div className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 text-sm">
                  Press Enter to add
                </div>
              </div>
              
              {/* Quick Add Sports */}
              <div className="mt-3">
                <p className="text-sm text-gray-600 mb-2">Quick add common sports:</p>
                <div className="flex flex-wrap gap-2">
                  {['badminton', 'tennis', 'football', 'cricket', 'table-tennis', 'basketball'].map((sport) => (
                    <button
                      key={sport}
                      type="button"
                      onClick={() => {
                        if (!facility.sportsAvailable.includes(sport)) {
                          setFacility(prev => ({
                            ...prev,
                            sportsAvailable: [...prev.sportsAvailable, sport]
                          }));
                        }
                      }}
                      disabled={facility.sportsAvailable.includes(sport)}
                      className={`px-3 py-1 rounded-full text-xs font-medium transition-all duration-200 ${
                        facility.sportsAvailable.includes(sport)
                          ? 'bg-gray-200 text-gray-500 cursor-not-allowed'
                          : 'bg-blue-100 text-blue-700 hover:bg-blue-200 hover:scale-105'
                      }`}
                    >
                      {sport}
                    </button>
                  ))}
                </div>
              </div>
              
              {facility.sportsAvailable.length > 0 && (
                <div className="flex flex-wrap gap-2 mt-3">
                  {facility.sportsAvailable.map((sport, index) => (
                    <span
                      key={index}
                      className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm flex items-center gap-2"
                    >
                      {sport}
                      <button
                        type="button"
                        onClick={() => removeSport(sport)}
                        className="text-blue-600 hover:text-blue-800 font-bold"
                      >
                        ×
                      </button>
                    </span>
                  ))}
                  <button
                    type="button"
                    onClick={() => setFacility(prev => ({ ...prev, sportsAvailable: [] }))}
                    className="text-red-600 hover:text-red-800 text-xs font-medium px-2 py-1 border border-red-300 rounded-full hover:bg-red-50"
                  >
                    Clear All
                  </button>
                </div>
              )}
              {facility.sportsAvailable.length === 0 && (
                <p className="text-sm text-gray-500 mt-2">
                  No sports added yet. Add at least one sport to continue.
                </p>
              )}
            </div>

            {/* Amenities */}
            <div>
              <label className="block mb-2 font-semibold text-gray-700">
                Amenities
              </label>
              <div className="relative">
                <input
                  type="text"
                  placeholder="Type amenity and press Enter (e.g., parking, wifi)"
                  value={amenitiesInput}
                  onChange={(e) => setAmenitiesInput(e.target.value)}
                  onKeyPress={handleAmenitiesInput}
                  className="w-full p-3 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all duration-300"
                />
                <div className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 text-sm">
                  Press Enter to add
                </div>
              </div>
              
              {/* Quick Add Amenities */}
              <div className="mt-3">
                <p className="text-sm text-gray-600 mb-2">Quick add common amenities:</p>
                <div className="flex flex-wrap gap-2">
                  {['parking', 'wifi', 'changing rooms', 'shower', 'equipment rental', 'cafe', 'lockers'].map((amenity) => (
                    <button
                      key={amenity}
                      type="button"
                      onClick={() => {
                        if (!facility.amenities.includes(amenity)) {
                          setFacility(prev => ({
                            ...prev,
                            amenities: [...prev.amenities, amenity]
                          }));
                        }
                      }}
                      disabled={facility.amenities.includes(amenity)}
                      className={`px-3 py-1 rounded-full text-xs font-medium transition-all duration-200 ${
                        facility.amenities.includes(amenity)
                          ? 'bg-gray-200 text-gray-500 cursor-not-allowed'
                          : 'bg-green-100 text-green-700 hover:bg-green-200 hover:scale-105'
                      }`}
                    >
                      {amenity}
                    </button>
                  ))}
                </div>
              </div>
              
              {facility.amenities.length > 0 && (
                <div className="flex flex-wrap gap-2 mt-3">
                  {facility.amenities.map((amenity, index) => (
                    <span
                      key={index}
                      className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm flex items-center gap-2"
                    >
                      {amenity}
                      <button
                        type="button"
                        onClick={() => removeAmenity(amenity)}
                        className="text-green-600 hover:text-green-800 font-bold"
                      >
                        ×
                      </button>
                    </span>
                  ))}
                  <button
                    type="button"
                    onClick={() => setFacility(prev => ({ ...prev, amenities: [] }))}
                    className="text-red-600 hover:text-red-800 text-xs font-medium px-2 py-1 border border-red-300 rounded-full hover:bg-red-50"
                  >
                    Clear All
                  </button>
                </div>
              )}
              {facility.amenities.length === 0 && (
                <p className="text-sm text-gray-500 mt-2">
                  No amenities added yet. (Optional)
                </p>
              )}
            </div>

            {/* Photo Upload */}
            <div>
              <label className="block mb-2 font-semibold text-gray-700">
                Venue Photos
              </label>
              <input
                type="file"
                multiple
                accept="image/*"
                onChange={handlePhotoUpload}
                className="w-full p-3 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all duration-300 file:mr-4 file:py-2 file:px-4 file:rounded file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
              />
              {facility.photos.length > 0 && (
                <div className="flex flex-wrap gap-3 mt-4">
                  {facility.photos.map((file, idx) => {
                    const url = URL.createObjectURL(file);
                    return (
                      <div key={idx} className="relative">
                        <img
                          src={url}
                          alt={`preview-${idx}`}
                          className="h-20 w-20 object-cover rounded-lg"
                          onLoad={() => URL.revokeObjectURL(url)}
                        />
                        <button
                          type="button"
                          onClick={() => {
                            setFacility(prev => ({
                              ...prev,
                              photos: prev.photos.filter((_, index) => index !== idx)
                            }));
                          }}
                          className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm hover:bg-red-600"
                        >
                          ×
                        </button>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>

            {/* Debug Section - Remove this in production */}
            {process.env.NODE_ENV === 'development' && (
              <div className="bg-gray-100 p-4 rounded-lg">
                <h4 className="font-semibold text-gray-700 mb-2">Debug Info:</h4>
                <div className="text-sm text-gray-600">
                  <p><strong>Sports Available:</strong> [{facility.sportsAvailable.join(', ')}] (Count: {facility.sportsAvailable.length})</p>
                  <p><strong>Amenities:</strong> [{facility.amenities.join(', ')}] (Count: {facility.amenities.length})</p>
                  <p><strong>Form Valid:</strong> {facility.name && facility.address.city && facility.address.state && facility.sportsAvailable.length > 0 ? 'Yes' : 'No'}</p>
                </div>
              </div>
            )}

            {/* Submit Button */}
            <div className="flex gap-4">
              <button
                type="submit"
                disabled={loading}
                className="flex-1 bg-gradient-to-r from-blue-600 to-purple-600 text-white px-8 py-3 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? (
                  <div className="flex items-center justify-center">
                    <FaSpinner className="animate-spin mr-2" />
                    Creating Venue...
                  </div>
                ) : (
                  'Create Venue'
                )}
              </button>
              
              <button
                type="button"
                onClick={() => navigate('/Owner')}
                className="px-8 py-3 border-2 border-gray-300 text-gray-700 rounded-xl hover:bg-gray-50 transition-all duration-300"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default FacilityManagement;
