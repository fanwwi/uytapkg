import express from "express";
import cors from "cors";
import helmet from "helmet";
import dotenv from "dotenv";
import authRoutes from "./routes/authRoutes.js";
import uploadRoutes from "./routes/uploadRoutes.js";
import listingsRoutes from "./routes/listingsRoutes.js";
import complexesRoutes from "./routes/complexesRoutes.js";
import aiRoutes from "./routes/aiRoutes.js";
import constantsRoutes from "./routes/constantsRoutes.js";
import favoritesRoutes from "./routes/favoritesRoutes.js";
import developersRoutes from "./routes/developersRoutes.js";
import paymentsRoutes from "./routes/paymentsRoutes.js";
import adminRoutes from "./routes/adminRoutes.js";
import lawyersRoutes from "./routes/lawyersRoutes.js";
import settingsRoutes from "./routes/settingsRoutes.js";
import bannersRoutes from "./routes/bannersRoutes.js";

dotenv.config();

const app = express();
// When running behind a proxy (e.g., local dev proxies or hosting), allow
// express to trust the X-Forwarded-* headers so express-rate-limit can
// correctly determine the remote IP. See express-rate-limit docs.
app.set("trust proxy", 1);
const PORT = process.env.PORT || 5000;

// Базовые защитные HTTP-заголовки (X-Content-Type-Options, отключение
// устаревшего X-Powered-By и т.п.). CSP отключаем — этот сервер отдаёт
// только JSON API, а не HTML-страницы, так что CSP тут не применим и
// только мешал бы (например, ответам Swagger/дебаг-страниц при их наличии).
app.use(helmet({ contentSecurityPolicy: false }));

// Разрешенные CORS источники. ВАЖНО: при деплое на реальный домен
// добавьте сюда его адрес (https://uytap.kg и т.п.) — иначе фронтенд в
// проде не сможет достучаться до API из браузера.
const allowedOrigins = [
  "http://localhost:3000",
  "http://127.0.0.1:3000",
  "http://localhost:3001",
];

app.use(
  cors({
    origin: (origin, callback) => {
      // origin отсутствует у server-to-server запросов и большинства
      // прямых curl/Postman-обращений — не блокируем их, т.к. они и так
      // не подвержены браузерной CORS-модели (credential-хищение через
      // CORS работает только из чужой вкладки браузера).
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error("Origin not allowed by CORS"));
      }
    },
    credentials: true,
  })
);

app.use(express.json({ limit: "1mb" }));

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
app.use("/api/constants", constantsRoutes);
app.use("/api/favorites", favoritesRoutes);
app.use("/api/developers", developersRoutes);
app.use("/api/payments", paymentsRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/lawyers", lawyersRoutes);
app.use("/api/settings", settingsRoutes);
app.use("/api/banners", bannersRoutes);

// Глобальный обработчик ошибок (включая Multer)
app.use((err, req, res, next) => {
  console.error("Unhandled Server Error:", err);

  if (err.message === "Origin not allowed by CORS") {
    return res.status(403).json({
      success: false,
      message: "Запросы с этого источника запрещены",
    });
  }

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
