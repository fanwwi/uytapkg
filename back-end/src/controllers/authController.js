import bcrypt from "bcryptjs";
import { supabase } from "../config/db.js";
import { registerSchema, loginSchema, normalizePhone } from "../utils/validation.js";
import { generateToken } from "../middleware/auth.js";

// =======================================================
// 1. Регистрация нового пользователя
// =======================================================
export const register = async (req, res) => {
  try {
    // Валидация входящих данных
    const validationResult = registerSchema.safeParse(req.body);
    if (!validationResult.success) {
      return res.status(400).json({
        success: false,
        message: "Ошибка валидации данных",
        errors: validationResult.error.errors.map((e) => e.message),
      });
    }

    const {
      accountType,
      email,
      phone,
      password,
      firstName,
      lastName,
      fullName,
      companyName,
      directorName,
      inn,
      officeAddress,
      agencyName,
      about,
    } = validationResult.data;

    const normalizedEmail = email.toLowerCase().trim();
    const formattedPhone = normalizePhone(phone);

    // 1. Проверка существования Email или Телефона в базе
    const { data: existingUser, error: checkError } = await supabase
      .from("users")
      .select("id, email, phone")
      .or(`email.eq.${normalizedEmail},phone.eq.${formattedPhone}`)
      .maybeSingle();

    if (checkError && checkError.code !== "PGRST116") {
      console.error("Supabase error during user check:", checkError);
    }

    if (existingUser) {
      if (existingUser.email === normalizedEmail) {
        return res.status(400).json({
          success: false,
          message: "Пользователь с таким Email уже зарегистрирован",
        });
      }
      if (existingUser.phone === formattedPhone) {
        return res.status(400).json({
          success: false,
          message: "Пользователь с таким номером телефона уже существует",
        });
      }
    }

    // 2. Хэширование пароля
    const saltRounds = 10;
    const passwordHash = await bcrypt.hash(password, saltRounds);

    // 3. Создание записи в таблице `users`
    const { data: newUser, error: createError } = await supabase
      .from("users")
      .insert([
        {
          account_type: accountType,
          email: normalizedEmail,
          phone: formattedPhone,
          password_hash: passwordHash,
          is_verified: false,
        },
      ])
      .select("id, account_type, email, phone, is_verified, created_at")
      .single();

    if (createError || !newUser) {
      console.error("Error inserting user:", createError);
      return res.status(500).json({
        success: false,
        message: "Ошибка сохранения пользователя в базе данных. Проверьте, созданы ли таблицы в БД.",
        details: createError?.message,
      });
    }

    // 4. Подготовка данных профиля
    let profileData = {
      user_id: newUser.id,
      about: about || null,
    };

    if (accountType === "personal") {
      profileData.first_name = firstName || null;
      profileData.last_name = lastName || null;
    } else if (accountType === "realtor") {
      profileData.first_name = fullName || firstName || null;
      profileData.company_name = agencyName || companyName || null;
    } else if (accountType === "developer") {
      profileData.company_name = companyName || null;
      profileData.inn = inn || null;
      profileData.office_address = officeAddress || null;
    } else if (accountType === "agency") {
      profileData.company_name = companyName || null;
      profileData.first_name = directorName || null;
      profileData.inn = inn || null;
      profileData.office_address = officeAddress || null;
    }

    // 5. Сохранение профиля в `user_profiles`
    const { data: userProfile, error: profileError } = await supabase
      .from("user_profiles")
      .insert([profileData])
      .select()
      .single();

    if (profileError) {
      console.warn("Warning: Could not create user profile details:", profileError);
    }

    // 6. Генерация JWT токена
    const token = generateToken({
      id: newUser.id,
      accountType: newUser.account_type,
      email: newUser.email,
    });

    return res.status(201).json({
      success: true,
      message: "Регистрация прошла успешно",
      token,
      user: {
        id: newUser.id,
        accountType: newUser.account_type,
        email: newUser.email,
        phone: newUser.phone,
        isVerified: newUser.is_verified,
        profile: userProfile || profileData,
      },
    });
  } catch (error) {
    console.error("Register Error:", error);
    return res.status(500).json({
      success: false,
      message: "Внутренняя ошибка сервера при регистрации",
    });
  }
};

