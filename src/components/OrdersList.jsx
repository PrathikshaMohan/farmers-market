import React, { useState } from "react";

const OrdersList = ({ orders }) => {
  const [expandedOrderId, setExpandedOrderId] = useState(null);

  const handleTrackClick = (orderId) => {
    setExpandedOrderId(expandedOrderId === orderId ? null : orderId);
  };

  if (!orders || orders.length === 0) {
    return (
      <p className="text-gray-600 italic text-center py-8">No orders found.</p>
    );
  }

  return (
    <div className="space-y-6 max-w-3xl mx-auto">
      {orders.map((order) => {
        const isExpanded = expandedOrderId === order.id;
        return (
          <div
            key={order.id}
            className="border border-gray-300 rounded-lg p-5 shadow-sm hover:shadow-lg transition-shadow duration-300"
          >
            <div className="flex justify-between items-center mb-3">
              <h2 className="text-lg font-semibold text-gray-800">
                Order ID: <span className="text-green-700">{order.id}</span>
              </h2>
              <p
                className={`font-semibold ${
                  order.status.toLowerCase() === "delivered"
                    ? "text-green-600"
                    : order.status.toLowerCase() === "pending"
                    ? "text-yellow-600"
                    : "text-red-600"
                }`}
              >
                Status: {order.status}
              </p>
            </div>

            <button
              onClick={() => handleTrackClick(order.id)}
              className="mb-4 bg-green-600 text-white px-4 py-2 rounded-md shadow hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-400 transition-transform active:scale-95"
            >
              {isExpanded ? "Hide Order Details" : "Track My Order"}
            </button>

            {isExpanded && (
              <div className="border-t pt-3">
                <p className="font-semibold text-gray-700 mb-2">Products:</p>
                <ul className="list-disc list-inside space-y-1 text-gray-600 text-sm max-h-40 overflow-y-auto">
                  {order.products && order.products.length > 0 ? (
                    order.products.map((product, index) => (
                      <li key={index}>
                        {product.product_name} — Qty: {product.quantity} {product.unit}
                      </li>
                    ))
                  ) : (
                    <li>No products info available</li>
                  )}
                </ul>
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
};

export default OrdersList;
