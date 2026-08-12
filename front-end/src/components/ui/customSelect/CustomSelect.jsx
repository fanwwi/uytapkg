"use client";

import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
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
  const [dropdownStyle, setDropdownStyle] = useState(null);

  const wrapperRef = useRef(null);

  const GAP = 10;
  const MAX_HEIGHT = 300;
  const MIN_HEIGHT = 120;

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
   *
   * Поэтому отдельно проверяем:
   * - исходный select
   * - dropdown через data-attribute
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
   * ещё не рассчитаны — не рендерим его на долю секунды
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
              options.map((item) => (
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
              ))
            ) : (
              <div className={styles.empty}>Нет доступных вариантов</div>
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

              <strong>{value || "Любой"}</strong>
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
