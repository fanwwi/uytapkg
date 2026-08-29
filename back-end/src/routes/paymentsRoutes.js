import express from "express";
import rateLimit from "express-rate-limit";
import {
  createPayment,
  getPaymentStatus,
  cancelPayment,
  handleResultUrl,
} from "../controllers/paymentsController.js";
import { authenticateToken } from "../middleware/auth.js";

const router = express.Router();

// Ограничиваем создание платежей, чтобы нельзя было заспамить O!Dengi
// счетами или перебирать суммы (20 попыток за 15 минут на IP)
const createPaymentLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 20,
  message: {
    success: false,
    message: "Слишком много попыток оплаты. Попробуйте снова через 15 минут.",
  },
});

// Опрос статуса дергается фронтендом каждые несколько секунд, лимит мягче
const statusLimiter = rateLimit({
  windowMs: 60 * 1000,
  max: 30,
});

router.post("/create", authenticateToken, createPaymentLimiter, createPayment);
router.get("/:orderId/status", authenticateToken, statusLimiter, getPaymentStatus);
router.post("/:orderId/cancel", authenticateToken, cancelPayment);

// Публичный callback от O!Dengi (result_url) — без авторизации
router.post("/webhook", handleResultUrl);

export default router;
