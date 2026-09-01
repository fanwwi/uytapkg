import bcrypt from "bcryptjs";
import { supabase } from "../config/db.js";
import { registerSchema, loginSchema, updateMeSchema, normalizePhone } from "../utils/validation.js";
import { generateToken } from "../middleware/auth.js";
import {
  uploadAvatarToStorage,
  removeImageFromStorage,
  uploadVerificationDocumentToStorage,
  getVerificationDocumentSignedUrl,
} from "../utils/storage.js";

const VERIFICATION_DOC_KEYS = ["document1", "document2", "document3"];

async function syncDeveloperRecord(userId, accountType, profile, phone, email) {
  try {
    if (accountType !== "developer") {
      // Удаляем из застройщиков, если тип аккаунта сменился
      await supabase
        .from("developers")
        .delete()
        .eq("user_id", userId);
      return;
    }

    const { data: dev } = await supabase
      .from("developers")
      .select("id")
      .eq("user_id", userId)
      .maybeSingle();

    let bioText = profile?.about || "";
    if (bioText.startsWith("{") && bioText.endsWith("}")) {
      try {
        const parsed = JSON.parse(bioText);
        bioText = parsed.bio || "";
      } catch (e) {}
    }

    const devData = {
      user_id: userId,
      company_name: profile?.company_name || "Застройщик",
      logo_url: profile?.avatar_url || null,
      description: bioText || null,
      phone: phone || null,
      email: email || null,
      website: profile?.website || null,
    };

    if (dev) {
      await supabase
        .from("developers")
        .update(devData)
        .eq("id", dev.id);
    } else {
      await supabase
        .from("developers")
        .insert([devData]);
    }
  } catch (err) {
    console.error("Error syncing developer record:", err);
  }
}

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
      avatarUrl, // фото профиля (для personal/realtor) или логотип (для agency/developer)
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
        return res.status(409).json({
          success: false,
          message: "Пользователь с таким Email уже зарегистрирован",
        });
      }
      if (existingUser.phone === formattedPhone) {
        return res.status(409).json({
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
    // avatar_url кладём для ЛЮБОГО типа аккаунта — это единое поле:
    // у personal/realtor это фото профиля, у agency/developer — логотип компании.
    let profileData = {
      user_id: newUser.id,
      about: about || null,
    };

    if (avatarUrl) {
      profileData.avatar_url = avatarUrl;
    }

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
    let userProfile = null;
    try {
      const { data, error } = await supabase
        .from("user_profiles")
        .insert([profileData])
        .select()
        .single();

      userProfile = data;
      if (error) {
        console.warn("Warning: Could not create user profile details:", error);
      }
    } catch (profileError) {
      console.warn("Warning: Could not create user profile details:", profileError);
    }

    // Синхронизируем запись в таблице застройщиков
    await syncDeveloperRecord(newUser.id, newUser.account_type, userProfile || profileData, newUser.phone, newUser.email);

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

    // Загрузка профиля пользователя (включая avatar_url — фото/логотип)
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
function formatProfileWithMetadata(profile) {
  if (!profile) return {};
  const formatted = { ...profile };
  const aboutText = formatted.about || "";
  if (aboutText.startsWith("{") && aboutText.endsWith("}")) {
    try {
      const parsed = JSON.parse(aboutText);
      formatted.about = parsed.bio || "";
      formatted.actualAddress = parsed.actualAddress || "";
      formatted.website = parsed.website || "";
      formatted.socials = parsed.socials || {};
      formatted.region = parsed.region || "";
    } catch (e) {}
  }
  return formatted;
}

// =======================================================
// 3a. Получение данных текущего авторизованного пользователя
// =======================================================
export const getMe = async (req, res) => {
  try {
    const userId = req.user.id;

    const { data: user, error: userError } = await supabase
      .from("users")
      .select("id, account_type, email, phone, is_verified, role, created_at")
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
        role: user.role || "user",
        profile: formatProfileWithMetadata(profile),
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
// 3b. Обновление профиля авторизованного пользователя
// =======================================================
export const updateMe = async (req, res) => {
  try {
    const userId = req.user.id;

    const validationResult = updateMeSchema.safeParse(req.body);
    if (!validationResult.success) {
      return res.status(400).json({
        success: false,
        message: "Ошибка валидации данных",
        errors: validationResult.error.errors.map((e) => e.message),
      });
    }

    const data = validationResult.data;
    const hasUserUpdates = data.phone !== undefined || data.accountType !== undefined;
    const profileFieldKeys = [
      "firstName",
      "lastName",
      "about",
      "avatarUrl",
      "fullName",
      "companyName",
      "directorName",
      "inn",
      "officeAddress",
      "agencyName",
      "actualAddress",
      "website",
      "socials",
      "region"
    ];
    const hasProfileUpdates =
      profileFieldKeys.some((key) => data[key] !== undefined) || data.accountType !== undefined;

    if (!hasUserUpdates && !hasProfileUpdates) {
      return res.status(400).json({
        success: false,
        message: "Не переданы поля для обновления",
      });
    }

    const { data: currentUser, error: currentUserError } = await supabase
      .from("users")
      .select("id, account_type, email, phone, is_verified, created_at")
      .eq("id", userId)
      .single();

    if (currentUserError || !currentUser) {
      return res.status(404).json({
        success: false,
        message: "Пользователь не найден",
      });
    }

    const { data: currentProfile } = await supabase
      .from("user_profiles")
      .select("*")
      .eq("user_id", userId)
      .maybeSingle();

    // Валидация обязательных полей для бизнес-ролей
    const targetAccountType = data.accountType || currentUser.account_type;
    if (targetAccountType === "realtor") {
      const finalFullName = data.fullName || data.firstName || currentProfile?.first_name;
      const finalInn = data.inn || currentProfile?.inn;
      const finalPhone = data.phone || currentUser.phone;
      const finalAbout = data.about || currentProfile?.about;

      if (!finalFullName || finalFullName.trim() === "") return res.status(400).json({ success: false, message: "ФИО обязательно для риэлтора" });
      if (!finalInn || finalInn.trim() === "") return res.status(400).json({ success: false, message: "ИНН обязателен для риэлтора" });
      if (!finalPhone || finalPhone.trim() === "") return res.status(400).json({ success: false, message: "Телефон обязателен для риэлтора" });
      if (!finalAbout || finalAbout.trim() === "") return res.status(400).json({ success: false, message: "Описание обязательно для риэлтора" });
    } else if (targetAccountType === "agency") {
      const finalName = data.companyName || data.agencyName || currentProfile?.company_name;
      const finalInn = data.inn || currentProfile?.inn;
      const finalOffice = data.officeAddress || currentProfile?.office_address;
      const finalPhone = data.phone || currentUser.phone;

      if (!finalName || finalName.trim() === "") return res.status(400).json({ success: false, message: "Название агентства обязательно" });
      if (!finalInn || finalInn.trim() === "") return res.status(400).json({ success: false, message: "ИНН обязателен для агентства" });
      if (!finalOffice || finalOffice.trim() === "") return res.status(400).json({ success: false, message: "Юридический адрес обязателен для агентства" });
      if (!finalPhone || finalPhone.trim() === "") return res.status(400).json({ success: false, message: "Телефон обязателен для агентства" });
    } else if (targetAccountType === "developer") {
      const finalName = data.companyName || currentProfile?.company_name;
      const finalInn = data.inn || currentProfile?.inn;
      const finalOffice = data.officeAddress || currentProfile?.office_address;
      const finalPhone = data.phone || currentUser.phone;

      if (!finalName || finalName.trim() === "") return res.status(400).json({ success: false, message: "Название компании застройщика обязательно" });
      if (!finalInn || finalInn.trim() === "") return res.status(400).json({ success: false, message: "ИНН обязателен для застройщика" });
      if (!finalOffice || finalOffice.trim() === "") return res.status(400).json({ success: false, message: "Юридический адрес обязателен для застройщика" });
      if (!finalPhone || finalPhone.trim() === "") return res.status(400).json({ success: false, message: "Телефон обязателен для застройщика" });
    }

    const userUpdates = {};
    if (data.phone !== undefined) {
      const formattedPhone = normalizePhone(data.phone);
      const { data: phoneConflict } = await supabase
        .from("users")
        .select("id")
        .eq("phone", formattedPhone)
        .neq("id", userId)
        .maybeSingle();

      if (phoneConflict) {
        return res.status(400).json({
          success: false,
          message: "Пользователь с таким номером телефона уже существует",
        });
      }
      userUpdates.phone = formattedPhone;
    }

    if (data.accountType !== undefined) {
      userUpdates.account_type = data.accountType;
    }

    if (Object.keys(userUpdates).length > 0) {
      userUpdates.updated_at = new Date().toISOString();
      const { error: userUpdateError } = await supabase
        .from("users")
        .update(userUpdates)
        .eq("id", userId);

      if (userUpdateError) {
        console.error("UpdateMe user error:", userUpdateError);
        return res.status(500).json({
          success: false,
          message: "Не удалось обновить данные пользователя",
          details: userUpdateError.message,
        });
      }
    }

    const profileUpdates = {};

    // Разбираем metadata из `about` колонки для не-personal аккаунтов
    const existingAbout = currentProfile?.about || "";
    let existingMetadata = {};
    if (existingAbout.startsWith("{") && existingAbout.endsWith("}")) {
      try {
        existingMetadata = JSON.parse(existingAbout);
      } catch (e) {}
    }

    const metadata = {
      bio: data.about !== undefined ? data.about : (existingMetadata.bio || existingAbout),
      actualAddress: data.actualAddress !== undefined ? data.actualAddress : (existingMetadata.actualAddress || ""),
      website: data.website !== undefined ? data.website : (existingMetadata.website || ""),
      socials: data.socials !== undefined ? data.socials : (existingMetadata.socials || {}),
      region: data.region !== undefined ? data.region : (existingMetadata.region || ""),
    };

    // Верификация застройщика хранится в этом же JSON — сохраняем эти поля,
    // иначе обычное редактирование профиля (сайт, соцсети и т.п.) стирало бы
    // статус/документы поданной заявки.
    if (existingMetadata.verificationStatus !== undefined) {
      metadata.verificationStatus = existingMetadata.verificationStatus;
    }
    if (existingMetadata.verificationDocs !== undefined) {
      metadata.verificationDocs = existingMetadata.verificationDocs;
    }
    if (existingMetadata.rejectionReason !== undefined) {
      metadata.rejectionReason = existingMetadata.rejectionReason;
    }

    const hasExtraUpdates =
      data.about !== undefined ||
      data.actualAddress !== undefined ||
      data.website !== undefined ||
      data.socials !== undefined ||
      data.region !== undefined;

    if (targetAccountType === "personal") {
      if (data.about !== undefined) profileUpdates.about = data.about;
    } else {
      if (hasExtraUpdates) {
        profileUpdates.about = JSON.stringify(metadata);
      }
    }

    if (data.inn !== undefined) profileUpdates.inn = data.inn;
    if (data.officeAddress !== undefined) profileUpdates.office_address = data.officeAddress;
    if (data.lastName !== undefined) profileUpdates.last_name = data.lastName;

    if (data.firstName !== undefined) profileUpdates.first_name = data.firstName;
    if (data.fullName !== undefined) profileUpdates.first_name = data.fullName;
    if (data.directorName !== undefined) profileUpdates.first_name = data.directorName;

    if (data.companyName !== undefined) profileUpdates.company_name = data.companyName;
    if (data.agencyName !== undefined) profileUpdates.company_name = data.agencyName;

    if (data.avatarUrl !== undefined) {
      const oldAvatarUrl = currentProfile?.avatar_url;
      profileUpdates.avatar_url = data.avatarUrl;

      if (oldAvatarUrl && oldAvatarUrl !== data.avatarUrl) {
        await removeImageFromStorage(oldAvatarUrl);
      }
    }

    let profile = currentProfile;

    if (Object.keys(profileUpdates).length > 0) {
      profileUpdates.updated_at = new Date().toISOString();

      if (currentProfile) {
        const { data: updatedProfile, error: profileError } = await supabase
          .from("user_profiles")
          .update(profileUpdates)
          .eq("user_id", userId)
          .select()
          .single();

        if (profileError) {
          console.error("UpdateMe profile error:", profileError);
          return res.status(500).json({
            success: false,
            message: "Не удалось обновить профиль",
            details: profileError.message,
          });
        }
        profile = updatedProfile;
      } else {
        const { data: insertedProfile, error: profileError } = await supabase
          .from("user_profiles")
          .insert([{ user_id: userId, ...profileUpdates }])
          .select()
          .single();

        if (profileError) {
          console.error("UpdateMe profile insert error:", profileError);
          return res.status(500).json({
            success: false,
            message: "Не удалось создать профиль",
            details: profileError.message,
          });
        }
        profile = insertedProfile;
      }
    }

    const { data: updatedUser, error: fetchUserError } = await supabase
      .from("users")
      .select("id, account_type, email, phone, is_verified, created_at")
      .eq("id", userId)
      .single();

    if (!fetchUserError && updatedUser) {
      await syncDeveloperRecord(userId, updatedUser.account_type, profile, updatedUser.phone, updatedUser.email);
    }

    if (fetchUserError || !updatedUser) {
      return res.status(500).json({
        success: false,
        message: "Не удалось получить обновлённые данные пользователя",
      });
    }

    return res.json({
      success: true,
      message: "Профиль успешно обновлён",
      user: {
        id: updatedUser.id,
        accountType: updatedUser.account_type,
        email: updatedUser.email,
        phone: updatedUser.phone,
        isVerified: updatedUser.is_verified,
        profile: formatProfileWithMetadata(profile),
      },
    });
  } catch (error) {
    console.error("UpdateMe Error:", error);
    return res.status(500).json({
      success: false,
      message: "Ошибка сервера при обновлении профиля",
    });
  }
};

// =======================================================
// 4. Загрузка аватара / логотипа (multipart, поле `avatar`)
// =======================================================
export const uploadUserAvatar = async (req, res) => {
  try {
    const userId = req.user.id;

    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: "Файл аватара не передан. Ожидается поле формы `avatar`.",
      });
    }

    const { data: existingProfile, error: profileSelectError } = await supabase
      .from("user_profiles")
      .select("id, avatar_url")
      .eq("user_id", userId)
      .maybeSingle();

    if (profileSelectError) {
      console.warn("Upload Avatar profile select warning:", profileSelectError);
    }

    const { publicUrl } = await uploadAvatarToStorage(userId, req.file);

    const { data, error } = await supabase
      .from("user_profiles")
      .upsert(
        {
          user_id: userId,
          avatar_url: publicUrl,
          updated_at: new Date().toISOString(),
        },
        { onConflict: "user_id" },
      )
      .select()
      .single();

    if (error) {
      console.error("Avatar profile upsert error:", error);
      return res.status(500).json({
        success: false,
        message: "Файл загружен, но не удалось сохранить профиль",
        details: error.message,
      });
    }

    const profile = data;

    if (existingProfile?.avatar_url && existingProfile.avatar_url !== publicUrl) {
      await removeImageFromStorage(existingProfile.avatar_url);
    }

    return res.json({
      success: true,
      message: "Аватар успешно загружен",
      avatar_url: publicUrl,
      profile,
    });
  } catch (error) {
    console.error("Upload Avatar Error:", error);
    return res.status(500).json({
      success: false,
      message: error.message || "Ошибка сервера при загрузке аватара",
    });
  }
};

// =======================================================
// 5. Удаление аватара
// =======================================================
export const deleteUserAvatar = async (req, res) => {
  try {
    const userId = req.user.id;

    const { data: existingProfile } = await supabase
      .from("user_profiles")
      .select("avatar_url")
      .eq("user_id", userId)
      .maybeSingle();

    if (!existingProfile?.avatar_url) {
      return res.status(404).json({
        success: false,
        message: "Аватар не установлен",
      });
    }

    const oldUrl = existingProfile.avatar_url;

    const { data: profile, error } = await supabase
      .from("user_profiles")
      .update({ avatar_url: null, updated_at: new Date().toISOString() })
      .eq("user_id", userId)
      .select()
      .single();

    if (error) {
      return res.status(500).json({
        success: false,
        message: "Не удалось удалить аватар из профиля",
        details: error.message,
      });
    }

    await removeImageFromStorage(oldUrl);

    return res.json({
      success: true,
      message: "Аватар удалён",
      profile,
    });
  } catch (error) {
    console.error("Delete Avatar Error:", error);
    return res.status(500).json({
      success: false,
      message: "Ошибка сервера при удалении аватара",
    });
  }
};

// =======================================================
// 6. Отправка и проверка WhatsApp / SMS OTP кодов (Заготовка)
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

// =======================================================
// 7. Получение публичного профиля пользователя по ID
// =======================================================
export const getUserPublicProfile = async (req, res) => {
  try {
    const { id } = req.params;

    let user = null;
    const { data: userRow } = await supabase
      .from("users")
      .select("id, account_type, email, phone, is_verified, created_at")
      .eq("id", id)
      .maybeSingle();

    if (userRow) {
      user = userRow;
    } else {
      // Попробуем поискать по developers.id
      const { data: devRow } = await supabase
        .from("developers")
        .select("user_id")
        .eq("id", id)
        .maybeSingle();

      if (devRow && devRow.user_id) {
        const { data: userByDev } = await supabase
          .from("users")
          .select("id, account_type, email, phone, is_verified, created_at")
          .eq("id", devRow.user_id)
          .maybeSingle();
        user = userByDev;
      }
    }

    if (!user) {
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

    // Fetch active listings for this user
    const { data: listings } = await supabase
      .from("listings")
      .select(`
        *,
        listing_photos (id, url, is_main, display_order)
      `)
      .eq("user_id", user.id)
      .eq("status", "active")
      .order("created_at", { ascending: false });

    // If developer, fetch complexes!
    let complexes = [];
    if (user.account_type === "developer") {
      const { data: devRow } = await supabase
        .from("developers")
        .select("id")
        .eq("user_id", user.id)
        .maybeSingle();

      if (devRow) {
        const { data: devComplexes } = await supabase
          .from("residential_complexes")
          .select("*")
          .eq("developer_id", devRow.id)
          .order("created_at", { ascending: false });
        complexes = devComplexes || [];
      }
    }

    return res.json({
      success: true,
      user: {
        id: user.id,
        type: user.account_type,
        email: user.email,
        phone: user.phone,
        isVerified: user.is_verified,
        createdAt: user.created_at,
        profile: formatProfileWithMetadata(profile),
        ads: listings || [],
        complexes: complexes || []
      }
    });
  } catch (error) {
    console.error("GetUserPublicProfile Error:", error);
    return res.status(500).json({
      success: false,
      message: "Ошибка сервера при получении публичного профиля",
    });
  }
};

// =======================================================
// 10. Загрузка, подача и статус заявки на верификацию застройщика
// =======================================================

// 10a. Загрузка одного документа верификации (POST /api/auth/verify-documents)
// Документы — чувствительные данные (паспорт, регистрационные бумаги),
// поэтому эндпоинт защищён авторизацией и хранит файлы в приватном бакете
// (в отличие от публичного /api/upload, который отдаёт открытые ссылки).
export const uploadVerificationDocument = async (req, res) => {
  try {
    if (req.user.account_type !== "developer") {
      return res.status(403).json({
        success: false,
        message: "Загрузка документов верификации доступна только застройщикам",
      });
    }

    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: "Файл не передан. Ожидается поле формы `document`.",
      });
    }

    const { objectPath } = await uploadVerificationDocumentToStorage(req.user.id, req.file);
    const signedUrl = await getVerificationDocumentSignedUrl(objectPath);

    return res.json({
      success: true,
      path: objectPath,
      previewUrl: signedUrl,
    });
  } catch (error) {
    console.error("Upload Verification Document Error:", error);
    return res.status(500).json({
      success: false,
      message: error.message || "Ошибка сервера при загрузке документа",
    });
  }
};

