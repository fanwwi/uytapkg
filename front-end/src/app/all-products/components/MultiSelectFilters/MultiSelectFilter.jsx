"use client";

import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { Check, ChevronDown } from "lucide-react";

import styles from "./MultiSelect.module.css";

export default function MultiSelect({
  icon: Icon,
  title,
  options = [],
  value = [],
  setValue,
}) {
  const [open, setOpen] = useState(false);
  const [dropdownStyle, setDropdownStyle] = useState(null);

  const wrapperRef = useRef(null);

  function updatePosition() {
    if (!wrapperRef.current) return;

    const rect = wrapperRef.current.getBoundingClientRect();

    const spaceBelow = window.innerHeight - rect.bottom - 10;

    const maxHeight = Math.max(120, Math.min(300, spaceBelow));

    setDropdownStyle({
      position: "fixed",
      top: `${rect.bottom + 10}px`,
      left: `${rect.left}px`,
      width: `${rect.width}px`,
      maxHeight: `${maxHeight}px`,
    });
  }

  useEffect(() => {
    if (!open) return;

    updatePosition();

    const handleResize = () => updatePosition();
    const handleScroll = () => updatePosition();

    window.addEventListener("resize", handleResize);
    window.addEventListener("scroll", handleScroll, true);

    return () => {
      window.removeEventListener("resize", handleResize);
      window.removeEventListener("scroll", handleScroll, true);
    };
  }, [open]);

  useEffect(() => {
    if (!open) return;

    function handleOutside(event) {
      const target = event.target;

      if (wrapperRef.current?.contains(target)) {
        return;
      }

      if (target.closest("[data-multi-select-dropdown]")) {
        return;
      }

      setOpen(false);
    }

    function handleKeyDown(event) {
      if (event.key === "Escape") {
        setOpen(false);
      }
    }

    document.addEventListener("mousedown", handleOutside);
    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.removeEventListener("mousedown", handleOutside);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [open]);

  function toggleValue(option) {
    setValue(
      value.includes(option)
        ? value.filter((item) => item !== option)
        : [...value, option],
    );
  }

  const label =
    value.length === 0
      ? "Любые"
      : value.length === 1
        ? value[0]
        : `${value.length} выбрано`;

  const dropdown =
    open && dropdownStyle
      ? createPortal(
          <div
            data-multi-select-dropdown
            className={styles.dropdown}
            style={dropdownStyle}
          >
            {options.map((option) => {
              const selected = value.includes(option);

              return (
                <button
                  key={option}
                  type="button"
                  className={`${styles.option} ${
                    selected ? styles.selected : ""
                  }`}
                  onClick={() => toggleValue(option)}
                >
                  <span>{option}</span>

                  {selected && <Check size={16} />}
                </button>
              );
            })}
          </div>,
          document.body,
        )
      : null;

  return (
    <>
      <div ref={wrapperRef} className={styles.wrapper}>
        <button
          type="button"
          className={`${styles.select} ${open ? styles.selectOpen : ""}`}
          onClick={() => setOpen((prev) => !prev)}
          aria-expanded={open}
        >
          <div className={styles.left}>
            {Icon && <Icon className={styles.icon} />}

            <div className={styles.content}>
              <span>{title}</span>
              <strong>{label}</strong>
            </div>
          </div>

          <ChevronDown
            className={`${styles.arrow} ${open ? styles.rotate : ""}`}
          />
        </button>
      </div>

      {dropdown}
    </>
  );
}
