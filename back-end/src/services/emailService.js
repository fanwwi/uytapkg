import nodemailer from "nodemailer";

// process.env читаем лениво: dotenv может быть загружен уже после импорта модуля.
const env = () => process.env;
const isSmtpConfigured = () => Boolean(env().SMTP_HOST && env().SMTP_USER && env().SMTP_PASS);

let transporter = null;
function getTransporter() {
  if (!transporter) {
    const { SMTP_HOST, SMTP_PORT, SMTP_USER, SMTP_PASS } = env();
    const port = Number(SMTP_PORT) || 587;
    transporter = nodemailer.createTransport({
      host: SMTP_HOST,
      port,
      secure: port === 465,
      auth: { user: SMTP_USER, pass: SMTP_PASS },
    });
  }
  return transporter;
}

function buildOtpHtml(code, type = "registration") {
  const isReset = type === "password_reset";
  const description = isReset
    ? "Ваш код для сброса пароля:"
    : "Ваш код подтверждения электронной почты:";
  const footer = isReset
    ? "Если вы не запрашивали сброс пароля на UyTap, просто проигнорируйте это письмо."
    : "Если вы не регистрировались на UyTap, просто проигнорируйте это письмо.";

  return `<!DOCTYPE html>
<html lang="ru">
  <body style="margin:0;padding:0;background:#f4f5f7;font-family:Arial,Helvetica,sans-serif;">
    <table width="100%" cellpadding="0" cellspacing="0" style="padding:32px 0;">
      <tr>
        <td align="center">
          <table width="480" cellpadding="0" cellspacing="0" style="background:#ffffff;border-radius:16px;padding:32px;">
            <tr>
              <td align="center" style="font-size:28px;font-weight:800;color:#111;letter-spacing:1px;">
                Uy<span style="color:#e11d48;">Tap</span>
              </td>
            </tr>
            <tr>
              <td align="center" style="padding-top:20px;color:#333;font-size:16px;">
                ${description}
              </td>
            </tr>
            <tr>
              <td align="center" style="padding:24px 0;">
                <div style="display:inline-block;padding:16px 32px;background:#f4f5f7;border-radius:12px;font-size:36px;font-weight:700;letter-spacing:10px;color:#111;">
                  ${code}
                </div>
              </td>
            </tr>
            <tr>
              <td align="center" style="color:#b91c1c;font-size:14px;font-weight:bold;">
                Никому не сообщайте этот код. Срок действия: 10 минут.
              </td>
            </tr>
            <tr>
              <td align="center" style="padding-top:16px;color:#888;font-size:12px;">
                ${footer}
              </td>
            </tr>
          </table>
        </td>
      </tr>
    </table>
  </body>
</html>`;
}

/**
 * Отправляет OTP-код на email.
 * Поддерживает type: 'registration' | 'password_reset'.
 * Без SMTP-настроек (dev) — не падает, а логирует код в терминал.
 */
export async function sendOtpEmail(toEmail, code, type = "registration") {
  const isReset = type === "password_reset";
  const subject = isReset ? "UyTap: Сброс пароля" : "UyTap — код подтверждения email";
  const text = isReset
    ? `Ваш код для сброса пароля UyTap: ${code}. Никому не сообщайте этот код. Срок действия: 10 минут.`
    : `Ваш код подтверждения UyTap: ${code}. Никому не сообщайте этот код. Срок действия: 10 минут.`;

  if (!isSmtpConfigured()) {
    console.log(` [DEV EMAIL OTP] [${type}] Code for`, toEmail, ":", code);
    return { dev: true };
  }

  await getTransporter().sendMail({
    from: env().SMTP_FROM || env().SMTP_USER,
    to: toEmail,
    subject,
    text,
    html: buildOtpHtml(code, type),
  });
  return { dev: false };
}
