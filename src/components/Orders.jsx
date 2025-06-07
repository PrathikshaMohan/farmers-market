import React, { useEffect, useState } from 'react';
import axios from 'axios';

const Orders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [pickupInfo, setPickupInfo] = useState({ location: '', timeSlot: '' });
  const [activePickupOrderId, setActivePickupOrderId] = useState(null);

  const storedUser = JSON.parse(localStorage.getItem('user'));
  const farmerId = storedUser?.id;

  useEffect(() => {
    if (farmerId) fetchOrders();
  }, [farmerId]);

  const fetchOrders = async () => {
    try {
      const res = await axios.get(`http://localhost:5000/api/notifications/orders/${farmerId}`);
      setOrders(res.data);
    } catch (err) {
      console.error('Failed to fetch orders:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = async (orderId) => {
    try {
      await axios.put(`http://localhost:5000/api/orders/${orderId}/status`, { status: 'Cancelled' });
      fetchOrders();
    } catch (err) {
      console.error('Failed to cancel order:', err);
    }
  };

  const handleStatusChange = async (orderId, newStatus) => {
    if (newStatus === 'Ready for Pickup') {
      setActivePickupOrderId(orderId);
      return;
    }

    try {
      await axios.put(`http://localhost:5000/api/orders/${orderId}/status`, { status: newStatus });
      fetchOrders();
    } catch (err) {
      console.error('Failed to update order status:', err);
    }
  };

  const handlePickupSubmit = async () => {
    try {
      await axios.put(`http://localhost:5000/api/orders/${activePickupOrderId}/status`, {
        status: 'Ready for Pickup',
        pickup_location: pickupInfo.location,
        pickup_time_slot: pickupInfo.timeSlot,
      });
      setPickupInfo({ location: '', timeSlot: '' });
      setActivePickupOrderId(null);
      fetchOrders();
    } catch (err) {
      console.error('Failed to update pickup info:', err);
    }
  };

  const statusColor = (status) => {
    switch (status) {
      case 'Cancelled': return '#e74c3c';
      case 'Pending': return '#bdc3c7';
      case 'Accepted': return '#2ecc71';
      case 'Ready for Pickup': return '#f1c40f';
      case 'Completed': return '#2ecc71';

      default: return '#999';
    }
  };

  return (
    <div style={{ padding: '2rem', fontFamily: 'Segoe UI, sans-serif' }}>
      <h2 style={{
        marginBottom: '1.5rem',
        fontSize: '1.875rem',
        fontWeight: '800',
        color: 'rgb(128,153,11)'
      }}>
        Orders
      </h2>

      {loading ? (
        <p>Loading orders...</p>
      ) : orders.length === 0 ? (
        <p>No orders found.</p>
      ) : (
        <table style={{ width: '100%', borderCollapse: 'collapse', backgroundColor: '#fff' }}>
          <thead>
            <tr style={{ backgroundColor: '#f4f6f8', textAlign: 'left' }}>
              <th style={th}>ORDER ID</th>
              <th style={th}>CUSTOMER</th>
              <th style={th}>DATE</th>
              <th style={th}>TOTAL</th>
              <th style={th}>STATUS</th>
              <th style={th}>ACTIONS</th>
            </tr>
          </thead>
          <tbody>
            {orders.map((order) => (
              <React.Fragment key={order.id}>
                <tr>
                  <td style={td}>{order.id}</td>
                  <td style={td}>{order.buyer_first_name} {order.buyer_last_name}</td>
                  <td style={td}>{new Date(order.order_date).toLocaleDateString()}</td>
                  <td style={td}>Rs.{Number(order.total).toFixed(2)}</td>
                  <td style={{ ...td, color: statusColor(order.status) }}>{order.status}</td>
                  <td style={td}>
                    <button style={viewBtn} onClick={() => setSelectedOrder(order)}>View</button>
                    {order.status !== 'Cancelled' && order.status !== 'Completed' && (
  <>
    {order.status !== 'Ready for Pickup' ? (
      <button
        style={{ ...viewBtn, backgroundColor: '#f1c40f' }}
        onClick={() => handleStatusChange(order.id, 'Ready for Pickup')}
      >
        Mark Ready
      </button>
    ) : (
      <button
        style={{ ...viewBtn, backgroundColor: '#2ecc71' }}
        onClick={() => handleStatusChange(order.id, 'Completed')}
      >
        Completed
      </button>
    )}
    <button
      style={cancelBtn}
      onClick={() => handleCancel(order.id)}
    >
      Cancel
    </button>
  </>
)}

                  </td>
                </tr>

                {activePickupOrderId === order.id && (
                  <tr>
                    <td colSpan="6" style={{ backgroundColor: '#f9f9f9', padding: '1rem' }}>
                      <h4>Set Pickup Details for Order #{order.id}</h4>
                      <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap', marginTop: '1rem' }}>
                        <input
                          type="text"
                          placeholder="Pickup Location"
                          value={pickupInfo.location}
                          onChange={(e) => setPickupInfo({ ...pickupInfo, location: e.target.value })}
                          style={{ padding: '0.5rem', flex: 1 }}
                        />
                        <input
                          type="text"
                          placeholder="Pickup Time Slot"
                          value={pickupInfo.timeSlot}
                          onChange={(e) => setPickupInfo({ ...pickupInfo, timeSlot: e.target.value })}
                          style={{ padding: '0.5rem', flex: 1 }}
                        />
                        <button
                          onClick={handlePickupSubmit}
                          style={{
                            backgroundColor: '#2ecc71',
                            color: '#fff',
                            padding: '0.5rem 1rem',
                            border: 'none',
                            borderRadius: '4px',
                            cursor: 'pointer'
                          }}
                        >
                          Submit
                        </button>
                        <button
                          onClick={() => setActivePickupOrderId(null)}
                          style={{
                            backgroundColor: '#ccc',
                            padding: '0.5rem 1rem',
                            border: 'none',
                            borderRadius: '4px',
                            cursor: 'pointer'
                          }}
                        >
                          Cancel
                        </button>
                      </div>
                    </td>
                  </tr>
                )}
              </React.Fragment>
            ))}
          </tbody>
        </table>
      )}

      {selectedOrder && (
        <div style={modalBackdrop}>
          <div style={modalContent}>
            <button
              onClick={() => setSelectedOrder(null)}
              style={modalCloseBtn}
              aria-label="Close modal"
              onMouseOver={e => e.currentTarget.style.color = '#333'}
              onMouseOut={e => e.currentTarget.style.color = '#999'}
            >
              &times;
            </button>

            <h3 style={{ marginBottom: '1rem' }}>Order #{selectedOrder.id} Details</h3>

            <div style={modalSection}>
              <h4>Status</h4>
              <span style={{
                display: 'inline-block',
                padding: '6px 16px',
                borderRadius: '20px',
                backgroundColor: statusColor(selectedOrder.status),
                color: '#fff',
                fontWeight: '600',
                fontSize: '0.95rem'
              }}>
                {selectedOrder.status}
              </span>
            </div>

            <div style={modalSection}>
              <h4>Buyer Information</h4>
              <p><strong>Name:</strong> {selectedOrder.buyer_first_name} {selectedOrder.buyer_last_name}</p>
              <p><strong>Phone:</strong> {selectedOrder.buyer_phone}</p>
            </div>

            <div style={modalSection}>
              <h4>Order Details</h4>
              <p><strong>Date:</strong> {new Date(selectedOrder.order_date).toLocaleString()}</p>
              <p><strong>Total:</strong> Rs.{Number(selectedOrder.total).toFixed(2)}</p>
              <p><strong>Pickup Location:</strong> {selectedOrder.pickup_location || '—'}</p>
              <p><strong>Pickup Time Slot:</strong> {selectedOrder.pickup_time_slot || '—'}</p>
            </div>

            <div style={modalSection}>
              <h4>Products</h4>
              <ul style={productList}>
                {selectedOrder.products.map((product, i) => (
                  <li key={i} style={productItem}>
                    <div><strong>{product.product_name}</strong></div>
                    <div>{product.quantity} {product.unit}</div>
                  </li>
                ))}
              </ul>
            </div>

            <button onClick={() => setSelectedOrder(null)} style={closeBtn}>Close</button>
          </div>
        </div>
      )}
    </div>
  );
};

// Styles
const th = { padding: '1rem', borderBottom: '2px solid #ddd' };
const td = { padding: '1rem', verticalAlign: 'top' };
const viewBtn = {
  padding: '6px 12px',
  backgroundColor: '#80990B',
  color: '#fff',
  border: 'none',
  borderRadius: '4px',
  cursor: 'pointer',
  marginRight: '8px'
};
const cancelBtn = {
  padding: '6px 12px',
  backgroundColor: '#e74c3c',
  color: '#fff',
  border: 'none',
  borderRadius: '4px',
  cursor: 'pointer'
};
const closeBtn = {
  marginTop: '1rem',
  padding: '6px 12px',
  backgroundColor: '#3498db',
  color: '#fff',
  border: 'none',
  borderRadius: '4px',
  cursor: 'pointer'
};
const modalBackdrop = {
  position: 'fixed',
  top: 0, left: 0, right: 0, bottom: 0,
  backgroundColor: 'rgba(0,0,0,0.4)',
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  zIndex: 1000
};
const modalContent = {
  position: 'relative',
  backgroundColor: '#fff',
  padding: '2rem',
  borderRadius: '12px',
  width: '500px',
  maxHeight: '80vh',
  overflowY: 'auto',
  boxShadow: '0 6px 20px rgba(0,0,0,0.2)'
};
const modalCloseBtn = {
  position: 'absolute',
  top: '12px',
  right: '16px',
  background: 'transparent',
  border: 'none',
  fontSize: '1.8rem',
  fontWeight: '700',
  cursor: 'pointer',
  color: '#999',
  transition: 'color 0.3s',
};
const modalSection = {
  marginBottom: '1.5rem',
  paddingBottom: '0.75rem',
  borderBottom: '1px solid #eee',
};
const productList = {
  listStyle: 'none',
  paddingLeft: 0,
  marginTop: 0,
};
const productItem = {
  display: 'flex',
  justifyContent: 'space-between',
  backgroundColor: '#f9f9f9',
  padding: '8px 12px',
  borderRadius: '8px',
  marginBottom: '8px',
  fontSize: '0.95rem',
};

export default Orders;
