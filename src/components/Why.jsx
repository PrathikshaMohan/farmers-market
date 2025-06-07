import { FaBox, FaStar, FaTruck, FaTags, FaLeaf, FaCertificate } from "react-icons/fa";
import { FaArrowUp, FaArrowDown } from "react-icons/fa";

const FeaturesSection = () => {
  return (
    <div className="relative flex flex-col items-center py-16 bg-white">
      <h3 className="text-[rgb(128,153,11)] text-sm font-semibold uppercase">Why Choose Our Platform</h3>
      <h2 className="text-3xl font-bold text-gray-800 mt-2">Reason to Choose Us</h2>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8 max-w-6xl">
        <FeatureCard icon={<FaBox />} title="Diverse Product Range" description="A wide variety of fresh produce directly from farmers." number="01" />
        <FeatureCard icon={<FaStar />} title="Quality Assurance" description="Ensuring farm-to-table quality and freshness." number="02" />
        <FeatureCard icon={<FaTruck />} title="Efficient Logistics" description="Reliable delivery services for all products." number="03" />
        <FeatureCard icon={<FaTags />} title="Affordable Pricing" description="Fair pricing benefiting both farmers and buyers. " number="04" />
        <FeatureCard icon={<FaLeaf />} title="100% Organic Guarantee" description="Certified organic products directly from farmers." number="05" />
        <FeatureCard icon={<FaCertificate />} title="Certified Vendors" description="Registered farmers ensuring trust and safety." number="06" />
      </div>
      
      
    </div>
  );
};

const FeatureCard = ({ icon, title, description, number }) => {
  return (
    <div className="border p-6 rounded-lg shadow-md text-center bg-white relative">
      <div className="text-[rgb(128,153,11)] text-3xl mb-3">{icon}</div>
      <h3 className="font-bold text-gray-800">{title}</h3>
      <p className="text-gray-600 mt-2 text-sm">{description}</p>
      <span className="absolute top-5 right-5 text-gray-200 text-4xl font-bold">{number}</span>
    </div>
  );
};

export default FeaturesSection;



