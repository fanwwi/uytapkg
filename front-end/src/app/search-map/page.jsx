"use client";

import dynamic from "next/dynamic";

const SearchMapClient = dynamic(() => import("./SearchMapClient"), {
  ssr: false,
  loading: () => (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        height: "80vh",
        fontSize: "16px",
        color: "#64748b",
        fontWeight: 500,
      }}
    >
      Загрузка интерактивной карты...
    </div>
  ),
});

export default function SearchMapPage() {
  return <SearchMapClient />;
}
