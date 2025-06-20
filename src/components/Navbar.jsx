import React, { useState } from "react";
import { FaPhoneAlt, FaBars, FaTimes } from "react-icons/fa";
import { Link } from "react-router-dom";
import AccountDropdown from "./Dropdown";

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <nav className="relative flex justify-between items-center px-6 md:px-8 py-4 shadow-md bg-white">
      {/* Logo */}
      <h1 className="text-2xl font-bold text-[rgb(128,153,11)]">
        Fresh<span className="text-black">Harvest</span>
      </h1>

      {/* Desktop Menu */}
      <ul className="hidden md:flex space-x-6 text-lg font-medium text-gray-700">
        <li>
          <Link to="/" className="hover:text-[rgb(128,153,11)] transition">Home</Link>
        </li>
        <li>
          <Link to="/about" className="hover:text-[rgb(128,153,11)] transition">About</Link>
        </li>
        <li>
          <Link to="/products" className="hover:text-[rgb(128,153,11)] transition">Shop</Link>
        </li>
        <li>
          <AccountDropdown />
        </li>
      </ul>

      {/* Mobile Menu Button */}
      <div className="md:hidden">
        <button onClick={() => setIsMenuOpen(!isMenuOpen)} className="text-xl text-gray-700">
          {isMenuOpen ? <FaTimes /> : <FaBars />}
        </button>
      </div>

      {/* Phone Info */}
      <div className="hidden md:flex items-center space-x-2 text-gray-700">
        <FaPhoneAlt className="text-[rgb(128,153,11)]" />
        <span className="text-sm font-semibold">(+94) 123 456-7899</span>
      </div>

      {/* Mobile Menu Dropdown */}
      {isMenuOpen && (
        <div className="absolute top-full left-0 w-full bg-white shadow-md md:hidden z-50">
          <ul className="flex flex-col space-y-4 p-6 text-lg font-medium text-gray-700">
            <li>
              <Link to="/" onClick={() => setIsMenuOpen(false)} className="hover:text-[rgb(128,153,11)]">Home</Link>
            </li>
            <li>
              <Link to="/about" onClick={() => setIsMenuOpen(false)} className="hover:text-[rgb(128,153,11)]">About</Link>
            </li>
            <li>
              <Link to="/products" onClick={() => setIsMenuOpen(false)} className="hover:text-[rgb(128,153,11)]">Shop</Link>
            </li>
            <li>
              <AccountDropdown />
            </li>
            <li className="flex items-center space-x-2 pt-2 border-t">
              <FaPhoneAlt className="text-[rgb(128,153,11)]" />
              <span className="text-sm font-semibold">(+94) 123 456-7899</span>
            </li>
          </ul>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
