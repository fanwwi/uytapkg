"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";

import { Mail, Phone, Lock, Check, ArrowRight } from "lucide-react";

import Link from "next/link";

import styles from "./Login.module.css";

export default function Login() {
  const [method, setMethod] = useState("phone");

  const [phoneStep, setPhoneStep] = useState(1);

  const [phone, setPhone] = useState("");

  const [code, setCode] = useState(["", "", "", ""]);

  const [email, setEmail] = useState("");

  const [password, setPassword] = useState("");

  const [remember, setRemember] = useState(true);

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
      alert("Введите корректный номер Кыргызстана");
      return;
    }

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
            }}
          >
            <Phone />
            Телефон
          </button>

          <button
            className={method === "email" ? styles.activeMethod : styles.method}
            onClick={() => setMethod("email")}
          >
            <Mail />
            Почта
          </button>
        </div>

        {method === "phone" && (
          <motion.form
            className={styles.form}
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
                <p className={styles.smsInfo}>Код отправлен на ваш номер</p>

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

                <button className={styles.submit}>Войти</button>

                <button type="button" className={styles.resend}>
                  Отправить код повторно
                </button>
              </>
            )}
          </motion.form>
        )}

        {method === "email" && (
          <motion.form
            className={styles.form}
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
              />
            </div>

            <div className={styles.inputBox}>
              <Lock />

              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Пароль"
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

            <button className={styles.submit}>Войти</button>
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
