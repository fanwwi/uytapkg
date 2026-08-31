import { supabase } from "../config/db.js";
import { getTariff, calculateTariffTotal } from "../constants/tariffs.js";
import { createLawyerSchema, updateLawyerSchema } from "../utils/validation.js";
import { toPublicLawyer } from "./lawyersController.js";

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

    const payments = (data || []).map((payment) => {
      const tariff = getTariff(payment.tariff_id);
      // Пересчитываем цену/мес и скидку по тем же правилам, что и при
      // создании платежа — в БД хранится только итоговая сумма.
      const calc = calculateTariffTotal(payment.tariff_id, payment.months);

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
