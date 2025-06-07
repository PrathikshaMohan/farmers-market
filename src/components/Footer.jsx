const Footer = () => {
  return (
    <footer className="bg-white text-gray-700 py-1">
     <div className="container mx-auto px-6 lg:px-16">
        <div className="grid md:grid-cols-4 gap-8">
          
          <div className="md:col-span-1">
            <h2 className="text-2xl font-bold text-gray-900">
              Fresh<span className="text-[rgb(128,153,11)]">Harvest.</span>
            </h2>
            <p className="mt-3 text-sm leading-relaxed">
              FreshHarvest is a Digital Agriculture Business that empowers rural farmers by providing them with a market for the sale of farm produce.
            </p>
            {/* Social Icons */}
            <div className="flex space-x-4 mt-4 text-gray-600">
              <i className="fab fa-facebook-f cursor-pointer hover:text-gray-900"></i>
              <i className="fab fa-twitter cursor-pointer hover:text-gray-900"></i>
              <i className="fab fa-instagram cursor-pointer hover:text-gray-900"></i>
              <i className="fab fa-pinterest cursor-pointer hover:text-gray-900"></i>
            </div>
          </div>

          {/* Working Hours */}
    <div className="text-center mb-4 md:mb-0">
      <h3 className="text-lg font-semibold text-gray-800">🕒 Working Hours</h3>
      <p className="text-sm text-gray-600">08:00 - 22:00, GMT/UTC +05:30</p>
      <p className="text-sm text-gray-600">Monday - Sunday</p>
    </div>

          {/* Quick Links */}
    <div className="text-center mb-4 md:mb-0">
      <h3 className="text-lg font-semibold text-gray-800">🔗 Quick Links</h3>
      <ul className="text-sm">
        <li><a href="/about" className="hover:text-[rgb(128,153,11)]">About Us</a></li>
        <li><a href="/login" className="hover:text-[rgb(128,153,11)]">Create account</a></li>
        <li><a href="/products" className="hover:text-[rgb(128,153,11)]">Shop</a></li>
      </ul>
    </div>

          {/* Customer Support */}
    <div className="text-center">
      <h3 className="text-lg font-semibold text-gray-800">📞 Customer Support 24/7</h3>
      <p className="text-[rgb(128,153,11)] font-semibold">(+94) 123 456-7899</p>
      <p className="text-[rgb(128,153,11)] font-semibold">(+94) 9987 654-3211</p>
    </div>
  </div>

        {/* Footer Bottom Section */}
        <div className="mt-6 border-t border-gray-300 pt-4 text-center md:text-left">
          <p className="text-sm text-gray-600">
            ©2025 <span className="text-[rgb(128,153,11)] font-semibold">FreshHarvest</span> All Rights Reserved
          </p>
        </div>
      </div>
      {/* Background Image */}
  <div className="relative mt-4">
    <div className="absolute inset-0 bg-black opacity-10"></div> {/* Dark Overlay for Readability */}
    <img
      src="images/cowg.png"
      alt="Farm Background"
      className="w-full h-[500px] object-cover"
    />
  </div>

</footer>
    
  );
};

export default Footer;
