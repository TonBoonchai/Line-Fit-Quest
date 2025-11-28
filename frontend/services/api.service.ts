import axios from "axios";

const ApiService = axios.create({
  baseURL: process.env.BACKEND_URL || "http://localhost:8080",
  timeout: 15000,
});

export default ApiService;
