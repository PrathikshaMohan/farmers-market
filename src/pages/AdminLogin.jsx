import React, { useState } from 'react';
import api from "../api";
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

const AdminLogin = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');

    try {
      const res = await api.post('/admin/login', {
        username,
        password
      });

      if (res.data.role === 'admin') {
        localStorage.setItem('admin', JSON.stringify(res.data.user));
        navigate('/admin');
      } else {
        setError('Unauthorized: Not an admin');
      }
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.message || 'Login failed');
    }
  };

  return (
  <>
    <Navbar />

    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-[rgb(128,153,11)] via-lime-200 to-green-100">

      <form onSubmit={handleLogin} className="bg-white p-8 rounded shadow-md w-full max-w-sm">
        <h2 className="text-2xl font-semibold mb-6 text-center">Admin Login</h2>
        {error && <p className="text-red-500 mb-4">{error}</p>}
        <input
          type="text"
          placeholder="Username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          className="w-full p-2 mb-4 border rounded"
          required
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full p-2 mb-6 border rounded"
          required
        />
        <button
                    type="submit"
                    className="w-full bg-[rgb(128,153,11)] text-white py-2 rounded hover:bg-gray-600"
                  >
                    Login
                  </button>
      </form>
    </div>

    <Footer />
  </>
);
}
export default AdminLogin;
