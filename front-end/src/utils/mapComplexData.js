export function mapComplexData(item) {
  if (!item) return null;

  const developerName = item.developers?.company_name || "Застройщик не указан";
  const developerLogo =
    item.developers?.logo_url ||
    "https://yt3.googleusercontent.com/dd6jiK-pM4c-OpIys_CbeZAnr1CgKBWOx9cUgHMx5yNTOKcfmnx_Cgmi53ucme32vcNm3MuETA=s900-c-k-c0x00ffffff-no-rj";

  let priceFrom = null;
  let priceTo = null;

  if (item.complex_layouts && item.complex_layouts.length > 0) {
    const prices = item.complex_layouts
      .map((l) => Number(l.price))
      .filter((p) => !isNaN(p) && p > 0);
    if (prices.length > 0) {
      const minP = Math.min(...prices);
      const maxP = Math.max(...prices);
      priceFrom = `${minP.toLocaleString()} $`;
      priceTo = `${maxP.toLocaleString()} $`;
    }
  }

  const addressText =
    item.address ||
    [item.city, item.region].filter(Boolean).join(", ") ||
    "Кыргызстан";

  return {
    id: item.id,
    name: item.name || "Жилой комплекс",
    developer: developerName,
    developerId: item.developers?.user_id || item.developers?.id,
    address: addressText,
    priceFrom: priceFrom || "По запросу",
    priceTo: priceTo ? ` — ${priceTo}` : "",
    description: item.description || "Описание жилого комплекса отсутствует.",
    image:
      item.cover_photo ||
      "https://storage.googleapis.com/bd-kg-02/buildings-v2/800x630/2336.jpg",
    logo: developerLogo,
    completionStatus: item.completion_status === "completed" ? "Сдан" : "Строится",
    completionDate: item.completion_date || "",
    housingClass: item.housing_class || "Премиум-класс",
    layouts: item.complex_layouts || [],
    raw: item,
  };
}
