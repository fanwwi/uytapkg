"use client";

import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { Check, ChevronDown } from "lucide-react";

import { useLanguage } from "@/context/LanguageContext";

import styles from "./MultiSelect.module.css";

export default function MultiSelect({
  icon: Icon,
  title,
  options = [],
  value = [],
  setValue,
}) {
  const { t } = useLanguage();

  const [open, setOpen] = useState(false);
  const [dropdownStyle, setDropdownStyle] = useState(null);

  const wrapperRef = useRef(null);

  /* =========================================================
     OPTION HELPERS
  ========================================================= */

  function getOptionValue(option) {
    if (option && typeof option === "object") {
      return option.value;
    }

    return option;
  }

  function getOptionLabel(option) {
    if (option && typeof option === "object") {
      return option.label;
    }

    return option;
  }

  function getSelectedOption(valueItem) {
    return options.find((option) => getOptionValue(option) === valueItem);
  }

  /* =========================================================
     DROPDOWN POSITION
  ========================================================= */

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

  /* =========================================================
     OPEN / CLOSE
  ========================================================= */

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

  /* =========================================================
     VALUE
  ========================================================= */

  function toggleValue(optionValue) {
    setValue(
      value.includes(optionValue)
        ? value.filter((item) => item !== optionValue)
        : [...value, optionValue],
    );
  }

  /* =========================================================
     SELECTED LABEL
  ========================================================= */

  let label;

  if (value.length === 0) {
    label = t("common.any");
  } else if (value.length === 1) {
    const selectedOption = getSelectedOption(value[0]);

    label = selectedOption ? getOptionLabel(selectedOption) : value[0];
  } else {
    // Вывод текста с количеством цифрой (например: "Выбрано: 3" или можно использовать ваш перевод)
    label = `Выбрано: ${value.length}`;
  }

  /* =========================================================
     DROPDOWN
  ========================================================= */

  const dropdown =
    open && dropdownStyle
      ? createPortal(
          <div
            data-multi-select-dropdown
            className={styles.dropdown}
            style={dropdownStyle}
          >
            {options.map((option) => {
              const optionValue = getOptionValue(option);
              const optionLabel = getOptionLabel(option);

              const selected = value.includes(optionValue);

              return (
                <button
                  key={optionValue}
                  type="button"
                  className={`${styles.option} ${
                    selected ? styles.selected : ""
                  }`}
                  onClick={() => toggleValue(optionValue)}
                >
                  <span>{optionLabel}</span>

                  {selected && <Check size={16} />}
                </button>
              );
            })}
          </div>,
          document.body,
        )
      : null;

  /* =========================================================
     RENDER
  ========================================================= */

  return (
    <>
      <div ref={wrapperRef} className={styles.wrapper}>
        <button
          type="button"
          className={`${styles.select} ${open ? styles.selectOpen : ""}`}
          onClick={() => setOpen((prev) => !prev)}
          aria-expanded={open}
          aria-haspopup="listbox"
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
