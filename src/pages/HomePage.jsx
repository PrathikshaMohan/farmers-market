import React from "react";
import Navbar from "../components/Navbar";
import Carousel from "../components/Carousel";
import Why from "../components/Why";
import ProductCategories from "../components/MainProduct";
import Footer from "../components/Footer";

const HomePage = () => {
  return (
    <div>
      <Navbar />
      <Carousel />
      <Why />
      <ProductCategories/>
      <Footer/>
      
    </div>
  );
};

export default HomePage;
