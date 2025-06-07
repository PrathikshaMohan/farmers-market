import React, { useState } from "react";
import FHeader from "../components/Fheader";
import Sidebar from "../components/Sidebar";
import Orders from "../components/Orders";
import MarketPrice from "../components/MarketPrice";
import WeatherForecast from "../components/Weather";
import InventoryAlert from "../components/InventoryAlert";
import Listing from "../components/Listing";
import  Settings  from "../components/Settings"



  const FarmerDashboard = () => {
  const [activeSection, setActiveSection] = useState("orders");
 
  const renderSection = () => {
    switch (activeSection) {
      case "listing":
      
        return <Listing />;
      case "orders":
        return <Orders />;
      
      case "market":
        return <MarketPrice role='farmer'/>;
      case "weather":
        return <WeatherForecast />;
      case "inventory":
        return <InventoryAlert />;
      case "settings":
        return <Settings />;
      default:
        return <Listing />;
    }
  };

  return (
    <div className="flex min-h-screen">
      <Sidebar setActiveSection={setActiveSection} />
      <div className="flex-1 flex flex-col bg-gray-50">
        <FHeader />
        
        <main className="p-4 overflow-y-auto">{renderSection()}</main>
      </div>
    </div>
  );
};

export default FarmerDashboard;