import React from "react";
import { Carousel } from "react-responsive-carousel";
import "react-responsive-carousel/lib/styles/carousel.min.css";
import { Link } from "react-router-dom";

const CarouselSection = () => {
  return (
    <Carousel showThumbs={false} autoPlay infiniteLoop showStatus={false} className="relative">
      {/* Slide 1 */}
      <div className="relative">
        <img src="/images/slide1.png" alt="Slide 1" className="w-full h-[600px] object-cover" />
        <div className="absolute inset-0 bg-black/10 flex flex-col items-start justify-center px-6 md:px-16 text-left">
          <p className="text-[rgb(128,153,11)] text-xs md:text-sm font-semibold">HUMILITY ORGANIC PRODUCTS</p>
          <h2 className="text-3xl md:text-5xl font-bold text-black leading-tight mt-2">
            Constantly Innovate <br /> Bring Your Family <br /> The Freshest.
          </h2>
          <p className="text-black mt-4 text-sm md:text-base max-w-full md:max-w-md">
            We value our personnel, farmers, and farm sponsors. Therefore, we accord Respect and Humility.
          </p>
          <Link to="/">
            <button className="mt-6 px-6 py-3 bg-[rgb(128,153,11)] text-white font-semibold rounded-lg hover:bg-gray-500">
              Get Started
            </button>
          </Link>
        </div>
      </div>

      {/* Slide 2 */}
      <div className="relative">
        <img src="/images/slide02.png" alt="Slide 2" className="w-full h-[600px] object-cover" />
        <div className="absolute inset-0 bg-black/10 flex flex-col items-start justify-center px-6 md:px-16 text-left">
          <p className="text-[rgb(128,153,11)] text-xs md:text-sm font-semibold">FRESH FARM PRODUCTS</p>
          <h2 className="text-3xl md:text-5xl font-bold text-black leading-tight mt-2">
            Fresh Vegetables <br /> Directly from Farmers.
          </h2>
          <p className="text-black mt-4 text-sm md:text-base max-w-full md:max-w-md">
            Get the highest quality vegetables sourced directly from farmers with love and care.
          </p>
          <Link to="/products">
            <button className="mt-6 px-6 py-3 bg-[rgb(128,153,11)] text-white font-semibold rounded-lg hover:bg-gray-500">
              Shop Now
            </button>
          </Link>
        </div>
      </div>

      {/* Slide 3 */}
      <div className="relative">
        <img src="/images/Header.png" alt="Slide 3" className="w-full h-[600px] object-cover" />
        <div className="absolute inset-0 bg-black/10 flex flex-col items-start justify-center px-6 md:px-16 text-left">
          <p className="text-[rgb(128,153,11)] text-xs md:text-sm font-semibold">OUR HARDWORK FARMERS</p>
          <h2 className="text-3xl md:text-5xl font-bold text-white leading-tight mt-2">
            Empowering Smallholder <br /> Farmers is Our Priority
          </h2>
          <p className="text-white mt-4 text-sm md:text-base max-w-full md:max-w-md">
            We have interpersonal intelligence and constantly seeking ways of improving relationship with farmers.
          </p>
          <Link to="/about">
            <button className="mt-6 px-6 py-3 bg-[rgb(128,153,11)] text-white font-semibold rounded-lg hover:bg-gray-500">
              Learn More
            </button>
          </Link>
        </div>
      </div>
    </Carousel>
  );
};

export default CarouselSection;
