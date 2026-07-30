import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import authRoutes from "./routes/authRoutes.js";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Разрешенные CORS ИСТОЧНИКИ (Next.js на порту 3000 и любые локальные разработки)
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
        callback(null, true); // Разрешаем запросы в режиме разработки
      }
    },
    credentials: true,
  })
);

app.use(express.json());

// Проверка работы API (Health check)
app.get("/api/health", (req, res) => {
  res.json({
    status: "ok",
    service: "UyTap Backend API",
    time: new Date().toISOString(),
  });
});

// Роуты аутентификации
app.use("/api/auth", authRoutes);

// Глобальный обработчик ошибок
app.use((err, req, res, next) => {
  console.error("Unhandled Server Error:", err);
  res.status(500).json({
    success: false,
    message: "Внутренняя ошибка сервера",
  });
});

app.listen(PORT, () => {
  console.log(`🚀 UyTap Backend API запущен и доступен по адресу: http://localhost:${PORT}`);
  console.log(`📡 Ожидание запросов от Frontend (Next.js)...`);
});
