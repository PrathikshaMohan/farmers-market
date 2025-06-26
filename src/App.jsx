
import HomePage from "./pages/HomePage";
import Login from "./pages/Login";
import Dashboard from "./pages/FDashboard";
import FreshPage from "./pages/BuyerProduct";
import About from "./pages/About";
import FarmerDashboard from "./pages/FDashboard";
import { CartProvider } from "./components/CartContext"; 
import CartPage from "./components/CartPage"; 
import CheckoutPage from "./components/Checkout";
import AdminDashboard from "./pages/Admin";
import AdminLogin from "./pages/AdminLogin";
import ForgotPassword from "./components/ForgotPassword";
import { BrowserRouter as Router, Routes, Route} from "react-router-dom";
import "./index.css";



const App = () => {
  
  return (
    <Router>
      <CartProvider>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/login" element={<Login />} />
          <Route path="/fdashboard" element={<Dashboard />} />
         <Route path="/products" element={<FreshPage />} />
          <Route path="/farmer" element={<FarmerDashboard />} />
          <Route path="/about" element={<About />} />
          <Route path="/checkout" element={<CheckoutPage />} />
          <Route path="/admin" element={<AdminDashboard />} />
          <Route path="/adminlogin" element={<AdminLogin />} />
          <Route path="/cart" element={<CartPage />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
        </Routes>
      </CartProvider>
    </Router>
  );
};


export default App;

