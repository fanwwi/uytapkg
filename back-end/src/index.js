import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import authRoutes from "./routes/authRoutes.js";
import uploadRoutes from "./routes/uploadRoutes.js";
import listingsRoutes from "./routes/listingsRoutes.js";
import complexesRoutes from "./routes/complexesRoutes.js";
import aiRoutes from "./routes/aiRoutes.js";

dotenv.config();

const app = express();
// When running behind a proxy (e.g., local dev proxies or hosting), allow
// express to trust the X-Forwarded-* headers so express-rate-limit can
// correctly determine the remote IP. See express-rate-limit docs.
app.set("trust proxy", true);
const PORT = process.env.PORT || 5000;

// Разрешенные CORS источники
const allowedOrigins = [
  "http://localhost:3000",
  "http://127.0.0.1:3000",
  "http://localhost:3001",
];

app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(null, true);
      }
    },
    credentials: true,
  })
);

app.use(express.json());

// Health Check
app.get("/api/health", (req, res) => {
  res.json({
    status: "ok",
    service: "UyTap Backend API",
    time: new Date().toISOString(),
  });
});

// Регистрация всех роутов API UyTap
app.use("/api/auth", authRoutes);
app.use("/api/upload", uploadRoutes);
app.use("/api/listings", listingsRoutes);
app.use("/api/complexes", complexesRoutes);
app.use("/api/ai", aiRoutes);

// Глобальный обработчик ошибок (включая Multer)
app.use((err, req, res, next) => {
  console.error("Unhandled Server Error:", err);

  if (err.code === "LIMIT_FILE_SIZE") {
    return res.status(400).json({
      success: false,
      message: "Превышен допустимый размер файла",
    });
  }

  if (err instanceof Error && err.message?.includes("HEIC")) {
    return res.status(400).json({
      success: false,
      message: err.message,
    });
  }

  if (err instanceof Error && err.message?.includes("Допустимы только изображения")) {
    return res.status(400).json({
      success: false,
      message: err.message,
    });
  }

  res.status(500).json({
    success: false,
    message: "Внутренняя ошибка сервера",
  });
});

app.listen(PORT, () => {
  console.log(`🚀 UyTap Backend API запущен на порту ${PORT}: http://localhost:${PORT}`);
  console.log(`📡 Готов к приему запросов от Frontend`);
});
