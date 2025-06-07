import React, { useEffect, useState } from "react";
import axios from "axios";
import { FaArrowRight } from "react-icons/fa";
import { Link } from "react-router-dom";

const ProductCategories = () => {
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    const fetchAndGroup = async () => {
      try {
        const res = await axios.get("http://localhost:5000/api/products");

        // Group products by category
        const grouped = {};
        res.data.forEach((product) => {
          const category = product.category;
          if (!grouped[category]) {
            grouped[category] = {
              name: category,
              items: 0,
              image: product.image, // use the first image found in that category
            };
          }
          grouped[category].items += 1;
        });

        setCategories(Object.values(grouped));
      } catch (err) {
        console.error("Failed to fetch products:", err);
      }
    };

    fetchAndGroup();
  }, []);


  return (
    <section className="py-12 px-6 bg-[url('/images/back.jpg')] bg-cover bg-center bg-no-repeat">
      <div className="text-center">
        <p className="text-[rgb(128,153,11)] font-semibold">WHAT ORGANIC WE PRODUCE</p>
        <h2 className="text-3xl font-bold mt-2">Farming Main Products.</h2>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-6 mt-8">
  {categories.slice(0, 3).map((category, index) => (
    <div
      key={index}
      className="p-6 bg-white shadow-md rounded-lg flex flex-col items-center text-center transition-all duration-300 transform hover:scale-105 hover:bg-green-100 hover:text-[rgb(128,153,11)] hover:shadow-xl"
    >
      <img
        src={`http://localhost:5000/uploads/${category.image}`}
        alt={category.name}
        className="h-20 mb-4 object-contain"
      />
      <h3 className="text-lg font-semibold">{category.name}</h3>
      <p className="text-gray-500">{category.items} Items</p>
      <FaArrowRight className="mt-2 text-gray-500 transition-all duration-300 hover:text-[rgb(128,153,11)] hover:translate-x-1" />
    </div>
  ))}

  <div className="p-6 bg-[rgb(128,153,11)] text-white rounded-lg flex flex-col items-center justify-center text-center cursor-pointer transition-all duration-300 transform hover:scale-105 hover:shadow-xl">
    <h3 className="text-lg font-semibold">
      <Link to="/products" className="hover:underline text-white-700">
        See all categories
      </Link>
    </h3>
    <FaArrowRight className="mt-2 transition-transform duration-300 hover:translate-x-1" />
  </div>
</div>
</section>
  );
};

export default ProductCategories;
