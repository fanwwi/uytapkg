"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import {
  X,
  Crown,
  Zap,
  Rocket,
  Camera,
  ArrowRight,
  AlertCircle,
} from "lucide-react";

import { getPricing } from "@/utils/api";
import { useLanguage } from "@/context/LanguageContext";

import styles from "./PromoteListingModal.module.css";

const SERVICES = [
  {
    id: "vip",
    icon: Crown,
    perDay: true,
  },
  {
    id: "top",
    icon: Rocket,
    perDay: true,
  },
  {
    id: "urgent",
    icon: Zap,
    perDay: true,
  },
  {
    id: "instagram",
    icon: Camera,
    perDay: false,
  },
];

const DAY_OPTIONS = [1, 3, 7, 14, 30];

export default function PromoteListingModal({ isOpen, onClose, listing }) {
  const router = useRouter();
  const { t } = useLanguage();

  const [pricing, setPricing] = useState(null);
  const [pricingError, setPricingError] = useState("");
  const [serviceType, setServiceType] = useState("vip");
  const [days, setDays] = useState(7);

  useEffect(() => {
    if (!isOpen) return;

    setServiceType("vip");
    setDays(7);
    setPricingError("");

    getPricing()
      .then((data) => setPricing(data))
      .catch((err) => {
        console.error("Ошибка загрузки цен продвижения:", err);

        setPricingError("promoteListingModal.errors.pricing");
      });
  }, [isOpen]);

  useEffect(() => {
    if (!isOpen) return;

    const handleEscape = (event) => {
      if (event.key === "Escape") {
        onClose();
      }
    };

    document.addEventListener("keydown", handleEscape);

    return () => document.removeEventListener("keydown", handleEscape);
  }, [isOpen, onClose]);

  if (!isOpen || !listing) return null;

  const selected = SERVICES.find((service) => service.id === serviceType);

  const pricePerUnit = pricing?.services?.[serviceType];

  const total = pricing
    ? selected.perDay
      ? Number(pricePerUnit) * days
      : Number(pricePerUnit)
    : null;

  const handleSubmit = () => {
    const params = new URLSearchParams({
      type: "promotion",
      listingId: listing.id,
      serviceType,
    });

    if (selected.perDay) {
      params.set("days", String(days));
    }

    router.push(`/payment?${params.toString()}`);
  };

  const getServiceTitle = (serviceId) => {
    return t(`promoteListingModal.services.${serviceId}.title`);
  };

  const getServiceDescription = (serviceId) => {
    return t(`promoteListingModal.services.${serviceId}.description`);
  };

  const getServicePeriod = (service) => {
    return service.perDay
      ? t("promoteListingModal.pricing.perDay")
      : t("promoteListingModal.pricing.oneTime");
  };

  return (
    <div
      className={styles.overlay}
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) {
          onClose();
        }
      }}
    >
      <div
        className={styles.modal}
        role="dialog"
        aria-modal="true"
        aria-labelledby="promote-modal-title"
      >
        <div className={styles.header}>
          <div>
            <span>{t("promoteListingModal.header.label")}</span>

            <h2 id="promote-modal-title">
              {t("promoteListingModal.header.title")}
            </h2>

            <p>{listing.title}</p>
          </div>

          <button
            type="button"
            className={styles.close}
            onClick={onClose}
            aria-label={t("promoteListingModal.actions.close")}
          >
            <X />
          </button>
        </div>

        <div className={styles.body}>
          {pricingError && (
            <div className={styles.error}>
              <AlertCircle size={14} />

              {pricingError.startsWith("promoteListingModal.")
                ? t(pricingError)
                : pricingError}
            </div>
          )}

          <div className={styles.serviceGrid}>
            {SERVICES.map((service) => {
              const Icon = service.icon;
              const isSelected = serviceType === service.id;

              const price = pricing?.services?.[service.id];

              return (
                <button
                  key={service.id}
                  type="button"
                  className={`${styles.serviceCard} ${
                    isSelected ? styles.serviceSelected : ""
                  }`}
                  onClick={() => setServiceType(service.id)}
                >
                  <div className={styles.serviceIcon}>
                    <Icon size={19} />
                  </div>

                  <div className={styles.serviceInfo}>
                    <strong>{getServiceTitle(service.id)}</strong>

                    <span>{getServiceDescription(service.id)}</span>
                  </div>

                  <div className={styles.servicePrice}>
                    {price !== undefined ? (
                      <>
                        {Number(price).toLocaleString("ru-RU")}{" "}
                        {t("promoteListingModal.pricing.currency")}
                        <small>{getServicePeriod(service)}</small>
                      </>
                    ) : (
                      "—"
                    )}
                  </div>
                </button>
              );
            })}
          </div>

          {selected.perDay && (
            <div className={styles.daysSection}>
              <span className={styles.daysLabel}>
                {t("promoteListingModal.days.label")}
              </span>

              <div className={styles.daysGrid}>
                {DAY_OPTIONS.map((option) => (
                  <button
                    key={option}
                    type="button"
                    className={`${styles.dayOption} ${
                      days === option ? styles.dayOptionSelected : ""
                    }`}
                    onClick={() => setDays(option)}
                  >
                    {option} {t("promoteListingModal.days.short")}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        <div className={styles.footer}>
          <div className={styles.total}>
            <span>{t("promoteListingModal.total.label")}</span>

            <strong>
              {total !== null
                ? `${total.toLocaleString("ru-RU")} ${t(
                    "promoteListingModal.pricing.currency",
                  )}`
                : "—"}
            </strong>
          </div>

          <button
            type="button"
            className={styles.submit}
            onClick={handleSubmit}
            disabled={!pricing}
          >
            {t("promoteListingModal.actions.payment")}

            <ArrowRight size={16} />
          </button>
        </div>
      </div>
    </div>
  );
}
