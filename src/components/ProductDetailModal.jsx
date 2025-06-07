import React, { useEffect, useState } from "react";
import { FaMinus, FaPlus } from "react-icons/fa";
import { useCart } from "./CartContext";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const ProductDetailModal = ({ product, isOpen, onClose, onProductAdded }) => {

  const [quantity, setQuantity] = useState(0.1);
  const { increment } = useCart();
  const navigate = useNavigate();

  const getUnitForProduct = (name) => {
    const lower = name.toLowerCase();
    if (lower.includes("milk") || lower.includes("juice") || lower.includes("water")) return "liter";
    if (lower.includes("egg") || lower.includes("piece") || lower.includes("fruit")) return "piece";
    return "kg"; // Default for vegetables/grains/etc.
  };

  const displayUnit = product.unit || getUnitForProduct(product.unit);
  const [isAddedToCart, setIsAddedToCart] = useState(false);

  const handleAddToCart = async () => {
    

  const user = JSON.parse(localStorage.getItem("user"));

  if (!user) {
    localStorage.setItem("redirectAfterLogin", "/products");
    localStorage.setItem("pendingProduct", JSON.stringify(product));
    localStorage.setItem("pendingQuantity", quantity.toString());
    return (window.location.href = "/login");
  }

  try {
    await axios.post("http://localhost:5000/api/cart/add", {
      user_id: user.id,
      product_id: product.id,
      quantity: parseFloat(quantity.toFixed(1)),
      unit: displayUnit
    });

    increment();               // update cart count
    setIsAddedToCart(true);    // update button state
    onProductAdded(product.id); 
    setTimeout(() => {
  onClose();
}, 2000);

  } catch (err) {
    console.error("Error adding to cart:", err.response?.data || err.message);
  }
};

 
  const isDecimalAllowed = displayUnit === "kg";
  const step = isDecimalAllowed ? 0.1 : 1;
  const minQuantity = isDecimalAllowed ? 0.1 : 1;

  return (
    <div className="fixed inset-0 backdrop-blur-sm bg-white/30 z-50 flex items-center justify-center">
      <div className="bg-white flex rounded-lg max-w-4xl w-full overflow-hidden">
        {/* Left - Image */}
        <div className="w-1/2 p-6 bg-gray-100 flex justify-center items-center">
          <img
            src={`http://localhost:5000/uploads/${product.image}`}
            alt={product.name}
            className="rounded w-64 h-64 object-cover"
          />
        </div>

        {/* Right - Details */}
        <div className="w-1/2 p-6">
         <button
  onClick={() => {
    console.log("Modal close button clicked");
    onClose();
  }}
  className="text-gray-500 float-right text-xl"
>
  ×
</button>

          <h2 className="text-xl font-bold mb-2">{product.name}</h2>
          <p className="text-sm text-gray-400 mb-2">SKU: {product.id}</p>
          <div className="text-lg mb-2">
            <span className="text-red-500 font-semibold">Rs {product.price}</span>
            <span className="line-through text-gray-400 ml-2 text-sm">
              Rs {(product.price * 1.1).toFixed(2)}
            </span>
          </div>

          <p className="text-sm text-gray-600 mb-4">
            Available: {product.quantity} {displayUnit}
          </p>

          <div className="flex items-center gap-4 mb-6">
            <span className="font-semibold">Quantity</span>
            <div className="flex items-center border rounded px-2 py-1">
              <button
                onClick={() =>
                  setQuantity((prev) => {
                    let newQuantity = prev - step;
                    if (newQuantity < minQuantity) newQuantity = minQuantity;
                    return isDecimalAllowed
                      ? parseFloat(newQuantity.toFixed(1))
                      : Math.floor(newQuantity);
                  })
                }
              >
                <FaMinus className="text-sm" />
              </button>

              <span className="px-4">
                {isDecimalAllowed ? quantity.toFixed(1) : Math.floor(quantity)} {displayUnit}
              </span>

              <button
                onClick={() =>
                  setQuantity((prev) => {
                    let newQuantity = prev + step;
                    if (newQuantity > product.quantity) newQuantity = product.quantity;
                    return isDecimalAllowed
                      ? parseFloat(newQuantity.toFixed(1))
                      : Math.floor(newQuantity);
                  })
                }
              >
                <FaPlus className="text-sm" />
              </button>
            </div>
          </div>


          <button
  onClick={handleAddToCart}
  disabled={isAddedToCart}
  className={`mt-4 w-full px-4 py-2 text-white text-sm rounded ${
    isAddedToCart ? "bg-[rgb(128,153,11)] cursor-default" : "bg-red-500 hover:bg-gray-500"
  }`}
>
  {isAddedToCart ? "Product Added" : "Add to Cart"}
</button>


        </div>
      </div>
    </div>
  );
};

export default ProductDetailModal;
