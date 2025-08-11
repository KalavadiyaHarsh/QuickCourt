// src/components/EditProfile.jsx
import React, { useEffect, useState } from "react";
import { editData, uploadImage } from "../utils/api";

export default function EditProfile({ user, onSave, onReset }) {
  const [form, setForm] = useState({
    fullName: user?.fullName || '',
    email: user?.email || '',
    phone: user?.phone || '',
  });
  const [avatar, setAvatar] = useState(null);
  const [avatarPreview, setAvatarPreview] = useState(user?.avatar || '/man.png');
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    setForm({
      fullName: user?.fullName || '',
      email: user?.email || '',
      phone: user?.phone || '',
    });
    setAvatarPreview(user?.avatar && user.avatar !== 'default.jpg' ? user.avatar : '/man.png');
  }, [user]);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleAvatarChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      // Validate file size (5MB limit)
      if (file.size > 5 * 1024 * 1024) {
        alert("File size must be less than 5MB");
        return;
      }
      setAvatar(file);
      // Create preview URL
      const reader = new FileReader();
      reader.onload = (e) => setAvatarPreview(e.target.result);
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      let response;

      if (avatar) {
        // If avatar is selected, use uploadImage for multipart form data
        const formData = new FormData();
        formData.append('fullName', form.fullName);
        formData.append('avatar', avatar);
        
        response = await uploadImage("/api/users/profile", formData);
      } else {
        // If no avatar, use editData for JSON data
        const updateData = {
          fullName: form.fullName,
        };
        
        response = await editData("/api/users/profile", updateData);
      }

      if (response?.success) {
        // Update the user data with the response
        const updatedUser = response.data;
        onSave(updatedUser);
        
        // Reset avatar state
        setAvatar(null);
        setAvatarPreview(updatedUser.avatar && updatedUser.avatar !== 'default.jpg' ? updatedUser.avatar : '/man.png');
      } else {
        alert(response?.message || "Failed to update profile");
      }
    } catch (error) {
      console.error("Error updating profile:", error);
      alert("An error occurred while updating profile");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleReset = () => {
    if (onReset) onReset();
  };

  return (
    <div>
      <h2 className="text-2xl font-semibold mb-6 text-gray-800">Edit Profile</h2>
      
      {/* Avatar Section */}
      <div className="mb-8">
        <label className="block text-sm font-medium text-gray-700 mb-4">
          Profile Picture
        </label>
        <div className="flex items-center space-x-6">
          <div className="relative">
            <img 
              src={avatarPreview} 
              alt="Profile Preview" 
              className="w-24 h-24 rounded-full border-4 border-blue-200 object-cover"
            />
            {avatar && (
              <div className="absolute -top-1 -right-1 w-6 h-6 bg-green-500 rounded-full flex items-center justify-center">
                <span className="text-white text-xs">✓</span>
              </div>
            )}
          </div>
          <div>
            <input
              type="file"
              accept="image/*"
              onChange={handleAvatarChange}
              className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
            />
            <p className="text-xs text-gray-500 mt-1">JPG, PNG or GIF. Max size 5MB.</p>
          </div>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6 max-w-md">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Full Name *
          </label>
          <input 
            name="fullName" 
            value={form.fullName} 
            onChange={handleChange} 
            className="w-full border border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors" 
            placeholder="Enter your full name"
            required
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Email
          </label>
          <input 
            name="email" 
            type="email"
            value={form.email} 
            onChange={handleChange} 
            className="w-full border border-gray-300 rounded-lg p-3 bg-gray-100 cursor-not-allowed" 
            placeholder="Email cannot be changed"
            disabled
          />
          <p className="text-xs text-gray-500 mt-1">Email address cannot be modified</p>
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Phone Number
          </label>
          <input 
            name="phone" 
            value={form.phone} 
            onChange={handleChange} 
            className="w-full border border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors" 
            placeholder="Enter your phone number"
          />
        </div>
        
        <div className="flex gap-3 pt-4">
          <button 
            type="button" 
            onClick={handleReset} 
            className="flex-1 bg-gray-300 hover:bg-gray-400 text-gray-800 px-4 py-3 rounded-lg font-medium transition-colors"
            disabled={isSubmitting}
          >
            Reset
          </button>
          <button 
            type="submit" 
            className="flex-1 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-4 py-3 rounded-lg font-medium transition-all transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
            disabled={isSubmitting}
          >
            {isSubmitting ? 'Updating...' : 'Save Changes'}
          </button>
        </div>
      </form>
      
      <div className="mt-8 p-4 bg-blue-50 rounded-lg border border-blue-200">
        <h3 className="text-sm font-medium text-blue-800 mb-2">Profile Information</h3>
        <div className="text-sm text-blue-700 space-y-1">
          <p><span className="font-medium">Role:</span> {user?.role || 'N/A'}</p>
          <p><span className="font-medium">Status:</span> <span className={`capitalize ${user?.status === 'active' ? 'text-green-600' : 'text-red-600'}`}>{user?.status || 'N/A'}</span></p>
          <p><span className="font-medium">Verified:</span> <span className={user?.isVerified ? 'text-green-600' : 'text-red-600'}>{user?.isVerified ? 'Yes' : 'No'}</span></p>
          {user?.createdAt && (
            <p><span className="font-medium">Member since:</span> {new Date(user.createdAt).toLocaleDateString()}</p>
          )}
        </div>
      </div>
    </div>
  );
}
