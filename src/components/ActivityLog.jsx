import { ShieldCheck, User2, Tractor } from 'lucide-react';
import React, { useState } from 'react';
import axios from 'axios';

const roleIcon = {
  admin: <ShieldCheck className="w-4 h-4 text-blue-600" />,
  farmer: <Tractor className="w-4 h-4 text-[rgb(128,153,11)]" />,
  user: <User2 className="w-4 h-4 text-gray-600" />,
};

const roleColor = {
  admin: 'bg-blue-100 text-blue-700',
  farmer: 'bg-green-100 text-[rgb(128,153,11)]',
  user: 'bg-gray-100 text-gray-700',
};

const ActivityLogSection = ({ logs = [], onClear }) => {
  const [clearing, setClearing] = useState(false);

  const handleClearLogs = async () => {
    if (!window.confirm('Are you sure you want to clear all activity logs?')) return;

    try {
      setClearing(true);
      await axios.post('http://localhost:5000/api/admin/clear');
      onClear(); // Tell parent to refresh logs
    } catch (error) {
      console.error('Error clearing logs:', error);
      alert('Failed to clear logs.');
    } finally {
      setClearing(false);
    }
  };

  return (
    <div className="bg-white dark:bg-gray-800 p-5 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-bold text-gray-800 dark:text-white">📜 Recent Activity</h2>
        <button
          onClick={handleClearLogs}
          className="text-sm bg-red-100 text-red-700 hover:bg-red-200 px-3 py-1 rounded-md shadow-sm disabled:opacity-50"
          disabled={clearing || logs.length === 0}
        >
          {clearing ? 'Clearing...' : 'Clear Logs'}
        </button>
      </div>

      <div className="max-h-64 overflow-y-auto scrollbar-thin scrollbar-thumb-gray-400 scrollbar-track-gray-100 pr-1">
        {logs.length > 0 ? (
          <ul className="space-y-3">
            {logs.map((log) => (
              <li
                key={log.id}
                className="bg-gray-50 dark:bg-gray-700 p-3 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-600 transition"
              >
                <div className="flex justify-between items-center mb-1">
                  <div className="flex items-center gap-2">
                    {roleIcon[log.role] || <User2 className="w-4 h-4 text-gray-400" />}
                    <span className="font-medium text-gray-800 dark:text-white">{log.username}</span>
                    <span className={`text-xs px-2 py-0.5 rounded-full font-semibold ${roleColor[log.role]}`}>
                      {log.role}
                    </span>
                  </div>
                  <span className="text-xs text-gray-500 dark:text-gray-300">
                    {new Date(log.timestamp).toLocaleString()}
                  </span>
                </div>
                <p className="text-sm text-gray-700 dark:text-gray-200 ml-6">{log.action}</p>
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-sm text-gray-500 italic">No recent activity found.</p>
        )}
      </div>
    </div>
  );
};


export default ActivityLogSection;
