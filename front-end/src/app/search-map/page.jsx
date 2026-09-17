"use client";

import dynamic from "next/dynamic";
import { useLanguage } from "@/context/LanguageContext";

function MapLoading() {
  const { t } = useLanguage();

  return (
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
      {t("searchMap.loading.objects")}
    </div>
  );
}

const SearchMapClient = dynamic(() => import("./searchMapClient/SearchMapClient"), {
  ssr: false,
  loading: () => <MapLoading />,
});

export default function SearchMapPage() {
  return <SearchMapClient />;
}
