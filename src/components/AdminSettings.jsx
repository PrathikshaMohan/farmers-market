import React, { useState, useEffect } from 'react';
import api from "../api";
const AdminSettings = () => {
  
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [message, setMessage] = useState('');
const [messageType, setMessageType] = useState(''); // 'success' or 'error'
  

  const handlePasswordChange = async (e) => {
  e.preventDefault();
  if (newPassword !== confirmPassword) {
    return setMessage("New passwords do not match.");
  }
  try {
    const res = await api.put('/admin/update-password', {
      username: 'admin', 
      currentPassword,
      newPassword,
    });

    setMessage(res.data.message);
    setMessageType('success');  // success message in green
    setCurrentPassword('');
    setNewPassword('');
    setConfirmPassword('');
  } catch (err) {
    setMessage(err.response?.data?.message || 'Password update failed.');
    setMessageType('error');  // error message in red
  }
};



  return (
    <div className="p-6 space-y-8">
  <h2 className="text-3xl font-extrabold text-[rgb(128,153,11)] dark:text-white"> Settings</h2>

  {/* Password Change */}
  <div className="bg-white dark:bg-gray-900 p-6 rounded-2xl shadow-md transition-all duration-300 hover:shadow-lg border border-gray-200 dark:border-gray-700">
    <h3 className="text-xl font-semibold mb-4 text-gray-800 dark:text-gray-100 flex items-center gap-2">
      🔐 Change Password
    </h3>

    {message && (
  <p
    className={`mb-4 text-sm p-2 rounded ${
      messageType === 'success'
        ? 'text-green-600 bg-green-100 dark:bg-green-900 dark:text-green-300'
        : 'text-red-500 bg-red-100 dark:bg-red-900 dark:text-red-300'
    }`}
  >
    {message}
  </p>
)}


    <form onSubmit={handlePasswordChange} className="space-y-4">
      <div>
        <label className="block text-sm font-medium mb-1 text-gray-700 dark:text-gray-300">
          Current Password
        </label>
        <input
          type="password"
          placeholder="Enter current password"
          className="w-full border border-gray-300 dark:border-gray-600 px-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-[rgb(128,153,11)] bg-gray-50 dark:bg-gray-800 dark:text-white"
          value={currentPassword}
          onChange={(e) => setCurrentPassword(e.target.value)}
          required
        />
      </div>

      <div>
        <label className="block text-sm font-medium mb-1 text-gray-700 dark:text-gray-300">
          New Password
        </label>
        <input
          type="password"
          placeholder="Enter new password"
          className="w-full border border-gray-300 dark:border-gray-600 px-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-[rgb(128,153,11)] bg-gray-50 dark:bg-gray-800 dark:text-white"
          value={newPassword}
          onChange={(e) => setNewPassword(e.target.value)}
          required
        />
      </div>

      <div>
        <label className="block text-sm font-medium mb-1 text-gray-700 dark:text-gray-300">
          Confirm New Password
        </label>
        <input
          type="password"
          placeholder="Confirm new password"
          className="w-full border border-gray-300 dark:border-gray-600 px-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-[rgb(128,153,11)] bg-gray-50 dark:bg-gray-800 dark:text-white"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          required
        />
      </div>

      <button
        type="submit"
        className="w-full bg-[rgb(128,153,11)] hover:bg-[rgb(100,120,10)] text-white font-semibold py-2 rounded-lg transition-all duration-200 transform hover:scale-105"
      >
         Update Password
      </button>
    </form>
  </div>
</div>


    
  );
};

export default AdminSettings;
