import { useState } from "react";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown } from "lucide-react"; 

const AccountDropdown = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <li
      className="relative"
      onMouseEnter={() => setIsOpen(true)}
      onMouseLeave={() => setIsOpen(false)}
    >
      <button
        className="flex items-center gap-1 hover:text-[rgb(128,153,11)] transition"
      >
        Account
        <ChevronDown
          className={`w-4 h-4 transition-transform duration-200 ${
            isOpen ? "rotate-180" : ""
          }`}
        />
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.ul
            initial={{ opacity: 0, y: -5 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -5 }}
            className="absolute right-0 mt-2 bg-white border rounded shadow-md w-44 z-50"
          >
            <li>
              <Link
                to="/login"
                className="block px-4 py-2 hover:bg-gray-100 transition"
              >
                Profile
              </Link>
            </li>
            <li>
              <Link
                to="/adminlogin"
                className="block px-4 py-2 hover:bg-gray-100 transition"
              >
                Admin
              </Link>
            </li>
          </motion.ul>
        )}
      </AnimatePresence>
    </li>
  );
};

export default AccountDropdown;
