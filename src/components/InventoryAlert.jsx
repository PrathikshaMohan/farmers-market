import React, { useEffect, useState } from "react";
import axios from "axios";

const InventoryAlert = () => {
  const [alerts, setAlerts] = useState([]);
  const [loading, setLoading] = useState(true);

  const user = JSON.parse(localStorage.getItem("user"));
  const farmerId = user?.id;

  useEffect(() => {
    if (!farmerId) {
      console.warn("No userId, skipping fetch");
      setLoading(false);
      return;
    }

    const fetchAlerts = async () => {
      try {
        
        const res = await axios.get(
          `http://localhost:5000/api/inventory/low-stock?farmerId=${farmerId}`
        );
        setAlerts(res.data);
      } catch (err) {
        console.error("Error fetching inventory alerts:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchAlerts();
  }, [farmerId]);

  return (
    <div className="p-4">
      <h2 className="text-3xl font-extrabold text-[rgb(128,153,11)] mb-4"> Inventory Alerts</h2>
      {loading ? (
        <p>Loading...</p>
      ) : alerts.length === 0 ? (
        <p className="text-[rgb(128,153,11)]">No low stock alerts. All good!</p>
      ) : (
        <div className="space-y-3">
          {alerts.map((item) => (
            <div
              key={item.id}
              className="bg-red-100 text-red-800 border border-red-300 p-3 rounded-md shadow"
            >
              <p>
                <strong>{item.name}</strong> is low on stock. Only{" "}
                <strong>
                  {item.quantity}{" "}
                  {item.unit === "piece"
                    ? item.quantity > 1
                      ? "pieces"
                      : "piece"
                    : item.unit}
                </strong>{" "}
                left.
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default InventoryAlert;
