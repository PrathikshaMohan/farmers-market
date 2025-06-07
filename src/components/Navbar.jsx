import React from "react";
import { FaPhoneAlt } from "react-icons/fa";
import { Link } from "react-router-dom";
import AccountDropdown from "./Dropdown";

const Navbar = () => {
  return (
    <nav className="flex justify-between items-center px-8 py-4 shadow-md bg-white">
      <h1 className="text-2xl font-bold text-[rgb(128,153,11)]">
        Fresh<span className="text-black">Harvest</span>
      </h1>
      <ul className="hidden md:flex space-x-6 text-lg font-medium text-gray-700">
  <li>
    <Link to="/" className="hover:text-[rgb(128,153,11)] transition">
      Home
    </Link>
  </li>
  <li>
    <Link to="/about" className="hover:text-[rgb(128,153,11)] transition">
      About
    </Link>
  </li>
  <li>
    <Link to="/products" className="hover:text-[rgb(128,153,11)] transition">
      Shop
    </Link>
  </li>
  <li>
  <AccountDropdown />
  </li>
  

  </ul>

      <div className="flex items-center space-x-2 text-gray-700">
        <FaPhoneAlt className="text-[rgb(128,153,11)]" />
        <span className="text-sm font-semibold">(+94) 123 456-7899</span>
      </div>
    </nav>
  );
};

export default Navbar;
