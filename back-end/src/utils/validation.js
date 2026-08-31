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

  // Фото/лого профиля — общее поле для всех типов аккаунта
  // (для personal/realtor это аватар, для agency/developer — логотип компании)
  avatarUrl: z.string().url("Некорректная ссылка на фото").optional().nullable(),
});

// Схема авторизации
export const loginSchema = z.object({
  identifier: z.string().min(1, "Укажите Email или Номер телефона"),
  password: z.string().min(1, "Введите пароль"),
});

// Схема обновления профиля (PUT /api/auth/me)
export const updateMeSchema = z.object({
  firstName: z.string().optional().nullable(),
  lastName: z.string().optional().nullable(),
  phone: z.string().min(9, "Номер телефона должен содержать минимум 9 цифр").optional(),
  about: z.string().optional().nullable(),
  avatarUrl: z
    .union([z.string().url("Некорректная ссылка на фото"), z.null()])
    .optional(),
  accountType: z.enum(["personal", "realtor", "agency", "developer"]).optional(),
  fullName: z.string().optional().nullable(),
  companyName: z.string().optional().nullable(),
  directorName: z.string().optional().nullable(),
  inn: z.string().optional().nullable(),
  officeAddress: z.string().optional().nullable(),
  agencyName: z.string().optional().nullable(),
  actualAddress: z.string().optional().nullable(),
  website: z.string().optional().nullable(),
  socials: z.any().optional(),
  region: z.string().optional().nullable(),
});

// Схема создания объявления (POST /api/listings)
export const createListingSchema = z
  .object({
    title: z
      .string({ required_error: "Укажите заголовок" })
      .min(5, "Заголовок должен содержать не менее 5 символов")
      .max(255, "Заголовок не должен превышать 255 символов"),
    description: z.string().optional().nullable(),
    propertyType: z.enum(
      ["apartment", "house", "land", "commercial", "room", "garage"],
      {
        errorMap: () => ({ message: "Укажите корректный тип недвижимости" }),
      }
    ),
    dealType: z.enum(["sale", "rent"], {
      errorMap: () => ({ message: "Укажите тип сделки (sale или rent)" }),
    }),
    rentPeriod: z
      .enum(["hourly", "daily", "weekly", "monthly", "long_term"], {
        errorMap: () => ({ message: "Некорректный период аренды" }),
      })
      .optional()
      .nullable(),
    country: z.string().optional().nullable(),
    region: z.string({ required_error: "Укажите регион" }).min(1, "Укажите регион"),
    city: z.string().optional().nullable(),
    district: z.string().optional().nullable(),
    microdistrict: z.string().optional().nullable(),
    address: z.string().optional().nullable(),
    latitude: z.number().optional().nullable(),
    longitude: z.number().optional().nullable(),
    price: z
      .number({ required_error: "Укажите цену", invalid_type_error: "Цена должна быть числом" })
      .positive("Цена должна быть положительным числом"),
    priceFrom: z.number().optional().nullable(),
    priceTo: z.number().optional().nullable(),
    currency: z
      .enum(["KGS", "USD"], {
        errorMap: () => ({ message: "Валюта должна быть KGS или USD" }),
      })
      .default("KGS")
      .optional()
      .nullable(),
    area: z
      .number({ invalid_type_error: "Площадь должна быть числом" })
      .positive("Площадь должна быть положительным числом")
      .optional()
      .nullable(),
    areaFrom: z.number().optional().nullable(),
    areaTo: z.number().optional().nullable(),
    rooms: z
      .number({ invalid_type_error: "Количество комнат должно быть числом" })
      .int("Количество комнат должно быть целым числом")
      .positive("Количество комнат должно быть положительным числом")
      .optional()
      .nullable(),
    floor: z
      .number({ invalid_type_error: "Этаж должен быть числом" })
      .int("Этаж должен быть целым числом")
      .optional()
      .nullable(),
    totalFloors: z
      .number({ invalid_type_error: "Этажность должна быть числом" })
      .int("Этажность должна быть целым числом")
      .optional()
      .nullable(),
    beachDistanceFrom: z.number().optional().nullable(),
    beachDistanceTo: z.number().optional().nullable(),
    developerOrComplex: z.string().optional().nullable(),
    listingType: z.string().optional().nullable(),
    isResort: z.boolean().optional(),
    resortFilters: z.record(z.any()).optional(),
    features: z.record(z.any()).optional(),
    photos: z.array(z.string()).optional(),
  })
  .passthrough()
  .superRefine((data, ctx) => {
    if (data.dealType === "rent" && !data.rentPeriod) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Для аренды необходимо указать период аренды (rentPeriod)",
        path: ["rentPeriod"],
      });
    }
  });

