import React from "react";
import { LogOut } from "lucide-react";

const AdminHeader = () => {
  return (
    <header className="bg-white shadow px-4 sm:px-6 py-4">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        {/* Greeting */}
        <div>
          <h2 className="text-lg sm:text-xl font-semibold text-gray-800">
            Admin Dashboard
          </h2>
          <p className="text-sm text-gray-500">
            Manage market prices, users, and reports
          </p>
        </div>

        {/* Logout Button */}
        <button
          onClick={() => {
            localStorage.removeItem("token");
            localStorage.removeItem("user");
            window.location.href = "/adminlogin";
          }}
          className="flex items-center justify-center bg-red-500 text-white px-4 py-2 rounded-md hover:bg-red-600 transition-all w-full sm:w-auto"
        >
          <LogOut className="w-5 h-5 mr-2" />
          LogOut
        </button>
      </div>
    </header>
  );
};

export default AdminHeader;
