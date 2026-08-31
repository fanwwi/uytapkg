import express from "express";
import {
  listPayments,
  listLawyers,
  createLawyer,
  updateLawyer,
  deleteLawyer,
} from "../controllers/adminController.js";
import { authenticateToken, requireAdmin } from "../middleware/auth.js";

const router = express.Router();

// Все роуты в этом файле — только для role='admin'. authenticateToken
// подтягивает req.user.role из БД на каждый запрос, поэтому отзыв
// админских прав действует немедленно, без ожидания истечения токена.
router.get("/payments", authenticateToken, requireAdmin, listPayments);

router.get("/lawyers", authenticateToken, requireAdmin, listLawyers);
router.post("/lawyers", authenticateToken, requireAdmin, createLawyer);
router.put("/lawyers/:id", authenticateToken, requireAdmin, updateLawyer);
router.delete("/lawyers/:id", authenticateToken, requireAdmin, deleteLawyer);

export default router;
