import express from "express";
import {
  listPayments,
  listLawyers,
  createLawyer,
  updateLawyer,
  deleteLawyer,
  listDevelopersAdmin,
  verifyDeveloperAdmin,
} from "../controllers/adminController.js";
import { authenticateToken, requireAdmin } from "../middleware/auth.js";

const router = express.Router();

// Все роуты в этом файле — только для role='admin'.
router.get("/payments", authenticateToken, requireAdmin, listPayments);

router.get("/lawyers", authenticateToken, requireAdmin, listLawyers);
router.post("/lawyers", authenticateToken, requireAdmin, createLawyer);
router.put("/lawyers/:id", authenticateToken, requireAdmin, updateLawyer);
router.delete("/lawyers/:id", authenticateToken, requireAdmin, deleteLawyer);

// Управление верификацией застройщиков
router.get("/developers", authenticateToken, requireAdmin, listDevelopersAdmin);
router.put("/developers/:id/verify", authenticateToken, requireAdmin, verifyDeveloperAdmin);

export default router;
