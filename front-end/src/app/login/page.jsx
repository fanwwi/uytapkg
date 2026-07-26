"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";

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
} from "lucide-react";

import styles from "./Login.module.css";

export default function Login() {
  const [accountType, setAccountType] = useState("personal");

  const [method, setMethod] = useState("phone");

  const [phoneStep, setPhoneStep] = useState(1);

  const [phone, setPhone] = useState("");

  const [code, setCode] = useState(["", "", "", ""]);

  const [email, setEmail] = useState("");

  const [password, setPassword] = useState("");

  const [showPassword, setShowPassword] = useState(false);

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
      alert("Введите корректный номер");

      return;
    }

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
                  }}
                >
                  <Phone />
                  Телефон
                </button>

                <button
                  className={
                    method === "email" ? styles.activeMethod : styles.method
                  }
                  onClick={() => setMethod("email")}
                >
                  <Mail />
                  Email
                </button>
              </div>

              <AnimatePresence mode="wait">
                {method === "phone" && (
                  <motion.div
                    key="phone"
                    initial={{
                      opacity: 0,
                      x: -20,
                    }}
                    animate={{
                      opacity: 1,
                      x: 0,
                    }}
                    exit={{
                      opacity: 0,
                      x: -20,
                    }}
                    transition={{
                      duration: 0.25,
                    }}
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
                      <div className={styles.form}>
                        <p className={styles.smsInfo}>Введите код из SMS</p>

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

                        <button className={styles.submit}>Войти</button>

                        <button className={styles.resend}>
                          Отправить код повторно
                        </button>
                      </div>
                    )}
                  </motion.div>
                )}

                {method === "email" && (
                  <motion.div
                    key="email"
                    initial={{
                      opacity: 0,
                      x: 20,
                    }}
                    animate={{
                      opacity: 1,
                      x: 0,
                    }}
                    exit={{
                      opacity: 0,
                      x: 20,
                    }}
                    transition={{
                      duration: 0.25,
                    }}
                  >
                    <EmailForm
                      email={email}
                      setEmail={setEmail}
                      password={password}
                      setPassword={setPassword}
                      showPassword={showPassword}
                      setShowPassword={setShowPassword}
                    />
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          )}

          {accountType === "business" && (
            <motion.div
              key="business"
              initial={{
                opacity: 0,
                x: 30,
              }}
              animate={{
                opacity: 1,
                x: 0,
              }}
              exit={{
                opacity: 0,
                x: 30,
              }}
              transition={{
                duration: 0.3,
              }}
            >
              <EmailForm
                email={email}
                setEmail={setEmail}
                password={password}
                setPassword={setPassword}
                showPassword={showPassword}
                setShowPassword={setShowPassword}
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

  business,
}) {
  const [remember, setRemember] = useState(true);

  return (
    <div className={styles.form}>
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
          type={showPassword ? "text" : "password"}
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Пароль"
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

      <button className={styles.submit}>Войти</button>
    </div>
  );
}
