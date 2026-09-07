"use client";

import { useEffect, useState } from "react";
import { Building2 } from "lucide-react";

import { getComplexes } from "@/utils/api";

import MultiSelect from "../MultiSelectFilters/MultiSelectFilter";

import styles from "./ResidentalComplexFilter.module.css";

export default function ResidentialComplexFilter({ value = [], setValue }) {
  const [complexes, setComplexes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    let mounted = true;

    async function fetchComplexes() {
      try {
        setLoading(true);
        setError(false);

        const res = await getComplexes();

        if (!mounted) {
          return;
        }

        const data = Array.isArray(res?.data)
          ? res.data
          : Array.isArray(res)
            ? res
            : [];

        const options = [
          ...new Set(
            data
              .map(
                (complex) =>
                  complex?.name ||
                  complex?.title ||
                  complex?.complex_name ||
                  complex?.name_ru ||
                  "",
              )
              .filter(Boolean),
          ),
        ];

        setComplexes(options);
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
    }

    fetchComplexes();

    return () => {
      mounted = false;
    };
  }, []);

  if (error) {
    return (
      <div className={styles.error}>
        <Building2 size={18} />

        <span>Не удалось загрузить список ЖК</span>
      </div>
    );
  }

  return (
    <div className={styles.wrapper}>
      <MultiSelect
        icon={Building2}
        title="Жилой комплекс"
        options={loading ? [] : complexes}
        value={Array.isArray(value) ? value : []}
        setValue={setValue}
      />

      {loading && <span className={styles.loading}>Загрузка списка ЖК...</span>}
    </div>
  );
}
