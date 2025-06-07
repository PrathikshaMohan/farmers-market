import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

const CompactOrdersDropdown = ({ orders }) => {
  const [expandedOrderId, setExpandedOrderId] = useState(null);

  const toggleDetails = (orderId) => {
    setExpandedOrderId(expandedOrderId === orderId ? null : orderId);
  };

  if (!orders || orders.length === 0) {
    return <p className="text-gray-500 italic text-center">No orders found.</p>;
  }

  return (
    <div className="space-y-4 max-h-[400px] overflow-y-auto scrollbar-thin px-1">
      {orders.map((order) => {
        const isExpanded = expandedOrderId === order.id;
        const statusColor =
          order.status.toLowerCase() === "delivered"
            ? "bg-green-100 text-green-700 border-green-300"
            : order.status.toLowerCase() === "pending"
            ? "bg-yellow-100 text-yellow-700 border-yellow-300"
            : "bg-red-100 text-red-700 border-red-300";

        return (
          <div
            key={order.id}
            className="bg-white border border-gray-200 rounded-xl shadow hover:shadow-md transition-all duration-300 p-5"
          >
            <div className="flex justify-between items-start">
              <div className="space-y-1">
                <p className="text-base font-semibold text-gray-800">
                  Order #{order.id}
                </p>
                <span
                  className={`inline-block px-3 py-1 rounded-full text-xs font-medium border ${statusColor}`}
                >
                  {order.status}
                </span>
              </div>
              <button
                onClick={() => toggleDetails(order.id)}
                className="text-sm text-blue-600 hover:underline focus:outline-none"
              >
                {isExpanded ? "Hide" : "Details"}
              </button>
            </div>

            <AnimatePresence>
              {isExpanded && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  transition={{ duration: 0.3 }}
                  className="mt-4 text-sm text-gray-700 space-y-3 border-t border-gray-100 pt-3"
                >
                  <div>
                    <p className="font-medium text-gray-800 mb-1">Products:</p>
                    <ul className="pl-5 list-disc space-y-1">
                      {order.products && order.products.length > 0 ? (
                        order.products.map((product, idx) => (
                          <li key={idx}>
                            <span className="font-medium">{product.product_name}</span>{" "}
                            — Qty: {product.quantity} {product.unit}
                          </li>
                        ))
                      ) : (
                        <li>No product details available</li>
                      )}
                    </ul>
                  </div>

                  {order.pickup_location && (
                    <p>
                      <span className="font-medium">Pickup Location:</span>{" "}
                      {order.pickup_location}
                    </p>
                  )}

                  {order.pickup_time_slot && (
                    <p>
                      <span className="font-medium">Pickup Time Slot:</span>{" "}
                      {order.pickup_time_slot}
                    </p>
                  )}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        );
      })}
    </div>
  );
};

export default CompactOrdersDropdown;
