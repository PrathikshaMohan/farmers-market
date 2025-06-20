import React, { useEffect, useState } from 'react';
import api from "../api";

const ManageOrders = () => {
  const [orders, setOrders] = useState([]);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const fetchOrders = async () => {
    try {
      const res = await api.get('/admin/orders');
      setOrders(res.data);
    } catch (err) {
      console.error('Failed to fetch orders:', err);
    }
  };

  const updateOrderStatus = async (id, status) => {
    try {
      await api.put(`/admin/orders/${id}`, { status });
      fetchOrders();
      if (selectedOrder && selectedOrder.id === id) setIsModalOpen(false);
    } catch (err) {
      console.error('Failed to update order status:', err);
    }
  };

  const viewOrderDetails = async (id) => {
    try {
      const res = await api.get(`/admin/orders/${id}`);
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
  const totalRevenue = orders.reduce((sum, o) => sum + parseFloat(o.total), 0);


  const statusColors = {
    pending: 'bg-yellow-200 text-yellow-800',
    shipped: 'bg-blue-200 text-blue-800',
    delivered: 'bg-green-200 text-green-800',
    cancelled: 'bg-red-200 text-red-800',
  };

  return (
  <div className="p-4 sm:p-6 max-w-7xl mx-auto">
  <h2 className="text-2xl sm:text-4xl font-extrabold mb-6 text-[rgb(128,153,11)]">
    Orders Overview
  </h2>

  {/* KPI Cards */}
  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 sm:gap-5 mb-8">
    <div className="bg-white shadow rounded-lg p-4 sm:p-5 text-center">
      <p className="text-lg sm:text-2xl font-semibold">{orders.length}</p>
      <p className="text-gray-600 mt-1 text-sm">Total Orders</p>
    </div>
    <div className="bg-yellow-100 shadow rounded-lg p-4 sm:p-5 text-center">
      <p className="text-lg sm:text-2xl font-semibold">{countStatus('Pending')}</p>
      <p className="text-yellow-800 mt-1 text-sm">Pending</p>
    </div>
    <div className="bg-green-100 shadow rounded-lg p-4 sm:p-5 text-center">
      <p className="text-lg sm:text-2xl font-semibold">{countStatus('Completed')}</p>
      <p className="text-green-800 mt-1 text-sm">Completed</p>
    </div>
    <div className="bg-red-100 shadow rounded-lg p-4 sm:p-5 text-center">
      <p className="text-lg sm:text-2xl font-semibold">{countStatus('Cancelled')}</p>
      <p className="text-red-800 mt-1 text-sm">Cancelled</p>
    </div>
    <div className="bg-blue-50 shadow rounded-lg p-4 sm:p-5 text-center">
      <p className="text-lg sm:text-2xl font-semibold">Rs.{totalRevenue}.00</p>
      <p className="text-blue-700 mt-1 font-medium text-sm">Total Revenue</p>
    </div>
  </div>

  {/* Table for desktop */}
  <div className="hidden md:block overflow-x-auto rounded-lg shadow-md border border-gray-200">
    <table className="w-full min-w-[600px] border-collapse text-center text-sm sm:text-base">
      <thead className="bg-gray-100 text-gray-700 uppercase text-xs sm:text-sm">
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
            <td className="p-3 space-x-2 flex flex-wrap justify-center">
              <button onClick={() => viewOrderDetails(order.id)} className="bg-gray-700 text-white px-4 py-1 rounded hover:bg-gray-800 text-sm">View</button>
              {order.status === 'pending' && (
                <button onClick={() => updateOrderStatus(order.id, 'shipped')} className="bg-blue-600 text-white px-4 py-1 rounded hover:bg-blue-700 text-sm">Mark Shipped</button>
              )}
              {order.status === 'shipped' && (
                <button onClick={() => updateOrderStatus(order.id, 'delivered')} className="bg-green-600 text-white px-4 py-1 rounded hover:bg-green-700 text-sm">Mark Delivered</button>
              )}
              {order.status !== 'cancelled' && order.status !== 'delivered' && (
                <button onClick={() => updateOrderStatus(order.id, 'cancelled')} className="bg-red-600 text-white px-4 py-1 rounded hover:bg-red-700 text-sm">Cancel</button>
              )}
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  </div>

  {/* Mobile: Card view */}
  <div className="md:hidden space-y-4">
    {orders.map((order) => (
      <div key={order.id} className="bg-white border rounded-lg p-4 shadow-sm space-y-2">
        <div className="flex justify-between">
          <span className="font-bold">Order ID:</span>
          <span>{order.id}</span>
        </div>
        <div className="flex justify-between">
          <span className="font-bold">Customer:</span>
          <span>{order.full_name}</span>
        </div>
        <div className="flex justify-between">
          <span className="font-bold">Date:</span>
          <span>{new Date(order.order_date).toLocaleDateString()}</span>
        </div>
        <div className="flex justify-between">
          <span className="font-bold">Total:</span>
          <span>Rs.{order.total}.00</span>
        </div>
        <div className="flex justify-between">
          <span className="font-bold">Status:</span>
          <span className={`font-semibold capitalize ${statusColors[order.status] || 'text-gray-700'}`}>
            {order.status}
          </span>
        </div>
        <div className="flex flex-wrap gap-2 mt-2">
          <button onClick={() => viewOrderDetails(order.id)} className="bg-gray-700 text-white px-3 py-1 rounded text-sm w-full">View</button>
          {order.status === 'pending' && (
            <button onClick={() => updateOrderStatus(order.id, 'shipped')} className="bg-blue-600 text-white px-3 py-1 rounded text-sm w-full">Mark Shipped</button>
          )}
          {order.status === 'shipped' && (
            <button onClick={() => updateOrderStatus(order.id, 'delivered')} className="bg-green-600 text-white px-3 py-1 rounded text-sm w-full">Mark Delivered</button>
          )}
          {order.status !== 'cancelled' && order.status !== 'delivered' && (
            <button onClick={() => updateOrderStatus(order.id, 'cancelled')} className="bg-red-600 text-white px-3 py-1 rounded text-sm w-full">Cancel</button>
          )}
        </div>
      </div>
    ))}
  </div>

  {/* Order Modal */}
  {isModalOpen && selectedOrder && (
    <div className="fixed inset-0 backdrop-blur-sm bg-white/30 z-50 flex items-center justify-center p-4">
      <div className="bg-white max-w-2xl w-full rounded-2xl shadow-lg p-6 relative space-y-6 max-h-[90vh] overflow-y-auto">
        <button onClick={() => setIsModalOpen(false)} className="absolute top-3 right-3 text-gray-500 hover:text-gray-800 text-2xl font-bold" aria-label="Close modal">×</button>
        <h3 className="text-2xl font-bold text-gray-800">
          🧾 Order Details <span className="text-gray-500 text-base">#{selectedOrder.id}</span>
        </h3>
        <div>
          <h4 className="text-lg font-semibold text-gray-700 mb-2">👤 Customer Information</h4>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm text-gray-600">
            <p><strong>First Name:</strong> {selectedOrder.buyer_first_name}</p>
            <p><strong>Last Name:</strong> {selectedOrder.buyer_last_name}</p>
            <p><strong>Phone:</strong> {selectedOrder.buyer_phone}</p>
            <p><strong>Full Name:</strong> {selectedOrder.full_name}</p>
          </div>
        </div>
        <div>
          <h4 className="text-lg font-semibold text-gray-700 mb-2">📦 Order Summary</h4>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm text-gray-600">
            <p><strong>Status:</strong> <span className={`font-medium capitalize ${selectedOrder.status === 'cancelled' ? 'text-red-600' : selectedOrder.status === 'delivered' ? 'text-green-600' : 'text-blue-600'}`}>{selectedOrder.status}</span></p>
            <p><strong>Total:</strong> Rs.{selectedOrder.total}.00</p>
            <p><strong>Date Placed:</strong> {new Date(selectedOrder.order_date).toLocaleString()}</p>
            <p><strong>Pickup Location:</strong> {selectedOrder.pickup_location || 'N/A'}</p>
            <p><strong>Pickup Time Slot:</strong> {selectedOrder.pickup_time_slot || 'N/A'}</p>
          </div>
        </div>
        <div className="text-right">
          <button onClick={() => setIsModalOpen(false)} className="bg-gray-800 text-white px-6 py-2 rounded-lg hover:bg-gray-900">
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
