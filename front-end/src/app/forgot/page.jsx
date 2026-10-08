"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { Mail, Lock, Eye, EyeOff, ArrowLeft } from "lucide-react";
import Link from "next/link";
import { useLanguage } from "@/context/LanguageContext";
import {
  requestPasswordReset,
  verifyPasswordResetCode,
  completePasswordReset,
} from "@/utils/api";
import styles from "./Forgot.module.css";

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export default function Forgot() {
  const router = useRouter();
  const { t } = useLanguage();

  const [step, setStep] = useState(1);

  const [email, setEmail] = useState("");
  const [code, setCode] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  // Состояние одноразового JWT resetToken между шагом 2 и 3
  const [resetToken, setResetToken] = useState("");

  // Индикаторы загрузки, таймер и сообщения
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [infoMessage, setInfoMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [countdown, setCountdown] = useState(0);

  const mismatch = confirmPassword.length > 0 && password !== confirmPassword;

  // Таймер обратного отсчёта 60 секунд на повторную отправку
  useEffect(() => {
    if (countdown <= 0) return;
    const interval = setInterval(() => {
      setCountdown((prev) => (prev <= 1 ? 0 : prev - 1));
    }, 1000);
    return () => clearInterval(interval);
  }, [countdown]);

  // Шаг 1: Отправка OTP-кода
  const handleSendEmail = async (e) => {
    e.preventDefault();
    const normalizedEmail = email.trim().toLowerCase();

    if (!normalizedEmail || !EMAIL_REGEX.test(normalizedEmail)) {
      setErrorMessage("Укажите корректный email адрес");
      return;
    }

    setIsLoading(true);
    setErrorMessage("");
    setInfoMessage("");

    try {
      const data = await requestPasswordReset(normalizedEmail);
      setCountdown(60);
      setInfoMessage(data.message || t("forgot.codeSentNotice") || "Если аккаунт существует, код отправлен на почту");
      setStep(2);
    } catch (err) {
      const match = /(\d+)\s*секунд/.exec(err?.message || "");
      if (match) {
        setCountdown(Number(match[1]));
      }
      setErrorMessage(err.message || "Не удалось отправить код восстановления");
    } finally {
      setIsLoading(false);
    }
  };

  // Повторная отправка кода (Шаг 2)
  const handleResendCode = async () => {
    if (countdown > 0 || isLoading) return;

    const normalizedEmail = email.trim().toLowerCase();
    setIsLoading(true);
    setErrorMessage("");

    try {
      const data = await requestPasswordReset(normalizedEmail);
      setCountdown(60);
      setInfoMessage(data.message || t("forgot.codeSentNotice") || "Если аккаунт существует, код отправлен на почту");
    } catch (err) {
      const match = /(\d+)\s*секунд/.exec(err?.message || "");
      if (match) {
        setCountdown(Number(match[1]));
      }
      setErrorMessage(err.message || "Не удалось отправить код повторно");
    } finally {
      setIsLoading(false);
    }
  };

  // Шаг 2: Проверка 6-значного кода
  const handleVerifyCode = async (e) => {
    e.preventDefault();
    const cleanCode = code.trim();

    if (cleanCode.length !== 6) {
      setErrorMessage("Введите 6-значный код из письма");
      return;
    }

    setIsLoading(true);
    setErrorMessage("");

    try {
      const data = await verifyPasswordResetCode(email.trim().toLowerCase(), cleanCode);
      if (data.resetToken) {
        setResetToken(data.resetToken);
        setInfoMessage("");
        setStep(3);
      } else {
        setErrorMessage("Не удалось получить токен для сброса пароля");
      }
    } catch (err) {
      setErrorMessage(err.message || "Неверный код подтверждения");
    } finally {
      setIsLoading(false);
    }
  };

  // Шаг 3: Сохранение нового пароля
  const handleSavePassword = async (e) => {
    e.preventDefault();

    if (password.length < 6 || password.length > 72) {
      setErrorMessage(t("forgot.passwordLengthError") || "Пароль должен содержать от 6 до 72 символов");
      return;
    }

    if (password !== confirmPassword) {
      setErrorMessage(t("forgot.passwordMismatch") || "Пароли не совпадают");
      return;
    }

    if (!resetToken) {
      setErrorMessage("Сессия сброса пароля истекла. Запросите код заново.");
      setStep(1);
      return;
    }

    setIsLoading(true);
    setErrorMessage("");

    try {
      await completePasswordReset(resetToken, password);
      setSuccessMessage(t("forgot.passwordChanged") || "Пароль успешно изменён! Выполняется вход...");
      setTimeout(() => {
        router.push("/login");
      }, 1500);
    } catch (err) {
      setErrorMessage(err.message || "Не удалось обновить пароль");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <main className={styles.page}>
      <motion.div
        className={styles.glowOne}
        animate={{
          x: [0, 40, 0],
          y: [0, 30, 0],
        }}
        transition={{
          duration: 8,
          repeat: Infinity,
        }}
      />

      <motion.div
        className={styles.glowTwo}
        animate={{
          x: [0, -40, 0],
          y: [0, -30, 0],
        }}
        transition={{
          duration: 9,
          repeat: Infinity,
        }}
      />

      <motion.section
        className={styles.card}
        initial={{
          opacity: 0,
          y: 40,
        }}
        animate={{
          opacity: 1,
          y: 0,
        }}
      >
        <Link href="/login" className={styles.back}>
          <ArrowLeft />
          {t("forgot.back")}
        </Link>

        <div className={styles.brand}>UyTap</div>

        <h1 className={styles.title}>{t("forgot.title")}</h1>

        <p className={styles.subtitle}>
          {step === 1 && t("forgot.steps.email")}
          {step === 2 && t("forgot.steps.code")}
          {step === 3 && t("forgot.steps.password")}
        </p>

        {step === 1 && (
          <motion.form
            onSubmit={handleSendEmail}
            className={styles.form}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
          >
            <div className={styles.inputBox}>
              <Mail />
              <input
                type="email"
                placeholder="example@gmail.com"
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                  if (errorMessage) setErrorMessage("");
                }}
                autoComplete="email"
                required
              />
            </div>

            {errorMessage && <p className={styles.error}>{errorMessage}</p>}

            <button
              type="submit"
              className={styles.submit}
              disabled={isLoading || !email.trim()}
            >
              {isLoading ? (t("forgot.loading") || "Подождите...") : t("forgot.sendCode")}
            </button>
          </motion.form>
        )}

        {step === 2 && (
          <motion.form
            onSubmit={handleVerifyCode}
            className={styles.form}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
          >
            <div className={styles.emailTarget}>
              <span>
                {t("forgot.sentTo") || "Код отправлен на:"} <strong>{email}</strong>
              </span>
              <button
                type="button"
                className={styles.changeEmailBtn}
                onClick={() => {
                  setStep(1);
                  setErrorMessage("");
                  setInfoMessage("");
                }}
              >
                {t("forgot.changeEmail") || "Изменить"}
              </button>
            </div>

            {infoMessage && <div className={styles.infoNotice}>{infoMessage}</div>}

            <div className={styles.inputBox}>
              <Mail />
              <input
                maxLength={6}
                inputMode="numeric"
                placeholder="000000"
                value={code}
                onChange={(e) => {
                  setCode(e.target.value.replace(/\D/g, ""));
                  if (errorMessage) setErrorMessage("");
                }}
                autoFocus
              />
            </div>

            {errorMessage && <p className={styles.error}>{errorMessage}</p>}

            <button
              type="submit"
              className={styles.submit}
              disabled={isLoading || code.trim().length !== 6}
            >
              {isLoading ? (t("forgot.loading") || "Подождите...") : t("forgot.verifyCode")}
            </button>

            <div className={styles.resendBox}>
              {countdown > 0 ? (
                <span className={styles.countdownText}>
                  {t("forgot.resendWait") || "Повторная отправка через"} {countdown}{" "}
                  {t("forgot.seconds") || "сек"}
                </span>
              ) : (
                <button
                  type="button"
                  className={styles.resendBtn}
                  disabled={isLoading}
                  onClick={handleResendCode}
                >
                  {t("forgot.resendCode") || "Отправить код повторно"}
                </button>
              )}
            </div>
          </motion.form>
        )}

        {step === 3 && (
          <motion.form
            onSubmit={handleSavePassword}
            className={styles.form}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
          >
            {successMessage ? (
              <div className={styles.successNotice}>{successMessage}</div>
            ) : (
              <>
                <div className={styles.inputBox}>
                  <Lock />
                  <input
                    type={showPassword ? "text" : "password"}
                    placeholder={t("forgot.newPassword")}
                    value={password}
                    onChange={(e) => {
                      setPassword(e.target.value);
                      if (errorMessage) setErrorMessage("");
                    }}
                    minLength={6}
                    maxLength={72}
                    autoComplete="new-password"
                    required
                  />
                  <button
                    type="button"
                    className={styles.eye}
                    onClick={() => setShowPassword(!showPassword)}
                    aria-label={
                      showPassword
                        ? t("forgot.hidePassword")
                        : t("forgot.showPassword")
                    }
                  >
                    {showPassword ? <EyeOff /> : <Eye />}
                  </button>
                </div>

                <div className={styles.inputBox}>
                  <Lock />
                  <input
                    type={showConfirm ? "text" : "password"}
                    placeholder={t("forgot.confirmPassword")}
                    value={confirmPassword}
                    onChange={(e) => {
                      setConfirmPassword(e.target.value);
                      if (errorMessage) setErrorMessage("");
                    }}
                    minLength={6}
                    maxLength={72}
                    autoComplete="new-password"
                    required
                  />
                  <button
                    type="button"
                    className={styles.eye}
                    onClick={() => setShowConfirm(!showConfirm)}
                    aria-label={
                      showConfirm
                        ? t("forgot.hidePassword")
                        : t("forgot.showPassword")
                    }
                  >
                    {showConfirm ? <EyeOff /> : <Eye />}
                  </button>
                </div>

                {mismatch && (
                  <p className={styles.error}>{t("forgot.passwordMismatch")}</p>
                )}

                {errorMessage && <p className={styles.error}>{errorMessage}</p>}

                <button
                  type="submit"
                  disabled={isLoading || mismatch || password.length < 6 || !confirmPassword}
                  className={styles.submit}
                >
                  {isLoading ? (t("forgot.loading") || "Подождите...") : t("forgot.savePassword")}
                </button>
              </>
            )}
          </motion.form>
        )}

        <div className={styles.bottom}>
          {t("forgot.rememberPassword")}{" "}
          <Link href="/login">{t("forgot.login")}</Link>
        </div>
      </motion.section>
    </main>
  );
}
