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

// Define a porta do servidor, usando a variável de ambiente PORT (comum em serviços de deploy) ou 3000 como padrão.
const porta = process.env.PORT || 3000;


app.listen(porta, () => {
  console.log(`Servidor rodando na porta ${porta}`);
});


export default app;