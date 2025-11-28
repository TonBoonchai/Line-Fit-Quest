import axios from "axios";

const ApiService = axios.create({
  baseURL: process.env.BACKEND_URL,
  timeout: 15000,
});
