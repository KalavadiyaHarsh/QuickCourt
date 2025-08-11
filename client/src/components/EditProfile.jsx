// src/components/EditProfile.jsx
import React, { useEffect, useState } from "react";

export default function EditProfile({ user, onSave, onReset }) {
  const [form, setForm] = useState(user);

  useEffect(() => setForm(user), [user]); // update form when user prop changes

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(form);
  };

  const handleReset = () => {
    setForm(user);
    if (onReset) onReset();
  };

  return (
    <div>
      <h2 className="text-xl font-semibold mb-4">Edit Profile</h2>
      <form onSubmit={handleSubmit} className="space-y-4 max-w-md">
        <input name="name" value={form.name} onChange={handleChange} className="w-full border border-gray-300 rounded p-2" />
        <input name="email" value={form.email} onChange={handleChange} className="w-full border border-gray-300 rounded p-2" />
        <input name="phone" value={form.phone} onChange={handleChange} className="w-full border border-gray-300 rounded p-2" />
        <div className="flex gap-3">
          <button type="button" onClick={handleReset} className="bg-gray-300 px-4 py-2 rounded">Reset</button>
          <button type="submit" className="bg-teal-600 text-white px-4 py-2 rounded">Save</button>
        </div>
      </form>
    </div>
  );
}
