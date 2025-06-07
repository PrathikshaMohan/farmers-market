import React from "react";
import { LogOut} from "lucide-react";


const AdminHeader = () => {
  return (
    <header className="flex items-center justify-between bg-white shadow px-6 py-4">
      {/* Greeting */}
      <div>
        <h2 className="text-xl font-semibold text-gray-800">Admin Dashboard</h2>
        <p className="text-sm text-gray-500">Manage market prices, users, and reports</p>
      </div>

      {/* Search + Icons */}
      <div className="flex items-center gap-4">
        

        

       

        {/* Logout Button */}
        <button
  onClick={() => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    window.location.href = "/adminlogin";
  }}
  className="flex items-center bg-red-500 text-white px-4 py-2 rounded-md hover:bg-red-600 hover:text-white transition-all"
>
  <LogOut className="w-5 h-5 mr-2" />
  LogOut
</button>
      </div>
    </header>
  );
};

export default AdminHeader;
