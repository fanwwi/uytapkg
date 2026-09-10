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
  List,
  ArrowUp,
} from "lucide-react";

import styles from "./PricingModal.module.css";

/* =========================================================
   DEFAULT VALUES
========================================================= */

const DEFAULT_VALUES = {
  tariffs: {
    start: {
      price: 390,
      activeListings: 5,
      topLifts: 1,
      vipLifts: 1,
    },

    optimal: {
      price: 790,
      activeListings: 15,
      topLifts: 3,
      vipLifts: 2,
    },

    business: {
      price: 1890,
      activeListings: 50,
      topLifts: 10,
      vipLifts: 5,
    },

    developer: {
      mode: "individual",
      value: "",

      activeListings: 100,
      topLifts: 20,
      vipLifts: 10,
    },
  },

  services: {
    vip: 290,
    urgent: 70,
    top: 190,
    instagram: 390,
  },
};

/* =========================================================
   TARIFF CONFIG
========================================================= */

const tariffConfig = [
  {
    id: "start",
    title: "СТАРТ",
    description: "Для начинающих риелторов и частных специалистов",
    icon: Rocket,
  },
  {
    id: "optimal",
    title: "ОПТИМАЛЬНЫЙ",
    description: "Для активных специалистов",
    icon: Crown,
  },
  {
    id: "business",
    title: "БИЗНЕС",
    description: "Для агентств недвижимости и команд",
    icon: Building2,
  },
  {
    id: "developer",
    title: "ЗАСТРОЙЩИК",
    description: "Для строительных компаний и жилых комплексов",
    icon: Sparkles,
  },
];

/* =========================================================
   SERVICE CONFIG
========================================================= */

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
    icon: ArrowUp,
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

/* =========================================================
   COMPONENT
========================================================= */

