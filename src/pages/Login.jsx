import React, { useState } from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { useNavigate} from 'react-router-dom';


const Login = () => {
  const [phoneNumber, setPhoneNumber] = useState('');
const [location, setLocation] = useState('');
const BASE_URL = import.meta.env.VITE_API_URL;
  const [isSignUp, setIsSignUp] = useState(false);
  const [role, setRole] = useState('');
  const [full_name, setFullname] = useState('');
  const [email, setEmail] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate(); // Correctly initialized

  const handleSignup = async (e) => {
  e.preventDefault();

  const data = {
    role,
    full_name,
    email,
    username,
    password,
    ...(role === 'farmer' && {
      phone_number: phoneNumber,
      location: location,
    }),
  };

  const res = await fetch(`${BASE_URL}/api/signup`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });

  const result = await res.json();
  alert(result.message);

  if (res.ok) {
    setUsername(data.username);
    setPassword('');
    setIsSignUp(false);
  }
};


  const handleLogin = async (e) => {
    e.preventDefault();
    console.log("Logging in as role:", role); // <--- check this
    const data = {
      role,
      username,
      password,
    };
  
    const res = await fetch(`${BASE_URL}/api/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
  
    const result = await res.json();
    if (result.success) {
  alert('Login successful!');

  // Save logged-in user ID and role
  localStorage.setItem('user', JSON.stringify(result.user)); // full user info
  localStorage.setItem('isLoggedIn', 'true'); // flag used in route protection

  // Redirect based on backend user's role
  const userRole = result.user.role;

  if (userRole === 'farmer') {
    navigate('/fdashboard');
  } else if (userRole === 'buyer') {
    navigate('/products');
  } else if (userRole === 'admin') {
    navigate('/admin');
  } else {
    alert('Invalid role found on server: ' + userRole);
  }
} else {
  alert('Login failed: ' + result.message);
}
  };
  
  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />

      <main className="flex-grow pb-16">
        <div className="flex flex-col md:flex-row-reverse min-h-screen md:h-[calc(100vh-160px)] w-full">
          
          {/* Right Side - Form */}
          <div className="w-full md:w-1/2 flex justify-center items-start md:items-center bg-gray-100 px-4 sm:px-6 py-8 sm:py-10 overflow-y-auto md:h-full">

            <div className="w-full max-w-md bg-white p-6 sm:p-8 rounded-lg shadow-md">
              <h2 className="text-2xl font-semibold text-center mb-6">
                {isSignUp ? 'Create Account' : 'Welcome Back!'}
              </h2>

              {isSignUp ? (
                <form onSubmit={handleSignup} className="space-y-4">
                  {/* Role */}
                  <div>
                    <label className="block text-sm font-medium mb-1">Select Role</label>
                    <select
                      value={role}
                      onChange={e => setRole(e.target.value)}
                      className="w-full border border-gray-300 rounded-lg px-4 py-2 text-sm"
                      required
                    >
                      <option value="">Select Role</option>
                      <option value="buyer">Buyer</option>
                      <option value="farmer">Farmer</option>
                    </select>
                  </div>

                  {/* Full Name */}
                  <div>
                    <label className="block text-sm font-medium mb-1">Full Name</label>
                    <input
                      type="text"
                      className="w-full px-4 py-2 border rounded"
                      placeholder="Enter full name"
                      value={full_name}
                      onChange={(e) => setFullname(e.target.value)}
                      required
                    />
                  </div>

                  {/* Email */}
                  <div>
                    <label className="block text-sm font-medium mb-1">Email</label>
                    <input
                      type="email"
                      className="w-full px-4 py-2 border rounded"
                      placeholder="Enter email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                    />
                  </div>

                  {/* Username */}
                  <div>
                    <label className="block text-sm font-medium mb-1">Username</label>
                    <input
                      type="text"
                      className="w-full px-4 py-2 border rounded"
                      placeholder="Enter username"
                      value={username}
                      onChange={(e) => setUsername(e.target.value)}
                      required
                    />
                  </div>

                  {/* Password */}
                  <div>
                    <label className="block text-sm font-medium mb-1">Password</label>
                    <input
                      type="password"
                      className="w-full px-4 py-2 border rounded"
                      placeholder="Create password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                    />
                  </div>

                  {/* Phone & Location for Farmers */}
                  {role === 'farmer' && (
                    <>
                      <div>
                        <label className="block text-sm font-medium mb-1">Phone Number</label>
                        <input
                          type="text"
                          className="w-full px-4 py-2 border rounded"
                          placeholder="Enter phone number"
                          value={phoneNumber}
                          onChange={(e) => setPhoneNumber(e.target.value)}
                          required
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium mb-1">Location</label>
                        <input
                          type="text"
                          className="w-full px-4 py-2 border rounded"
                          placeholder="Enter farm location"
                          value={location}
                          onChange={(e) => setLocation(e.target.value)}
                          required
                        />
                      </div>
                    </>
                  )}

                  <button
                    type="submit"
                    className="w-full bg-[rgb(128,153,11)] text-white py-2 text-sm sm:text-base rounded hover:bg-gray-600 transition"
                  >
                    Sign Up
                  </button>

                  <p className="mt-4 text-sm text-center">
                    Already have an account?{' '}
                    <button
                      type="button"
                      className="text-blue-500 underline"
                      onClick={() => setIsSignUp(false)}
                    >
                      Login
                    </button>
                  </p>
                </form>
              ) : (
                <form onSubmit={handleLogin} className="space-y-4">
                  {/* Role */}
                  <div>
                    <label className="block text-sm font-medium mb-1">Select Role</label>
                    <select
                      value={role}
                      onChange={(e) => setRole(e.target.value)}
                      className="w-full px-4 py-2 border rounded bg-white text-gray-700"
                      required
                    >
                      <option value="">Choose role</option>
                      <option value="farmer">Farmer</option>
                      <option value="buyer">Buyer</option>
                    </select>
                  </div>

                  {/* Username */}
                  <div>
                    <label className="block text-sm font-medium mb-1">Username</label>
                    <input
                      type="text"
                      className="w-full px-4 py-2 border rounded"
                      placeholder="Enter username"
                      value={username}
                      onChange={(e) => setUsername(e.target.value)}
                      required
                    />
                  </div>

                  {/* Password */}
                  <div>
                    <label className="block text-sm font-medium mb-1">Password</label>
                    <input
                      type="password"
                      className="w-full px-4 py-2 border rounded"
                      placeholder="Enter password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                    />
                  </div>

                  <button
                    type="submit"
                    className="w-full bg-[rgb(128,153,11)] text-white py-2 text-sm sm:text-base rounded hover:bg-gray-600 transition"
                  >
                    Login
                  </button>

                  <div className="mt-4 text-sm text-center">
                    Forgot your password?{' '}
                    <a href="/forgot-password" className="text-blue-500">Click Here</a>
                  </div>
                </form>
              )}
            </div>
          </div>

          {/* Left Side - Video and Text */}
          <div className="relative w-full md:w-1/2 h-64 md:h-full">
            <video
              autoPlay
              loop
              muted
              className="absolute w-full h-full object-cover"
            >
              <source src="/back2.mp4" type="video/mp4" />
              Your browser does not support the video tag.
            </video>
            <div className="absolute inset-0 bg-black/40 z-10" />
            <div className="relative z-20 flex flex-col justify-center items-center h-full text-white px-6 text-center">
              <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold">
                Grow and Sell<br /> Fresh & Authentic Produce
              </h1>
              <p className="mt-4 text-sm sm:text-base">Bringing Nature’s Goodness Directly to You</p>

              <div className="absolute bottom-0 left-0 w-full z-20 bg-white/20 backdrop-blur py-3 text-center">
                {isSignUp ? (
                  <>
                    <span className="text-white text-sm mr-2">Already have an account?</span>
                    <button
                      onClick={() => setIsSignUp(false)}
                      className="bg-white text-black px-4 py-1 rounded hover:bg-gray-200"
                    >
                      Login
                    </button>
                  </>
                ) : (
                  <>
                    <span className="text-white text-sm mr-2">Don't have an account?</span>
                    <button
                      onClick={() => setIsSignUp(true)}
                      className="bg-white text-black px-4 py-1 rounded hover:bg-gray-200"
                    >
                      Sign Up
                    </button>
                  </>
                )}
              </div>
            </div>
          </div>

        </div>
      </main>

      <Footer />
    </div>
  );
};
export default Login;
