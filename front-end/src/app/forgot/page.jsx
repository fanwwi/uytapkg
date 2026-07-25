"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Mail, Lock, Eye, EyeOff, Check, ArrowLeft } from "lucide-react";

import Link from "next/link";

import styles from "./Forgot.module.css";

export default function Forgot() {
  const [step, setStep] = useState(1);

  const [email, setEmail] = useState("");

  const [code, setCode] = useState("");

  const [password, setPassword] = useState("");

  const [confirmPassword, setConfirmPassword] = useState("");

  const [showPassword, setShowPassword] = useState(false);

  const [showConfirm, setShowConfirm] = useState(false);

  const mismatch = confirmPassword.length > 0 && password !== confirmPassword;

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
          Назад
        </Link>

        <div className={styles.brand}>UyTap</div>

        <h1 className={styles.title}>Восстановление</h1>

        <p className={styles.subtitle}>
          {step === 1 && "Введите email, чтобы получить код восстановления"}

          {step === 2 && "Введите 6-значный код из письма"}

          {step === 3 && "Создайте новый пароль"}
        </p>

        {step === 1 && (
          <motion.div
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
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>

            <button className={styles.submit} onClick={() => setStep(2)}>
              Отправить код
            </button>
          </motion.div>
        )}

        {step === 2 && (
          <motion.div
            className={styles.form}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
          >
            <div className={styles.inputBox}>
              <Mail />

              <input
                maxLength={6}
                inputMode="numeric"
                placeholder="000000"
                value={code}
                onChange={(e) => setCode(e.target.value.replace(/\D/g, ""))}
              />
            </div>

            <button className={styles.submit} onClick={() => setStep(3)}>
              Проверить код
            </button>
          </motion.div>
        )}

        {step === 3 && (
          <motion.div
            className={styles.form}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
          >
            <div className={styles.inputBox}>
              <Lock />

              <input
                type={showPassword ? "text" : "password"}
                placeholder="Новый пароль"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />

              <button
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
                placeholder="Повторите пароль"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
              />

              <button
                className={styles.eye}
                onClick={() => setShowConfirm(!showConfirm)}
              >
                {showConfirm ? <EyeOff /> : <Eye />}
              </button>
            </div>

            {mismatch && <p className={styles.error}>Пароли не совпадают</p>}

            <button disabled={mismatch} className={styles.submit}>
              Сохранить пароль
            </button>
          </motion.div>
        )}

        <div className={styles.bottom}>
          Вспомнили пароль?
          <Link href="/login">Войти</Link>
        </div>
      </motion.section>
    </main>
  );
}
