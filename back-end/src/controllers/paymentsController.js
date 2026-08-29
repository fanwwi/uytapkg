import crypto from "crypto";
import { supabase } from "../config/db.js";
import { calculateTariffTotal } from "../constants/tariffs.js";
import * as odengi from "../services/odengiService.js";
import { activateSubscription } from "../services/subscriptionsService.js";

function generateOrderId() {
  return `UT${Date.now()}${crypto.randomBytes(6).toString("hex")}`;
}

function toPublicPayment(payment) {
  return {
    orderId: payment.order_id,
    invoiceId: payment.invoice_id,
    tariffId: payment.tariff_id,
    months: payment.months,
    amount: payment.amount / 100,
    status: payment.status,
    qrUrl: payment.qr_url,
    paylinkUrl: payment.paylink_url,
    linkApp: payment.link_app,
    paidAt: payment.paid_at,
    createdAt: payment.created_at,
  };
}

// =======================================================
// 1. Создать платёж и выставить счёт в O!Dengi (POST /api/payments/create)
// =======================================================
export const createPayment = async (req, res) => {
  try {
    const userId = req.user.id;
    const { tariffId, months } = req.body || {};

    if (!tariffId || months === undefined) {
      return res.status(400).json({
        success: false,
        message: "tariffId и months обязательны",
      });
    }

    // Сумма считается ТОЛЬКО на сервере — клиенту нельзя доверять цену
    const calc = calculateTariffTotal(tariffId, months);

    if (!calc || calc.total <= 0) {
      return res.status(400).json({
        success: false,
        message: "Неизвестный тариф или период оплаты",
      });
    }

    const orderId = generateOrderId();
    const amountKopecks = Math.round(calc.total * 100);

    const { data: payment, error: insertError } = await supabase
      .from("payments")
      .insert({
        user_id: userId,
        order_id: orderId,
        tariff_id: calc.tariff.id,
        months: calc.months,
        amount: amountKopecks,
        status: "pending",
      })
      .select()
      .single();

    if (insertError) {
      console.error("Create Payment Insert Error:", insertError);
      return res.status(500).json({
        success: false,
        message: "Не удалось создать платёж",
      });
    }

    let invoice;
    try {
      invoice = await odengi.createInvoice({
        orderId,
        description: `UyTap PRO — тариф ${calc.tariff.title}, ${calc.months} мес.`,
        amountKopecks,
      });
    } catch (providerError) {
      console.error("O!Dengi createInvoice Error:", providerError);

      await supabase
        .from("payments")
        .update({ status: "failed", updated_at: new Date().toISOString() })
        .eq("id", payment.id);

      return res.status(503).json({
        success: false,
        message: "Платёжный сервис временно недоступен. Попробуйте позже.",
      });
    }

    const { data: updated, error: updateError } = await supabase
      .from("payments")
      .update({
        invoice_id: invoice.invoice_id,
        qr_url: invoice.qr || invoice.emv_qr || null,
        paylink_url: invoice.paylink_url || null,
        link_app: invoice.link_app || null,
        provider_response: invoice,
        status: "processing",
        updated_at: new Date().toISOString(),
      })
      .eq("id", payment.id)
      .select()
      .single();

    if (updateError) {
      console.error("Update Payment After Invoice Error:", updateError);
      return res.status(500).json({
        success: false,
        message: "Не удалось сохранить данные счёта",
      });
    }

    return res.status(201).json({
      success: true,
      data: {
        ...toPublicPayment(updated),
        tariffTitle: calc.tariff.title,
        pricePerMonth: calc.pricePerMonth,
        discountPercent: calc.discountPercent,
      },
    });
  } catch (error) {
    console.error("Create Payment Controller Error:", error);
    return res.status(500).json({
      success: false,
      message: "Ошибка сервера при создании платежа",
    });
  }
};