// 10b. Подача заявки на верификацию (POST /api/auth/verify-request)
export const submitVerificationRequest = async (req, res) => {
  try {
    const userId = req.user.id;

    if (req.user.account_type !== "developer") {
      return res.status(403).json({
        success: false,
        message: "Верификация доступна только аккаунтам застройщика",
      });
    }

    const { documents } = req.body;

    if (!documents || typeof documents !== "object" || Array.isArray(documents)) {
      return res.status(400).json({
        success: false,
        message: "Необходимо передать загруженные документы для проверки",
      });
    }

    // Принимаем только ожидаемые ключи, и только пути, которые
    // uploadVerificationDocument выдал именно этому пользователю —
    // это не даёт подставить чужой документ или произвольную ссылку.
    const sanitizedDocuments = {};
    for (const key of VERIFICATION_DOC_KEYS) {
      const value = documents[key];
      if (typeof value !== "string" || !value.startsWith(`${userId}/`)) {
        return res.status(400).json({
          success: false,
          message: "Все документы должны быть загружены через /verify-documents перед отправкой заявки",
        });
      }
      sanitizedDocuments[key] = value;
    }

    const { data: profile } = await supabase
      .from("user_profiles")
      .select("*")
      .eq("user_id", userId)
      .maybeSingle();

    let aboutMeta = {};
    if (profile?.about && profile.about.startsWith("{") && profile.about.endsWith("}")) {
      try {
        aboutMeta = JSON.parse(profile.about);
      } catch (e) {}
    } else if (profile?.about) {
      aboutMeta = { bio: profile.about };
    }

    aboutMeta.verificationStatus = "pending";
    aboutMeta.verificationDocs = sanitizedDocuments;
    aboutMeta.rejectionReason = "";

    const updatedAbout = JSON.stringify(aboutMeta);

    if (profile) {
      await supabase
        .from("user_profiles")
        .update({ about: updatedAbout })
        .eq("id", profile.id);
    } else {
      await supabase
        .from("user_profiles")
        .insert([{ user_id: userId, about: updatedAbout }]);
    }

    await supabase
      .from("users")
      .update({ is_verified: false })
      .eq("id", userId);

    return res.json({
      success: true,
      message: "Заявка на верификацию успешно отправлена на рассмотрение",
      status: "pending",
    });
  } catch (error) {
    console.error("Submit Verification Error:", error);
    return res.status(500).json({
      success: false,
      message: "Ошибка сервера при отправке заявки на верификацию",
    });
  }
};

