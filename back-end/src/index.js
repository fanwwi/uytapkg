import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import authRoutes from "./routes/authRoutes.js";
import listingsRoutes from "./routes/listingsRoutes.js";
import complexesRoutes from "./routes/complexesRoutes.js";
import aiRoutes from "./routes/aiRoutes.js";

dotenv.config();

const app = express();
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
app.use("/api/listings", listingsRoutes);
app.use("/api/complexes", complexesRoutes);
app.use("/api/ai", aiRoutes);

// Глобальный обработчик ошибок
app.use((err, req, res, next) => {
  console.error("Unhandled Server Error:", err);
  res.status(500).json({
    success: false,
    message: "Внутренняя ошибка сервера",
  });
});

app.listen(PORT, () => {
  console.log(`🚀 UyTap Backend API запущен на порту ${PORT}: http://localhost:${PORT}`);
  console.log(`📡 Готов к приему запросов от Frontend`);
});
