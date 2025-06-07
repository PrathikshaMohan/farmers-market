import React, {useState,useEffect} from "react";
import AdminHeader from "../components/AdminHeader";
import Sidebar from "../components/AdminNav";
import MarketPrice from "../components/MarketPrice";
import ManageProducts from "../components/ManageProduct";
import ManageUsers from "../components/ManageUsers";
import ManageOrders from "../components/ManageOrders";
import AdminSettings from "../components/AdminSettings";

const AdminDashboard = () => {
    const [activeSection, setActiveSection] = useState("marketprice");
  const [role, setRole] = useState("");

  useEffect(() => {
    const adminData = JSON.parse(localStorage.getItem("admin"));
    if (adminData) {
      setRole(adminData.role);
    }
  }, []);
    const renderSection = () => {
      switch (activeSection) {
        case "products":
          return <ManageProducts />;
        case "marketprice":
           return <MarketPrice role={role} />;
        case "users":
          return <ManageUsers />;
        case "orders":
          return <ManageOrders />;
        case "reports":
          return <Reports />;
        case "settings":
          return <AdminSettings />;
           
        default:
          return <ManageOrders />;
      }
    };
  
    return (
      <div className="flex min-h-screen">
        <Sidebar setActiveSection={setActiveSection} />
        <div className="flex-1 flex flex-col bg-gray-100">
          <AdminHeader />
          <main className="p-4 overflow-y-auto">{renderSection()}</main>
        </div>
      </div>
    );
  };
  
  export default AdminDashboard;