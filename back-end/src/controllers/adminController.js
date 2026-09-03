import { supabase } from "../config/db.js";
import { getTariff, calculateTariffTotal } from "../constants/tariffs.js";
import { createLawyerSchema, updateLawyerSchema, pricingSchema } from "../utils/validation.js";
import { toPublicLawyer } from "./lawyersController.js";
import { getVerificationDocumentSignedUrl } from "../utils/storage.js";
import { getPricingSettings, savePricingSettings } from "../utils/pricingSettings.js";
import { listAllBanners } from "../utils/bannersStore.js";

const VERIFICATION_DOC_KEYS = ["document1", "document2", "document3"];
const MAX_REJECTION_REASON_LENGTH = 1000;

// =======================================================
// Сводная статистика для главной страницы админки (GET /api/admin/stats)
//
// Все счётчики считаются на сервере из реальных данных — раньше на
// дашборде были захардкожены фиктивные цифры. "Период" соответствует
// подписи на дашборде ("последние 30 дней") и относится к новым
// пользователям и оплатам; баннеры/юристы — это текущий инвентарь
// админки, поэтому считаются целиком, без временного окна.
// =======================================================
export const getDashboardStats = async (req, res) => {
  try {
    const periodStart = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString();

    const [
      newUsersResult,
      paymentsResult,
      lawyersResult,
      banners,
    ] = await Promise.all([
      supabase
        .from("users")
        .select("id", { count: "exact", head: true })
        .gte("created_at", periodStart),
      supabase
        .from("payments")
        .select("id", { count: "exact", head: true })
        .eq("status", "approved")
        .gte("created_at", periodStart),
      supabase.from("lawyers").select("id", { count: "exact", head: true }),
      listAllBanners(),
    ]);

    if (newUsersResult.error) {
      console.error("Dashboard Stats — users count error:", newUsersResult.error);
    }
    if (paymentsResult.error) {
      console.error("Dashboard Stats — payments count error:", paymentsResult.error);
    }
    if (lawyersResult.error) {
      console.error("Dashboard Stats — lawyers count error:", lawyersResult.error);
    }

    return res.json({
      success: true,
      data: {
        newUsersCount: newUsersResult.count || 0,
        paymentsCount: paymentsResult.count || 0,
        bannersCount: (banners || []).length,
        lawyersCount: lawyersResult.count || 0,
      },
    });
  } catch (error) {
    console.error("Get Dashboard Stats Controller Error:", error);
    return res.status(500).json({
      success: false,
      message: "Не удалось получить статистику дашборда",
    });
  }
};

// =======================================================
// Список платежей для админ-панели (GET /api/admin/payments)
//
// Доступ проверяется в роуте через authenticateToken + requireAdmin —
// этот контроллер полагается на то, что до него дошли только админы.
// =======================================================
export const listPayments = async (req, res) => {
  try {
    const { data, error } = await supabase
      .from("payments")
      .select("*, users(email, phone)")
      .order("created_at", { ascending: false })
      .limit(200);

    if (error) {
      console.error("Admin List Payments Error:", error);
      return res.status(500).json({
        success: false,
        message: "Ошибка при получении списка платежей",
      });
    }

    const pricing = await getPricingSettings();

    const payments = (data || []).map((payment) => {
      const tariff = getTariff(payment.tariff_id, pricing);
      // Пересчитываем цену/мес и скидку по тем же правилам, что и при
      // создании платежа — в БД хранится только итоговая сумма. Обрати
      // внимание: если админ поменял цену тарифа ПОСЛЕ оплаты, здесь
      // отобразится текущая (актуальная), а не историческая цена — это
      // ожидаемо, т.к. фактическая сумма платежа берётся из payment.amount.
      const calc = calculateTariffTotal(payment.tariff_id, payment.months, pricing);

      return {
        orderId: payment.order_id,
        invoiceId: payment.invoice_id,
        tariffId: payment.tariff_id,
        tariffTitle: tariff?.title || payment.tariff_id,
        months: payment.months,
        amount: payment.amount / 100,
        pricePerMonth: calc?.pricePerMonth ?? null,
        discountPercent: calc?.discountPercent ?? 0,
        status: payment.status,
        userEmail: payment.users?.email || null,
        userPhone: payment.users?.phone || null,
        paidAt: payment.paid_at,
        createdAt: payment.created_at,
      };
    });

    const totalRevenue = payments
      .filter((p) => p.status === "approved")
      .reduce((sum, p) => sum + p.amount, 0);

    const paidCount = payments.filter((p) => p.status === "approved").length;

    return res.json({
      success: true,
      data: payments,
      stats: {
        totalRevenue,
        paidCount,
      },
    });
  } catch (error) {
    console.error("Admin List Payments Controller Error:", error);
    return res.status(500).json({
      success: false,
      message: "Ошибка сервера при получении списка платежей",
    });
  }
};

