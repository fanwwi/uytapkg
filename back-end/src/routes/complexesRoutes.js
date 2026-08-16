import express from "express";
import {
  getComplexes,
  getComplexById,
  getMyComplexes,
  createComplex,
  updateComplex,
  deleteComplex,
} from "../controllers/complexesController.js";
import { authenticateToken } from "../middleware/auth.js";

const router = express.Router();

// Публичные маршруты
router.get("/", getComplexes);
router.get("/my", authenticateToken, getMyComplexes); // Собственные ЖК застройщика (должен идти до :id)
router.get("/:id", getComplexById);

// Защищенные маршруты (только для застройщиков)
router.post("/", authenticateToken, createComplex);
router.put("/:id", authenticateToken, updateComplex);
router.delete("/:id", authenticateToken, deleteComplex);

export default router;
