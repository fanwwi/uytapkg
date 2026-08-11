"use client";

import { useEffect, useRef, useState } from "react";
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
  const [openUp, setOpenUp] = useState(false);

  const wrapperRef = useRef(null);

  useEffect(() => {
    if (!open || !wrapperRef.current) return;

    const updatePosition = () => {
      const rect = wrapperRef.current.getBoundingClientRect();

      const spaceBelow = window.innerHeight - rect.bottom;
      const spaceAbove = rect.top;

      // Если снизу мало места, открываем вверх
      setOpenUp(spaceBelow < 320 && spaceAbove > spaceBelow);
    };

    updatePosition();

    window.addEventListener("resize", updatePosition);
    window.addEventListener("scroll", updatePosition, true);

    return () => {
      window.removeEventListener("resize", updatePosition);
      window.removeEventListener("scroll", updatePosition, true);
    };
  }, [open]);

  useEffect(() => {
    if (!open) return;

    const handleOutsideClick = (event) => {
      if (
        wrapperRef.current &&
        !wrapperRef.current.contains(event.target)
      ) {
        setOpen(false);
      }
    };

    document.addEventListener("mousedown", handleOutsideClick);

    return () => {
      document.removeEventListener("mousedown", handleOutsideClick);
    };
  }, [open]);

  return (
    <div ref={wrapperRef} className={styles.wrapper}>
      <button
        type="button"
        className={`${styles.select} ${
          open ? styles.selectOpen : ""
        }`}
        onClick={() => setOpen((prev) => !prev)}
      >
        <div className={styles.left}>
          {Icon && <Icon className={styles.icon} />}

          <section>
            <small>{title}</small>

            <strong>{value || "Любой"}</strong>
          </section>
        </div>

        <ChevronDown
          className={`${styles.arrow} ${
            open ? styles.rotate : ""
          }`}
        />
      </button>

      {open && (
        <div
          className={`${styles.dropdown} ${
            openUp ? styles.dropdownUp : styles.dropdownDown
          }`}
        >
          {options.map((item) => (
            <button
              type="button"
              key={item}
              className={`${styles.option} ${
                value === item ? styles.optionSelected : ""
              }`}
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