import React, { useEffect, useState } from 'react';
import api from "../api";
import jsPDF from 'jspdf';
import 'jspdf-autotable';


const MarketPrice = ({role}) => {

  const [prices, setPrices] = useState([]);
  const [form, setForm] = useState({
    product_name: '',
    location: '',
    price_per_kg: '',
    category: '',
  });
  const [editingId, setEditingId] = useState(null);
  const [filter, setFilter] = useState('all');

  useEffect(() => {
    fetchPrices(filter);
  }, [filter]);

  const fetchPrices = async (selectedDate) => {
    try {
      const url = `/market-prices${selectedDate !== 'all' ? `?date=${selectedDate}` : ''}`;
      const res = await api.get(url);
      setPrices(res.data);
    } catch (error) {
      console.error('Error fetching market prices:', error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingId) {
        await api.put(`/market-prices/${editingId}`, form);
      } else {
        await api.post('/market-prices', form);
      }
      setForm({ product_name: '', location: '', price_per_kg: '', category: '' });
      setEditingId(null);
      fetchPrices(filter);
    } catch (error) {
      console.error('Error saving market price:', error);
    }
  };

  const handleEdit = (item) => {
    setForm({
      product_name: item.product_name,
      location: item.location,
      price_per_kg: item.price_per_kg,
      category: item.category || '',
    });
    setEditingId(item.id);
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this entry?')) {
      try {
        await api.delete(`/market-prices/${id}`);
        fetchPrices(filter);
      } catch (error) {
        console.error('Error deleting market price:', error);
      }
    }
  };

  const generateAdminPDF = () => {
    const doc = new jsPDF();
    doc.setTextColor(128, 153, 11);
    doc.setFontSize(16);
    doc.text('DAILY MARKET PRICE REPORT', 14, 15);
    doc.setFontSize(12);
    doc.text(`Generated: ${new Date().toLocaleDateString('en-GB')}`, 14, 23);

    const grouped = prices.reduce((acc, item) => {
      let cat = item.category || 'Other';
      if (item.product_name.toLowerCase().includes('rice')) {
        cat = 'Grain';
      }
      if (!acc[cat]) acc[cat] = [];
      acc[cat].push(item);
      return acc;
    }, {});

    let currentY = 30;

    Object.entries(grouped).forEach(([category, items]) => {
      doc.setFontSize(13);
      doc.setTextColor(128, 153, 11);
      doc.text(category.toUpperCase(), 14, currentY);
      currentY += 5;

      const tableData = items.map((item) => [
        item.product_name,
        item.location,
        `Rs. ${item.price_per_kg}`,
        new Date(item.date).toLocaleDateString("en-GB"),
      ]);

      doc.autoTable({
        startY: currentY,
        head: [["Product", "Location", "Price (Rs/kg)", "Date"]],
        body: tableData,
        styles: { fontSize: 10, textColor: [128, 153, 11] },
        headStyles: { fillColor: [200, 220, 120], textColor: [0, 0, 0] },
        theme: 'grid',
        margin: { left: 14, right: 14 },
        didDrawPage: (data) => {
          currentY = data.cursor.y + 10;
        }
      });
    });

    doc.save(`market_report_admin_${new Date().toISOString().split("T")[0]}.pdf`);
  };

  const generateFarmerPDF = () => {
  const doc = new jsPDF();
  doc.setTextColor(128, 153, 11);
  doc.setFontSize(16);
  doc.text('TODAY’S MARKET PRICES', 14, 15);
  doc.setFontSize(12);

  const today = new Date();
  const todayStr = today.toLocaleDateString('en-CA');
  doc.text(`Date: ${today.toLocaleDateString('en-GB')}`, 14, 23);

  const filtered = prices.filter(item => {
    const itemDate = new Date(item.date).toLocaleDateString('en-CA');
    return itemDate === todayStr;
  });

  if (filtered.length === 0) {
    alert("No data available for today.");
    return;
  }

  // Group by category
  const groupedByCategory = {};
  filtered.forEach(item => {
    if (!groupedByCategory[item.category]) {
      groupedByCategory[item.category] = [];
    }
    groupedByCategory[item.category].push([
      item.product_name,
      item.location,
      `Rs. ${item.price_per_kg}`
    ]);
  });

  let yPos = 30;

  for (const [category, tableData] of Object.entries(groupedByCategory)) {
    doc.setFontSize(13);
    doc.text(`Category: ${category}`, 14, yPos);
    yPos += 5;

    doc.autoTable({
      startY: yPos,
      head: [["Product", "Location", "Price (Rs/kg)"]],
      body: tableData,
      styles: { fontSize: 10, textColor: [128, 153, 11] },
      headStyles: { fillColor: [200, 220, 120], textColor: [0, 0, 0] },
      theme: 'grid',
      margin: { left: 14, right: 14 },
      didDrawPage: (data) => { yPos = data.cursor.y + 10; }
    });
  }

  doc.save(`today_market_prices_${todayStr}.pdf`);
};

