"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Mail, Lock, Eye, EyeOff, ArrowLeft } from "lucide-react";

import Link from "next/link";

import { useLanguage } from "@/context/LanguageContext";

import styles from "./Forgot.module.css";

export default function Forgot() {
  const { t } = useLanguage();

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
              {t("forgot.sendCode")}
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
              {t("forgot.verifyCode")}
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
                placeholder={t("forgot.newPassword")}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
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
                onChange={(e) => setConfirmPassword(e.target.value)}
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

            <button disabled={mismatch} className={styles.submit}>
              {t("forgot.savePassword")}
            </button>
          </motion.div>
        )}

        <div className={styles.bottom}>
          {t("forgot.rememberPassword")}{" "}
          <Link href="/login">{t("forgot.login")}</Link>
        </div>
      </motion.section>
    </main>
  );
}
