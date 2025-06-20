import React, { useEffect, useState, useRef } from "react";
import api from "../api";

const Listing = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingProductId, setEditingProductId] = useState(null);
  const [formData, setFormData] = useState({
    name: "",
    price: "",
    quantity: "",
    unit: "",
    image: null,
    category: "",
  });
  
  const [imagePreview, setImagePreview] = useState(null);
  const BASE_URL = import.meta.env.VITE_API_URL;

  
  
  const fileInputRef = useRef(null); // to reset file input
  const user = JSON.parse(localStorage.getItem("user"));
const farmer_id = user?.id;

  if (!farmer_id) {
    console.error("No farmer ID found. Please log in again.");
    // Optional: redirect to login or show error
  }
  console.log("Farmer ID:", farmer_id);
  useEffect(() => {
    if (farmer_id) {
      fetchProducts();
    }
  }, [farmer_id]);

  const fetchProducts = async () => {
    try {
      const res = await api.get(`/products/farmer/${Number(farmer_id)}`);
    console.log("Fetched products:", res.data); // 👈 Add this
      setProducts(res.data);
    } catch (err) {
      console.error("Error fetching products:", err);
    } finally {
      setLoading(false);
    }
  }
  
  

  const handleInputChange = (e) => {
    const { name, value, files } = e.target;

    if (name === "image") {
      setFormData((prevData) => ({
        ...prevData,
        image: files[0],
      }));
      setImagePreview(URL.createObjectURL(files[0]));
    } else {
      setFormData((prevData) => ({
        ...prevData,
        [name]: value,
      }));
    }
  };

  const handleAddProduct = async (e) => {
  e.preventDefault();

  const data = new FormData();
  data.append("name", formData.name);
  data.append("price", formData.price);
  data.append("quantity", formData.quantity);
  data.append("farmer_id", String(farmer_id));
  data.append("unit", formData.unit);
  data.append("category", formData.category);

  if (formData.image) {
    data.append("image", formData.image);
  }

  try {
    if (editingProductId) {
      // Edit existing product
      await api.put(`/products/${editingProductId}`, data, {
        headers: { "Content-Type": "multipart/form-data" },
      });
    } else {
      // Add new product
      await api.post("/products", data, {
        headers: { "Content-Type": "multipart/form-data" },
      });
    }

    fetchProducts();  // Refresh product list after add/edit
    resetForm();      // Clear form inputs

  } catch (err) {
    if (err.response) {
    // Server responded with a status code out of 2xx
    console.error("Response error:", err.response.data);
  } else if (err.request) {
    // Request was made but no response received
    console.error("No response received:", err.request);
  } else {
    // Something else happened
    console.error("Error setting up request:", err.message);
  }
  }
};

  const handleUpdateProduct = async (e) => {
    e.preventDefault();
  
    if (!editingProductId) return;
  
    const data = new FormData();
    data.append("name", formData.name);
    data.append("price", formData.price);
    data.append("quantity", formData.quantity);
    data.append("unit",formData.unit);
    data.append("category", formData.category);

    if (formData.image instanceof File) {
      data.append("image", formData.image); // Only append new image if selected
    }
  
    try {
      await api.put(`/products/${editingProductId}`, data, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
  
      fetchProducts(); // Refresh product list
      resetForm(); // Clear form and editing state
    } catch (err) {
      console.error("Error updating product:", err);
    }
  };
  
  
  const handleDelete = async (id) => {
    try {
      await api.delete(`/products/${id}`);
      fetchProducts(); // Refresh product list
    } catch (err) {
      console.error("Error deleting product:", err);
    }
  };

  const handleEditClick = (product) => {
    setEditingProductId(product.id);
  setFormData({
    name: product.name,
    price: product.price,
    quantity: product.quantity,
    unit: product.unit,
    
    image: null, // don't auto fill image
    category: product.category || "",
  });
  setImagePreview(`${BASE_URL}/uploads/${product.image}`);
};
  
  
const resetForm = () => {
  setFormData({ name: "", price: "", quantity: "", unit: "", category: "", image: null });
  setImagePreview(null);
  setEditingProductId(null);
  if (fileInputRef.current) fileInputRef.current.value = null;
};


  return (
  <div className="p-6 max-w-7xl mx-auto">
    <h2 className="text-3xl font-extrabold mb-6 text-[rgb(128,153,11)]">
      {editingProductId ? "Edit Product" : "Add New Product"}
    </h2>

    <form
      onSubmit={editingProductId ? handleUpdateProduct : handleAddProduct}
      className="grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 bg-white p-6 rounded-xl shadow-lg border border-[rgb(128,153,11)]"
    >
      <input
        type="text"
        name="name"
        placeholder="Product Name"
        value={formData.name}
        onChange={handleInputChange}
        required
        className="p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-4 focus:ring-[rgb(128,153,11)] transition"
      />

      <input
        type="number"
        name="price"
        placeholder="Price (Rs.)"
        value={formData.price}
        onChange={handleInputChange}
        required
        className="p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-4 focus:ring-[rgb(128,153,11)] transition"
      />

      <input
        type="number"
        name="quantity"
        value={formData.quantity}
        onChange={handleInputChange}
        placeholder="Quantity"
        required
        className="p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-4 focus:ring-[rgb(128,153,11)] transition"
      />

      <select
        name="unit"
        value={formData.unit}
        onChange={handleInputChange}
        required
        className="p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-4 focus:ring-[rgb(128,153,11)] transition"
      >
        <option value="select" disabled>
          Select Unit
        </option>
        <option value="kg">kg</option>
        <option value="piece">piece</option>
        <option value="liters">liters</option>
      </select>

      <select
        name="category"
        value={formData.category}
        onChange={handleInputChange}
        required
        className="p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-4 focus:ring-[rgb(128,153,11)] transition"
      >
        <option value="" disabled>
          Select Category
        </option>
        <option value="Fruits">Fruit</option>
        <option value="Vegetables">Vegetable</option>
        <option value="Dairy">Dairy</option>
        <option value="Grains">Grain</option>
      </select>

      <input
        type="file"
        name="image"
        accept="image/*"
        ref={fileInputRef}
        onChange={handleInputChange}
        className="col-span-1 sm:col-span-2 file:border file:p-3 file:rounded file:bg-[rgb(128,153,11)] file:text-white file:font-semibold cursor-pointer transition"
      />

      {imagePreview && (
        <img
          src={imagePreview}
          alt="Preview"
          className="w-full h-32 object-cover rounded-lg col-span-1 sm:col-span-2 transition-shadow duration-300 shadow-md"
        />
      )}

      <div className="flex gap-4 sm:col-span-2 lg:col-span-3 justify-start">
        <button
          type="submit"
          className="bg-[rgb(128,153,11)] cursor-pointer hover:bg-gray-500 text-white px-6 py-3 rounded-lg font-semibold shadow-md transition-all"
        >
          {editingProductId ? "Update Product" : "Add Product"}
        </button>

        {editingProductId && (
          <button
            type="button"
            onClick={resetForm}
            className="bg-gray-500 hover:bg-gray-600 text-white px-6 py-3 rounded-lg font-semibold shadow-md transition-all"
          >
            Cancel
          </button>
        )}
      </div>
    </form>

    <h2 className="text-3xl font-extrabold mt-12 mb-6 text-[rgb(128,153,11)]">
      My Listings
    </h2>

    {loading ? (
      <p className="text-gray-600 italic">Loading products...</p>
    ) : products.length === 0 ? (
      <p className="text-gray-600 italic">No products listed yet.</p>
    ) : (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
        {products.map((product) => (
          <div
            key={product.id}
            className="bg-white rounded-xl shadow-lg border border-gray-200 hover:shadow-2xl transition-shadow duration-300 overflow-hidden flex flex-col"
          >
            <img
              src={`${BASE_URL}/uploads/${product.image}`}
              alt={product.name}
              className="w-full h-48 object-cover"
            />
            <div className="p-5 flex flex-col flex-grow">
              <h3 className="text-xl font-semibold mb-1 text-[rgb(64,85,13)]">
                {product.name}
              </h3>
              <p className="text-gray-700 mb-1">
                Price: <span className="font-semibold">Rs. {product.price}</span>
              </p>
              <p className="text-gray-700 mb-1">
                Quantity: <span className="font-semibold">{product.quantity} {product.unit}</span>
              </p>
              <p className="text-gray-700 mb-3">
                Category: <span className="font-semibold">{product.category}</span>
              </p>

              <div className="mt-auto flex gap-3">
                <button
                  onClick={() => handleEditClick(product)}
                  className="flex-1 bg-yellow-500 hover:bg-yellow-600 text-white px-4 py-2 rounded-lg font-semibold transition"
                >
                  Edit
                </button>
                <button
                  onClick={() => handleDelete(product.id)}
                  className="flex-1 bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg font-semibold transition"
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    )}
  </div>
);

};

export default Listing;
