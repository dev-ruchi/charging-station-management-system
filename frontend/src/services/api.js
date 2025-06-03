import axios from "axios";

const API_URL = "http://localhost:3000/api"; // Adjust this based on your backend URL

const api = axios.create({
  baseURL: API_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

export const authService = {
  async signup(userData) {
    const response = await api.post("/auth/register", userData);
    if (response.data.token) {
      localStorage.setItem("token", response.data.token);
      localStorage.setItem("user", JSON.stringify(response.data.savedUser));
    }
    return response.data;
  },

  async login(credentials) {
    const response = await api.post("/auth/login", credentials);
    if (response.data.token) {
      localStorage.setItem("token", response.data.token);
      localStorage.setItem("user", JSON.stringify(response.data.user));
    }
    return response.data;
  },

  logout() {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
  },
};

export default api;
