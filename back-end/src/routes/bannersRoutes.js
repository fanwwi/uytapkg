import express from "express";
import { getPublicBanners } from "../controllers/bannersController.js";

const router = express.Router();

// Публичный список активных рекламных баннеров — без авторизации,
// используется главной страницей. Управление — только через
// /api/admin/banners (роль admin).
router.get("/", getPublicBanners);

export default router;