const generateYesterdayFarmerPDF = () => {
  const doc = new jsPDF();
  doc.setTextColor(128, 153, 11);
  doc.setFontSize(16);
  doc.text('YESTERDAY’S MARKET PRICES', 14, 15);
  doc.setFontSize(12);

  const yesterday = new Date();
  yesterday.setDate(yesterday.getDate() - 1);
  const yesterdayStr = yesterday.toLocaleDateString('en-CA');
  doc.text(`Date: ${yesterday.toLocaleDateString('en-GB')}`, 14, 23);

  const filtered = prices.filter(item => {
    const itemDate = new Date(item.date).toLocaleDateString('en-CA');
    return itemDate === yesterdayStr;
  });

  if (filtered.length === 0) {
    alert("No data available for yesterday.");
    return;
  }

  // Group by category
  const groupedByCategory = {};
  filtered.forEach(item => {
    if (!groupedByCategory[item.category]) {
      groupedByCategory[item.category] = [];
    }
    groupedByCategory[item.category].push([
      item.product_name,
      item.location,
      `Rs. ${item.price_per_kg}`
    ]);
  });

  let yPos = 30;

  for (const [category, tableData] of Object.entries(groupedByCategory)) {
    doc.setFontSize(13);
    doc.text(`Category: ${category}`, 14, yPos);
    yPos += 5;

    doc.autoTable({
      startY: yPos,
      head: [["Product", "Location", "Price (Rs/kg)"]],
      body: tableData,
      styles: { fontSize: 10, textColor: [128, 153, 11] },
      headStyles: { fillColor: [200, 220, 120], textColor: [0, 0, 0] },
      theme: 'grid',
      margin: { left: 14, right: 14 },
      didDrawPage: (data) => { yPos = data.cursor.y + 10; }
    });
  }

  doc.save(`yesterday_market_prices_${yesterdayStr}.pdf`);
};



  return (
    <div className="p-6 max-w-6xl mx-auto">
      <h1 className="text-3xl font-extrabold mb-6 text-[rgb(128,153,11)]">🛒 Market Prices</h1>

      <div className="flex gap-3 mb-6">
        {['all', 'today', 'yesterday'].map((d) => (
          <button
            key={d}
            onClick={() => setFilter(d)}
            className={`px-5 py-2 rounded-full border transition-colors duration-300 ${
              filter === d
                ? 'bg-[rgb(128,153,11)] text-white border-[rgb(128,153,11)]'
                : 'bg-white text-gray-700 border-gray-300 hover:bg-[rgb(128,153,11)] hover:text-white'
            }`}
          >
            {d.charAt(0).toUpperCase() + d.slice(1)}
          </button>
        ))}
      </div>

      <div className="mb-6">
        {role === 'admin' && prices.length > 0 && (
          <button
            onClick={generateAdminPDF}
            className="mr-5 bg-[rgb(64,85,13)] text-white px-6 py-3 rounded-lg font-semibold hover:bg-[rgb(128,153,11)] transition-colors duration-300 shadow-md"
          >
            📄 Download Full Admin Report
          </button>
        )}

{role === 'farmer' && prices.length > 0 && (
  <div className="flex gap-4">
    <button
      onClick={generateFarmerPDF}
      className="bg-[rgb(128,153,11)] text-white px-6 py-3 rounded-lg font-semibold hover:bg-[rgb(64,85,13)] transition-colors duration-300 shadow-md"
    >
      📄 Download Today’s Prices
    </button>
    <button
      onClick={generateYesterdayFarmerPDF}
      className="bg-[rgb(64,85,13)] text-white px-6 py-3 rounded-lg font-semibold hover:bg-[rgb(128,153,11)] transition-colors duration-300 shadow-md"
    >
      📄 Download Yesterday’s Prices
    </button>
  </div>
)}



      </div>

      {role === 'admin' && (
        <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-5 gap-5 mb-8">
          <input
            type="text"
            placeholder="Product Name"
            value={form.product_name}
            onChange={(e) => setForm({ ...form, product_name: e.target.value })}
            className="p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[rgb(128,153,11)]"
            required
          />
          <input
            type="text"
            placeholder="Location"
            value={form.location}
            onChange={(e) => setForm({ ...form, location: e.target.value })}
            className="p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[rgb(128,153,11)]"
            required
          />
          <input
            type="number"
            step="0.01"
            placeholder="Price per KG"
            value={form.price_per_kg}
            onChange={(e) => setForm({ ...form, price_per_kg: e.target.value })}
            className="p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[rgb(128,153,11)]"
            required
          />
          <input
            type="text"
            placeholder="Category (e.g. Grain, Vegetable)"
            value={form.category}
            onChange={(e) => setForm({ ...form, category: e.target.value })}
            className="p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[rgb(128,153,11)]"
          />
          <button
            type="submit"
            className="bg-[rgb(128,153,11)] text-white px-5 py-3 rounded-lg font-semibold hover:bg-gray-700 transition-colors duration-300 shadow-md"
          >
            {editingId ? 'Update' : 'Add'}
          </button>
        </form>
      )}

      <div className="overflow-x-auto rounded-lg shadow-lg border border-gray-200">
        <table className="min-w-full bg-white rounded-lg">
          <thead className="bg-[rgb(128,153,11)] text-white">
            <tr>
              <th className="py-3 px-5 text-left rounded-tl-lg">Product</th>
              <th className="py-3 px-5 text-left">Location</th>
              <th className="py-3 px-5 text-left">Price (Rs/kg)</th>
              {role === 'admin' && <th className="py-3 px-5 text-left">Category</th>}
              <th className="py-3 px-5 text-left">Date</th>
              {role === 'admin' && <th className="py-3 px-5 text-center rounded-tr-lg">Actions</th>}
            </tr>
          </thead>
          <tbody>
            {prices.length === 0 ? (
              <tr>
                <td colSpan={role === 'admin' ? 6 : 5} className="text-center py-6 text-gray-500 italic">
                  No records found.
                </td>
              </tr>
            ) : (
              prices.map((item) => (
                <tr key={item.id} className="border-b hover:bg-gray-50">
                  <td className="py-3 px-5">{item.product_name}</td>
                  <td className="py-3 px-5">{item.location}</td>
                  <td className="py-3 px-5">Rs. {item.price_per_kg}</td>
                  {role === 'admin' && <td className="py-3 px-5">{item.category}</td>}
                  <td className="py-3 px-5">{new Date(item.date).toLocaleDateString('en-GB')}</td>
                  {role === 'admin' && (
                    <td className="py-3 px-5 text-center">
                      <button
                        onClick={() => handleEdit(item)}
                        className="text-blue-600 hover:underline mr-3"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDelete(item.id)}
                        className="text-red-600 hover:underline"
                      >
                        Delete
                      </button>
                    </td>
                  )}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default MarketPrice;