export const getVerificationStatus = async (req, res) => {
  try {
    const userId = req.user.id;

    const { data: user } = await supabase
      .from("users")
      .select("id, is_verified")
      .eq("id", userId)
      .single();

    const { data: profile } = await supabase
      .from("user_profiles")
      .select("about")
      .eq("user_id", userId)
      .maybeSingle();

    let aboutMeta = {};
    if (profile?.about && profile.about.startsWith("{") && profile.about.endsWith("}")) {
      try {
        aboutMeta = JSON.parse(profile.about);
      } catch (e) {}
    }

    let status = aboutMeta.verificationStatus || (user?.is_verified ? "approved" : "none");
    if (user?.is_verified) {
      status = "approved";
    }

    // `documents` содержит пути хранилища (нужны, чтобы повторно отправить
    // заявку без переза­грузки файлов — путь сам по себе не даёт доступа,
    // бакет приватный). `previewUrls` — временные подписанные ссылки для
    // просмотра владельцем.
    let documents = null;
    let previewUrls = null;
    if (aboutMeta.verificationDocs && typeof aboutMeta.verificationDocs === "object") {
      documents = {};
      previewUrls = {};
      for (const key of VERIFICATION_DOC_KEYS) {
        const path = aboutMeta.verificationDocs[key];
        if (path) {
          documents[key] = path;
          previewUrls[key] = await getVerificationDocumentSignedUrl(path);
        }
      }
    }

    return res.json({
      success: true,
      isVerified: Boolean(user?.is_verified),
      status,
      documents,
      previewUrls,
      rejectionReason: aboutMeta.rejectionReason || "",
    });
  } catch (error) {
    console.error("Get Verification Status Error:", error);
    return res.status(500).json({
      success: false,
      message: "Ошибка сервера при получении статуса верификации",
    });
  }
};
