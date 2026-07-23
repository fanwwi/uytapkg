"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import { Mail, Phone, Lock, Check, Eye, EyeOff } from "lucide-react";

import Link from "next/link";

import styles from "./Register.module.css";

export default function Register() {
  const [method, setMethod] = useState("phone");

  const [remember, setRemember] = useState(true);

  const [phone, setPhone] = useState("");

  const [codeSent, setCodeSent] = useState(false);

  const [smsCode, setSmsCode] = useState("");

  const [password, setPassword] = useState("");

  const [confirmPassword, setConfirmPassword] = useState("");

  const [showPassword, setShowPassword] = useState(false);

  const [showConfirm, setShowConfirm] = useState(false);

  const passwordsMismatch =
    confirmPassword.length > 0 && password !== confirmPassword;

  // Маска кыргызского номера
  const formatPhone = (value) => {
    let numbers = value.replace(/\D/g, "");

    if (numbers.startsWith("996")) {
      numbers = numbers.slice(3);
    }

    numbers = numbers.slice(0, 9);

    let formatted = "+996 ";

    if (numbers.length > 0) formatted += numbers.slice(0, 3);

    if (numbers.length >= 4) formatted += " " + numbers.slice(3, 6);

    if (numbers.length >= 7) formatted += " " + numbers.slice(6, 9);

    return formatted;
  };

  const phoneValid = phone.replace(/\D/g, "").length === 12;

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
      >
        <div className={styles.brand}>UyTap</div>

        <h1 className={styles.title}>Регистрация</h1>

        <p className={styles.subtitle}>
          Создайте аккаунт и начните пользоваться сервисом
        </p>

        <div className={styles.methods}>
          <button
            type="button"
            className={method === "phone" ? styles.activeMethod : styles.method}
            onClick={() => {
              setMethod("phone");
              setCodeSent(false);
            }}
          >
            <Phone />
            Телефон
          </button>

          <button
            type="button"
            className={method === "email" ? styles.activeMethod : styles.method}
            onClick={() => {
              setMethod("email");
            }}
          >
            <Mail />
            Почта
          </button>
        </div>

        <motion.form
          className={styles.form}
          key={method}
          initial={{
            opacity: 0,
            x: 20,
          }}
          animate={{
            opacity: 1,
            x: 0,
          }}
        >
          {method === "phone" && (
            <>
              <div className={styles.inputBox}>
                <Phone />

                <input
                  type="tel"
                  value={phone}
                  placeholder="+996 990 120 212"
                  onChange={(e) => setPhone(formatPhone(e.target.value))}
                />
              </div>

              {!codeSent ? (
                <button
                  type="button"
                  disabled={!phoneValid}
                  className={styles.submit}
                  onClick={() => setCodeSent(true)}
                >
                  Получить SMS код
                </button>
              ) : (
                <>
                  <div className={styles.inputBox}>
                    <Lock />

                    <input
                      value={smsCode}
                      maxLength={4}
                      placeholder="4 значный код"
                      onChange={(e) =>
                        setSmsCode(e.target.value.replace(/\D/g, ""))
                      }
                    />
                  </div>

                  <button className={styles.submit}>Создать аккаунт</button>
                </>
              )}
            </>
          )}

          {method === "email" && (
            <>
              <div className={styles.inputBox}>
                <Mail />

                <input type="email" placeholder="example@gmail.com" />
              </div>

              <div className={styles.inputBox}>
                <Lock />

                <input
                  type={showPassword ? "text" : "password"}
                  placeholder="Пароль"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />

                <button
                  type="button"
                  className={styles.eye}
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? <EyeOff /> : <Eye />}
                </button>
              </div>

              <div className={styles.inputBox}>
                <Lock />

                <input
                  type={showConfirm ? "text" : "password"}
                  placeholder="Подтвердите пароль"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                />

                <button
                  type="button"
                  className={styles.eye}
                  onClick={() => setShowConfirm(!showConfirm)}
                >
                  {showConfirm ? <EyeOff /> : <Eye />}
                </button>
              </div>

              {passwordsMismatch && (
                <p className={styles.error}>Пароли не совпадают</p>
              )}

              <button disabled={passwordsMismatch} className={styles.submit}>
                Создать аккаунт
              </button>
            </>
          )}

          <label className={styles.remember}>
            <input
              type="checkbox"
              checked={remember}
              onChange={(e) => setRemember(e.target.checked)}
            />
            <span className={styles.check}>{remember && <Check />}</span>
            Запомнить меня
          </label>
        </motion.form>

        <div className={styles.bottom}>
          Уже есть аккаунт?
          <Link href="/login">Войти</Link>
        </div>
      </motion.section>
    </main>
  );
}
