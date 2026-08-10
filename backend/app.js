import "dotenv/config";
import cors from "cors";
import express from "express";
import usuarioRoutes from "./routes/usuarioRoutes.js";

const app = express();

app.use(express.json());

// Configuração de segurança do CORS
const corsOptions = {
  origin: [process.env.FRONTEND_URL, "http://localhost:5173"], // Permite o frontend de produção E o localhost
  methods: ["GET", "POST", "PUT", "DELETE"], // Métodos HTTP permitidos
  allowedHeaders: ["Content-Type", "Authorization"] // Cabeçalhos permitidos
};

// Habilita o CORS com as opções configuradas
app.use(cors(corsOptions));

app.use("/usuarios", usuarioRoutes);

export default app;
