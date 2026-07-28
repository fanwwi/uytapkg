"use client";

import { useState } from "react";
import { ChevronDown } from "lucide-react";

import styles from "./CustomSelect.module.css";

export default function CustomSelect({
  icon: Icon,
  title,
  options = [],
  value,
  setValue,
}) {
  const [open, setOpen] = useState(false);

  return (
    <div className={styles.wrapper}>
      <button
        type="button"
        className={styles.select}
        onClick={() => setOpen(!open)}
      >
        <div className={styles.left}>
          {Icon && <Icon className={styles.icon} />}

          <section>
            <small>{title}</small>

            <strong>{value || "Любой"}</strong>
          </section>
        </div>

        <ChevronDown
          className={`${styles.arrow} ${open ? styles.rotate : ""}`}
        />
      </button>

      {open && (
        <div className={styles.dropdown}>
          {options.map((item) => (
            <button
              type="button"
              key={item}
              className={styles.option}
              onClick={() => {
                setValue(item);
                setOpen(false);
              }}
            >
              {item}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
