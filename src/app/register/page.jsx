"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import { Mail, Phone, User, Lock, Check, Eye, EyeOff } from "lucide-react";

import Link from "next/link";

import styles from "./Register.module.css";

export default function Register() {
  const [method, setMethod] = useState("phone");

  const [remember, setRemember] = useState(true);

  const [showPassword, setShowPassword] = useState(false);

  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const [password, setPassword] = useState("");

  const [confirmPassword, setConfirmPassword] = useState("");

  const passwordsMismatch =
    confirmPassword.length > 0 && password !== confirmPassword;

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
        <div className={styles.brand}>Welcome</div>

        <h1 className={styles.title}>Регистрация</h1>

        <p className={styles.subtitle}>
          Создайте аккаунт и начните пользоваться сервисом
        </p>

        <div className={styles.methods}>
          <button
            type="button"
            className={method === "phone" ? styles.activeMethod : styles.method}
            onClick={() => setMethod("phone")}
          >
            <Phone />
            Телефон
          </button>

          <button
            type="button"
            className={method === "email" ? styles.activeMethod : styles.method}
            onClick={() => setMethod("email")}
          >
            <Mail />
            Почта
          </button>
        </div>

        <motion.form
          className={styles.form}
          autoComplete="on"
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
          <div className={styles.inputBox}>
            {method === "phone" ? <Phone /> : <Mail />}

            <input
              type={method === "phone" ? "tel" : "email"}
              name={method === "phone" ? "phone" : "email"}
              autoComplete={method === "phone" ? "tel" : "email"}
              placeholder={
                method === "phone" ? "+996 555 555 555" : "example@gmail.com"
              }
            />
          </div>

          <div className={styles.inputBox}>
            <User />

            <input
              type="text"
              name="name"
              autoComplete="name"
              placeholder="ФИО"
            />
          </div>

          <div className={styles.inputBox}>
            <Lock />

            <input
              type={showPassword ? "text" : "password"}
              name="password"
              autoComplete="new-password"
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
              type={showConfirmPassword ? "text" : "password"}
              name="confirmPassword"
              autoComplete="new-password"
              placeholder="Подтвердите пароль"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
            />

            <button
              type="button"
              className={styles.eye}
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
            >
              {showConfirmPassword ? <EyeOff /> : <Eye />}
            </button>
          </div>

          {passwordsMismatch && (
            <motion.p
              className={styles.error}
              initial={{
                opacity: 0,
                y: -5,
              }}
              animate={{
                opacity: 1,
                y: 0,
              }}
            >
              Пароли не совпадают
            </motion.p>
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

          <button
            type="submit"
            disabled={passwordsMismatch}
            className={styles.submit}
          >
            Создать аккаунт
          </button>
        </motion.form>

        <div className={styles.bottom}>
          Уже есть аккаунт?
          <Link href="/login">Войти</Link>
        </div>
      </motion.section>
    </main>
  );
}
