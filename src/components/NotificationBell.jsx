import React, { useEffect, useState } from "react";
import { Bell } from "lucide-react";
import api from "../api";

const NotificationBell = () => {
  const [notifications, setNotifications] = useState([]);
  const [farmerId, setFarmerId] = useState(null);
  const [showDropdown, setShowDropdown] = useState(false);

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("user"));
    if (user?.id) setFarmerId(user.id);
  }, []);

  useEffect(() => {
    if (!farmerId) return;

    const fetchNotifications = async () => {
      try {
        const res = await api.get(
          `/notifications/${farmerId}`
        );
        setNotifications(res.data);
      } catch (err) {
        console.error("Error fetching notifications:", err);
      }
    };

    fetchNotifications();
  }, [farmerId]);

  return (
    <div className="relative inline-block text-left">
      <button
        onClick={() => setShowDropdown(!showDropdown)}
        className="relative focus:outline-none focus:ring-2 focus:ring-[rgb(128,153,11)] rounded-full p-2 hover:bg-green-50 transition"
        aria-label="Toggle notifications dropdown"
      >
        <Bell className="text-gray-600 hover:text-[rgb(128,153,11)] w-6 h-6" />
        {notifications.length > 0 && (
          <span className="absolute top-1 right-1 w-3 h-3 bg-red-500 rounded-full border-2 border-white animate-pulse"></span>
        )}
      </button>

      {showDropdown && (
        <div className="absolute right-0 mt-2 w-80 bg-white shadow-xl border border-gray-200 rounded-lg z-50 ring-1 ring-black ring-opacity-5">
          <div className="px-4 py-3 font-semibold border-b border-gray-200 text-gray-700 text-lg">
            Notifications
          </div>
          {notifications.length === 0 ? (
            <div className="p-6 text-center text-gray-400 italic select-none">
              No new notifications.
            </div>
          ) : (
            <ul className="max-h-64 overflow-y-auto divide-y divide-gray-100">
              {notifications.map((note) => (
                <li
                  key={note.id}
                  className="p-4 hover:bg-green-50 cursor-default transition"
                >
                  <p className="text-sm text-gray-800">{note.message}</p>
                  <p className="text-xs text-gray-400 mt-1">
                    {new Date(note.created_at).toLocaleString()}
                  </p>
                </li>
              ))}
            </ul>
          )}
        </div>
      )}
    </div>
  );
};

export default NotificationBell;
