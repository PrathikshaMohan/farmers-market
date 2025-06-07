import React, { useEffect, useState } from 'react';
import axios from 'axios';
import ActivityLogSection from './ActivityLog';

const ManageUsers = () => {
  const [users, setUsers] = useState([]);
  const [logs, setLogs] = useState([]); 

  const fetchUsers = async () => {
    try {
      const res = await axios.get('http://localhost:5000/api/admin/users');
      setUsers(res.data);
    } catch (error) {
      console.error('Failed to fetch users:', error);
    }
  };

  const deleteUser = async (id) => {
    try {
      await axios.delete(`http://localhost:5000/api/admin/users/${id}`);
      fetchUsers();
    } catch (error) {
      console.error('Failed to delete user:', error);
    }
  };

  const fetchLogs = async () => {
    try {
      const res = await axios.get('http://localhost:5000/api/admin/logs');
      setLogs(res.data.logs);
    } catch (error) {
      console.error('Failed to fetch logs', error);
    }
  };

  useEffect(() => {
    fetchUsers();
    fetchLogs();
  }, []);

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <h2 className="text-3xl font-extrabold mb-6 text-[rgb(128,153,11)]">Manage Users</h2>

      <div className="overflow-x-auto rounded-lg shadow-md border border-gray-200 mb-8">
        <table className="w-full border-collapse text-center text-sm">
          <thead className="bg-green-100 text-gray-700 uppercase text-xs">
            <tr>
              <th className="p-3 border-b border-gray-300">ID</th>
              <th className="p-3 border-b border-gray-300">Full Name</th>
              <th className="p-3 border-b border-gray-300">Email</th>
              <th className="p-3 border-b border-gray-300">Username</th>
              <th className="p-3 border-b border-gray-300">Role</th>
              <th className="p-3 border-b border-gray-300">Actions</th>
            </tr>
          </thead>
          <tbody>
            {users.map((u) => (
              <tr
                key={u.id}
                className="border-t border-gray-300 hover:bg-gray-50 transition-colors"
              >
                <td className="p-3">{u.id}</td>
                <td className="p-3 font-semibold">{u.full_name}</td>
                <td className="p-3 break-words max-w-xs">{u.email}</td>
                <td className="p-3">{u.username}</td>
                <td className="p-3 capitalize">{u.role}</td>
                <td className="p-3">
                  <button
                    onClick={() => deleteUser(u.id)}
                    className="bg-red-500 px-4 py-1 rounded text-white font-semibold hover:bg-red-600 transition"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
            {users.length === 0 && (
              <tr>
                <td colSpan="6" className="p-6 text-gray-500">
                  No users found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Activity Logs Section */}
      <ActivityLogSection logs={logs} onClear={fetchLogs} />
    </div>
  );
};

export default ManageUsers;
