import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { jsPDF } from "jspdf"; 
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

const CheckoutPage = () => {
  const [step, setStep] = useState(1);
  const [userId, setUserId] = useState(null);
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(false);
  const [orderSuccess, setOrderSuccess] = useState(false);
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    phone: ""
  });
  const [errors, setErrors] = useState({});
  const navigate = useNavigate();

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("user"));
    if (user?.id) setUserId(user.id);
  }, []);

  useEffect(() => {
    if (!userId) return;
    const fetchCart = async () => {
      try {
        const res = await axios.get(`http://localhost:5000/api/cart/${userId}`);
        setItems(res.data);
      } catch (err) {
        console.error("Cart fetch error:", err);
      }
    };
    fetchCart();
  }, [userId]);

  const validateFields = () => {
    const newErrors = {};
    Object.entries(formData).forEach(([key, value]) => {
      if (!value) newErrors[key] = "Required";
    });
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const total = items.reduce((acc, item) => acc + item.price * item.quantity, 0);

  // PDF Generation Function

  const generatePDF = () => {
  const doc = new jsPDF();

  const lineHeight = 10;
  let y = 20;

  // Header
  doc.setFillColor(128, 153, 11); // Green banner
  doc.rect(0, 0, 210, 15, "F");
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(16);
  doc.text("Order Summary", 105, 10, { align: "center" });

  // Date
  doc.setFontSize(12);
  doc.setTextColor(0);
  y += 20;
  doc.text(`Date: ${new Date().toLocaleString()}`, 150, y, { align: "right" });

  // Customer Info
  y += 10;
  doc.setFont("helvetica", "bold");
  doc.text("Customer Details", 20, y);
  doc.setFont("helvetica", "normal");
  y += lineHeight;
  doc.text(`Name: ${formData.firstName} ${formData.lastName}`, 20, y);
  y += lineHeight;
  doc.text(`Phone: ${formData.phone}`, 20, y);

  // Divider
  y += 10;
  doc.setDrawColor(180);
  doc.line(20, y, 190, y);
  y += 10;

  // Items
  doc.setFont("helvetica", "bold");
  doc.text("Items Ordered", 20, y);
  y += lineHeight;

  doc.setFont("helvetica", "bold");
  doc.text("No.", 20, y);
  doc.text("Item", 30, y);
  doc.text("Qty", 100, y);
  doc.text("Price", 130, y);
  y += 8;

  doc.setFont("helvetica", "normal");
  items.forEach((item, index) => {
    doc.text(`${index + 1}`, 20, y);
    doc.text(item.name, 30, y);
    doc.text(`${item.quantity}`, 100, y);
    doc.text(`Rs. ${item.price.toFixed(2)}`, 130, y);
    y += 6;

    doc.setFontSize(10);
    doc.setTextColor(100);
    doc.text(`Farmer: ${item.farmer_name || "-"}`, 30, y);
    y += 5;
    doc.text(`Phone: ${item.farmer_phone || "-"}`, 30, y);
    y += 5;
    doc.text(`Location: ${item.farmer_location || "-"}`, 30, y);
    y += 8;

    doc.setFontSize(12);
    doc.setTextColor(0);
  });

  // Total
  doc.setFont("helvetica", "bold");
  doc.text(`Total: Rs. ${total.toFixed(2)}`, 150, y, { align: "right" });
  y += 10;

  // Footer
  doc.setFont("helvetica", "italic");
  doc.text("Thank you for your order! We hope to serve you again.", 105, y, { align: "center" });

  doc.save("Order_Summary.pdf");
};


  const handleCheckout = async () => {
    if (!validateFields()) return;

    try {
      setLoading(true);
      const res = await axios.post("http://localhost:5000/api/checkout", {
  user_id: userId,
  payment_method: "Cash on Delivery",
  firstName: formData.firstName,
  lastName: formData.lastName,
  phone: formData.phone
});
      alert(res.data.message);
      setOrderSuccess(true);
      generatePDF();
      setItems([]);
      navigate("/products");
    } catch (err) {
      alert(err.response?.data?.message || "Checkout failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-gray-100 p-6">
        <div className="max-w-6xl mx-auto bg-white shadow-md rounded-lg overflow-hidden grid grid-cols-12">
          <div className="col-span-12 md:col-span-7 p-6">
            <h2 className="text-2xl font-semibold mb-4">Checkout</h2>

            <div className="space-y-4">
              {["Pickup Information", "Shipping method", "Payment", "Place order"].map((label, index) => (
                <div
                  key={index}
                  className={`flex items-center gap-4 ${step === index + 1 ? "font-bold" : "text-gray-500"}`}
                >
                  <span className="w-6 h-6 flex items-center justify-center rounded-full border border-black">
                    {index + 1}
                  </span>
                  <span>{label}</span>
                </div>
              ))}
            </div>

            {step === 1 && (
              <form className="mt-6 space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <input
                      name="firstName"
                      value={formData.firstName}
                      onChange={handleChange}
                      placeholder="First Name"
                      className="w-full border p-2 rounded"
                    />
                    {errors.firstName && <p className="text-red-600 text-sm">{errors.firstName}</p>}
                  </div>
                  <div>
                    <input
                      name="lastName"
                      value={formData.lastName}
                      onChange={handleChange}
                      placeholder="Last Name"
                      className="w-full border p-2 rounded"
                    />
                    {errors.lastName && <p className="text-red-600 text-sm">{errors.lastName}</p>}
                  </div>
                </div>
                <input
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  placeholder="Phone Number"
                  className="w-full border p-2 rounded"
                />
                {errors.phone && <p className="text-red-600 text-sm">{errors.phone}</p>}

                <button
                  type="button"
                  onClick={() => validateFields() && setStep(2)}
                  className="mt-4 w-full bg-[rgb(128,153,11)] text-white py-2 rounded cursor-pointer hover:bg-gray-500"
                >
                  Continue to shipping method
                </button>
              </form>
            )}

            {step === 2 && (
              <div className="mt-6">
                <h3 className="text-lg font-semibold mb-2">Shipping method</h3>
                <p>Pickup</p>
                <div className="flex justify-between mt-4">
                  <button onClick={() => setStep(1)} className="bg-gray-300 px-4 py-2 rounded cursor-pointer">Back</button>
                  <button onClick={() => setStep(3)} className="bg-[rgb(128,153,11)] text-white px-4 py-2 rounded cursor-pointer hover:bg-gray-500">Next</button>
                </div>
              </div>
            )}

            {step === 3 && (
              <div className="mt-6">
                <h3 className="text-lg font-semibold mb-2">Payment</h3>
                <select className="w-full p-2 border rounded">
                  <option>Cash on Pickup</option>
                </select>
                <div className="flex justify-between mt-4">
                  <button onClick={() => setStep(2)} className="bg-gray-300 px-4 py-2 rounded cursor-pointer" >Back</button>
                  <button onClick={() => setStep(4)} className="bg-[rgb(128,153,11)] text-white px-4 py-2 rounded cursor-pointer hover:bg-gray-500">Next</button>
                </div>
              </div>
            )}

            {step === 4 && (
              <div className="mt-6">
                <h3 className="text-lg font-semibold mb-2">Place Order</h3>
                <button
                  onClick={handleCheckout}
                  disabled={items.length === 0 || loading}
                  className="mt-4 w-full bg-[rgb(128,153,11)] hover:bg-gray-500 text-white py-2 rounded"
                >
                  {loading ? "Processing..." : "Place Order"}
                </button>
                <button onClick={() => setStep(3)} className="mt-2 w-full bg-gray-300 text-black py-2 rounded">
                  Back
                </button>
                {orderSuccess && (
  <div className="mt-4">
    <p className="text-[rgb(128,153,11)] font-medium">🎉 Order placed successfully!</p>
    <button
      onClick={generatePDF}
      className="mt-2 w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700"
    >
      Download PDF Summary
    </button>
  </div>
)}

              </div>
            )}
          </div>

          <div className="col-span-12 md:col-span-5 bg-gray-50 p-6">
            <h3 className="text-lg font-semibold mb-4">Summary</h3>
            <div className="space-y-4">
              {items.map((item) => (
                <div key={item.id} className="flex items-center gap-4">
                  <img
                    src={`http://localhost:5000/uploads/${item.image}`}
                    alt={item.name}
                    className="w-16 h-16 object-cover rounded"
                  />
                  <div>
                    <p className="font-semibold">{item.name}</p>
                    <p className="text-sm text-gray-600">{item.quantity} x Rs. {item.price.toFixed(2)}</p>
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-6 border-t pt-4 space-y-2 text-sm">
              <div className="flex justify-between">
                <span>Subtotal</span>
                <span>Rs. {total.toFixed(2)}</span>
              </div>
              
              <hr />
              <div className="flex justify-between font-semibold text-base">
                <span>Total</span>
                <span>Rs. {total.toFixed(2)}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default CheckoutPage;
