"use client";

import { useEffect, useState } from "react";
import { Building2 } from "lucide-react";

import { getComplexes } from "@/utils/api";
import CustomSelect from "@/components/ui/customSelect/CustomSelect";

import styles from "./ResidentialComplexSelect.module.css";

export default function ResidentialComplexSelect({ value, setValue }) {
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

        const complexOptions = data
          .map((complex) => {
            return (
              complex?.name ||
              complex?.title ||
              complex?.complex_name ||
              complex?.name_ru ||
              ""
            );
          })
          .filter(Boolean);

        // Убираем дубликаты
        const uniqueOptions = [...new Set(complexOptions)];

        setComplexes(uniqueOptions);
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
        <span>Не удалось загрузить список ЖК</span>
      </div>
    );
  }

  return (
    <div className={styles.wrapper}>
      <CustomSelect
        icon={Building2}
        title="Жилой комплекс"
        value={value || ""}
        setValue={setValue}
        options={loading ? [] : complexes}
      />

      {loading && <span className={styles.loading}>Загрузка списка ЖК...</span>}
    </div>
  );
}