// =======================================================
// Текущие цены тарифов и услуг (GET /api/settings/pricing)
//
// ПУБЛИЧНЫЙ эндпоинт (без авторизации) — цены не являются секретом,
// их видят страницы /pricing и /payment. Изменение цен доступно
// только через updatePricing ниже (требует роль admin).
// =======================================================
export const getPricing = async (req, res) => {
  try {
    const pricing = await getPricingSettings();
    return res.json({ success: true, data: pricing });
  } catch (error) {
    console.error("Get Pricing Controller Error:", error);
    return res.status(500).json({
      success: false,
      message: "Не удалось получить текущие цены",
    });
  }
};

// =======================================================
// Изменение цен тарифов и услуг (PUT /api/admin/pricing)
//
// Доступ проверяется в роуте через authenticateToken + requireAdmin.
// Тело запроса строго валидируется zod-схемой — админ не может записать
// произвольные поля или отрицательные/нечисловые цены.
// =======================================================
export const updatePricing = async (req, res) => {
  try {
    const result = pricingSchema.safeParse(req.body);

    if (!result.success) {
      return res.status(400).json({
        success: false,
        message: result.error.issues[0]?.message || "Некорректные данные цен",
      });
    }

    const saved = await savePricingSettings(result.data);

    return res.json({ success: true, data: saved });
  } catch (error) {
    console.error("Update Pricing Controller Error:", error);
    return res.status(500).json({
      success: false,
      message: "Не удалось сохранить цены",
    });
  }
};

// =======================================================
// Юристы (раздел «Юристы» в админ-панели)
// =======================================================

function toLawyerRow(payload) {
  const row = {};

  if (payload.lastName !== undefined) row.last_name = payload.lastName;
  if (payload.firstName !== undefined) row.first_name = payload.firstName;
  if (payload.middleName !== undefined) row.middle_name = payload.middleName || null;
  if (payload.specialization !== undefined) row.specialization = payload.specialization;
  if (payload.experience !== undefined) row.experience = payload.experience;
  if (payload.phone !== undefined) row.phone = payload.phone || null;
  if (payload.whatsapp !== undefined) row.whatsapp = payload.whatsapp || null;
  if (payload.description !== undefined) row.description = payload.description || null;
  if (payload.active !== undefined) row.is_active = payload.active;

  return row;
}

// 1. Список ВСЕХ юристов, включая выключенных (GET /api/admin/lawyers)
export const listLawyers = async (req, res) => {
  try {
    const { data, error } = await supabase
      .from("lawyers")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) {
      console.error("Admin List Lawyers Error:", error);
      return res.status(500).json({
        success: false,
        message: "Ошибка при получении списка юристов",
      });
    }

    return res.json({
      success: true,
      data: (data || []).map(toPublicLawyer),
    });
  } catch (error) {
    console.error("Admin List Lawyers Controller Error:", error);
    return res.status(500).json({
      success: false,
      message: "Ошибка сервера при получении списка юристов",
    });
  }
};

