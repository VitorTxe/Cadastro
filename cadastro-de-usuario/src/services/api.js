import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:3000",
  // baseURL: "https://sistema-de-cadastro-mt67.onrender.com",
});

export default api;
