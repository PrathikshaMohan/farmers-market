
import React, { useEffect, useState } from "react";
import api from "../api";
import { Link, useNavigate } from "react-router-dom";
import {
  FaShoppingCart,
  FaUser,
  FaSearch,
  FaChevronRight,
} from "react-icons/fa";
import ProductDetailModal from "../components/ProductDetailModal";
import { useCart } from "../components/CartContext";
import CompactOrdersDropdown from "../components/CompactOrdersDropdown";

const categories = ["All", "Vegetables", "Fruits", "Dairy", "Grains"];

const FreshPage = () => {
  const [products, setProducts] = useState([]);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [orderStatus, setOrderStatus] = useState("Loading...");
  const [searchTerm, setSearchTerm] = useState("");
  const [category, setCategory] = useState("All Categories");
  const [isLoggedIn, setIsLoggedIn] = useState(!!localStorage.getItem("user"));
const [addedProductIds, setAddedProductIds] = useState([]);
const [showStickyAdded, setShowStickyAdded] = useState(false);
const [showModal, setShowModal] = useState(false);
const [orders, setOrders] = useState([]);
const [showOrders, setShowOrders] = useState(false);
  const { cartCount } = useCart();
  const navigate = useNavigate();
const BASE_URL = import.meta.env.VITE_API_URL;
  useEffect(() => {
    api
      .get("/products") //fetch product list
      .then((response) => setProducts(response.data))
      .catch((error) => console.error("Error fetching products:", error));
  }, []);

  useEffect(() => {
  const restoredProduct = localStorage.getItem("pendingProduct"); //restore product after login
  const quantity = localStorage.getItem("pendingQuantity");

  if (restoredProduct) {
    const parsedProduct = JSON.parse(restoredProduct);

    // restore quantity if needed
    parsedProduct.defaultQuantity = quantity || "0.1";

    setSelectedProduct(parsedProduct);
    setShowModal(true);

    // Clean up saved product info
    localStorage.removeItem("pendingProduct");
    localStorage.removeItem("pendingQuantity");
  }
}, []);



  useEffect(() => {
  const user = JSON.parse(localStorage.getItem("user")); //order tracking

  if (!user || !user.id) {
    setOrderStatus("Please log in to track your order.");
    setOrders([]);
    return;
  }

  api
    .get(`/orders/user/${user.id}`)
    .then((res) => {
      console.log("Fetched Orders:", res.data);
      if (res.data && res.data.length > 0) {
        setOrders(res.data);
        const latestOrder = res.data.reduce((latest, order) =>
          new Date(order.order_date) > new Date(latest.order_date) ? order : latest
        );
        setOrderStatus(latestOrder.status);
      } else {
        setOrderStatus("No recent orders");
        setOrders([]);
      }
    })
    .catch((err) => {
      console.error("Error fetching order status:", err);
      setOrderStatus("Failed to fetch order status");
      setOrders([]);
    });
}, []);

  useEffect(() => {
    const handleStorageChange = () => {
      setIsLoggedIn(!!localStorage.getItem("user"));
    };

    window.addEventListener("storage", handleStorageChange);
    return () => window.removeEventListener("storage", handleStorageChange);
  }, []);

  const filteredProducts = products.filter((product) => {
    const matchesCategory =
      category === "All Categories" || category === "All" || product.category === category;
    const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const handleProductClick = (product) => {
    const user = JSON.parse(localStorage.getItem("user"));

    if (!user) {
      localStorage.setItem("redirectAfterLogin", "/products");
      localStorage.setItem("pendingProduct", JSON.stringify(product));
      localStorage.setItem("pendingQuantity", "0.1");
      return navigate("/login");
    }

    setSelectedProduct(product);
    setShowModal(true);
  };

  const handleSearch = () => {};

  return (
    <>
      {/* Header */}
      <header className="bg-[#8FBC8B] text-white p-4 shadow-md">
        <div className="flex flex-col md:flex-row items-center justify-between px-4 md:px-6 py-2 gap-4">

          <h1 className="text-2xl font-bold text-[rgb(128,153,11)]">
            Fresh<span className="text-black">Harvest.</span>
          </h1>

          <div className="w-full md:max-w-xl flex bg-white rounded overflow-hidden">

            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="I'm searching for..."
              className="flex-grow px-4 py-2 text-black outline-none"
            />
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="bg-gray-100 px-3 text-sm text-black border-l"
            >
              <option>All Categories</option>
              <option>Fruits</option>
              <option>Vegetables</option>
              <option>Dairy</option>
              <option>Grains</option>
            </select>
            <button onClick={handleSearch} className="bg-yellow-400 px-4">
              <FaSearch className="text-black" />
            </button>
          </div>

          <div className="flex items-center gap-4 text-white text-lg mt-2 md:mt-0">

            <Link to="/cart" className="relative">
              <FaShoppingCart className="cursor-pointer text-xl hover:text-black" />
              {cartCount > 0 && (
                <span className="absolute -top-2 -right-2 bg-orange-400 text-xs rounded-full px-2 py-0.5">
                  {cartCount}
                </span>
              )}
            </Link>
            {isLoggedIn && (
    <div className="relative">
      <button
        onClick={() => setShowOrders(!showOrders)}
        className="bg-white text-green-700 px-3 py-1 rounded shadow hover:bg-gray-100 text-sm"
      >
        Track My Orders
      </button>

      {showOrders && (
        <div className="absolute right-0 mt-2 bg-white text-black w-80 max-h-[28rem] overflow-y-auto shadow-lg rounded-lg z-50 p-4">
          <h3 className="text-lg font-semibold mb-2 text-center">Your Orders</h3>
          <CompactOrdersDropdown orders={orders} />
          <button
            onClick={() => setShowOrders(false)}
            className="block text-sm text-red-600 hover:underline mt-3 mx-auto"
          >
            Close
          </button>
        </div>
      )}
    </div>
  )}
            {isLoggedIn ? (
              <button
                onClick={() => {
                  localStorage.removeItem("user");
                  setIsLoggedIn(false);
                  navigate("/login");
                }}
                className="flex items-center gap-1 hover:text-black"
              >
                <FaUser />
                <span className="text-sm">Logout</span>
              </button>
            ) : (
              <Link to="/login">
                <FaUser className="cursor-pointer text-xl hover:text-black" />
              </Link>
            )}
          </div>
        </div>

        <nav className="bg-[#8FBC8B] px-4 py-2 flex flex-wrap items-center justify-between text-sm">

          <div className="flex gap-6">
            <div className="relative group cursor-pointer font-semibold">
              Shop All Groceries ▾
              <div className="absolute hidden group-hover:block bg-white text-black mt-2 p-4 shadow-lg rounded z-10">
                <p>Fruits</p>
                <p>Vegetables</p>
                <p>Dairy</p>
              </div>
            </div>
            <Link to="/" className="hover:underline cursor-pointer">Home</Link>
            <Link to="/products" className="hover:underline cursor-pointer">Shop</Link>
          </div>


        </nav>
      </header>

      {/* Banner */}
      <div className="relative w-full h-48 md:h-64 lg:h-80 rounded-xl overflow-hidden">

        <video className="object-cover w-full h-full" autoPlay muted loop>
          <source src="/product.mp4" type="video/mp4" />
          Your browser does not support the video tag.
        </video>
        <div className="absolute inset-0 bg-gradient-to-r from-black/60 via-black/30 to-transparent flex items-center px-8">
          <div className="text-white">
            <h2 className="text-3xl font-semibold mb-2">
              Straight from the field to your doorstep
              <br />Pick freshness. Pick anytime.
            </h2>
            
            <button className="bg-orange-500 hover:bg-orange-600 text-white px-4 py-2 rounded w-fit text-sm">
              Shop Now <FaChevronRight className="inline ml-1" />
            </button>
           
          </div>
        </div>
      </div>

      {/* Main Section */}
      <div className="mt-8 grid grid-cols-1 md:grid-cols-12 gap-6">
  <aside className="md:col-span-3 bg-gray-100 p-4 rounded-lg">

          <h3 className="text-lg font-semibold mb-4">Categories</h3>
          <ul className="space-y-2">
            {categories.map((cat, index) => (
              <li
                key={index}
                onClick={() => setCategory(cat === "All" ? "All Categories" : cat)}
                className={`px-3 py-2 rounded cursor-pointer transition ${
                  (cat === "All" && category === "All Categories") || category === cat
                    ? "bg-white font-bold"
                    : "hover:bg-white"
                }`}
              >
                {cat}
              </li>
            ))}
          </ul>
        </aside>
<div className="md:col-span-9 grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 sm:gap-8">
  {filteredProducts.map((product) => (
    <div
      key={product.id}
      className="bg-white rounded-xl border border-gray-200 shadow-sm hover:shadow-md transition duration-300 p-4 flex flex-col justify-between hover:scale-[1.02] transform"
    >
      <div className="overflow-hidden rounded-md mb-3">
        <img
          src={`${BASE_URL}/uploads/${product.image}`}
          alt={product.name}
          className="h-40 w-full object-cover rounded-md transform transition-transform duration-500 hover:scale-110"
        />
      </div>

      <h4 className="text-base font-semibold text-gray-900 truncate">
        {product.name}
      </h4>

      <p className="mt-1 text-[rgb(128,153,11)] font-semibold text-lg">
        Rs.{product.price} / {product.unit}
      </p>

      <p className="mt-1 text-sm text-gray-700">
        Farmer:{" "}
        <span className="font-semibold">
          {product.farmer_name || "Unknown"}
        </span>
      </p>
      <p className="text-xs text-gray-500">
        Contact: {product.farmer_contact || "N/A"} | Location:{" "}
        {product.farmer_location || "N/A"}
      </p>

      {product.quantity <= 0 ? (
        <p className="text-red-600 font-semibold mt-4 text-center">
          Out of Stock
        </p>
      ) : addedProductIds.includes(product.id) ? (
        <button
          disabled
          className="mt-4 bg-gray-200 text-gray-500 font-semibold py-2 px-4 rounded-lg cursor-not-allowed w-full transition duration-300"
        >
          Product Added
        </button>
      ) : (
        <button
          onClick={() => handleProductClick(product)}
          className="mt-4 bg-[rgb(128,153,11)] hover:bg-gray-500 text-white font-medium py-2 px-4 rounded-lg w-full transition duration-300 active:scale-95"
        >
          Add to Cart
        </button>
      )}
    </div>
  ))}
</div>


      </div>

      {selectedProduct && showModal && (
  <ProductDetailModal
    product={selectedProduct}
    isOpen={showModal}
    onClose={() => setShowModal(false)}
    onProductAdded={(id) => {
      setAddedProductIds((prev) => [...prev, id]);
      setShowStickyAdded(true);
    }}
  />
)}
{showStickyAdded && (
  <div
    onClick={() => navigate("/cart")}
    style={{
      position: "fixed",
      bottom: "20px",
      right: "20px",
      backgroundColor: "rgb(128,153,11)",
      color: "white",
      padding: "12px 24px",
      borderRadius: "30px",
      boxShadow: "0 4px 8px rgba(0, 0, 0, 0.2)",
      fontWeight: "600",
      fontSize: "14px",
      cursor: "pointer",
      zIndex: 9999,
      userSelect: "none",
      transition: "background-color 0.3s ease",
      textAlign: "center",
      maxWidth: "220px",
    }}
    onMouseEnter={e => e.currentTarget.style.backgroundColor = "rgb(100,120,8)"}
    onMouseLeave={e => e.currentTarget.style.backgroundColor = "rgb(128,153,11)"}
  >
    Product added to cart - Go to Cart
  </div>
)}


    </>
  );
};

export default FreshPage;