// 2. Добавить юриста (POST /api/admin/lawyers)
export const createLawyer = async (req, res) => {
  try {
    const validationResult = createLawyerSchema.safeParse(req.body);

    if (!validationResult.success) {
      return res.status(400).json({
        success: false,
        message: "Ошибка валидации данных",
        errors: validationResult.error.errors.map((e) => e.message),
      });
    }

    const row = toLawyerRow(validationResult.data);

    const { data, error } = await supabase
      .from("lawyers")
      .insert(row)
      .select()
      .single();

    if (error) {
      console.error("Create Lawyer Error:", error);
      return res.status(500).json({
        success: false,
        message: "Не удалось добавить юриста",
      });
    }

    return res.status(201).json({
      success: true,
      data: toPublicLawyer(data),
    });
  } catch (error) {
    console.error("Create Lawyer Controller Error:", error);
    return res.status(500).json({
      success: false,
      message: "Ошибка сервера при добавлении юриста",
    });
  }
};

// 3. Обновить юриста / переключить активность (PUT /api/admin/lawyers/:id)
export const updateLawyer = async (req, res) => {
  try {
    const { id } = req.params;

    const validationResult = updateLawyerSchema.safeParse(req.body);

    if (!validationResult.success) {
      return res.status(400).json({
        success: false,
        message: "Ошибка валидации данных",
        errors: validationResult.error.errors.map((e) => e.message),
      });
    }

    const row = toLawyerRow(validationResult.data);

    if (Object.keys(row).length === 0) {
      return res.status(400).json({
        success: false,
        message: "Нет данных для обновления",
      });
    }

    row.updated_at = new Date().toISOString();

    const { data, error } = await supabase
      .from("lawyers")
      .update(row)
      .eq("id", id)
      .select()
      .maybeSingle();

    if (error) {
      console.error("Update Lawyer Error:", error);
      return res.status(500).json({
        success: false,
        message: "Не удалось обновить юриста",
      });
    }

    if (!data) {
      return res.status(404).json({
        success: false,
        message: "Юрист не найден",
      });
    }

    return res.json({
      success: true,
      data: toPublicLawyer(data),
    });
  } catch (error) {
    console.error("Update Lawyer Controller Error:", error);
    return res.status(500).json({
      success: false,
      message: "Ошибка сервера при обновлении юриста",
    });
  }
};

// 4. Удалить юриста (DELETE /api/admin/lawyers/:id)
export const deleteLawyer = async (req, res) => {
  try {
    const { id } = req.params;

    const { data, error } = await supabase
      .from("lawyers")
      .delete()
      .eq("id", id)
      .select();

    if (error) {
      console.error("Delete Lawyer Error:", error);
      return res.status(500).json({
        success: false,
        message: "Не удалось удалить юриста",
      });
    }

    if (!data || data.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Юрист не найден",
      });
    }

    return res.json({ success: true });
  } catch (error) {
    console.error("Delete Lawyer Controller Error:", error);
    return res.status(500).json({
      success: false,
      message: "Ошибка сервера при удалении юриста",
    });
  }
};

// =======================================================
// Управление верификацией застройщиков (Админка)
// =======================================================

