"use client";

import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { ChevronDown } from "lucide-react";

import { useLanguage } from "@/context/LanguageContext";

import styles from "./CustomSelect.module.css";

export default function CustomSelect({
  icon: Icon,
  title,
  options = [],
  value,
  setValue,
}) {
  const { t } = useLanguage();

  const [open, setOpen] = useState(false);
  const [dropdownStyle, setDropdownStyle] = useState(null);

  const wrapperRef = useRef(null);

  const GAP = 10;
  const MAX_HEIGHT = 300;
  const MIN_HEIGHT = 120;

  /**
   * Поддерживаем оба формата:
   *
   * "Новостройка"
   *
   * или
   *
   * {
   *   value: "Новостройка",
   *   label: "Жаңы курулуш"
   * }
   */
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

  /**
   * Находим выбранную опцию.
   *
   * value всегда содержит внутреннее значение,
   * которое используется формой/API.
   */
  const selectedOption = options.find(
    (option) => getOptionValue(option) === value,
  );

  const selectedLabel = selectedOption
    ? getOptionLabel(selectedOption)
    : value || t("common.any");

  /**
   * Позиция dropdown относительно исходного select.
   *
   * Dropdown всегда открывается вниз.
   *
   * Если места снизу мало:
   * просто уменьшаем его высоту,
   * но НЕ открываем вверх.
   */
  function updateDropdownPosition() {
    if (!wrapperRef.current) return;

    const rect = wrapperRef.current.getBoundingClientRect();

    const viewportHeight = window.innerHeight;

    const spaceBelow = viewportHeight - rect.bottom - GAP;

    const availableHeight = Math.max(
      MIN_HEIGHT,
      Math.min(MAX_HEIGHT, spaceBelow),
    );

    setDropdownStyle({
      position: "fixed",
      top: `${rect.bottom + GAP}px`,
      left: `${rect.left}px`,
      width: `${rect.width}px`,
      maxHeight: `${availableHeight}px`,
    });
  }

  function toggleDropdown() {
    setOpen((prev) => !prev);
  }

  /**
   * Когда dropdown открыт:
   * - пересчитываем позицию;
   * - следим за resize;
   * - следим за scroll всех контейнеров.
   */
  useEffect(() => {
    if (!open) return;

    updateDropdownPosition();

    const handleResize = () => {
      updateDropdownPosition();
    };

    const handleScroll = () => {
      updateDropdownPosition();
    };

    window.addEventListener("resize", handleResize);

    // true — ловит scroll даже внутри ScrollContainer
    window.addEventListener("scroll", handleScroll, true);

    return () => {
      window.removeEventListener("resize", handleResize);
      window.removeEventListener("scroll", handleScroll, true);
    };
  }, [open]);

  /**
   * Закрытие при клике вне select/dropdown.
   *
   * Поскольку dropdown находится через portal,
   * wrapperRef его не содержит.
   */
  useEffect(() => {
    if (!open) return;

    function handleOutsideClick(event) {
      const target = event.target;

      const clickedInsideSelect = wrapperRef.current?.contains(target);

      const clickedInsideDropdown = target.closest(
        "[data-custom-select-dropdown]",
      );

      if (!clickedInsideSelect && !clickedInsideDropdown) {
        setOpen(false);
      }
    }

    document.addEventListener("mousedown", handleOutsideClick);

    return () => {
      document.removeEventListener("mousedown", handleOutsideClick);
    };
  }, [open]);

  /**
   * Закрываем dropdown при Escape.
   */
  useEffect(() => {
    if (!open) return;

    function handleKeyDown(event) {
      if (event.key === "Escape") {
        setOpen(false);
      }
    }

    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [open]);

  /**
   * Если dropdown открыт и его размер/позиция
   * ещё не рассчитаны — не рендерим его
   * в неправильном месте.
   */
  const dropdown =
    open && dropdownStyle
      ? createPortal(
          <div
            data-custom-select-dropdown
            className={styles.dropdown}
            style={dropdownStyle}
          >
            {options.length > 0 ? (
              options.map((item) => {
                const optionValue = getOptionValue(item);

                const optionLabel = getOptionLabel(item);

                const isSelected = value === optionValue;

                return (
                  <button
                    type="button"
                    key={optionValue}
                    className={`${styles.option} ${
                      isSelected ? styles.optionSelected : ""
                    }`}
                    onClick={() => {
                      setValue(optionValue);
                      setOpen(false);
                    }}
                  >
                    {optionLabel}
                  </button>
                );
              })
            ) : (
              <div className={styles.empty}>{t("common.noOptions")}</div>
            )}
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
          onClick={toggleDropdown}
          aria-expanded={open}
          aria-haspopup="listbox"
        >
          <div className={styles.left}>
            {Icon && <Icon className={styles.icon} />}

            <section>
              <small>{title}</small>

              <strong>{selectedLabel}</strong>
            </section>
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
