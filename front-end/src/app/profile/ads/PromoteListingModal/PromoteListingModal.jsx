"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { X, Crown, Zap, Rocket, Camera, ArrowRight, AlertCircle } from "lucide-react";

import { getPricing } from "@/utils/api";
import styles from "./PromoteListingModal.module.css";

const SERVICES = [
  {
    id: "vip",
    title: "VIP",
    description: "Закрепление в самом верху каталога + золотая рамка",
    icon: Crown,
    perDay: true,
  },
  {
    id: "top",
    title: "ТОП",
    description: "Подъём и закрепление выше стандартных карточек",
    icon: Rocket,
    perDay: true,
  },
  {
    id: "urgent",
    title: "Срочно",
    description: "Красный бейдж + попадание в фильтр «Срочные продажи»",
    icon: Zap,
    perDay: true,
  },
  {
    id: "instagram",
    title: "Instagram",
    description: "Пост + Stories + дублирование в Telegram",
    icon: Camera,
    perDay: false,
  },
];

const DAY_OPTIONS = [1, 3, 7, 14, 30];

export default function PromoteListingModal({ isOpen, onClose, listing }) {
  const router = useRouter();

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
        setPricingError("Не удалось загрузить актуальные цены. Попробуйте позже.");
      });
  }, [isOpen]);

  useEffect(() => {
    if (!isOpen) return;

    const handleEscape = (event) => {
      if (event.key === "Escape") onClose();
    };

    document.addEventListener("keydown", handleEscape);
    return () => document.removeEventListener("keydown", handleEscape);
  }, [isOpen, onClose]);

  if (!isOpen || !listing) return null;

  const selected = SERVICES.find((s) => s.id === serviceType);
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

  return (
    <div
      className={styles.overlay}
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) onClose();
      }}
    >
      <div className={styles.modal}>
        <div className={styles.header}>
          <div>
            <span>ПРОДВИЖЕНИЕ</span>
            <h2>Продвинуть объявление</h2>
            <p>{listing.title}</p>
          </div>

          <button type="button" className={styles.close} onClick={onClose} aria-label="Закрыть">
            <X />
          </button>
        </div>

        <div className={styles.body}>
          {pricingError && (
            <div className={styles.error}>
              <AlertCircle size={14} />
              {pricingError}
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
                  className={`${styles.serviceCard} ${isSelected ? styles.serviceSelected : ""}`}
                  onClick={() => setServiceType(service.id)}
                >
                  <div className={styles.serviceIcon}>
                    <Icon size={19} />
                  </div>

                  <div className={styles.serviceInfo}>
                    <strong>{service.title}</strong>
                    <span>{service.description}</span>
                  </div>

                  <div className={styles.servicePrice}>
                    {price !== undefined ? (
                      <>
                        {Number(price).toLocaleString("ru-RU")} сом
                        <small>{service.perDay ? "/ день" : "разово"}</small>
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
              <span className={styles.daysLabel}>На сколько дней</span>

              <div className={styles.daysGrid}>
                {DAY_OPTIONS.map((option) => (
                  <button
                    key={option}
                    type="button"
                    className={`${styles.dayOption} ${days === option ? styles.dayOptionSelected : ""}`}
                    onClick={() => setDays(option)}
                  >
                    {option} дн.
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        <div className={styles.footer}>
          <div className={styles.total}>
            <span>Итого</span>
            <strong>{total !== null ? `${total.toLocaleString("ru-RU")} сом` : "—"}</strong>
          </div>

          <button
            type="button"
            className={styles.submit}
            onClick={handleSubmit}
            disabled={!pricing}
          >
            Перейти к оплате
            <ArrowRight size={16} />
          </button>
        </div>
      </div>
    </div>
  );
}
