"use client";

import { useEffect, useState } from "react";
import {
  X,
  Save,
  CreditCard,
  Crown,
  Zap,
  Rocket,
  Building2,
  Sparkles,
  AlertCircle,
  Camera,
} from "lucide-react";

import styles from "./PricingModal.module.css";

const DEFAULT_VALUES = {
  tariffs: {
    start: 390,
    optimal: 790,
    business: 1890,
    developer: {
      mode: "individual",
      value: "",
    },
  },

  services: {
    vip: 290,
    urgent: 70,
    top: 190,
    instagram: 390,
  },
};

const tariffConfig = [
  {
    id: "start",
    title: "СТАРТ",
    description: "Для начинающих риелторов и частных специалистов",
    icon: Rocket,
    suffix: "сом / месяц",
  },
  {
    id: "optimal",
    title: "ОПТИМАЛЬНЫЙ",
    description: "Для активных специалистов",
    icon: Crown,
    suffix: "сом / месяц",
  },
  {
    id: "business",
    title: "БИЗНЕС",
    description: "Для агентств недвижимости и команд",
    icon: Building2,
    suffix: "сом / месяц",
  },
  {
    id: "developer",
    title: "ЗАСТРОЙЩИК",
    description: "Для строительных компаний и жилых комплексов",
    icon: Sparkles,
  },
];

const serviceConfig = [
  {
    id: "vip",
    title: "VIP",
    description: "Закрепление в самом верху каталога + золотая рамка",
    icon: Crown,
    suffix: "сом / день",
  },
  {
    id: "urgent",
    title: "Срочно",
    description: "Красный бейдж + попадание в фильтр «Срочные продажи»",
    icon: Zap,
    suffix: "сом / день",
  },
  {
    id: "top",
    title: "ТОП",
    description: "Подъем и закрепление объявления выше стандартных карточек",
    icon: Rocket,
    suffix: "сом / день",
  },
  {
    id: "instagram",
    title: "Instagram",
    description: "Пост + Stories + дублирование в Telegram",
    icon: Camera,
    suffix: "сом",
  },
];

