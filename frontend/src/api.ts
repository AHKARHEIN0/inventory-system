import axios from "axios";

const API_BASE_URL = "https://inventory-system-gg85.onrender.com";

export const api = axios.create({
  baseURL: API_BASE_URL,
});
