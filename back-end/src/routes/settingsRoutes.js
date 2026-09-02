import express from "express";
import { getPricing } from "../controllers/adminController.js";

const router = express.Router();

// Публичное чтение текущих цен тарифов и услуг — без авторизации,
// используется страницами /pricing и /payment. Изменение цен — только
// через PUT /api/admin/pricing (роль admin).
router.get("/pricing", getPricing);

export default router;