export default function PricingEditModal({ isOpen, onClose, values, onSave }) {
  const [form, setForm] = useState(DEFAULT_VALUES);

  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (!isOpen) return;

    setForm({
      tariffs: {
        start: values?.tariffs?.start ?? 390,
        optimal: values?.tariffs?.optimal ?? 790,
        business: values?.tariffs?.business ?? 1890,
        developer: {
          mode: values?.tariffs?.developer?.mode ?? "individual",

          value: values?.tariffs?.developer?.value ?? "",
        },
      },

      services: {
        vip: values?.services?.vip ?? 290,
        urgent: values?.services?.urgent ?? 70,
        top: values?.services?.top ?? 190,
        instagram: values?.services?.instagram ?? 390,
      },
    });

    setErrors({});
  }, [isOpen, values]);

  useEffect(() => {
    if (!isOpen) return;

    const handleEscape = (event) => {
      if (event.key === "Escape") {
        onClose();
      }
    };

    document.addEventListener("keydown", handleEscape);

    return () => {
      document.removeEventListener("keydown", handleEscape);
    };
  }, [isOpen, onClose]);

  if (!isOpen) {
    return null;
  }

  const updateTariff = (id, value) => {
    setForm((prev) => ({
      ...prev,

      tariffs: {
        ...prev.tariffs,
        [id]: value,
      },
    }));

    setErrors((prev) => ({
      ...prev,
      [id]: "",
    }));
  };

  const updateService = (id, value) => {
    setForm((prev) => ({
      ...prev,

      services: {
        ...prev.services,
        [id]: value,
      },
    }));

    setErrors((prev) => ({
      ...prev,
      [id]: "",
    }));
  };

  const updateDeveloperMode = (mode) => {
    setForm((prev) => ({
      ...prev,

      tariffs: {
        ...prev.tariffs,

        developer: {
          ...prev.tariffs.developer,
          mode,
          value: mode === "individual" ? "" : prev.tariffs.developer.value,
        },
      },
    }));

    setErrors((prev) => ({
      ...prev,
      developer: "",
    }));
  };

  const updateDeveloperValue = (value) => {
    setForm((prev) => ({
      ...prev,

      tariffs: {
        ...prev.tariffs,

        developer: {
          ...prev.tariffs.developer,
          value,
        },
      },
    }));

    setErrors((prev) => ({
      ...prev,
      developer: "",
    }));
  };

  const validate = () => {
    const nextErrors = {};

    const numericTariffs = ["start", "optimal", "business"];

    numericTariffs.forEach((id) => {
      const value = Number(form.tariffs[id]);

      if (form.tariffs[id] === "" || !Number.isFinite(value) || value < 0) {
        nextErrors[id] = "Введите корректную цену";
      }
    });

    if (form.tariffs.developer.mode === "numeric") {
      const value = Number(form.tariffs.developer.value);

      if (
        form.tariffs.developer.value === "" ||
        !Number.isFinite(value) ||
        value < 0
      ) {
        nextErrors.developer = "Введите корректную цену";
      }
    }

    Object.entries(form.services).forEach(([id, rawValue]) => {
      const value = Number(rawValue);

      if (rawValue === "" || !Number.isFinite(value) || value < 0) {
        nextErrors[id] = "Введите корректную цену";
      }
    });

    setErrors(nextErrors);

    return Object.keys(nextErrors).length === 0;
  };

  const handleSubmit = () => {
    if (!validate()) return;

    const normalized = {
      tariffs: {
        start: Number(form.tariffs.start),

        optimal: Number(form.tariffs.optimal),

        business: Number(form.tariffs.business),

        developer: {
          mode: form.tariffs.developer.mode,

          value:
            form.tariffs.developer.mode === "numeric"
              ? Number(form.tariffs.developer.value)
              : "",
        },
      },

      services: {
        vip: Number(form.services.vip),
        urgent: Number(form.services.urgent),
        top: Number(form.services.top),
        instagram: Number(form.services.instagram),
      },
    };

    onSave(normalized);
    onClose();
  };

  const formatValue = (value) => {
    if (value === undefined || value === null || value === "") {
      return "";
    }

    return String(value);
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
      <div className={styles.modal}>
        {/* =====================================================
            HEADER
        ===================================================== */}

        <div className={styles.modalHeader}>
          <div className={styles.headerTitle}>
            <div className={styles.headerIcon}>
              <CreditCard size={21} />
            </div>

            <div>
              <span>АДМИНИСТРИРОВАНИЕ</span>

              <h2>Цены тарифов и услуг</h2>

              <p>
                Управляйте стоимостью подписок и дополнительных услуг UyTap.
              </p>
            </div>
          </div>

          <button
            type="button"
            className={styles.close}
            onClick={onClose}
            aria-label="Закрыть"
          >
            <X />
          </button>
        </div>

        {/* =====================================================
            BODY
        ===================================================== */}

        <div className={styles.body}>
          {/* ===================================================
              TARIFFS
          =================================================== */}

          <section className={styles.section}>
            <div className={styles.sectionHeading}>
              <div className={styles.sectionNumber}>01</div>

              <div>
                <h3>Тарифы</h3>

                <p>Ежемесячная стоимость подписки.</p>
              </div>
            </div>

            <div className={styles.fields}>
              {tariffConfig.map((item) => {
                const Icon = item.icon;

                if (item.id === "developer") {
                  return (
                    <div
                      key={item.id}
                      className={`${styles.fieldCard} ${styles.developerCard}`}
                    >
                      <div className={styles.fieldTop}>
                        <div className={styles.fieldIcon}>
                          <Icon size={19} />
                        </div>

                        <div className={styles.fieldTitle}>
                          <strong>{item.title}</strong>

                          <span>{item.description}</span>
                        </div>
                      </div>

                      <div className={styles.developerModes}>
                        <button
                          type="button"
                          className={
                            form.tariffs.developer.mode === "individual"
                              ? styles.modeActive
                              : ""
                          }
                          onClick={() => updateDeveloperMode("individual")}
                        >
                          Индивидуально
                        </button>

                        <button
                          type="button"
                          className={
                            form.tariffs.developer.mode === "numeric"
                              ? styles.modeActive
                              : ""
                          }
                          onClick={() => updateDeveloperMode("numeric")}
                        >
                          Указать цену
                        </button>
                      </div>

                      {form.tariffs.developer.mode === "numeric" && (
                        <div className={styles.priceInput}>
                          <input
                            type="number"
                            min="0"
                            value={formatValue(form.tariffs.developer.value)}
                            onChange={(event) =>
                              updateDeveloperValue(event.target.value)
                            }
                            placeholder="Например 9990"
                          />

                          <span>сом / месяц</span>
                        </div>
                      )}

                      {errors.developer && (
                        <div className={styles.fieldError}>
                          <AlertCircle size={14} />

                          {errors.developer}
                        </div>
                      )}
                    </div>
                  );
                }

                return (
                  <div key={item.id} className={styles.fieldCard}>
                    <div className={styles.fieldTop}>
                      <div className={styles.fieldIcon}>
                        <Icon size={19} />
                      </div>

                      <div className={styles.fieldTitle}>
                        <strong>{item.title}</strong>

                        <span>{item.description}</span>
                      </div>
                    </div>

                    <div className={styles.priceInput}>
                      <input
                        type="number"
                        min="0"
                        value={formatValue(form.tariffs[item.id])}
                        onChange={(event) =>
                          updateTariff(item.id, event.target.value)
                        }
                        placeholder="0"
                      />

                      <span>{item.suffix}</span>
                    </div>

                    {errors[item.id] && (
                      <div className={styles.fieldError}>
                        <AlertCircle size={14} />

                        {errors[item.id]}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </section>

          {/* ===================================================
              SERVICES
          =================================================== */}

          <section className={styles.section}>
            <div className={styles.sectionHeading}>
              <div className={styles.sectionNumber}>02</div>

              <div>
                <h3>Дополнительные услуги</h3>

                <p>Цены на продвижение и SMM.</p>
              </div>
            </div>

            <div className={styles.fields}>
              {serviceConfig.map((item) => {
                const Icon = item.icon;

                return (
                  <div key={item.id} className={styles.fieldCard}>
                    <div className={styles.fieldTop}>
                      <div className={styles.fieldIcon}>
                        <Icon size={19} />
                      </div>

                      <div className={styles.fieldTitle}>
                        <strong>{item.title}</strong>

                        <span>{item.description}</span>
                      </div>
                    </div>

                    <div className={styles.priceInput}>
                      <input
                        type="number"
                        min="0"
                        value={formatValue(form.services[item.id])}
                        onChange={(event) =>
                          updateService(item.id, event.target.value)
                        }
                        placeholder="0"
                      />

                      <span>{item.suffix}</span>
                    </div>

                    {errors[item.id] && (
                      <div className={styles.fieldError}>
                        <AlertCircle size={14} />

                        {errors[item.id]}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </section>
        </div>

        {/* =====================================================
            FOOTER
        ===================================================== */}

        <div className={styles.footer}>
          <button type="button" className={styles.cancel} onClick={onClose}>
            Отмена
          </button>

          <button type="button" className={styles.save} onClick={handleSubmit}>
            <Save size={17} />
            Сохранить цены
          </button>
        </div>
      </div>
    </div>
  );
}
