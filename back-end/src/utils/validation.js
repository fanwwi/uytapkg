import { z } from "zod";

// Нормализация номера телефона (очистка от лишних символов)
export const normalizePhone = (phone) => {
  if (!phone) return "";
  let cleaned = phone.replace(/\D/g, "");
  if (cleaned.startsWith("996")) {
    cleaned = cleaned.slice(3);
  }
  if (cleaned.length === 9) {
    return `+996${cleaned}`;
  }
  return phone.trim();
};

// Схема регистрационных данных в зависимости от роли
export const registerSchema = z.object({
  accountType: z.enum(["personal", "realtor", "agency", "developer"], {
    errorMap: () => ({ message: "Неверный тип аккаунта" }),
  }),
  email: z.string().email("Укажите корректный Email адрес"),
  phone: z.string().min(9, "Номер телефона должен содержать минимум 9 цифр"),
  password: z.string().min(6, "Пароль должен быть не менее 6 символов"),
  
  // Дополнительные поля по ролям
  firstName: z.string().optional(),
  lastName: z.string().optional(),
  fullName: z.string().optional(),
  companyName: z.string().optional(),
  directorName: z.string().optional(),
  inn: z.string().optional(),
  officeAddress: z.string().optional(),
  agencyName: z.string().optional(),
  about: z.string().optional(),
});

// Схема авторизации
export const loginSchema = z.object({
  identifier: z.string().min(1, "Укажите Email или Номер телефона"),
  password: z.string().min(1, "Введите пароль"),
});
