"use client";

import { AlertTriangle, X, Trash2, Loader2 } from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";
import styles from "./DeleteModal.module.css";

export default function DeleteModal({
  isOpen,
  onClose,
  onConfirm,
  title,
  description,
  loading = false,
  confirmText,
  cancelText,
}) {
  const { t } = useLanguage();

  if (!isOpen) return null;

  const finalTitle = title ?? t("deleteModal.defaults.title");

  const finalDescription = description ?? t("deleteModal.defaults.description");

  const finalConfirmText = confirmText ?? t("deleteModal.defaults.confirm");

  const finalCancelText = cancelText ?? t("deleteModal.defaults.cancel");

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
          aria-label={t("deleteModal.actions.close")}
        >
          <X size={19} />
        </button>

        <div className={styles.iconWrapper}>
          <div className={styles.icon}>
            <AlertTriangle size={25} />
          </div>
        </div>

        <div className={styles.content}>
          <span className={styles.label}>{t("deleteModal.confirmation")}</span>

          <h2 id="delete-modal-title">{finalTitle}</h2>

          <p>{finalDescription}</p>
        </div>

        <div className={styles.actions}>
          <button
            type="button"
            className={styles.cancel}
            onClick={onClose}
            disabled={loading}
          >
            {finalCancelText}
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
                {t("deleteModal.actions.deleting")}
              </>
            ) : (
              <>
                <Trash2 size={17} />
                {finalConfirmText}
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
