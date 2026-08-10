import app from "./app.js";

// Define a porta do servidor, usando a variável de ambiente PORT (comum em serviços de deploy) ou 3000 como padrão.
const porta = process.env.PORT || 3000;

app.listen(porta, () => {
  console.log(`Servidor rodando na porta ${porta}`);
});