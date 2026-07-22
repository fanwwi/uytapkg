"use client";

import React from "react";
import { motion } from "framer-motion";
import { UserRound, Lock, Check } from "lucide-react";

import Link from "next/link";

import styles from "./Login.module.css";

export default function Login() {
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
        <div className={styles.brand}>Welcome Back</div>

        <h1 className={styles.title}>Вход</h1>

        <p className={styles.subtitle}>Войдите в аккаунт, чтобы продолжить</p>

        <motion.form className={styles.form} autoComplete="on">
          <div className={styles.inputBox}>
            <UserRound />

            <input
              type="text"
              name="username"
              autoComplete="username"
              placeholder="Номер телефона или почта"
            />
          </div>

          <div className={styles.inputBox}>
            <Lock />

            <input
              type="password"
              name="password"
              autoComplete="current-password"
              placeholder="Пароль"
            />
          </div>

          <div className={styles.options}>
            <label className={styles.remember}>
              <input type="checkbox" />
              <span className={styles.check}>
                <Check />
              </span>
              Запомнить меня
            </label>

            <Link href="/forgot-password">Забыли пароль?</Link>
          </div>

          <button type="submit" className={styles.submit}>
            Войти
          </button>
        </motion.form>

        <div className={styles.bottom}>
          Нет аккаунта?
          <Link href="/register">Регистрация</Link>
        </div>
      </motion.section>
    </main>
  );
}
