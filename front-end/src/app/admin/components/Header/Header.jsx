"use client";

import { Bell } from "lucide-react";

import styles from "./Header.module.css";

export default function Header({ title, subtitle }) {
  return (
    <header className={styles.header}>
      <div>
        <h1>{title}</h1>
        <p>{subtitle}</p>
      </div>

      <button className={styles.notification}>
        <Bell />
        <span />
      </button>
    </header>
  );
}
