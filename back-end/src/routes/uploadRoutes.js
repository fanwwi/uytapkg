import express from "express";
import rateLimit from "express-rate-limit";
import { uploadImage, uploadListingPhoto } from "../controllers/uploadController.js";
import { uploadImageFile } from "../middleware/upload.js";
import { authenticateToken } from "../middleware/auth.js";

const router = express.Router();

const uploadLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 50,
  message: {
    success: false,
    message: "Слишком много загрузок. Попробуйте снова через 15 минут.",
  },
});

const handleImageFileUpload = (req, res, next) => {
  uploadImageFile(req, res, (err) => {
    if (err) {
      const isLimit = err.code === "LIMIT_FILE_SIZE";
      return res.status(400).json({
        success: false,
        message: isLimit
          ? "Размер файла не должен превышать 8 МБ"
          : err.message || "Ошибка загрузки файла",
      });
    }
    next();
  });
};

router.post("/", uploadLimiter, handleImageFileUpload, uploadImage);

// Фото объявлений — всегда с водяным знаком (лого UyTap), см.
// uploadController.js. Отдельный маршрут от "/", чтобы наложение
// водяного знака нельзя было обойти со стороны клиента. Требует
// авторизации (форма добавления объявления и так доступна только
// вошедшим пользователям) — дополнительно ограничивает анонимный доступ
// к CPU-затратной обработке изображений.
router.post(
  "/listing-photo",
  authenticateToken,
  uploadLimiter,
  handleImageFileUpload,
  uploadListingPhoto
);

export default router;
