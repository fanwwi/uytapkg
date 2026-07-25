"use client";

import { Eye, EyeOff } from "lucide-react";

import styles from "./InputField.module.css";

export default function InputField({
  icon: Icon,
  type = "text",
  placeholder,
  value,
  setValue,
  password,
  showPassword,
  setShowPassword,
}) {
  return (
    <div className={styles.wrapper}>
      {Icon && <Icon className={styles.icon} />}

      <input
        type={password ? (showPassword ? "text" : "password") : type}
        placeholder={placeholder}
        value={value}
        onChange={(e) => setValue(e.target.value)}
      />

      {password && (
        <button
          type="button"
          className={styles.eye}
          onClick={() => setShowPassword(!showPassword)}
        >
          {showPassword ? <EyeOff /> : <Eye />}
        </button>
      )}
    </div>
  );
}
