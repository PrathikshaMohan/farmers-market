import axios from "axios";

const BASE_URL = import.meta.env.VITE_API_URL;

const api = axios.create({
  baseURL: `${BASE_URL}/api`, // ✅ append /api here
});

export default api;
