import React, { useEffect, useState } from "react";
import axios from "axios";

const ManageProducts = () => {
  const [products, setProducts] = useState([]);
  const [search, setSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(8);
  const [deleteId, setDeleteId] = useState(null);
  const [loading, setLoading] = useState(false);

  const fetchProducts = async () => {
    setLoading(true);
    try {
      const res = await axios.get("http://localhost:5000/api/products");
      setProducts(res.data);
    } catch (error) {
      console.error("Failed to fetch products:", error);
    }
    setLoading(false);
  };

  const deleteProduct = async (id) => {
    try {
      await axios.delete(`http://localhost:5000/api/products/${id}`);
      setDeleteId(null);
      fetchProducts();
    } catch (error) {
      console.error("Failed to delete product:", error);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  // Filter products by search
  const filteredProducts = products.filter((p) =>
    p.name.toLowerCase().includes(search.toLowerCase())
  );

  // Pagination logic
  const indexOfLast = currentPage * itemsPerPage;
  const indexOfFirst = indexOfLast - itemsPerPage;
  const currentProducts = filteredProducts.slice(indexOfFirst, indexOfLast);
  const totalPages = Math.ceil(filteredProducts.length / itemsPerPage);

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <h2 className="text-3xl font-extrabold mb-6 text-[rgb(128,153,11)]">Manage Products</h2>

      <input
        type="text"
        placeholder="Search products by name..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className="mb-4 w-full max-w-md p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-[rgb(128,153,11)]"
      />

      <div className="overflow-x-auto rounded-lg shadow-md border border-gray-200">
        {loading ? (
          <div className="p-6 text-center text-gray-500">Loading products...</div>
        ) : (
          <table className="w-full text-center text-sm">
            <thead className="bg-green-100 text-gray-700 uppercase text-xs">
              <tr>
                {["ID", "Name", "Price", "Quantity", "Unit", "Category", "Farmer ID", "Actions"].map((header) => (
                  <th key={header} className="p-3">{header}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {currentProducts.length === 0 ? (
                <tr>
                  <td colSpan="8" className="p-6 text-gray-500">
                    No products found.
                  </td>
                </tr>
              ) : (
                currentProducts.map((p) => (
                  <tr
                    key={p.id}
                    className="border-t hover:bg-green-50 transition-colors"
                  >
                    <td className="p-3">{p.id}</td>
                    <td className="p-3 font-semibold">{p.name}</td>
                    <td className="p-3">Rs {p.price.toFixed(2)}</td>
                    <td className="p-3">{p.quantity}</td>
                    <td className="p-3">{p.unit}</td>
                    <td className="p-3">{p.category}</td>
                    <td className="p-3">{p.farmer_id}</td>
                    <td className="p-3 space-x-2">
                      <button
                        onClick={() => setDeleteId(p.id)}
                        className="bg-red-500 px-4 py-1 rounded text-white font-semibold hover:bg-red-600 transition"
                        aria-label={`Delete product ${p.name}`}
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        )}
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex justify-center mt-4 space-x-3">
          {[...Array(totalPages)].map((_, i) => (
            <button
              key={i}
              className={`px-3 py-1 rounded ${
                currentPage === i + 1
                  ? "bg-[rgb(128,153,11)] text-white"
                  : "bg-gray-100 hover:bg-green-100"
              }`}
              onClick={() => setCurrentPage(i + 1)}
              aria-label={`Go to page ${i + 1}`}
            >
              {i + 1}
            </button>
          ))}
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {deleteId && (
        <div className="fixed inset-0 backdrop-blur-sm bg-white/30 z-50 flex items-center justify-center">

          <div className="bg-white p-6 rounded shadow-lg max-w-sm w-full text-center">
            <p className="mb-4 text-lg font-semibold text-gray-700">
              Are you sure you want to delete this product?
            </p>
            <div className="flex justify-center space-x-4">
              <button
                onClick={() => deleteProduct(deleteId)}
                className="bg-red-600 px-4 py-2 rounded text-white hover:bg-red-700 transition"
              >
                Yes, Delete
              </button>
              <button
                onClick={() => setDeleteId(null)}
                className="bg-gray-300 px-4 py-2 rounded hover:bg-gray-400 transition"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ManageProducts;
