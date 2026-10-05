"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowRight, CheckCircle2, Mail, RefreshCw } from "lucide-react";

import styles from "./AuthCode.module.css";

export default function AuthCode() {
  const router = useRouter();

  const [code, setCode] = useState("");
  const [error, setError] = useState("");
  const [isChecking, setIsChecking] = useState(false);
  const [timer, setTimer] = useState(60);
  const [isResending, setIsResending] = useState(false);

  const inputRef = useRef(null);

  /*
   * Email сохраняем после регистрации.
   *
   * Например:
   * localStorage.setItem("register_email", email)
   */
  const email =
    typeof window !== "undefined"
      ? localStorage.getItem("register_email")
      : null;

  /* =========================================================
     TIMER
  ========================================================= */

  useEffect(() => {
    if (timer <= 0) {
      return;
    }

    const interval = setInterval(() => {
      setTimer((prev) => {
        if (prev <= 1) {
          clearInterval(interval);
          return 0;
        }

        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [timer]);

  /* =========================================================
     INPUT
  ========================================================= */

  const handleCodeChange = (event) => {
    const value = event.target.value.replace(/\D/g, "").slice(0, 6);

    setCode(value);

    if (error) {
      setError("");
    }
  };

  /* =========================================================
     VERIFY CODE
  ========================================================= */

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (code.length !== 6) {
      setError("Введите 6-значный код");
      return;
    }

    setIsChecking(true);
    setError("");

    try {
      /*
       * TODO:
       * Здесь подключается твой backend.
       *
       * Пример:
       *
       * const response = await fetch(
       *   `${API_URL}/auth/verify-email`,
       *   {
       *     method: "POST",
       *     headers: {
       *       "Content-Type": "application/json",
       *     },
       *     body: JSON.stringify({
       *       email,
       *       code,
       *     }),
       *   }
       * );
       *
       * const data = await response.json();
       *
       * if (!response.ok) {
       *   throw new Error(
       *     data.message || "Неверный код"
       *   );
       * }
       */

      /*
       * ВРЕМЕННАЯ ПРОВЕРКА.
       *
       * Замени на реальный ответ backend.
       */
      const correctCode = localStorage.getItem("register_code");

      if (correctCode && code === correctCode) {
        localStorage.removeItem("register_code");
        localStorage.removeItem("register_email");

        router.push("/success-register");
        return;
      }

      setError("Неверный код");
    } catch (error) {
      console.error("Ошибка проверки кода:", error);

      setError(error?.message || "Неверный код");
    } finally {
      setIsChecking(false);
    }
  };

  /* =========================================================
     RESEND CODE
  ========================================================= */

  const handleResend = async () => {
    if (timer > 0 || isResending) {
      return;
    }

    if (!email) {
      setError("Не удалось определить email");
      return;
    }

    setIsResending(true);
    setError("");

    try {
      /*
       * TODO:
       * Подключить реальный endpoint.
       *
       * Например:
       *
       * await fetch(
       *   `${API_URL}/auth/resend-code`,
       *   {
       *     method: "POST",
       *     headers: {
       *       "Content-Type": "application/json",
       *     },
       *     body: JSON.stringify({
       *       email,
       *     }),
       *   }
       * );
       */

      /*
       * Временная логика.
       */
      setTimer(60);
      setCode("");

      setTimeout(() => {
        inputRef.current?.focus();
      }, 50);
    } catch (error) {
      console.error("Ошибка повторной отправки:", error);

      setError("Не удалось отправить код");
    } finally {
      setIsResending(false);
    }
  };

  /* =========================================================
     FORMAT TIMER
  ========================================================= */

  const minutes = String(Math.floor(timer / 60)).padStart(2, "0");

  const seconds = String(timer % 60).padStart(2, "0");

  /* =========================================================
     RENDER
  ========================================================= */

  return (
    <main className={styles.page}>
      <div className={styles.noise} />

      <div className={styles.glowOne} />

      <div className={styles.glowTwo} />

      <div className={styles.container}>
        {/* ICON */}

        <div className={styles.iconWrapper}>
          <div className={styles.icon}>
            <Mail size={27} />
          </div>
        </div>

        {/* HEADER */}

        <div className={styles.header}>
          <span className={styles.eyebrow}>EMAIL VERIFICATION</span>

          <h1>
            Проверьте
            <span> почту</span>
          </h1>

          <p>Мы отправили код подтверждения на вашу электронную почту.</p>

          {email && <div className={styles.email}>{email}</div>}
        </div>

        {/* FORM */}

        <form className={styles.form} onSubmit={handleSubmit}>
          <label htmlFor="auth-code" className={styles.label}>
            Введите код
          </label>

          <input
            ref={inputRef}
            id="auth-code"
            type="text"
            inputMode="numeric"
            autoComplete="one-time-code"
            maxLength={6}
            value={code}
            onChange={handleCodeChange}
            placeholder="000000"
            className={`${styles.input} ${error ? styles.inputError : ""}`}
            autoFocus
          />

          {error && <div className={styles.error}>{error}</div>}

          <button
            type="submit"
            className={styles.submit}
            disabled={isChecking || code.length !== 6}
          >
            {isChecking ? (
              <>
                Проверяем...
                <RefreshCw size={17} className={styles.spinning} />
              </>
            ) : (
              <>
                Подтвердить
                <ArrowRight size={17} />
              </>
            )}
          </button>
        </form>

        {/* RESEND */}

        <div className={styles.resend}>
          {timer > 0 ? (
            <>
              <span>Не получили код?</span>

              <span className={styles.timer}>
                Повторная отправка через{" "}
                <strong>
                  {minutes}:{seconds}
                </strong>
              </span>
            </>
          ) : (
            <>
              <span>Не получили код?</span>

              <button
                type="button"
                onClick={handleResend}
                disabled={isResending}
                className={styles.resendButton}
              >
                {isResending ? (
                  <>
                    Отправляем...
                    <RefreshCw size={14} className={styles.spinning} />
                  </>
                ) : (
                  <>
                    Отправить код ещё раз
                    <RefreshCw size={14} />
                  </>
                )}
              </button>
            </>
          )}
        </div>

        {/* SECURITY */}

        <div className={styles.security}>
          <CheckCircle2 size={15} />

          <span>Код действителен в течение ограниченного времени</span>
        </div>
      </div>
    </main>
  );
}
