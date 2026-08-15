"use client";

import { AlertTriangle, X, Trash2, Loader2 } from "lucide-react";
import styles from "./DeleteModal.module.css";

export default function DeleteModal({
  isOpen,
  onClose,
  onConfirm,
  title = "Удалить объект?",
  description = "Это действие нельзя отменить. Объект будет удалён без возможности восстановления.",
  loading = false,
  confirmText = "Удалить",
  cancelText = "Отмена",
}) {
  if (!isOpen) return null;

  const handleConfirm = async () => {
    if (loading) return;

    await onConfirm();
  };

  return (
    <div
      className={styles.overlay}
      onMouseDown={(e) => {
        if (e.target === e.currentTarget && !loading) {
          onClose();
        }
      }}
    >
      <div
        className={styles.modal}
        role="dialog"
        aria-modal="true"
        aria-labelledby="delete-modal-title"
      >
        <button
          type="button"
          className={styles.close}
          onClick={onClose}
          disabled={loading}
          aria-label="Закрыть"
        >
          <X size={19} />
        </button>

        <div className={styles.iconWrapper}>
          <div className={styles.icon}>
            <AlertTriangle size={25} />
          </div>
        </div>

        <div className={styles.content}>
          <span className={styles.label}>ПОДТВЕРЖДЕНИЕ</span>

          <h2 id="delete-modal-title">{title}</h2>

          <p>{description}</p>
        </div>

        <div className={styles.actions}>
          <button
            type="button"
            className={styles.cancel}
            onClick={onClose}
            disabled={loading}
          >
            {cancelText}
          </button>

          <button
            type="button"
            className={styles.delete}
            onClick={handleConfirm}
            disabled={loading}
          >
            {loading ? (
              <>
                <Loader2 size={17} className={styles.loader} />
                Удаление...
              </>
            ) : (
              <>
                <Trash2 size={17} />
                {confirmText}
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
