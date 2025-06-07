import React, { createContext, useState, useContext } from "react";

const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState([]);
  const [cartCount, setCartCount] = useState(0);

  const addToCart = (product) => {
    setCartItems((prevItems) => [...prevItems, product]);
    setCartCount((c) => c + 1);
  };

  const increment = () => setCartCount((c) => c + 1);
  const decrement = () => setCartCount((c) => Math.max(0, c - 1));

  return (
    <CartContext.Provider
      value={{
        cartItems,
        cartCount,
        addToCart,
        increment,
        decrement,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => useContext(CartContext);
