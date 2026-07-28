"use client";

import { useState } from "react";
import { User, Phone, Mail, Lock, CheckCircle2 } from "lucide-react";
import { useRouter } from "next/navigation";
import styles from "./PersonalForm.module.css";
import InputField from "../inputField/InputField";
import { registerUser } from "@/utils/api";

export default function PersonalForm() {
  const router = useRouter();
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const data = await registerUser({
        accountType: "personal",
        firstName,
        lastName,
        phone,
        email,
        password,
      });

      if (data.token) {
        localStorage.setItem("uytap_token", data.token);
        localStorage.setItem("uytap_user", JSON.stringify(data.user));
      }

      setSuccess(true);
      setTimeout(() => {
        router.push("/main");
      }, 1500);
    } catch (err) {
      setError(err.message || "Ошибка при регистрации");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form className={styles.form} onSubmit={handleSubmit}>
      <InputField
        icon={User}
        placeholder="Имя"
        value={firstName}
        setValue={setFirstName}
      />

      <InputField
        icon={User}
        placeholder="Фамилия"
        value={lastName}
        setValue={setLastName}
      />

      <InputField
        icon={Phone}
        placeholder="+996 990 000 000"
        value={phone}
        setValue={setPhone}
      />

      <InputField
        icon={Mail}
        placeholder="Email"
        type="email"
        value={email}
        setValue={setEmail}
      />

      <InputField
        icon={Lock}
        placeholder="Пароль"
        password
        value={password}
        setValue={setPassword}
      />

      {error && (
        <div style={{ color: "#ef4444", fontSize: "14px", marginTop: "4px" }}>
          ⚠️ {error}
        </div>
      )}

      {success && (
        <div style={{ color: "#10b981", fontSize: "14px", display: "flex", alignItems: "center", gap: "6px" }}>
          <CheckCircle2 size={18} /> Аккаунт успешно создан! Перенаправление...
        </div>
      )}

      <button className={styles.submit} type="submit" disabled={loading}>
        {loading ? "Создание аккаунта..." : "Создать аккаунт"}
      </button>
    </form>
  );
}