export default function PricingEditModal({
  isOpen,
  onClose,
  values,
  onSave,
}) {
  const [form, setForm] = useState(DEFAULT_VALUES);

  const [errors, setErrors] = useState({});
  const [submitError, setSubmitError] = useState("");
  const [saving, setSaving] = useState(false);

  /* =======================================================
     INIT FORM
  ======================================================= */

  useEffect(() => {
    if (!isOpen) return;

    const source = values || {};

    setForm({
      tariffs: {
        start: {
          price: source?.tariffs?.start?.price ?? 390,
          activeListings:
            source?.tariffs?.start?.activeListings ?? 5,
          topLifts:
            source?.tariffs?.start?.topLifts ?? 1,
          vipLifts:
            source?.tariffs?.start?.vipLifts ?? 1,
        },

        optimal: {
          price: source?.tariffs?.optimal?.price ?? 790,
          activeListings:
            source?.tariffs?.optimal?.activeListings ?? 15,
          topLifts:
            source?.tariffs?.optimal?.topLifts ?? 3,
          vipLifts:
            source?.tariffs?.optimal?.vipLifts ?? 2,
        },

        business: {
          price: source?.tariffs?.business?.price ?? 1890,
          activeListings:
            source?.tariffs?.business?.activeListings ?? 50,
          topLifts:
            source?.tariffs?.business?.topLifts ?? 10,
          vipLifts:
            source?.tariffs?.business?.vipLifts ?? 5,
        },

        developer: {
          mode:
            source?.tariffs?.developer?.mode ??
            "individual",

          value:
            source?.tariffs?.developer?.value ??
            source?.tariffs?.developer?.price ??
            "",

          activeListings:
            source?.tariffs?.developer?.activeListings ?? 100,

          topLifts:
            source?.tariffs?.developer?.topLifts ?? 20,

          vipLifts:
            source?.tariffs?.developer?.vipLifts ?? 10,
        },
      },

      services: {
        vip: source?.services?.vip ?? 290,
        urgent: source?.services?.urgent ?? 70,
        top: source?.services?.top ?? 190,
        instagram: source?.services?.instagram ?? 390,
      },
    });

    setErrors({});
    setSubmitError("");
    setSaving(false);
  }, [isOpen, values]);

  /* =======================================================
     ESCAPE
  ======================================================= */

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

  /* =======================================================
     HELPERS
  ======================================================= */

  const formatValue = (value) => {
    if (value === undefined || value === null || value === "") {
      return "";
    }

    return String(value);
  };

  /* =======================================================
     UPDATE TARIFF PRICE
  ======================================================= */

  const updateTariffPrice = (id, value) => {
    // У тарифа "Застройщик" цена хранится в поле value (mode: "numeric"),
    // у остальных тарифов — в price.
    const field = id === "developer" ? "value" : "price";

    setForm((prev) => ({
      ...prev,

      tariffs: {
        ...prev.tariffs,

        [id]: {
          ...prev.tariffs[id],
          [field]: value,
        },
      },
    }));

    setErrors((prev) => ({
      ...prev,
      [`${id}.price`]: "",
    }));
  };

  /* =======================================================
     UPDATE TARIFF LIMIT
  ======================================================= */

  const updateTariffLimit = (tariffId, field, value) => {
    setForm((prev) => ({
      ...prev,

      tariffs: {
        ...prev.tariffs,

        [tariffId]: {
          ...prev.tariffs[tariffId],
          [field]: value,
        },
      },
    }));

    setErrors((prev) => ({
      ...prev,
      [`${tariffId}.${field}`]: "",
    }));
  };

  /* =======================================================
     UPDATE SERVICE
  ======================================================= */

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

  /* =======================================================
     DEVELOPER MODE
  ======================================================= */

  const updateDeveloperMode = (mode) => {
    setForm((prev) => ({
      ...prev,

      tariffs: {
        ...prev.tariffs,

        developer: {
          ...prev.tariffs.developer,

          mode,

          value:
            mode === "individual"
              ? ""
              : prev.tariffs.developer.value,
        },
      },
    }));

    setErrors((prev) => ({
      ...prev,
      "developer.price": "",
    }));
  };

  /* =======================================================
     VALIDATION
  ======================================================= */

  const validate = () => {
    const nextErrors = {};

    tariffConfig.forEach((item) => {
      const tariff = form.tariffs[item.id];

      /* ---------------------------------------------------
         PRICE
      --------------------------------------------------- */

      if (item.id === "developer") {
        if (tariff.mode === "numeric") {
          const price = Number(tariff.value);

          if (
            tariff.value === "" ||
            !Number.isFinite(price) ||
            price < 0
          ) {
            nextErrors["developer.price"] =
              "Введите корректную цену";
          }
        }
      } else {
        const price = Number(tariff.price);

        if (
          tariff.price === "" ||
          !Number.isFinite(price) ||
          price < 0
        ) {
          nextErrors[`${item.id}.price`] =
            "Введите корректную цену";
        }
      }

      /* ---------------------------------------------------
         ACTIVE LISTINGS
      --------------------------------------------------- */

      const activeListings = Number(
        tariff.activeListings
      );

      if (
        tariff.activeListings === "" ||
        !Number.isInteger(activeListings) ||
        activeListings < 0
      ) {
        nextErrors[`${item.id}.activeListings`] =
          "Введите корректное количество";
      }

      /* ---------------------------------------------------
         TOP RAISES
      --------------------------------------------------- */

      const topLifts = Number(tariff.topLifts);

      if (
        tariff.topLifts === "" ||
        !Number.isInteger(topLifts) ||
        topLifts < 0
      ) {
        nextErrors[`${item.id}.topLifts`] =
          "Введите корректное количество";
      }

      /* ---------------------------------------------------
         VIP LISTINGS
      --------------------------------------------------- */

      const vipLifts = Number(
        tariff.vipLifts
      );

      if (
        tariff.vipLifts === "" ||
        !Number.isInteger(vipLifts) ||
        vipLifts < 0
      ) {
        nextErrors[`${item.id}.vipLifts`] =
          "Введите корректное количество";
      }
    });

    /* -----------------------------------------------------
       SERVICES
    ----------------------------------------------------- */

    Object.entries(form.services).forEach(
      ([id, rawValue]) => {
        const value = Number(rawValue);

        if (
          rawValue === "" ||
          !Number.isFinite(value) ||
          value < 0
        ) {
          nextErrors[id] =
            "Введите корректную цену";
        }
      }
    );

    setErrors(nextErrors);

    return Object.keys(nextErrors).length === 0;
  };

  /* =======================================================
     SUBMIT
  ======================================================= */

  const handleSubmit = async () => {
    if (!validate()) return;

    const normalized = {
      tariffs: {
        start: {
          price: Number(form.tariffs.start.price),

          activeListings: Number(
            form.tariffs.start.activeListings
          ),

          topLifts: Number(
            form.tariffs.start.topLifts
          ),

          vipLifts: Number(
            form.tariffs.start.vipLifts
          ),
        },

        optimal: {
          price: Number(form.tariffs.optimal.price),

          activeListings: Number(
            form.tariffs.optimal.activeListings
          ),

          topLifts: Number(
            form.tariffs.optimal.topLifts
          ),

          vipLifts: Number(
            form.tariffs.optimal.vipLifts
          ),
        },

        business: {
          price: Number(form.tariffs.business.price),

          activeListings: Number(
            form.tariffs.business.activeListings
          ),

          topLifts: Number(
            form.tariffs.business.topLifts
          ),

          vipLifts: Number(
            form.tariffs.business.vipLifts
          ),
        },

        developer: {
          mode: form.tariffs.developer.mode,

          value:
            form.tariffs.developer.mode === "numeric"
              ? Number(form.tariffs.developer.value)
              : null,

          activeListings: Number(
            form.tariffs.developer.activeListings
          ),

          topLifts: Number(
            form.tariffs.developer.topLifts
          ),

          vipLifts: Number(
            form.tariffs.developer.vipLifts
          ),
        },
      },

      services: {
        vip: Number(form.services.vip),

        urgent: Number(form.services.urgent),

        top: Number(form.services.top),

        instagram: Number(form.services.instagram),
      },
    };

    setSubmitError("");
    setSaving(true);

    try {
      await onSave(normalized);

      onClose();
    } catch (error) {
      setSubmitError(
        error?.message ||
          "Не удалось сохранить настройки тарифов"
      );
    } finally {
      setSaving(false);
    }
  };

  /* =======================================================
     RENDER
  ======================================================= */

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
        {/* =================================================
            HEADER
        ================================================= */}

        <div className={styles.modalHeader}>
          <div className={styles.headerTitle}>
            <div className={styles.headerIcon}>
              <CreditCard size={21} />
            </div>

            <div>
              <span>АДМИНИСТРИРОВАНИЕ</span>

              <h2>Тарифы и услуги</h2>

              <p>
                Управляйте стоимостью тарифов,
                лимитами объявлений и дополнительными
                услугами UyTap.
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

        {/* =================================================
            BODY
        ================================================= */}

        <div className={styles.body}>
          {/* ===============================================
              TARIFFS
          =============================================== */}

          <section className={styles.section}>
            <div className={styles.sectionHeading}>
              <div className={styles.sectionNumber}>
                01
              </div>

              <div>
                <h3>Тарифы</h3>

                <p>
                  Цена и индивидуальные лимиты каждого
                  тарифа.
                </p>
              </div>
            </div>

            <div className={styles.tariffFields}>
              {tariffConfig.map((item) => {
                const Icon = item.icon;

                const tariff = form.tariffs[item.id];

                return (
                  <div
                    key={item.id}
                    className={styles.tariffCard}
                  >
                    {/* ===================================
                        TARIFF HEADER
                    =================================== */}

                    <div className={styles.fieldTop}>
                      <div className={styles.fieldIcon}>
                        <Icon size={19} />
                      </div>

                      <div className={styles.fieldTitle}>
                        <strong>
                          {item.title}
                        </strong>

                        <span>
                          {item.description}
                        </span>
                      </div>
                    </div>

                    {/* ===================================
                        PRICE
                    =================================== */}

                    {item.id === "developer" ? (
                      <>
                        <div
                          className={
                            styles.developerModes
                          }
                        >
                          <button
                            type="button"
                            className={
                              tariff.mode ===
                              "individual"
                                ? styles.modeActive
                                : ""
                            }
                            onClick={() =>
                              updateDeveloperMode(
                                "individual"
                              )
                            }
                          >
                            Индивидуально
                          </button>

                          <button
                            type="button"
                            className={
                              tariff.mode ===
                              "numeric"
                                ? styles.modeActive
                                : ""
                            }
                            onClick={() =>
                              updateDeveloperMode(
                                "numeric"
                              )
                            }
                          >
                            Указать цену
                          </button>
                        </div>

                        {tariff.mode ===
                          "numeric" && (
                          <div
                            className={
                              styles.priceInput
                            }
                          >
                            <input
                              type="number"
                              min="0"
                              value={formatValue(
                                tariff.value
                              )}
                              onChange={(event) =>
                                updateTariffPrice(
                                  item.id,
                                  event.target.value
                                )
                              }
                              placeholder="Например 9990"
                            />

                            <span>
                              сом / месяц
                            </span>
                          </div>
                        )}

                        {tariff.mode ===
                          "individual" && (
                          <div
                            className={
                              styles.individualPrice
                            }
                          >
                            <Sparkles size={15} />

                            <span>
                              Цена устанавливается
                              индивидуально
                            </span>
                          </div>
                        )}
                      </>
                    ) : (
                      <div className={styles.priceInput}>
                        <input
                          type="number"
                          min="0"
                          value={formatValue(
                            tariff.price
                          )}
                          onChange={(event) =>
                            updateTariffPrice(
                              item.id,
                              event.target.value
                            )
                          }
                          placeholder="0"
                        />

                        <span>
                          сом / месяц
                        </span>
                      </div>
                    )}

                    {errors[
                      `${item.id}.price`
                    ] && (
                      <div
                        className={
                          styles.fieldError
                        }
                      >
                        <AlertCircle size={14} />

                        {
                          errors[
                            `${item.id}.price`
                          ]
                        }
                      </div>
                    )}

                    {/* ===================================
                        LIMITS
                    =================================== */}

                    <div className={styles.limits}>
                      <div className={styles.limitsTitle}>
                        <span>ЛИМИТЫ ТАРИФА</span>
                      </div>

                      <div className={styles.limitsGrid}>
                        {/* ACTIVE LISTINGS */}

                        <div
                          className={
                            styles.limitField
                          }
                        >
                          <div
                            className={
                              styles.limitLabel
                            }
                          >
                            <List size={14} />

                            <span>
                              Активные объявления
                            </span>
                          </div>

                          <div
                            className={
                              styles.limitInput
                            }
                          >
                            <input
                              type="number"
                              min="0"
                              step="1"
                              value={formatValue(
                                tariff.activeListings
                              )}
                              onChange={(event) =>
                                updateTariffLimit(
                                  item.id,
                                  "activeListings",
                                  event.target.value
                                )
                              }
                              placeholder="0"
                            />

                            <span>шт.</span>
                          </div>

                          {errors[
                            `${item.id}.activeListings`
                          ] && (
                            <small
                              className={
                                styles.limitError
                              }
                            >
                              {
                                errors[
                                  `${item.id}.activeListings`
                                ]
                              }
                            </small>
                          )}
                        </div>

                        {/* TOP */}

                        <div
                          className={
                            styles.limitField
                          }
                        >
                          <div
                            className={
                              styles.limitLabel
                            }
                          >
                            <ArrowUp size={14} />

                            <span>
                              Поднятия в ТОП
                            </span>
                          </div>

                          <div
                            className={
                              styles.limitInput
                            }
                          >
                            <input
                              type="number"
                              min="0"
                              step="1"
                              value={formatValue(
                                tariff.topLifts
                              )}
                              onChange={(event) =>
                                updateTariffLimit(
                                  item.id,
                                  "topLifts",
                                  event.target.value
                                )
                              }
                              placeholder="0"
                            />

                            <span>
                              раз
                            </span>
                          </div>

                          {errors[
                            `${item.id}.topLifts`
                          ] && (
                            <small
                              className={
                                styles.limitError
                              }
                            >
                              {
                                errors[
                                  `${item.id}.topLifts`
                                ]
                              }
                            </small>
                          )}
                        </div>

                        {/* VIP */}

                        <div
                          className={
                            styles.limitField
                          }
                        >
                          <div
                            className={
                              styles.limitLabel
                            }
                          >
                            <Crown size={14} />

                            <span>
                              VIP-размещения
                            </span>
                          </div>

                          <div
                            className={
                              styles.limitInput
                            }
                          >
                            <input
                              type="number"
                              min="0"
                              step="1"
                              value={formatValue(
                                tariff.vipLifts
                              )}
                              onChange={(event) =>
                                updateTariffLimit(
                                  item.id,
                                  "vipLifts",
                                  event.target.value
                                )
                              }
                              placeholder="0"
                            />

                            <span>
                              раз
                            </span>
                          </div>

                          {errors[
                            `${item.id}.vipLifts`
                          ] && (
                            <small
                              className={
                                styles.limitError
                              }
                            >
                              {
                                errors[
                                  `${item.id}.vipLifts`
                                ]
                              }
                            </small>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </section>

          {/* ===============================================
              SERVICES
          =============================================== */}

          <section className={styles.section}>
            <div className={styles.sectionHeading}>
              <div className={styles.sectionNumber}>
                02
              </div>

              <div>
                <h3>
                  Дополнительные услуги
                </h3>

                <p>
                  Цены на продвижение и SMM.
                </p>
              </div>
            </div>

            <div className={styles.fields}>
              {serviceConfig.map((item) => {
                const Icon = item.icon;

                return (
                  <div
                    key={item.id}
                    className={styles.fieldCard}
                  >
                    <div className={styles.fieldTop}>
                      <div className={styles.fieldIcon}>
                        <Icon size={19} />
                      </div>

                      <div className={styles.fieldTitle}>
                        <strong>
                          {item.title}
                        </strong>

                        <span>
                          {item.description}
                        </span>
                      </div>
                    </div>

                    <div className={styles.priceInput}>
                      <input
                        type="number"
                        min="0"
                        value={formatValue(
                          form.services[item.id]
                        )}
                        onChange={(event) =>
                          updateService(
                            item.id,
                            event.target.value
                          )
                        }
                        placeholder="0"
                      />

                      <span>
                        {item.suffix}
                      </span>
                    </div>

                    {errors[item.id] && (
                      <div
                        className={
                          styles.fieldError
                        }
                      >
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

        {/* =================================================
            FOOTER
        ================================================= */}

        <div className={styles.footer}>
          {submitError && (
            <div
              className={styles.fieldError}
              style={{ marginRight: "auto" }}
            >
              <AlertCircle size={14} />

              {submitError}
            </div>
          )}

          <button
            type="button"
            className={styles.cancel}
            onClick={onClose}
            disabled={saving}
          >
            Отмена
          </button>

          <button
            type="button"
            className={styles.save}
            onClick={handleSubmit}
            disabled={saving}
          >
            <Save size={17} />

            {saving
              ? "Сохраняем..."
              : "Сохранить изменения"}
          </button>
        </div>
      </div>
    </div>
  );
}
