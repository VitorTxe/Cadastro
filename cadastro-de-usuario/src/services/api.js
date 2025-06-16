import axios from "axios";

const api = axios.create({
  // baseURL: "http://localhost:3000",
  baseURL: "https://cadastro-usuario-3e9h.onrender.com",
});

export default api;
