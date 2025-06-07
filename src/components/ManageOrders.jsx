import React, { useEffect, useState } from 'react';
import axios from 'axios';

const ManageOrders = () => {
  const [orders, setOrders] = useState([]);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const fetchOrders = async () => {
    try {
      const res = await axios.get('http://localhost:5000/api/admin/orders');
      setOrders(res.data);
    } catch (err) {
      console.error('Failed to fetch orders:', err);
    }
  };

  const updateOrderStatus = async (id, status) => {
    try {
      await axios.put(`http://localhost:5000/api/admin/orders/${id}`, { status });
      fetchOrders();
      if (selectedOrder && selectedOrder.id === id) setIsModalOpen(false);
    } catch (err) {
      console.error('Failed to update order status:', err);
    }
  };

  const viewOrderDetails = async (id) => {
    try {
      const res = await axios.get(`http://localhost:5000/api/admin/orders/${id}`);
      setSelectedOrder(res.data);
      setIsModalOpen(true);
    } catch (err) {
      console.error('Failed to fetch order details:', err);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const countStatus = (status) => orders.filter(o => o.status === status).length;
  const totalRevenue = orders.reduce((sum, o) => sum + o.total, 0);

  const statusColors = {
    pending: 'bg-yellow-200 text-yellow-800',
    shipped: 'bg-blue-200 text-blue-800',
    delivered: 'bg-green-200 text-green-800',
    cancelled: 'bg-red-200 text-red-800',
  };

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <h2 className="text-3xl font-extrabold mb-6 text-[rgb(128,153,11)]">Orders Overview</h2>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-5 mb-8">
        <div className="bg-white shadow rounded-lg p-5 text-center">
          <p className="text-xl font-semibold">{orders.length}</p>
          <p className="text-gray-600 mt-1">Total Orders</p>
        </div>
        <div className="bg-yellow-100 shadow rounded-lg p-5 text-center">
          <p className="text-xl font-semibold">{countStatus('Pending')}</p>
          <p className="text-yellow-800 mt-1">Pending</p>
        </div>
        <div className="bg-green-100 shadow rounded-lg p-5 text-center">
          <p className="text-xl font-semibold">{countStatus('Completed')}</p>
          <p className="text-green-800 mt-1">Completed</p>
        </div>
        <div className="bg-red-100 shadow rounded-lg p-5 text-center">
          <p className="text-xl font-semibold">{countStatus('Cancelled')}</p>
          <p className="text-red-800 mt-1">Cancelled</p>
        </div>
        <div className="bg-blue-50 shadow rounded-lg p-5 text-center">
          <p className="text-xl font-semibold">Rs.{totalRevenue}.00</p>
          <p className="text-blue-700 mt-1 font-medium">Total Revenue</p>
        </div>
      </div>

      {/* Orders Table */}
      <div className="overflow-x-auto rounded-lg shadow-md border border-gray-200">
        <table className="w-full border-collapse text-center text-sm">
          <thead className="bg-gray-100 text-gray-700 uppercase text-xs select-none">
            <tr>
              <th className="p-3 border-b">Order ID</th>
              <th className="p-3 border-b">Customer</th>
              <th className="p-3 border-b">Date</th>
              <th className="p-3 border-b">Total</th>
              <th className="p-3 border-b">Status</th>
              <th className="p-3 border-b">Actions</th>
            </tr>
          </thead>
          <tbody>
            {orders.map((order) => (
              <tr key={order.id} className="border-t hover:bg-gray-50">
                <td className="p-3">{order.id}</td>
                <td className="p-3 font-semibold">{order.full_name}</td>
                <td className="p-3">{new Date(order.order_date).toLocaleDateString()}</td>
                <td className="p-3">Rs.{order.total}.00</td>
                <td className="p-3">
                  <span className={`inline-block px-3 py-1 rounded-full text-xs font-semibold capitalize ${statusColors[order.status] || 'bg-gray-200 text-gray-700'}`}>
                    {order.status}
                  </span>
                </td>
                <td className="p-3 space-x-2">
                  <button
                    onClick={() => viewOrderDetails(order.id)}
                    className="bg-gray-700 text-white px-4 py-1 rounded hover:bg-gray-800"
                  >
                    View
                  </button>
                  {order.status === 'pending' && (
                    <button
                      onClick={() => updateOrderStatus(order.id, 'shipped')}
                      className="bg-blue-600 text-white px-4 py-1 rounded hover:bg-blue-700"
                    >
                      Mark Shipped
                    </button>
                  )}
                  {order.status === 'shipped' && (
                    <button
                      onClick={() => updateOrderStatus(order.id, 'delivered')}
                      className="bg-green-600 text-white px-4 py-1 rounded hover:bg-green-700"
                    >
                      Mark Delivered
                    </button>
                  )}
                  {order.status !== 'cancelled' && order.status !== 'delivered' && (
                    <button
                      onClick={() => updateOrderStatus(order.id, 'cancelled')}
                      className="bg-red-600 text-white px-4 py-1 rounded hover:bg-red-700"
                    >
                      Cancel
                    </button>
                  )}
                </td>
              </tr>
            ))}
            {orders.length === 0 && (
              <tr>
                <td colSpan="6" className="p-6 text-gray-500">
                  No orders found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Order Detail Modal */}
      {isModalOpen && selectedOrder && (
        <div className="fixed inset-0 backdrop-blur-sm bg-white/30 z-50 flex items-center justify-center">
          <div className="bg-white max-w-2xl w-full rounded-2xl shadow-lg p-6 relative space-y-6">
            <button
              onClick={() => setIsModalOpen(false)}
              className="absolute top-3 right-3 text-gray-500 hover:text-gray-800 text-xl font-bold"
            >
              ×
            </button>

            <h3 className="text-2xl font-bold text-gray-800">
              🧾 Order Details <span className="text-gray-500 text-base">#{selectedOrder.id}</span>
            </h3>

            {/* Customer Info */}
            <div>
              <h4 className="text-lg font-semibold text-gray-700 mb-2">👤 Customer Information</h4>
              <div className="grid grid-cols-2 gap-4 text-sm text-gray-600">
                <p><strong>First Name:</strong> {selectedOrder.buyer_first_name}</p>
                <p><strong>Last Name:</strong> {selectedOrder.buyer_last_name}</p>
                <p><strong>Phone:</strong> {selectedOrder.buyer_phone}</p>
                <p><strong>Full Name:</strong> {selectedOrder.full_name}</p>
              </div>
            </div>

            {/* Order Info */}
            <div>
              <h4 className="text-lg font-semibold text-gray-700 mb-2">📦 Order Summary</h4>
              <div className="grid grid-cols-2 gap-4 text-sm text-gray-600">
                <p>
                  <strong>Status:</strong>{' '}
                  <span className={`font-medium capitalize ${
                    selectedOrder.status === 'cancelled'
                      ? 'text-red-600'
                      : selectedOrder.status === 'delivered'
                      ? 'text-green-600'
                      : 'text-blue-600'
                  }`}>
                    {selectedOrder.status}
                  </span>
                </p>
                <p><strong>Total:</strong> Rs.{selectedOrder.total}.00</p>
                <p><strong>Date Placed:</strong> {new Date(selectedOrder.order_date).toLocaleString()}</p>
                <p><strong>Pickup Location:</strong> {selectedOrder.pickup_location || 'N/A'}</p>
                <p><strong>Pickup Time Slot:</strong> {selectedOrder.pickup_time_slot || 'N/A'}</p>
              </div>
            </div>

            <div className="text-right">
              <button
                onClick={() => setIsModalOpen(false)}
                className="bg-gray-800 text-white px-6 py-2 rounded-lg hover:bg-gray-900"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ManageOrders;
