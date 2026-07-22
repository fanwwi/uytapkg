"use client";

import { useState } from "react";

import { ChevronDown } from "lucide-react";

import styles from "../../../pageComponents/searchFilter/SearchFilter.module.css";

export default function CustomSelect({
  icon: Icon,

  title,

  options = [],

  value,

  setValue,
}) {
  const [open, setOpen] = useState(false);

  return (
    <div className={styles.custom}>
      <button className={styles.select} onClick={() => setOpen(!open)}>
        <div>
          {Icon && <Icon />}

          <section>
            <small>{title}</small>

            <strong>{value || "Выбрать"}</strong>
          </section>
        </div>

        <ChevronDown className={open ? styles.rotate : ""} />
      </button>

      {open && (
        <div className={styles.dropdown}>
          {options.map((option) => (
            <button
              key={option}
              onClick={() => {
                setValue?.(option);

                setOpen(false);
              }}
            >
              {option}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
