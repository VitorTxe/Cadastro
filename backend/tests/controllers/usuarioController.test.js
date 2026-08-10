import { jest } from "@jest/globals";
import request from "supertest";

// Criação do mock do Prisma para isolar os testes de integração do banco de dados real
const mockPrismaUsuarios = {
  create: jest.fn(),
  findMany: jest.fn(),
  update: jest.fn(),
  delete: jest.fn(),
};

jest.unstable_mockModule("@prisma/client", () => {
  return {
    PrismaClient: jest.fn().mockImplementation(() => ({
      usuarios: mockPrismaUsuarios,
    })),
  };
});

// Importação dinâmica do app após o mock do Prisma ser registrado
const { default: app } = await import("../../app.js");

describe("Rotas de Usuários (/usuarios)", () => {
  let consoleSpy;

  beforeEach(() => {
    jest.clearAllMocks();
    consoleSpy = jest.spyOn(console, "error").mockImplementation(() => {});
  });

  afterEach(() => {
    consoleSpy.mockRestore();
  });

  describe("POST /usuarios", () => {
    it("deve criar um usuário com sucesso (Status 201)", async () => {
      const newUserInput = {
        name: "carlos silva",
        age: 30,
        email: "carlos@example.com",
      };

      const mockCreatedUser = {
        id: "123-abc",
        name: "Carlos Silva",
        age: "30",
        email: "carlos@example.com",
      };

      mockPrismaUsuarios.create.mockResolvedValue(mockCreatedUser);

      const response = await request(app)
        .post("/usuarios")
        .send(newUserInput);

      expect(response.status).toBe(201);
      expect(response.body).toEqual(mockCreatedUser);
      expect(mockPrismaUsuarios.create).toHaveBeenCalledWith({
        data: {
          name: "Carlos Silva",
          age: "30",
          email: "carlos@example.com",
        },
      });
    });

    it("deve retornar 400 se o email for inválido", async () => {
      const invalidInput = {
        name: "Carlos",
        age: 30,
        email: "email-invalido",
      };

      const response = await request(app)
        .post("/usuarios")
        .send(invalidInput);

      expect(response.status).toBe(400);
      expect(response.body).toHaveProperty("message", "Email inválido ou não fornecido.");
    });

    it("deve retornar 409 se o email já estiver cadastrado", async () => {
      const duplicateInput = {
        name: "Carlos",
        age: 30,
        email: "carlos@example.com",
      };

      const prismaError = new Error("Unique constraint failed");
      prismaError.code = "P2002";
      mockPrismaUsuarios.create.mockRejectedValue(prismaError);

      const response = await request(app)
        .post("/usuarios")
        .send(duplicateInput);

      expect(response.status).toBe(409);
      expect(response.body).toHaveProperty("message", "Email já cadastrado.");
    });
  });

  describe("GET /usuarios", () => {
    it("deve listar os usuários cadastrados (Status 200)", async () => {
      const mockUsersList = [
        { id: "1", name: "Ana", age: "25", email: "ana@example.com" },
      ];

      mockPrismaUsuarios.findMany.mockResolvedValue(mockUsersList);

      const response = await request(app).get("/usuarios");

      expect(response.status).toBe(200);
      expect(response.body).toEqual(mockUsersList);
    });
  });

  describe("PUT /usuarios/:id", () => {
    it("deve atualizar um usuário existente com sucesso (Status 200)", async () => {
      const updateData = { name: "ana maria", age: 26 };
      const mockUpdatedUser = {
        id: "1",
        name: "Ana Maria",
        age: "26",
        email: "ana@example.com",
      };

      mockPrismaUsuarios.update.mockResolvedValue(mockUpdatedUser);

      const response = await request(app)
        .put("/usuarios/1")
        .send(updateData);

      expect(response.status).toBe(200);
      expect(response.body).toEqual(mockUpdatedUser);
    });

    it("deve retornar 404 caso o usuário não exista", async () => {
      const prismaError = new Error("Record to update not found.");
      prismaError.code = "P2025";
      mockPrismaUsuarios.update.mockRejectedValue(prismaError);

      const response = await request(app)
        .put("/usuarios/999")
        .send({ name: "Desconhecido" });

      expect(response.status).toBe(404);
      expect(response.body).toHaveProperty("message", "Usuário não encontrado.");
    });
  });

  describe("DELETE /usuarios/:id", () => {
    it("deve deletar um usuário com sucesso (Status 204)", async () => {
      mockPrismaUsuarios.delete.mockResolvedValue({});

      const response = await request(app).delete("/usuarios/1");

      expect(response.status).toBe(204);
    });

    it("deve retornar 404 se tentar deletar usuário inexistente", async () => {
      const prismaError = new Error("Record to delete not found.");
      prismaError.code = "P2025";
      mockPrismaUsuarios.delete.mockRejectedValue(prismaError);

      const response = await request(app).delete("/usuarios/999");

      expect(response.status).toBe(404);
      expect(response.body).toHaveProperty("message", "Usuário não encontrado.");
    });
  });
});
