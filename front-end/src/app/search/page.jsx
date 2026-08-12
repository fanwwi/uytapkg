"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";

import { getListings } from "@/utils/api";

export default function SearchPage() {
  const [listings, setListings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function loadListings() {
      try {
        setLoading(true);
        const params = new URLSearchParams(window.location.search);
        const data = await getListings(Object.fromEntries(params.entries()));
        setListings(data?.data || []);
      } catch (err) {
        setError(err.message || "Не удалось загрузить объявления");
      } finally {
        setLoading(false);
      }
    }

    loadListings();
  }, []);

  const hasListings = listings.length > 0;

  return (
    <main style={{ padding: 24, maxWidth: 1100, margin: "0 auto" }}>
      <h1 style={{ fontSize: 28, marginBottom: 16 }}>Результаты поиска</h1>

      {loading && <p>Загружаем объявления...</p>}
      {error && <p style={{ color: "#c0392b" }}>{error}</p>}

      {!loading && !hasListings && <p>По вашему запросу ничего не найдено.</p>}

      <div style={{ display: "grid", gap: 16 }}>
        {listings.map((item) => (
          <div key={item.id} style={{ border: "1px solid #e5e7eb", padding: 16, borderRadius: 12 }}>
            <h3>{item.title || "Объявление"}</h3>
            <p>{item.description || "Описание отсутствует"}</p>
            <p><strong>Цена:</strong> {item.price || "—"}</p>
            <Link href={`/listing/${item.id}`} style={{ color: "#2563eb" }}>
              Открыть
            </Link>
          </div>
        ))}
      </div>
    </main>
  );
}
