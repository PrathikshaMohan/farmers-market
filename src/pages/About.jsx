import React from "react";
import { motion } from "framer-motion"; //used for animation
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

const fadeInUp = { //makes elements appear from below with a fade effect
  hidden: { opacity: 0, y: 50 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: "easeOut" },
  },
};

const staggerContainer = { //delays animations of child elements one after another (staggered effect)
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.3,
    },
  },
};

const About = () => {
  const scrollToSection = () => { //help to scroll smoothly
    const section = document.getElementById("section-agriculture");
    if (section) {
      section.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />

      <main className="flex-grow pb-16">
        <div className="bg-white">
          {/* Section 1: About Us Header + Video */}
          <motion.section
            className="relative bg-[rgb(128,153,11)] text-white py-5 px-4 sm:px-6 md:px-20 flex flex-col md:flex-row items-center justify-between"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={staggerContainer}
          >
            <motion.div className="mb-8 md:mb-0 md:w-1/2" variants={fadeInUp}>
              <h2 className="text-4xl font-bold">About Us</h2>
            </motion.div>

            <motion.div className="md:w-1/2" variants={fadeInUp}>
              <motion.div
                whileHover={{ scale: 1.05 }}
                className="relative w-full max-w-xl mx-auto rounded-2xl overflow-hidden shadow-lg -mb-20 z-20"
              >
                <video controls className="w-full h-full object-cover">
                  <source src="about.mp4" type="video/mp4" />
                  Your browser does not support the video tag.
                </video>
              </motion.div>
            </motion.div>
          </motion.section>

          
          <div className="h-20 bg-white relative z-10"></div>

          {/* Section 2: We Are Agriculture Farm */}
          <motion.section
            id="section-agriculture"
            className="py-16 px-4 sm:px-6 md:px-20 bg-white grid md:grid-cols-2 gap-10 items-center"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={staggerContainer}
          >
            <motion.div variants={fadeInUp}>
              <h2 className="text-4xl font-bold mb-4">Empowering Farmers, Connecting Communities</h2>
              <blockquote className="text-[rgb(128,153,11)] font-semibold border-l-4 border-[rgb(128,153,11)] pl-4 mb-4">
              We’re building a direct connection between farmers and buyers — no middlemen, no unfair pricing, just honest trade.
              </blockquote>
              <p className="text-gray-700 mb-2">
              Our platform gives farmers the power to list and sell their products directly to consumers. Whether it's fresh vegetables, dairy, or homemade goods, we make it easier for local producers to reach their market and earn a fair income.
              </p>
              <p className="text-gray-700">
              This system also benefits buyers by providing fresh, local produce straight from the source — promoting transparency, trust, and community-driven commerce.
              </p>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={scrollToSection}
                className="mt-6 bg-[rgb(128,153,11)] text-white px-6 py-2 rounded-full hover:bg-gray-500 transition"
              >
                About Us
              </motion.button>
            </motion.div>

            <motion.div className="grid grid-cols-2 gap-6 text-center" variants={staggerContainer}>
              <motion.div variants={fadeInUp}>
                <h3 className="text-3xl font-bold text-[rgb(128,153,11)]">500+</h3>
                <p className="text-gray-600 text-sm mt-2">
                Farmers already registered and showcasing their products directly to local buyers through our platform.
                </p>
              </motion.div>
              <motion.div variants={fadeInUp}>
                <h3 className="text-3xl font-bold text-[rgb(128,153,11)]">1k+</h3>
                <p className="text-gray-600 text-sm mt-2">
                Successful transactions completed between farmers and buyers — fostering trust and transparency.
                </p>
              </motion.div>
            </motion.div>
          </motion.section>

          {/* Section 3: High-Quality Products */}
          <motion.section
            className="bg-[rgb(128,153,11)] text-white py-16 px-4 sm:px-6 md:px-20 flex flex-col md:flex-row items-center justify-between gap-10"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={staggerContainer}
          >
            <motion.div className="md:w-1/2" variants={fadeInUp}>
              <motion.img
                whileHover={{ scale: 1.02 }}
                src="https://images.unsplash.com/photo-1567306226416-28f0efdc88ce"
                alt="Farm"
                className="w-full h-full object-cover rounded-lg"
              />
            </motion.div>

            <motion.div className="md:w-1/2 space-y-6" variants={fadeInUp}>
              <h2 className="text-3xl font-bold">Directly From Farm to Table</h2>

              <motion.div whileHover={{ x: 10 }}>
                <h4 className="font-semibold text-xl">🌾 Fresh Produce</h4>
                <p>
                Buyers can discover seasonal fruits, vegetables, and grains straight from the fields—locally grown and chemical-free.
                </p>
              </motion.div>

              <motion.div whileHover={{ x: 10 }}>
                <h4 className="font-semibold text-xl">🥛 Dairy & Milk Products</h4>
                <p>
                Farmers offer pure, fresh milk, curd, and eggs — with no middleman, ensuring both freshness and fair pricing.
                </p>
              </motion.div>

              
            </motion.div>
          </motion.section>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default About;
