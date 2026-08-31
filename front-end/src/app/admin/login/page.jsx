"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Mail, Lock, LoaderCircle } from "lucide-react";

import styles from "./AdminLogin.module.css";
import { loginUser, getMe } from "@/utils/api";

// Специально не различаем "неверный пароль" и "вход валиден, но роль
// не admin" — единая ошибка не даёт перебором узнать, какие email
// вообще существуют в системе и у кого из них есть права администратора.
const GENERIC_ERROR = "Неверные данные для входа в админ-панель";

export default function AdminLoginPage() {
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (event) => {
    event.preventDefault();

    setError("");
    setLoading(true);

    try {
      const data = await loginUser({ identifier: email, password });

      if (!data.token) {
        setError(GENERIC_ERROR);
        return;
      }

      const user = await getMe(data.token);

      if (user?.role !== "admin") {
        setError(GENERIC_ERROR);
        return;
      }

      document.cookie = `uytap_token=${data.token}; path=/; max-age=${60 * 60 * 24 * 30}`;
      localStorage.setItem("uytap_token", data.token);
      localStorage.setItem("uytap_user", JSON.stringify(user));

      router.push("/admin");
    } catch {
      setError(GENERIC_ERROR);
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className={styles.page}>
      <div className={styles.card}>
        <div className={styles.logo}>
          Uy<span>Tap</span>
        </div>

        <p className={styles.subtitle}>Вход в панель администратора</p>

        <form className={styles.form} onSubmit={handleSubmit}>
          {error && <div className={styles.error}>{error}</div>}

          <div className={styles.inputBox}>
            <Mail size={17} />
            <input
              type="email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              placeholder="Email администратора"
              autoComplete="username"
              required
            />
          </div>

          <div className={styles.inputBox}>
            <Lock size={17} />
            <input
              type="password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              placeholder="Пароль"
              autoComplete="current-password"
              required
            />
          </div>

          <button type="submit" className={styles.submit} disabled={loading}>
            {loading ? (
              <LoaderCircle size={18} className={styles.spin} />
            ) : (
              "Войти"
            )}
          </button>
        </form>
      </div>
    </main>
  );
}
