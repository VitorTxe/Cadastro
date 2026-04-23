import express from "express";
import { 
  criarUsuario, 
  listarUsuarios, 
  atualizarUsuario, 
  deletarUsuario 
} from "../controllers/usuarioController.js";

const router = express.Router();

router.post("/", criarUsuario);
router.get("/", listarUsuarios);
router.put("/:id", atualizarUsuario);
router.delete("/:id", deletarUsuario);

export default router;
