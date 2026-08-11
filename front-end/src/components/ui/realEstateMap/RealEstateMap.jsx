"use client";

import dynamic from "next/dynamic";

const RealEstateMapClient = dynamic(() => import("./RealEstateMapClient"), {
  ssr: false,
  loading: () => (
    <div
      style={{
        width: "100%",
        height: "420px",
        borderRadius: "18px",
        background: "#f7f7f7",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        color: "#999",
      }}
    >
      Загрузка карты...
    </div>
  ),
});

export default function RealEstateMap(props) {
  return <RealEstateMapClient {...props} />;
}
