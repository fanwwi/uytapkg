import express from "express";
import rateLimit from "express-rate-limit";
import { uploadImage } from "../controllers/uploadController.js";
import { uploadImageFile } from "../middleware/upload.js";

const router = express.Router();

const uploadLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 50,
  message: {
    success: false,
    message: "Слишком много загрузок. Попробуйте снова через 15 минут.",
  },
});

router.post(
  "/",
  uploadLimiter,
  (req, res, next) => {
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
  },
  uploadImage
);

export default router;
