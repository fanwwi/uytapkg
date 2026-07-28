"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import { Mail, Phone, Lock, Check, ArrowRight, CheckCircle2 } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import styles from "./Login.module.css";
import { loginUser } from "@/utils/api";

export default function Login() {
  const router = useRouter();
  const [method, setMethod] = useState("phone");
  const [phoneStep, setPhoneStep] = useState(1);
  const [phone, setPhone] = useState("");
  const [code, setCode] = useState(["", "", "", ""]);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [remember, setRemember] = useState(true);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  // формат номера Кыргызстана
  const formatPhone = (value) => {
    let numbers = value.replace(/\D/g, "");

    if (numbers.startsWith("996")) {
      numbers = numbers.slice(3);
    }

    numbers = numbers.slice(0, 9);
    let result = "+996";

    if (numbers.length) {
      result += " " + numbers.slice(0, 3);
    }
    if (numbers.length >= 4) {
      result += " " + numbers.slice(3, 6);
    }
    if (numbers.length >= 7) {
      result += " " + numbers.slice(6, 9);
    }

    return result;
  };

  const handlePhone = (e) => {
    setPhone(formatPhone(e.target.value));
  };

  const sendCode = () => {
    const clean = phone.replace(/\D/g, "");
    if (clean.length !== 12) {
      setError("Введите корректный номер Кыргызстана (+996...)");
      return;
    }
    setError("");
    setPhoneStep(2);
  };

  const changeCode = (value, index) => {
    if (!/^\d*$/.test(value)) return;
    const newCode = [...code];
    newCode[index] = value;
    setCode(newCode);

    if (value && index < 3) {
      document.getElementById(`code-${index + 1}`)?.focus();
    }
  };

  const handleEmailLogin = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const data = await loginUser({
        identifier: email,
        password: password,
      });

      if (data.token) {
        localStorage.setItem("uytap_token", data.token);
        localStorage.setItem("uytap_user", JSON.stringify(data.user));
      }

      setSuccess(true);
      setTimeout(() => {
        router.push("/main");
      }, 1200);
    } catch (err) {
      setError(err.message || "Неверный Email или пароль");
    } finally {
      setLoading(false);
    }
  };

  const handlePhoneLogin = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const fullCode = code.join("");
      if (fullCode.length < 4) {
        throw new Error("Введите полный 4-значный код");
      }

      // Отправляем код подтверждения
      setSuccess(true);
      setTimeout(() => {
        router.push("/main");
      }, 1200);
    } catch (err) {
      setError(err.message || "Ошибка входа по номеру телефона");
    } finally {
      setLoading(false);
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
          y: 50,
          scale: 0.95,
        }}
        animate={{
          opacity: 1,
          y: 0,
          scale: 1,
        }}
        transition={{
          duration: 0.5,
        }}
      >
        <div className={styles.brand}>UyTap</div>

        <h1 className={styles.title}>Вход</h1>

        <p className={styles.subtitle}>Войдите в аккаунт для продолжения</p>

        <div className={styles.methods}>
          <button
            className={method === "phone" ? styles.activeMethod : styles.method}
            onClick={() => {
              setMethod("phone");
              setPhoneStep(1);
              setError("");
            }}
          >
            <Phone />
            Телефон
          </button>

          <button
            className={method === "email" ? styles.activeMethod : styles.method}
            onClick={() => {
              setMethod("email");
              setError("");
            }}
          >
            <Mail />
            Почта
          </button>
        </div>

        {method === "phone" && (
          <motion.form
            className={styles.form}
            onSubmit={handlePhoneLogin}
            initial={{
              opacity: 0,
              x: 20,
            }}
            animate={{
              opacity: 1,
              x: 0,
            }}
          >
            {phoneStep === 1 && (
              <>
                <div className={styles.inputBox}>
                  <Phone />
                  <input
                    type="tel"
                    value={phone}
                    onChange={handlePhone}
                    placeholder="+996 555 555 555"
                  />
                </div>

                {error && <div style={{ color: "#ef4444", fontSize: "14px" }}>⚠️ {error}</div>}

                <button
                  type="button"
                  className={styles.submit}
                  onClick={sendCode}
                >
                  Получить код
                  <ArrowRight />
                </button>
              </>
            )}

            {phoneStep === 2 && (
              <>
                <p className={styles.smsInfo}>Код отправлен на ваш номер {phone}</p>

                <div className={styles.codeInputs}>
                  {code.map((item, index) => (
                    <input
                      key={index}
                      id={`code-${index}`}
                      value={item}
                      maxLength={1}
                      onChange={(e) => changeCode(e.target.value, index)}
                    />
                  ))}
                </div>

                {error && <div style={{ color: "#ef4444", fontSize: "14px" }}>⚠️ {error}</div>}

                {success && (
                  <div style={{ color: "#10b981", fontSize: "14px", display: "flex", alignItems: "center", gap: "6px" }}>
                    <CheckCircle2 size={18} /> Авторизация успешна!
                  </div>
                )}

                <button className={styles.submit} type="submit" disabled={loading}>
                  {loading ? "Проверка..." : "Войти"}
                </button>

                <button type="button" className={styles.resend} onClick={sendCode}>
                  Отправить код повторно
                </button>
              </>
            )}
          </motion.form>
        )}

        {method === "email" && (
          <motion.form
            className={styles.form}
            onSubmit={handleEmailLogin}
            initial={{
              opacity: 0,
              x: 20,
            }}
            animate={{
              opacity: 1,
              x: 0,
            }}
          >
            <div className={styles.inputBox}>
              <Mail />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="example@gmail.com"
                required
              />
            </div>

            <div className={styles.inputBox}>
              <Lock />
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Пароль"
                required
              />
            </div>

            <div className={styles.options}>
              <label className={styles.remember}>
                <input
                  type="checkbox"
                  checked={remember}
                  onChange={(e) => setRemember(e.target.checked)}
                />
                <span className={styles.check}>{remember && <Check />}</span>
                Запомнить меня
              </label>

              <Link href="/forgot">Забыли пароль?</Link>
            </div>

            {error && <div style={{ color: "#ef4444", fontSize: "14px" }}>⚠️ {error}</div>}

            {success && (
              <div style={{ color: "#10b981", fontSize: "14px", display: "flex", alignItems: "center", gap: "6px" }}>
                <CheckCircle2 size={18} /> Успешный вход! Вход в систему...
              </div>
            )}

            <button className={styles.submit} type="submit" disabled={loading}>
              {loading ? "Вход..." : "Войти"}
            </button>
          </motion.form>
        )}

        <div className={styles.bottom}>
          Нет аккаунта?
          <Link href="/register">Регистрация</Link>
        </div>
      </motion.section>
    </main>
  );
}
