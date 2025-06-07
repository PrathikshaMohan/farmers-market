
import React from "react";

import NotificationBell from "./NotificationBell";
import {LogOut } from "lucide-react";

const FHeader = ()=>{
  return (
    <div className="w-full px-6 py-4 bg-gray-50 shadow-sm space-y-6">
      {/* TOP HEADER */}
      <div className="flex justify-between items-center">
        <div className="flex flex-col">
          <h2 className="text-xl font-semibold">Welcome back.</h2>
          
        </div>

        {/* Search + Icons */}
        <div className="flex items-center space-x-4">
          

          <NotificationBell />

          

          <button
  onClick={() => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    window.location.href = "/login";
  }}
  className="flex items-center bg-red-500 text-white px-4 py-2 rounded-md hover:bg-red-600 hover:text-white transition-all"
>
  <LogOut className="w-5 h-5 mr-2" />
  LogOut
</button>
        </div>
      </div>

      {/* VIDEO BANNER + STAT CARD */}
      <div className="w-full h-64 rounded-xl overflow-hidden relative">
  <video
    src="/fdashboard.mp4"
    autoPlay
    muted
    loop
    className="absolute inset-0 w-full h-full object-cover"
  />
  
  <div className="absolute inset-0 bg-black/30 flex flex-col justify-center px-6 z-10 text-white">
    <h2 className="text-xl md:text-2xl font-bold mb-1">Sell your products</h2>
    <p className="text-sm md:text-base text-gray-200 mb-3">
      The world’s fast growing industry today are natural made products!
    </p>
    <div className="flex gap-2">
      <button className="bg-[rgb(128,153,11)] hover:bg-gray-500 transition text-white px-4 py-2 rounded text-sm">
        Explore More
      </button>
    </div>
  </div>
</div>
</div>

  );
};


export default FHeader;
