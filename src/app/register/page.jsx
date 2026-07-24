"use client";

import { useState } from "react";
import { motion } from "framer-motion";

import Link from "next/link";

import styles from "./Register.module.css";
import PersonalForm from "./сomponents/personalForm/PersonalForm";
import RealtorForm from "./сomponents/realtorForm/RealtorForm";
import DeveloperForm from "./сomponents/developerForm/DeveloperForm";
import AccountType from "./сomponents/accountType/AccountType";
import Agency from "./сomponents/agency/Agency";

export default function Register() {
  const [accountType, setAccountType] = useState(null);

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

        <h1 className={styles.title}>Регистрация</h1>

        <p className={styles.subtitle}>
          Создайте аккаунт и управляйте недвижимостью удобнее
        </p>

        {!accountType && (
          <motion.div
            initial={{
              opacity: 0,
            }}
            animate={{
              opacity: 1,
            }}
          >
            <AccountType type={accountType} setType={setAccountType} />
          </motion.div>
        )}

        {accountType && (
          <motion.div
            key={accountType}
            initial={{
              opacity: 0,
              x: 30,
            }}
            animate={{
              opacity: 1,
              x: 0,
            }}
            transition={{
              duration: 0.35,
            }}
          >
            {accountType && (
              <button
                className={styles.changeType}
                onClick={() => setAccountType(null)}
              >
                ← Изменить тип аккаунта
              </button>
            )}

            {accountType === "personal" && <PersonalForm />}

            {accountType === "realtor" && <RealtorForm />}

            {accountType === "developer" && <DeveloperForm />}

            {accountType === "agency" && <Agency />}
          </motion.div>
        )}

        <div className={styles.bottom}>
          Уже есть аккаунт?
          <Link href="/login">Войти</Link>
        </div>
      </motion.section>
    </main>
  );
}
