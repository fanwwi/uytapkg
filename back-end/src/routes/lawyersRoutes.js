import express from "express";
import { getLawyers } from "../controllers/lawyersController.js";

const router = express.Router();

// Публичный роут — список активных юристов для страницы /lawyers.
// Управление (создание/редактирование/удаление) — только через
// /api/admin/lawyers, см. adminRoutes.js.
router.get("/", getLawyers);

export default router;
