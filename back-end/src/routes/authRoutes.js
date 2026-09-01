import express from "express";
import rateLimit from "express-rate-limit";
import {
  register,
  login,
  getMe,
  updateMe,
  uploadUserAvatar,
  deleteUserAvatar,
  sendOtp,
  verifyOtp,
  getUserPublicProfile,
  getVerificationStatus,
  submitVerificationRequest,
  uploadVerificationDocument,
} from "../controllers/authController.js";
import { authenticateToken } from "../middleware/auth.js";
import { uploadAvatar, uploadVerificationDocument as uploadVerificationDocumentFile } from "../middleware/upload.js";

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
router.get("/users/:id", getUserPublicProfile);

// Защищенные эндпоинты
router.get("/me", authenticateToken, getMe);
router.put("/me", authenticateToken, updateMe);

// Верификация профиля застройщика
router.get("/verification-status", authenticateToken, getVerificationStatus);
router.post("/verify-request", authenticateToken, submitVerificationRequest);
router.post(
  "/verify-documents",
  authenticateToken,
  authLimiter,
  (req, res, next) => {
    uploadVerificationDocumentFile(req, res, (err) => {
      if (err) {
        const isLimit = err.code === "LIMIT_FILE_SIZE";
        return res.status(400).json({
          success: false,
          message: isLimit
            ? "Размер файла не должен превышать 10 МБ"
            : err.message || "Ошибка загрузки файла",
        });
      }
      next();
    });
  },
  uploadVerificationDocument
);

// Аватар: multipart/form-data, поле `avatar`
router.post(
  "/avatar",
  authenticateToken,
  (req, res, next) => {
    uploadAvatar(req, res, (err) => {
      if (err) {
        const isLimit = err.code === "LIMIT_FILE_SIZE";
        return res.status(400).json({
          success: false,
          message: isLimit
            ? "Размер файла не должен превышать 5 МБ"
            : err.message || "Ошибка загрузки файла",
        });
      }
      next();
    });
  },
  uploadUserAvatar
);
router.delete("/avatar", authenticateToken, deleteUserAvatar);

export default router;
