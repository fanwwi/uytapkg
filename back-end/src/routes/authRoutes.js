import express from "express";
import rateLimit from "express-rate-limit";
import { register, login, getMe, sendOtp, verifyOtp } from "../controllers/authController.js";
import { authenticateToken } from "../middleware/auth.js";

const router = express.Router();

// Лимит попыток регистрации/авторизации (100 запросов за 15 минут)
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  message: {
    success: false,
    message: "Слишком много запросов. Попробуйте снова через 15 минут.",
  },
});

// Публичные эндпоинты
router.post("/register", authLimiter, register);
router.post("/login", authLimiter, login);
router.post("/send-otp", authLimiter, sendOtp);
router.post("/verify-otp", authLimiter, verifyOtp);

// Защищенные эндпоинты
router.get("/me", authenticateToken, getMe);

export default router;
