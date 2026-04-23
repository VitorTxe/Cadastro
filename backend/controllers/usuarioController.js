import { PrismaClient } from "@prisma/client";
import validator from "validator";
import { capitalize } from "../utils/stringUtils.js";

// Cria uma única instância do Prisma Client para ser usada em toda a aplicação, otimizando conexões com o banco.
const prisma = new PrismaClient();

export const criarUsuario = async (req, res) => {
  const { name, age, email } = req.body;

  if (!email || validator.isEmail(email) == false || typeof email !== "string") {
    return res.status(400).json({ message: "Email inválido ou não fornecido." });
  }

  // Operação no Banco de Dados: Bloco `try...catch` para lidar com possíveis erros.
  try {
    const newUser = await prisma.usuarios.create({
      data: {
        email: email,
        name: capitalize(name),
        age: String(age), // Convertendo para String conforme o schema do Prisma
      },
    });
    // Retorna o usuário recém-criado com status 201 (Created).
    return res.status(201).json(newUser);
  } catch (error) {
    console.error("Erro ao criar usuário:", error);
    // 3. Tratamento de Erro Específico: Se o erro for de violação de chave única (email duplicado).
    if (error.code === "P2002") { // Código de erro do Prisma para "Unique constraint failed"
      return res.status(409).json({ message: "Email já cadastrado." });
    }
    return res.status(500).json({ message: "Ocorreu um erro no servidor ao criar o usuário." });
  }
};

export const listarUsuarios = async (req, res) => {
  try {
    const { name, email, age } = req.query;
    const where = {
      name: name,
      email: email,
      age: age,
    };

    const users = await prisma.usuarios.findMany({ where });
    res.status(200).json(users);
  } catch (error) {
    console.error("Erro ao buscar usuários:", error);
    res.status(500).json({ message: "Ocorreu um erro no servidor ao buscar usuários."});
  }
};

export const atualizarUsuario = async (req, res) => {
  try {
    const { id } = req.params;
    const { email, name, age } = req.body;

    // Constrói um objeto `dataToUpdate` apenas com os campos que foram enviados na requisição.
    const dataToUpdate = {};
    if (email) {
      if (!validator.isEmail(email)) {
        return res.status(400).json({ message: "Formato de email inválido." });
      }
      dataToUpdate.email = email;
    }
    if (name) dataToUpdate.name = capitalize(name);
    if (age) {
      if (age <= 0 || age > 120) {
        return res.status(400).json({ message: "Idade inválida." });
      }
      dataToUpdate.age = String(age);
    }

    // Executa a atualização no banco de dados.
    const updatedUser = await prisma.usuarios.update({
      where: { id },
      data: dataToUpdate,
    });

    // Retorna o usuário atualizado com status 200 (OK).
    res.status(200).json(updatedUser);
  } catch (error) {
    console.error("Erro ao atualizar usuário:", error);
    if (error.code === 'P2025') { // Código do Prisma para "registro não encontrado"
      return res.status(404).json({ message: "Usuário não encontrado." });
    }
    res.status(500).json({ message: "Ocorreu um erro no servidor ao atualizar o usuário." });
  }
};

export const deletarUsuario = async (req, res) => {
  try {
    const { id } = req.params;
    await prisma.usuarios.delete({ where: { id } });
    // Retorna status 204 (No Content), indicando que a operação foi bem-sucedida e não há conteúdo para retornar.
    res.status(204).send();
  } catch (error) {
    // Se o Prisma retornar o erro P2025, significa que o registro a ser deletado não foi encontrado.
    if (error.code === 'P2025') {
      return res.status(404).json({ message: "Usuário não encontrado." });
    }
    // Para qualquer outro erro, retorna um erro genérico de servidor.
    res.status(500).json({ message: "Ocorreu um erro no servidor ao deletar o usuário." });
  }
};