// Сверяет статус платежа с O!Dengi и, если он только что подтверждён,
// один раз активирует тариф пользователю. Используется и при опросе с
// фронтенда, и при получении callback'а (resultUrl) — сам callback
// НЕ считается источником истины, мы всегда перепроверяем статус
// напрямую в O!Dengi перед активацией тарифа.
async function reconcilePaymentStatus(payment) {
  if (payment.status === "approved" || payment.status === "canceled") {
    return payment;
  }

  const statusData = await odengi.statusPayment({
    invoiceId: payment.invoice_id,
    orderId: payment.order_id,
  });

  const paymentAttempt = Array.isArray(statusData?.payments)
    ? statusData.payments[statusData.payments.length - 1]
    : null;

  const providerStatus = paymentAttempt?.status || statusData?.status;

  if (providerStatus === "approved") {
    // Атомарно "забираем" переход в approved, чтобы при параллельных
    // запросах тариф активировался ровно один раз.
    const { data: claimed } = await supabase
      .from("payments")
      .update({
        status: "approved",
        trans_id: paymentAttempt?.trans_id || null,
        paid_at: paymentAttempt?.date_pay
          ? new Date(paymentAttempt.date_pay).toISOString()
          : new Date().toISOString(),
        provider_response: statusData,
        updated_at: new Date().toISOString(),
      })
      .eq("id", payment.id)
      .neq("status", "approved")
      .select()
      .maybeSingle();

    if (claimed) {
      await activateSubscription(payment.user_id, payment.tariff_id, payment.months);
      return claimed;
    }
  } else if (providerStatus === "canceled") {
    const { data: updated } = await supabase
      .from("payments")
      .update({
        status: "canceled",
        provider_response: statusData,
        updated_at: new Date().toISOString(),
      })
      .eq("id", payment.id)
      .select()
      .maybeSingle();

    if (updated) return updated;
  }

  return payment;
}

// =======================================================
// 2. Проверить статус платежа (GET /api/payments/:orderId/status)
// =======================================================
export const getPaymentStatus = async (req, res) => {
  try {
    const userId = req.user.id;
    const { orderId } = req.params;

    const { data: payment, error } = await supabase
      .from("payments")
      .select("*")
      .eq("order_id", orderId)
      .eq("user_id", userId)
      .maybeSingle();

    if (error) {
      console.error("Get Payment Status Error:", error);
      return res.status(500).json({
        success: false,
        message: "Ошибка при получении статуса платежа",
      });
    }

    if (!payment) {
      return res.status(404).json({
        success: false,
        message: "Платёж не найден",
      });
    }

    let current = payment;
    try {
      current = await reconcilePaymentStatus(payment);
    } catch (providerError) {
      console.error("Reconcile Payment Status Error:", providerError);
      // Отдаём последний известный статус из БД, если O!Dengi недоступен
    }

    return res.json({
      success: true,
      data: toPublicPayment(current),
    });
  } catch (error) {
    console.error("Get Payment Status Controller Error:", error);
    return res.status(500).json({
      success: false,
      message: "Ошибка сервера при получении статуса платежа",
    });
  }
};

// =======================================================
// 3. Отменить неоплаченный счёт (POST /api/payments/:orderId/cancel)
// =======================================================
export const cancelPayment = async (req, res) => {
  try {
    const userId = req.user.id;
    const { orderId } = req.params;

    const { data: payment, error } = await supabase
      .from("payments")
      .select("*")
      .eq("order_id", orderId)
      .eq("user_id", userId)
      .maybeSingle();

    if (error || !payment) {
      return res.status(404).json({
        success: false,
        message: "Платёж не найден",
      });
    }

    if (payment.status !== "processing" && payment.status !== "pending") {
      return res.status(409).json({
        success: false,
        message: "Этот платёж нельзя отменить",
      });
    }

    if (payment.invoice_id) {
      try {
        await odengi.invoiceCancel({ invoiceId: payment.invoice_id });
      } catch (providerError) {
        console.error("O!Dengi invoiceCancel Error:", providerError);
      }
    }

    await supabase
      .from("payments")
      .update({ status: "canceled", updated_at: new Date().toISOString() })
      .eq("id", payment.id);

    return res.json({ success: true });
  } catch (error) {
    console.error("Cancel Payment Controller Error:", error);
    return res.status(500).json({
      success: false,
      message: "Ошибка сервера при отмене платежа",
    });
  }
};

// =======================================================
// 4. Callback от O!Dengi об изменении статуса счёта (POST /api/payments/webhook)
//
// Это ПУБЛИЧНЫЙ эндпоинт без авторизации — его дергает сервер O!Dengi,
// а не наш фронтенд. Поэтому тело запроса НЕ считается источником
// истины: мы используем его только как триггер "проверь этот order_id
// прямо сейчас" и всегда перепроверяем реальный статус через
// statusPayment (server-to-server) перед тем, как активировать тариф.
// =======================================================
export const handleResultUrl = async (req, res) => {
  try {
    const orderId = req.body?.order_id;

    if (!orderId) {
      return res.status(400).json({ success: false });
    }

    const { data: payment } = await supabase
      .from("payments")
      .select("*")
      .eq("order_id", orderId)
      .maybeSingle();

    if (payment) {
      try {
        await reconcilePaymentStatus(payment);
      } catch (providerError) {
        console.error("Result URL Reconcile Error:", providerError);
      }
    }

    // O!Dengi не обрабатывает наш ответ на callback, но отвечаем 200 OK
    return res.status(200).json({ success: true });
  } catch (error) {
    console.error("Result URL Handler Error:", error);
    return res.status(200).json({ success: true });
  }
};
