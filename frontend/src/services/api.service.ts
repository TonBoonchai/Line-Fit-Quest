import axios from "axios";

const ApiService = axios.create({
  baseURL: process.env.NEXT_PUBLIC_BACKEND_URL || "/api",
  timeout: 15000,
});

export default ApiService;
