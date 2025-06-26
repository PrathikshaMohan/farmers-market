import React from "react";
import Navbar from "../components/Navbar";
import Carousel from "../components/Carousel";
import Why from "../components/Why";
import ProductCategories from "../components/MainProduct";
import Footer from "../components/Footer";

//functional component
const HomePage = () => {
//jsx returned
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