// 1. Получить список всех застройщиков с их документами (GET /api/admin/developers)
export const listDevelopersAdmin = async (req, res) => {
  try {
    const { data: users, error: usersError } = await supabase
      .from("users")
      .select("id, email, phone, account_type, is_verified, created_at")
      .eq("account_type", "developer")
      .order("created_at", { ascending: false });

    if (usersError) {
      console.error("Admin List Developers Error:", usersError);
      return res.status(500).json({
        success: false,
        message: "Ошибка при получении списка застройщиков",
      });
    }

    const userIds = (users || []).map((u) => u.id);

    const { data: profiles } = await supabase
      .from("user_profiles")
      .select("*")
      .in("user_id", userIds.length > 0 ? userIds : ["00000000-0000-0000-0000-000000000000"]);

    const profilesMap = new Map((profiles || []).map((p) => [p.user_id, p]));

    const developersList = await Promise.all(
      (users || []).map(async (user) => {
        const profile = profilesMap.get(user.id) || {};
        let aboutMeta = {};
        if (profile.about && profile.about.startsWith("{") && profile.about.endsWith("}")) {
          try {
            aboutMeta = JSON.parse(profile.about);
          } catch (e) {}
        }

        const name = profile.company_name || profile.first_name || user.email;

        // Документы лежат в приватном бакете как пути — для админки отдаём
        // временные подписанные ссылки, по которым можно их открыть.
        let documents = null;
        if (aboutMeta.verificationDocs && typeof aboutMeta.verificationDocs === "object") {
          documents = {};
          for (const key of VERIFICATION_DOC_KEYS) {
            const path = aboutMeta.verificationDocs[key];
            if (path) {
              documents[key] = await getVerificationDocumentSignedUrl(path, 900);
            }
          }
        }

        return {
          id: user.id,
          name,
          companyName: profile.company_name || name,
          representative: profile.first_name ? `${profile.first_name} ${profile.last_name || ""}`.trim() : "Представитель",
          email: user.email,
          phone: user.phone || profile.phone,
          image: profile.avatar_url || "https://images.unsplash.com/photo-1560518883-ce09059eeffa?auto=format&fit=crop&w=500&q=80",
          isVerified: user.is_verified,
          verificationStatus: aboutMeta.verificationStatus || (user.is_verified ? "approved" : "none"),
          documents,
          rejectionReason: aboutMeta.rejectionReason || "",
          createdAt: user.created_at,
        };
      })
    );

    return res.json({
      success: true,
      data: developersList,
    });
  } catch (error) {
    console.error("Admin List Developers Controller Error:", error);
    return res.status(500).json({
      success: false,
      message: "Ошибка сервера при получении застройщиков",
    });
  }
};

// 2. Подтвердить или отклонить верификацию застройщика (PUT /api/admin/developers/:id/verify)
export const verifyDeveloperAdmin = async (req, res) => {
  try {
    const { id } = req.params;
    const { isVerified, rejectionReason } = req.body;

    if (typeof isVerified !== "boolean") {
      return res.status(400).json({
        success: false,
        message: "Поле isVerified обязательно и должно быть true или false",
      });
    }

    if (!isVerified && (typeof rejectionReason !== "string" || !rejectionReason.trim())) {
      return res.status(400).json({
        success: false,
        message: "При отклонении заявки необходимо указать причину отказа",
      });
    }

    if (rejectionReason && rejectionReason.length > MAX_REJECTION_REASON_LENGTH) {
      return res.status(400).json({
        success: false,
        message: `Причина отказа не должна превышать ${MAX_REJECTION_REASON_LENGTH} символов`,
      });
    }

    const { data: targetUser } = await supabase
      .from("users")
      .select("id, account_type")
      .eq("id", id)
      .maybeSingle();

    if (!targetUser || targetUser.account_type !== "developer") {
      return res.status(404).json({
        success: false,
        message: "Застройщик не найден",
      });
    }

    const { data: user, error: userError } = await supabase
      .from("users")
      .update({ is_verified: isVerified })
      .eq("id", id)
      .select()
      .maybeSingle();

    if (userError || !user) {
      return res.status(404).json({
        success: false,
        message: "Пользователь не найден",
      });
    }

    const { data: profile } = await supabase
      .from("user_profiles")
      .select("*")
      .eq("user_id", id)
      .maybeSingle();

    if (profile) {
      let aboutMeta = {};
      if (profile.about && profile.about.startsWith("{") && profile.about.endsWith("}")) {
        try {
          aboutMeta = JSON.parse(profile.about);
        } catch (e) {}
      } else if (profile.about) {
        aboutMeta = { bio: profile.about };
      }

      aboutMeta.verificationStatus = isVerified ? "approved" : "rejected";
      aboutMeta.rejectionReason = isVerified ? "" : rejectionReason.trim();

      await supabase
        .from("user_profiles")
        .update({ about: JSON.stringify(aboutMeta) })
        .eq("id", profile.id);
    }

    return res.json({
      success: true,
      message: isVerified ? "Профиль застройщика успешно подтверждён" : "Заявка отклонена",
      isVerified: user.is_verified,
    });
  } catch (error) {
    console.error("Admin Verify Developer Error:", error);
    return res.status(500).json({
      success: false,
      message: "Ошибка сервера при верификации застройщика",
    });
  }
};