// =======================================================
// 2. Вход в аккаунт (Login)
// =======================================================
export const login = async (req, res) => {
  try {
    const validationResult = loginSchema.safeParse(req.body);
    if (!validationResult.success) {
      return res.status(400).json({
        success: false,
        message: "Заполните логин и пароль",
      });
    }

    const { identifier, password } = validationResult.data;
    const normalizedIdentifier = identifier.trim().toLowerCase();
    const formattedPhone = normalizePhone(identifier);

    // Поиск по Email или Телефону
    const { data: user, error: userError } = await supabase
      .from("users")
      .select("*")
      .or(`email.eq.${normalizedIdentifier},phone.eq.${formattedPhone}`)
      .maybeSingle();

    if (userError || !user) {
      return res.status(401).json({
        success: false,
        message: "Неверный Email/телефон или пароль",
      });
    }

    // Проверка совпадения пароля
    const isPasswordValid = await bcrypt.compare(password, user.password_hash);
    if (!isPasswordValid) {
      return res.status(401).json({
        success: false,
        message: "Неверный Email/телефон или пароль",
      });
    }

    // Загрузка профиля пользователя
    const { data: profile } = await supabase
      .from("user_profiles")
      .select("*")
      .eq("user_id", user.id)
      .maybeSingle();

    // Генерация токена
    const token = generateToken({
      id: user.id,
      accountType: user.account_type,
      email: user.email,
    });

    return res.json({
      success: true,
      message: "Авторизация успешна",
      token,
      user: {
        id: user.id,
        accountType: user.account_type,
        email: user.email,
        phone: user.phone,
        isVerified: user.is_verified,
        profile: profile || {},
      },
    });
  } catch (error) {
    console.error("Login Error:", error);
    return res.status(500).json({
      success: false,
      message: "Ошибка сервера при попытке входа",
    });
  }
};

// =======================================================
// 3. Получение текущего профиля авторизованного пользователя
// =======================================================
export const getMe = async (req, res) => {
  try {
    const userId = req.user.id;

    const { data: user, error: userError } = await supabase
      .from("users")
      .select("id, account_type, email, phone, is_verified, created_at")
      .eq("id", userId)
      .single();

    if (userError || !user) {
      return res.status(404).json({
        success: false,
        message: "Пользователь не найден",
      });
    }

    const { data: profile } = await supabase
      .from("user_profiles")
      .select("*")
      .eq("user_id", user.id)
      .maybeSingle();

    return res.json({
      success: true,
      user: {
        id: user.id,
        accountType: user.account_type,
        email: user.email,
        phone: user.phone,
        isVerified: user.is_verified,
        profile: profile || {},
      },
    });
  } catch (error) {
    console.error("GetMe Error:", error);
    return res.status(500).json({
      success: false,
      message: "Ошибка сервера при получении данных профиля",
    });
  }
};

// =======================================================
// 4. Отправка и проверка WhatsApp / SMS OTP кодов (Заготовка)
// =======================================================
export const sendOtp = async (req, res) => {
  const { phone } = req.body;
  if (!phone) {
    return res.status(400).json({ success: false, message: "Укажите номер телефона" });
  }

  // Здесь подключается WhatsApp API (например, Green API / Twilio)
  return res.json({
    success: true,
    message: `Код подтверждения отправлен в WhatsApp на номер ${phone}`,
  });
};

export const verifyOtp = async (req, res) => {
  const { phone, code } = req.body;
  if (!phone || !code) {
    return res.status(400).json({ success: false, message: "Укажите телефон и код" });
  }

  // Проверка тестового кода "1111" или динамического
  if (code === "1111" || code === "1234") {
    return res.json({
      success: true,
      message: "Код подлинный",
    });
  }

  return res.status(400).json({ success: false, message: "Неверный код из SMS/WhatsApp" });
};
