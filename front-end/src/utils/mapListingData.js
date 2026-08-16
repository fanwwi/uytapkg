export function mapListingData(item) {
  const propertyTypeMapping = {
    apartment: "Квартира",
    house: "Дом",
    land: "Участок",
    commercial: "Коммерция",
    room: "Комнаты",
    garage: "Паркинг/гараж",
  };

  const mainPhoto = item.listing_photos?.find((p) => p.is_main)?.url 
    || item.listing_photos?.[0]?.url 
    || "https://images.unsplash.com/photo-1564013799919-ab600027ffc6?q=80&w=400";

  return {
    id: item.id,
    title: item.title || "Без названия",
    type: propertyTypeMapping[item.property_type] || "Другое",
    dealType: item.deal_type === "sale" ? "Продажа" : "Сниму в аренду",
    status: item.is_urgent ? "urgent" : (item.promotion_status === "vip" ? "vip" : null),
    location: item.city || item.region || "Кыргызстан",
    region: item.region,
    price: `${item.price?.toLocaleString() || 0} ${item.currency === "USD" ? "$" : "сом"}`,
    image: mainPhoto,
    likes: 0,
    rooms: item.rooms,
    area: item.area ? `${item.area} м²` : "",
  };
}

export function mapListingDetail(item) {
  const propertyTypeMapping = {
    apartment: "Квартира",
    house: "Дом",
    land: "Участок",
    commercial: "Коммерция",
    room: "Комната",
    garage: "Паркинг/гараж",
  };

  const dealTypeMapping = {
    sale: "Продажа",
    rent: "Аренда",
  };

  let images = ["https://images.unsplash.com/photo-1564013799919-ab600027ffc6?q=80&w=800"];
  if (item.listing_photos && item.listing_photos.length > 0) {
    const sorted = [...item.listing_photos].sort((a, b) => (a.display_order || 0) - (b.display_order || 0));
    images = sorted.map((p) => p.url);
  }

  const dbUser = item.users || {};
  const dbProfile = dbUser.user_profiles || {};

  const owner = {
    id: dbUser.id || "",
    name: (dbProfile.first_name || dbProfile.last_name)
      ? `${dbProfile.first_name || ""} ${dbProfile.last_name || ""}`.trim()
      : dbUser.email || "Пользователь",
    role: dbUser.account_type === "agency" ? "Агентство" : (dbUser.account_type === "realtor" ? "Риелтор" : "Владелец"),
    avatar: dbProfile.avatar_url || "https://i.pravatar.cc/150?img=12",
    phone: dbProfile.phone_number || "",
  };

  const features = item.features || {};

  const dateOptions = { day: "numeric", month: "long", year: "numeric" };
  const createdAtFormatted = item.created_at
    ? new Date(item.created_at).toLocaleDateString("ru-RU", dateOptions)
    : "Не указана";

  return {
    id: item.id,
    title: item.title || "Без названия",
    price: `${item.price?.toLocaleString() || 0} ${item.currency === "USD" ? "$" : "сом"}`,
    type: propertyTypeMapping[item.property_type] || "Другое",
    dealType: dealTypeMapping[item.deal_type] || "Другое",
    location: item.city || item.region || "Кыргызстан",
    address: item.address || "",
    area: item.area ? `${item.area} м²` : "",
    rooms: item.rooms || 0,
    floors: item.total_floors || item.floor || 0,
    year: features.year || null,
    status: item.is_urgent ? "urgent" : (item.promotion_status === "vip" ? "vip" : null),
    description: item.description || "Описание отсутствует.",
    images,
    owner,
    createdAt: createdAtFormatted,
    rawFeatures: features,
  };
}
