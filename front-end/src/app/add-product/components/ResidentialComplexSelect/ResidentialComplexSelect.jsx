"use client";

import { useEffect, useState } from "react";
import { Building2 } from "lucide-react";

import { useLanguage } from "@/context/LanguageContext";
import { getComplexes } from "@/utils/api";
import CustomSelect from "@/components/ui/customSelect/CustomSelect";

import styles from "./ResidentialComplexSelect.module.css";
import LoadingScreen from "@/components/ui/loadingScreen/LoadingScreen";

// Строит уникальную подпись для ЖК в выпадающем списке.
function buildOptions(complexes) {
  const withLabel = complexes.map((complex) => ({
    ...complex,
    label: complex.city ? `${complex.name} — ${complex.city}` : complex.name,
  }));

  const labelCounts = new Map();

  withLabel.forEach(({ label }) => {
    labelCounts.set(label, (labelCounts.get(label) || 0) + 1);
  });

  const seen = new Set();

  return withLabel.map((complex) => {
    let label = complex.label;

    if (labelCounts.get(label) > 1 && complex.address) {
      label = `${label}, ${complex.address}`;
    }

    while (seen.has(label)) {
      label = `${label} (${complex.id.slice(0, 4)})`;
    }

    seen.add(label);

    return { ...complex, label };
  });
}

export default function ResidentialComplexSelect({ value, onSelect }) {
  const { t } = useLanguage();

  const [complexes, setComplexes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    let mounted = true;

    const fetchComplexes = async () => {
      try {
        setLoading(true);
        setError(false);

        const res = await getComplexes();

        if (!mounted) return;

        const data = Array.isArray(res?.data)
          ? res.data
          : Array.isArray(res)
            ? res
            : [];

        const raw = data
          .map((complex) => ({
            id: complex?.id,
            name:
              complex?.name ||
              complex?.title ||
              complex?.complex_name ||
              complex?.name_ru ||
              "",
            city: complex?.city || null,
            address: complex?.address || null,
          }))
          .filter((complex) => complex.id && complex.name);

        setComplexes(buildOptions(raw));
      } catch (err) {
        console.error("Failed to fetch residential complexes:", err);

        if (mounted) {
          setError(true);
          setComplexes([]);
        }
      } finally {
        if (mounted) {
          setLoading(false);
        }
      }
    };

    fetchComplexes();

    return () => {
      mounted = false;
    };
  }, []);

  if (error) {
    return (
      <div className={styles.error}>
        <Building2 size={18} />
        <span>{t("residentialComplex.error")}</span>
      </div>
    );
  }

  return (
    <div className={styles.wrapper}>
      <CustomSelect
        icon={Building2}
        title={t("residentialComplex.title")}
        value={value || ""}
        setValue={(label) => {
          const found = complexes.find((complex) => complex.label === label);

          onSelect(
            found
              ? {
                  id: found.id,
                  name: found.label,
                }
              : {
                  id: null,
                  name: label,
                },
          );
        }}
        options={loading ? [] : complexes.map((complex) => complex.label)}
      />

      {loading && (
        <span className={styles.loading}>
          <LoadingScreen />
        </span>
      )}
    </div>
  );
}
