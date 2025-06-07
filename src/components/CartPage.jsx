import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { Trash2 } from "lucide-react";
import Navbar from "../components/Navbar"; 
import Footer from "../components/Footer";

const CartPage = () => {
  const [cartItems, setCartItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const fetchCart = () => {
    const user = JSON.parse(localStorage.getItem("user"));
    if (!user) return navigate("/login");

    axios
      .get(`http://localhost:5000/api/cart/${user.id}`)
      .then((res) => {
        setCartItems(res.data);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Error fetching cart items:", err);
        setLoading(false);
      });
  };

  useEffect(() => {
    fetchCart();
  }, []);

  const updateQuantity = (itemId, newQty) => {
    if (newQty < 1) return;
    axios
      .put(`http://localhost:5000/api/cart/update`, {
        item_id: itemId,
        quantity: newQty,
      })
      .then(() => fetchCart())
      .catch((err) => console.error("Update quantity error:", err));
  };

  const removeItem = (itemId) => {
    axios
      .delete(`http://localhost:5000/api/cart/${itemId}`)
      .then(() => fetchCart())
      .catch((err) => console.error("Remove item error:", err));
  };

  const totalPrice = cartItems.reduce(
    (total, item) => total + item.price * item.quantity,
    0
  );
 
  if (loading)
    return <p className="text-center mt-10 text-gray-600">Loading cart...</p>;

  if (cartItems.length === 0)
    return (
      <>
        <Navbar />
        <div className="p-6 text-center min-h-screen bg-gray-100 ">
          <h2 className="text-2xl font-bold mb-4">🛒 Your Cart is Empty</h2>
          <button
            onClick={() => navigate("/products")}
            className="bg-[rgb(128,153,11)] hover:bg-lime-700 text-white px-5 py-2 rounded-lg"
          >
            Browse Products
          </button>
        </div>
        <Footer />
      </>
    );

  return (
    <>
      <Navbar />
      <div className="max-w-5xl mx-auto p-6 min-h-screen">
        <h2 className="text-3xl font-bold text-center mb-8">🛒 Your Cart</h2>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse shadow-md rounded-md">
            <thead className="bg-[rgb(128,153,11)] text-white">
              <tr>
                <th className="px-4 py-3">Product</th>
                <th className="px-4 py-3">Quantity</th>
                <th className="px-4 py-3">Subtotal</th>
              </tr>
            </thead>
            <tbody className="bg-white">
              {cartItems.map((item) => (
                <tr
                  key={item.id}
                  className="border-b hover:bg-gray-50 transition-all duration-200"
                >
                  <td className="px-4 py-3 flex items-center gap-4">
                    <img
                      src={`http://localhost:5000/uploads/${item.image}`}
                      alt={item.name}
                      className="w-16 h-16 object-cover rounded"
                    />
                    <div>
                      <p className="font-semibold">{item.name}</p>
                      <p className="text-sm text-gray-600">Price: Rs {item.price.toFixed(2)}</p>
                      <button
                        className="text-red-600 text-sm hover:underline mt-1"
                        onClick={() => removeItem(item.id)}
                      >
                        Remove
                      </button>
                    </div>
                  </td>
                  <td className="px-4 py-3 flex items-center gap-2">
  <input
    type="number"
    min={item.unit === "kg" || item.unit === "liter" ? 0.1 : 1}
    step={item.unit === "kg" || item.unit === "liter" ? 0.1 : 1}
    value={item.quantity}
    onChange={(e) =>
      updateQuantity(item.id, item.unit === "kg" || item.unit === "liter"
        ? parseFloat(e.target.value)
        : parseInt(e.target.value))
    }
    className="w-20 border rounded px-2 py-1"
  />
  <span className="text-sm text-gray-600">{item.unit}</span>
</td>

                  <td className="px-4 py-3 font-medium text-gray-700">
                    Rs {(item.quantity * item.price).toFixed(2)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="mt-8 max-w-sm ml-auto bg-white p-6 rounded shadow-md text-gray-700">
  <div className="flex justify-between mb-3">
    <span className="font-medium">Subtotal</span>
    <span>Rs {totalPrice.toFixed(2)}</span>
  </div>
  <div className="flex justify-between font-bold text-lg border-t pt-3">
    <span>Total</span>
    <span>Rs {totalPrice.toFixed(2)}</span>
  </div>
  <button
    onClick={() => navigate("/checkout")}
    className="mt-6 w-full bg-[rgb(128,153,11)] hover:bg-lime-700 text-white py-3 rounded-lg font-semibold"
  >
    Proceed to checkout →
  </button>
</div>

      </div>
      <Footer />
    </>
  );
};

export default CartPage;
