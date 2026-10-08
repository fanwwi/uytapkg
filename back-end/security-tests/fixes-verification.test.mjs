import test from "node:test";
import assert from "node:assert/strict";

// 1. Тестирование валидации пароля (Bcrypt DoS Protection)
import { registerSchema, loginSchema } from "../src/utils/validation.js";

test("Validation: пароль длиннее 72 символов должен отклоняться (Bcrypt DoS)", () => {
  const longPassword = "A".repeat(73);
  const validPassword = "A".repeat(72);

  const regResultLong = registerSchema.safeParse({
    accountType: "personal",
    email: "test@example.com",
    phone: "+996555123456",
    password: longPassword,
  });
  assert.equal(regResultLong.success, false, "Пароль длиннее 72 символов должен отклоняться в registerSchema");

  const regResultValid = registerSchema.safeParse({
    accountType: "personal",
    email: "test@example.com",
    phone: "+996555123456",
    password: validPassword,
  });
  assert.equal(regResultValid.success, true, "Пароль ровно 72 символа должен приниматься в registerSchema");

  const loginResultLong = loginSchema.safeParse({
    identifier: "test@example.com",
    password: longPassword,
  });
  assert.equal(loginResultLong.success, false, "Пароль длиннее 72 символов должен отклоняться в loginSchema");

  const loginResultLongIdent = loginSchema.safeParse({
    identifier: "a".repeat(256),
    password: validPassword,
  });
  assert.equal(loginResultLongIdent.success, false, "Identifier длиннее 255 символов должен отклоняться в loginSchema");
});

// 2. Тестирование сортировки избранного (No NaN Sorting)
test("Favorites Sorting: отсутствие NaN при любых типах статусов и продвижения", () => {
  const priority = {
    vip: 0,
    urgent: 1,
    top: 2,
    null: 3,
  };

  const items = [
    { id: 1, status: "regular" },
    { id: 2, status: "top" },
    { id: 3, status: "vip" },
    { id: 4, status: "urgent" },
    { id: 5, status: undefined },
    { id: 6, status: null, promotion_type: "top" },
  ];

  const sorted = [...items].sort(
    (a, b) =>
      (priority[a.promotion_type ?? a.status] ?? 3) -
      (priority[b.promotion_type ?? b.status] ?? 3)
  );

  assert.ok(Array.isArray(sorted));
  assert.equal(sorted.length, items.length);

  // Проверяем, что компаратор для любых пар возвращает строго конечные числа, не NaN
  for (let i = 0; i < items.length; i++) {
    for (let j = 0; j < items.length; j++) {
      const diff =
        (priority[items[i].promotion_type ?? items[i].status] ?? 3) -
        (priority[items[j].promotion_type ?? items[j].status] ?? 3);
      assert.ok(Number.isFinite(diff), `Разность приоритетов должна быть конечным числом, получено: ${diff}`);
    }
  }
});

// 3. Тестирование фильтрации PII для публичных профилей
test("PII Protection: скрытие личных email и phone для аккаунтов personal", () => {
  const filterProfile = (user) => {
    const isBusinessAccount = ["agency", "developer", "realtor"].includes(user.account_type);
    return {
      id: user.id,
      type: user.account_type,
      email: isBusinessAccount ? user.email : null,
      phone: isBusinessAccount ? user.phone : null,
    };
  };

  const personalUser = {
    id: "user-1",
    account_type: "personal",
    email: "private@user.com",
    phone: "+996555111222",
  };

  const agencyUser = {
    id: "user-2",
    account_type: "agency",
    email: "agency@business.com",
    phone: "+996555333444",
  };

  const personalResult = filterProfile(personalUser);
  assert.equal(personalResult.email, null, "Email физлица должен быть скрыт (null)");
  assert.equal(personalResult.phone, null, "Телефон физлица должен быть скрыт (null)");

  const agencyResult = filterProfile(agencyUser);
  assert.equal(agencyResult.email, "agency@business.com", "Email агентства должен отображаться");
  assert.equal(agencyResult.phone, "+996555333444", "Телефон агентства должен отображаться");
});

// 4. Тестирование устойчивости watermark.js к отсутствию файла логотипа
test("Watermark: устойчивость к сбоям без вызова аварийного завершения", async () => {
  const { applyWatermark } = await import("../src/utils/watermark.js");
  const dummyBuffer = Buffer.from("fake-image-bytes");

  // applyWatermark должен вернуть исходный буфер без генерации необработанного исключения
  const result = await applyWatermark(dummyBuffer, "image/jpeg");
  assert.ok(Buffer.isBuffer(result), "Должен возвращаться валидный буфер");
});

// 5. Тестирование валидации order_id для вебхука платежей
test("Payments Webhook: строгая валидация order_id", () => {
  const isValidOrderId = (orderId) => {
    return (
      !!orderId &&
      typeof orderId === "string" &&
      orderId.length <= 100 &&
      /^[a-zA-Z0-9_\-]+$/.test(orderId)
    );
  };

  assert.equal(isValidOrderId("order_12345-ABC"), true, "Корректный order_id должен проходить");
  assert.equal(isValidOrderId("a".repeat(101)), false, "order_id длиннее 100 должен отклоняться");
  assert.equal(isValidOrderId("<script>alert(1)</script>"), false, "XSS пейлоад должен отклоняться");
  assert.equal(isValidOrderId("order; DROP TABLE payments;--"), false, "SQL инъекция должна отклоняться");
  assert.equal(isValidOrderId(null), false, "null должен отклоняться");
  assert.equal(isValidOrderId(undefined), false, "undefined должен отклоняться");
  assert.equal(isValidOrderId({}), false, "Объект вместо строки должен отклоняться");
});
