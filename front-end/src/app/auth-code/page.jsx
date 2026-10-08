"use client";

import { Suspense, useEffect, useRef, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { ArrowRight, CheckCircle2, Mail, RefreshCw } from "lucide-react";

import styles from "./AuthCode.module.css";
import { verifyEmailOtp, resendEmailOtp } from "@/utils/api";

function AuthCodeContent() {
  const router = useRouter();
  const searchParams = useSearchParams();

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
  const [email, setEmail] = useState(null);
  const initRef = useRef(false);
  const reason = searchParams.get("reason");
  const queryEmail = searchParams.get("email");

  useEffect(() => {
    const value = (queryEmail || localStorage.getItem("register_email") || "")
      .trim()
      .toLowerCase();
    setEmail(value || null);
  }, [queryEmail]);

  // Вход с неподтверждённой почтой: код при логине не отправляется,
  // поэтому запрашиваем его здесь (сервер сам применяет кулдаун/лимиты).
  useEffect(() => {
    if (!email || reason !== "login" || initRef.current) return;
    initRef.current = true;
    resendEmailOtp(email).catch((err) => {
      const match = /(\d+)\s*секунд/.exec(err?.message || "");
      if (match) setTimer(Number(match[1]));
      else if (err?.status === 429) setError(err.message);
    });
  }, [email, reason]);

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
      await verifyEmailOtp(email, code);
      localStorage.removeItem("register_email");
      router.push("/success-register");
      return;
    } catch (error) {
      setError(error?.message || "Неверный код");
      if (/Превышено|не найден/.test(error?.message || "")) setCode("");
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
      await resendEmailOtp(email);
      setTimer(60);
      setCode("");

      setTimeout(() => {
        inputRef.current?.focus();
      }, 50);
    } catch (error) {
      const match = /(\d+)\s*секунд/.exec(error?.message || "");
      if (match) setTimer(Number(match[1]));
      setError(error?.message || "Не удалось отправить код");
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

          <p>
            {reason === "login"
              ? "Подтвердите email, чтобы войти в аккаунт. Мы отправили вам код."
              : "Мы отправили код подтверждения на вашу электронную почту."}
          </p>

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

export default function AuthCode() {
  return (
    <Suspense fallback={<main className={styles.page} />}>
      <AuthCodeContent />
    </Suspense>
  );
}
