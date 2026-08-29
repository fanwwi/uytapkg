"use client";

import { X } from "lucide-react";

import styles from "./Modal.module.css";

export default function Modal({ open, onClose, title, children }) {
  if (!open) return null;

  return (
    <div
      className={styles.overlay}
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) {
          onClose();
        }
      }}
    >
      <div className={styles.modal}>
        <div className={styles.header}>
          <h2>{title}</h2>

          <button type="button" onClick={onClose} className={styles.close}>
            <X />
          </button>
        </div>

        <div className={styles.body}>{children}</div>
      </div>
    </div>
  );
}
