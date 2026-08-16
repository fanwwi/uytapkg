import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import { supabase } from "../config/db.js";

dotenv.config();

const JWT_SECRET = process.env.JWT_SECRET || "uytap_fallback_jwt_secret_key_2026";

// Генерация JWT токена
export const generateToken = (payload) => {
  return jwt.sign(payload, JWT_SECRET, { expiresIn: "7d" });
};

// Middleware для проверки токена доступа
export const authenticateToken = (req, res, next) => {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];

  if (!token) {
    return res.status(401).json({
      success: false,
      message: "Требуется авторизация. Токен отсутствует.",
    });
  }

  jwt.verify(token, JWT_SECRET, async (err, decodedUser) => {
    if (err) {
      return res.status(403).json({
        success: false,
        message: "Недействительный или истекший токен авторизации.",
      });
    }

    try {
      // Подтягиваем роль и тип аккаунта пользователя из базы данных
      const { data: dbUser, error: dbError } = await supabase
        .from("users")
        .select("role, account_type")
        .eq("id", decodedUser.id)
        .single();

      let userRole = "user";

      if (dbError) {
        // PGRST204: колонка 'role' отсутствует в БД
        if (dbError.code === "PGRST204") {
          console.warn(
            "⚠️ WARNING: Column 'role' is missing in 'users' table. Please run the following SQL in your Supabase SQL Editor:\n" +
            "ALTER TABLE users ADD COLUMN role VARCHAR(20) DEFAULT 'user' CHECK (role IN ('user', 'admin'));"
          );
        } else if (dbError.code === "PGRST116") {
          // PGRST116: запись не найдена
          return res.status(404).json({
            success: false,
            message: "Пользователь не найден в системе.",
          });
        } else {
          // Другая ошибка базы данных
          console.error("Database error during user fetch:", dbError);
          return res.status(500).json({
            success: false,
            message: "Ошибка базы данных при проверке пользователя.",
          });
        }
      } else if (dbUser) {
        userRole = dbUser.role || "user";
      }

      req.user = {
        ...decodedUser,
        role: userRole,
        account_type: dbUser?.account_type || decodedUser.accountType || decodedUser.account_type,
        accountType: dbUser?.account_type || decodedUser.accountType || decodedUser.account_type,
      };
      next();
    } catch (dbQueryError) {
      console.error("Database user fetch error in auth middleware:", dbQueryError);
      return res.status(500).json({
        success: false,
        message: "Ошибка сервера при проверке прав доступа.",
      });
    }
  });
};

// Middleware для проверки роли admin
export const requireAdmin = (req, res, next) => {
  if (!req.user || req.user.role !== "admin") {
    return res.status(403).json({
      success: false,
      message: "Доступ запрещён. Требуются права администратора.",
    });
  }
  next();
};

