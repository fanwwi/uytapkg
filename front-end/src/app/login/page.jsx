"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { useRouter } from "next/navigation";

import {
  Mail,
  Phone,
  Lock,
  Check,
  ArrowRight,
  Eye,
  EyeOff,
  User,
  Building2,
  CheckCircle2,
} from "lucide-react";

import styles from "./Login.module.css";
import { loginUser } from "@/utils/api";

export default function Login() {
  const router = useRouter();
  const [accountType, setAccountType] = useState("personal");
  const [method, setMethod] = useState("phone");
  const [phoneStep, setPhoneStep] = useState(1);
  const [phone, setPhone] = useState("");
  const [code, setCode] = useState(["", "", "", ""]);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [remember, setRemember] = useState(true);
  const [showPassword, setShowPassword] = useState(false);

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

    if (numbers.length) result += " " + numbers.slice(0, 3);
    if (numbers.length >= 4) result += " " + numbers.slice(3, 6);
    if (numbers.length >= 7) result += " " + numbers.slice(6, 9);

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
    const arr = [...code];
    arr[index] = value;
    setCode(arr);

    if (value && index < 3) {
      document.getElementById(`code-${index + 1}`)?.focus();
    }
  };

  const handleEmailLogin = async (e) => {
    if (e) e.preventDefault();
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
    if (e) e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const fullCode = code.join("");
      if (fullCode.length < 4) {
        throw new Error("Введите полный 4-значный код");
      }

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
      <motion.section
        className={styles.card}
        layout
        initial={{
          opacity: 0,
          y: 40,
        }}
        animate={{
          opacity: 1,
          y: 0,
        }}
        transition={{
          duration: 0.45,
        }}
      >
        <div className={styles.brand}>UyTap</div>

        <h1 className={styles.title}>Вход</h1>

        <p className={styles.subtitle}>Войдите в аккаунт для продолжения</p>

        {/* Тип аккаунта */}
        <div className={styles.accountTabs}>
          <button
            className={accountType === "personal" ? styles.activeTab : ""}
            onClick={() => {
              setAccountType("personal");
              setMethod("phone");
              setPhoneStep(1);
              setError("");
            }}
          >
            <User />
            Частное лицо
          </button>

          <button
            className={accountType === "business" ? styles.activeTab : ""}
            onClick={() => {
              setAccountType("business");
              setMethod("email");
              setError("");
            }}
          >
            <Building2 />
            Бизнес
          </button>
        </div>

        <AnimatePresence mode="wait">
          {accountType === "personal" && (
            <motion.div
              key="personal"
              initial={{
                opacity: 0,
                x: -30,
              }}
              animate={{
                opacity: 1,
                x: 0,
              }}
              exit={{
                opacity: 0,
                x: -30,
              }}
              transition={{
                duration: 0.3,
              }}
            >
              <div className={styles.methods}>
                <button
                  className={
                    method === "phone" ? styles.activeMethod : styles.method
                  }
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
                  className={
                    method === "email" ? styles.activeMethod : styles.method
                  }
                  onClick={() => {
                    setMethod("email");
                    setError("");
                  }}
                >
                  <Mail />
                  Email
                </button>
              </div>

              {error && <div style={{ color: "#ef4444", fontSize: "14px", margin: "10px 0" }}>⚠️ {error}</div>}
              {success && (
                <div style={{ color: "#10b981", fontSize: "14px", display: "flex", alignItems: "center", gap: "6px", margin: "10px 0" }}>
                  <CheckCircle2 size={18} /> Авторизация успешна! Перенаправление...
                </div>
              )}

              <AnimatePresence mode="wait">
                {method === "phone" && (
                  <motion.div
                    key="phone"
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    transition={{ duration: 0.25 }}
                  >
                    {phoneStep === 1 && (
                      <div className={styles.form}>
                        <div className={styles.inputBox}>
                          <Phone />
                          <input
                            type="tel"
                            value={phone}
                            onChange={handlePhone}
                            placeholder="+996 555 555 555"
                          />
                        </div>

                        <button className={styles.submit} onClick={sendCode}>
                          Получить код
                          <ArrowRight />
                        </button>
                      </div>
                    )}

                    {phoneStep === 2 && (
                      <form className={styles.form} onSubmit={handlePhoneLogin}>
                        <p className={styles.smsInfo}>Введите код из SMS ({phone})</p>

                        <div className={styles.codeInputs}>
                          {code.map((item, index) => (
                            <input
                              key={index}
                              id={`code-${index}`}
                              value={item}
                              maxLength={1}
                              onChange={(e) =>
                                changeCode(e.target.value, index)
                              }
                            />
                          ))}
                        </div>

                        <button className={styles.submit} type="submit" disabled={loading}>
                          {loading ? "Проверка..." : "Войти"}
                        </button>

                        <button type="button" className={styles.resend} onClick={sendCode}>
                          Отправить код повторно
                        </button>
                      </form>
                    )}
                  </motion.div>
                )}

                {method === "email" && (
                  <motion.div
                    key="email"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 20 }}
                    transition={{ duration: 0.25 }}
                  >
                    <EmailForm
                      email={email}
                      setEmail={setEmail}
                      password={password}
                      setPassword={setPassword}
                      showPassword={showPassword}
                      setShowPassword={setShowPassword}
                      remember={remember}
                      setRemember={setRemember}
                      handleEmailLogin={handleEmailLogin}
                      loading={loading}
                    />
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          )}

          {accountType === "business" && (
            <motion.div
              key="business"
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 30 }}
              transition={{ duration: 0.3 }}
            >
              {error && <div style={{ color: "#ef4444", fontSize: "14px", margin: "10px 0" }}>⚠️ {error}</div>}
              {success && (
                <div style={{ color: "#10b981", fontSize: "14px", display: "flex", alignItems: "center", gap: "6px", margin: "10px 0" }}>
                  <CheckCircle2 size={18} /> Авторизация успешна! Перенаправление...
                </div>
              )}
              <EmailForm
                email={email}
                setEmail={setEmail}
                password={password}
                setPassword={setPassword}
                showPassword={showPassword}
                setShowPassword={setShowPassword}
                remember={remember}
                setRemember={setRemember}
                handleEmailLogin={handleEmailLogin}
                loading={loading}
                business
              />
            </motion.div>
          )}
        </AnimatePresence>

        <div className={styles.bottom}>
          Нет аккаунта?
          <Link href="/register">Регистрация</Link>
        </div>
      </motion.section>
    </main>
  );
}

function EmailForm({
  email,
  setEmail,
  password,
  setPassword,
  showPassword,
  setShowPassword,
  remember,
  setRemember,
  handleEmailLogin,
  loading,
  business,
}) {
  return (
    <form className={styles.form} onSubmit={handleEmailLogin}>
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
          type={showPassword ? "text" : "password"}
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Пароль"
          required
        />
        <button
          type="button"
          className={styles.eye}
          onClick={() => setShowPassword(!showPassword)}
        >
          {showPassword ? <EyeOff /> : <Eye />}
        </button>
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

      <button className={styles.submit} type="submit" disabled={loading}>
        {loading ? "Вход..." : "Войти"}
      </button>
    </form>
  );
}
