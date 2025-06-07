import React from "react";
import {
  Home,
  PackageOpen,
  ShoppingCart,
  TrendingUp,
  User,
  Settings,
} from "lucide-react";

const Sidebar = ({ setActiveSection }) => {
  return (
    <div className="w-64 min-h-screen bg-green-100 p-6 shadow-lg">
      <h1 className="text-2xl font-bold text-[rgb(128,153,11)] mb-8">
        Fresh<span className="text-black">Harvest.</span>
      </h1>
      <ul className="space-y-4 text-green-900 font-medium">
        <li
          className="flex items-center gap-2 cursor-pointer hover:text-green-700"
          onClick={() => setActiveSection("dashboard")}
        >
          <Home className="w-5 h-5" />
          Dashboard
        </li>
        <li
          className="flex items-center gap-2 cursor-pointer hover:text-green-700"
          onClick={() => setActiveSection("products")}
        >
          <PackageOpen className="w-5 h-5" />
          Manage Products
        </li>
        <li
          className="flex items-center gap-2 cursor-pointer hover:text-green-700"
          onClick={() => setActiveSection("users")}
        >
          <User className="w-5 h-5" />
          Manage Users
        </li>
        <li
          className="flex items-center gap-2 cursor-pointer hover:text-green-700"
          onClick={() => setActiveSection("orders")}
        >
          <ShoppingCart className="w-5 h-5" />
          Orders Overview
        </li>
        <li
          className="flex items-center gap-2 cursor-pointer hover:text-green-700"
          onClick={() => setActiveSection("marketprice")}
        >
          <TrendingUp className="w-5 h-5" />
          Market Price
        </li>
        <li
          className="flex items-center gap-2 cursor-pointer hover:text-green-700"
          onClick={() => setActiveSection("settings")}
        >
          <Settings className="w-5 h-5" />
          Settings
        </li>
      </ul>
    </div>
  );
};

export default Sidebar;