// Схема обновления объявления (PUT /api/listings/:id)
export const updateListingSchema = z
  .object({
    title: z
      .string()
      .min(5, "Заголовок должен содержать не менее 5 символов")
      .max(255, "Заголовок не должен превышать 255 символов")
      .optional(),
    description: z.string().optional().nullable(),
    propertyType: z
      .enum(["apartment", "house", "land", "commercial", "room", "garage"], {
        errorMap: () => ({ message: "Укажите корректный тип недвижимости" }),
      })
      .optional(),
    dealType: z
      .enum(["sale", "rent"], {
        errorMap: () => ({ message: "Укажите тип сделки (sale или rent)" }),
      })
      .optional(),
    rentPeriod: z
      .enum(["hourly", "daily", "weekly", "monthly", "long_term"], {
        errorMap: () => ({ message: "Некорректный период аренды" }),
      })
      .optional()
      .nullable(),
    country: z.string().optional().nullable(),
    region: z.string().min(1, "Укажите регион").optional(),
    city: z.string().optional().nullable(),
    district: z.string().optional().nullable(),
    microdistrict: z.string().optional().nullable(),
    address: z.string().optional().nullable(),
    latitude: z.number().optional().nullable(),
    longitude: z.number().optional().nullable(),
    price: z
      .number({ invalid_type_error: "Цена должна быть числом" })
      .positive("Цена должна быть положительным числом")
      .optional(),
    priceFrom: z.number().optional().nullable(),
    priceTo: z.number().optional().nullable(),
    currency: z
      .enum(["KGS", "USD"], {
        errorMap: () => ({ message: "Валюта должна быть KGS или USD" }),
      })
      .optional()
      .nullable(),
    area: z
      .number({ invalid_type_error: "Площадь должна быть числом" })
      .positive("Площадь должна быть положительным числом")
      .optional()
      .nullable(),
    areaFrom: z.number().optional().nullable(),
    areaTo: z.number().optional().nullable(),
    rooms: z
      .number({ invalid_type_error: "Количество комнат должно быть числом" })
      .int("Количество комнат должно быть целым числом")
      .positive("Количество комнат должно быть положительным числом")
      .optional()
      .nullable(),
    floor: z
      .number({ invalid_type_error: "Этаж должен быть числом" })
      .int("Этаж должен быть целым числом")
      .optional()
      .nullable(),
    totalFloors: z
      .number({ invalid_type_error: "Этажность должна быть числом" })
      .int("Этажность должна быть целым числом")
      .optional()
      .nullable(),
    status: z
      .enum(["active", "hidden", "draft", "moderation"], {
        errorMap: () => ({ message: "Некорректный статус объявления" }),
      })
      .optional(),
    promotionStatus: z
      .enum(["regular", "vip", "top"], {
        errorMap: () => ({ message: "Некорректный статус продвижения" }),
      })
      .optional(),
    isUrgent: z.boolean().optional(),
    beachDistanceFrom: z.number().optional().nullable(),
    beachDistanceTo: z.number().optional().nullable(),
    developerOrComplex: z.string().optional().nullable(),
    listingType: z.string().optional().nullable(),
    isResort: z.boolean().optional(),
    resortFilters: z.record(z.any()).optional(),
    features: z.record(z.any()).optional(),
    photos: z.array(z.string()).optional(),
    userId: z.any().optional(),
    user_id: z.any().optional(),
  })
  .passthrough()
  .superRefine((data, ctx) => {
    if (data.dealType === "rent" && data.rentPeriod === null) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Для аренды необходимо указать период аренды (rentPeriod)",
        path: ["rentPeriod"],
      });
    }
  });

// Схема создания Жилого Комплекса (POST /api/complexes)
export const createComplexSchema = z
  .object({
    name: z.string({ required_error: "Укажите название ЖК" }).min(2, "Название ЖК слишком короткое"),
    description: z.string().optional().nullable(),
    region: z.string().optional().nullable(),
    city: z.string().optional().nullable(),
    address: z.string().optional().nullable(),
    status: z.string().optional().nullable(),
    class: z.string().optional().nullable(),
    construction: z.string().optional().nullable(),
    completionDate: z.string().optional().nullable(),
    floors: z.union([z.number(), z.string()]).optional().nullable(),
    blocks: z.union([z.number(), z.string()]).optional().nullable(),
    apartments: z.union([z.number(), z.string()]).optional().nullable(),
    parking: z.union([z.number(), z.string()]).optional().nullable(),
    ceilingHeight: z.union([z.number(), z.string()]).optional().nullable(),
    area: z.union([z.number(), z.string()]).optional().nullable(),
    areaSotka: z.union([z.number(), z.string()]).optional().nullable(),
    documentsUrl: z
      .string({ required_error: "Укажите ссылку на документы ЖК" })
      .min(1, "Укажите ссылку на документы ЖК"),
    amenities: z.array(z.string()).optional(),
    images: z.array(z.string()).optional(),
    features: z.record(z.any()).optional(),
  })
  .passthrough();

// Схема обновления Жилого Комплекса (PUT /api/complexes/:id)
export const updateComplexSchema = createComplexSchema.partial();

// Схема добавления юриста (POST /api/admin/lawyers)
export const createLawyerSchema = z.object({
  lastName: z.string({ required_error: "Укажите фамилию" }).min(1, "Укажите фамилию"),
  firstName: z.string({ required_error: "Укажите имя" }).min(1, "Укажите имя"),
  middleName: z.string().optional().nullable(),
  specialization: z
    .string({ required_error: "Укажите специализацию" })
    .min(1, "Укажите специализацию"),
  experience: z.string({ required_error: "Укажите опыт работы" }).min(1, "Укажите опыт работы"),
  phone: z.string().optional().nullable(),
  whatsapp: z.string().optional().nullable(),
  description: z.string().optional().nullable(),
  active: z.boolean().optional(),
});

// Схема обновления юриста (PUT /api/admin/lawyers/:id)
export const updateLawyerSchema = createLawyerSchema.partial();


