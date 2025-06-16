const validator = require("validator");
const cors = require("cors");
const express = require("express");
const app = express();

app.use(express.json());
app.use(cors());

const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

const porta = process.env.PORT || 3000;

function capitalize(string) {
  return string
    .split(" ")
    .map((word) => {
      if (word.length === 0) {
        return "";
      }

      const firstLetter = word.charAt(0).toUpperCase();
      const restOfWord = word.slice(1).toLowerCase();
      return firstLetter + restOfWord;
    })
    .join(" ");
}

app.post("/usuarios", async (req, res) => {
  const { name, age, email } = req.body;

  if (!email || !name || !age) {
    return res.status(400).json({
      message: "Todos os campos (email, name, age) são obrigatórios.",
    });
  }

  if (validator.isEmail(email) == false || typeof email !== "string") {
    return res.status(400).json({ message: "Email inválido." });
  }

  if (age <= 0 || age > 120) {
    return res.status(400).json({ message: "Idade inválida" });
  }

  try {
    const newUser = await prisma.usuarios.create({
      data: {
        email: email,
        name: capitalize(name),
        age: age,
      },
    });
    return res.status(201).json(newUser);
  } catch (error) {
    console.error("Erro ao criar usuário:", error);
    if (error.code === "P2002") {
      return res.status(409).json({ message: "Email já cadastrado." });
    }
  }
});

app.get("/usuarios", async (req, res) => {
  let users = [];

  if (req.params) {
    users = await prisma.usuarios.findMany({
      where: {
        email: req.query.email,
        name: req.query.name,
        age: req.query.age,
      },
    });
  } else {
    await prisma.usuarios.findMany();
  }

  res.status(200).json(users);
});

app.put("/usuarios/:id", async (req, res) => {
  await prisma.usuarios.update({
    where: {
      id: req.params.id,
    },
    data: {
      email: req.body.email,
      name: req.body.name,
      age: req.body.age,
    },
  });
  res.status(201).json(req.body);
});

app.delete("/usuarios/:id", async (req, res) => {
  await prisma.usuarios.delete({
    where: {
      id: req.params.id,
    },
  });
  res.status(200).json({ message: "Usuario deletado com sucesso" });
});

app.listen(porta, () => {
  console.log(`Servidor rodando na porta ${porta}`);
});
