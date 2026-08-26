import { getListings } from "../src/controllers/listingsController.js";

// Тестовый набор объявлений разных типов
const mockListings = [
  { id: 1, title: "Объявление Regular", promotion_status: "regular", is_urgent: false, created_at: "2026-08-25T10:00:00Z" },
  { id: 2, title: "Объявление Top", promotion_status: "top", is_urgent: false, created_at: "2026-08-25T11:00:00Z" },
  { id: 3, title: "Объявление VIP", promotion_status: "vip", is_urgent: false, created_at: "2026-08-25T12:00:00Z" },
  { id: 4, title: "Объявление Urgent (Срочно)", promotion_status: "regular", is_urgent: true, created_at: "2026-08-25T13:00:00Z" },
  { id: 5, title: "Объявление Top + Urgent (Срочно)", promotion_status: "top", is_urgent: true, created_at: "2026-08-25T14:00:00Z" },
];

const getListingPriority = (item) => {
  if (item.promotion_status === "vip") return 0;
  if (item.is_urgent) return 1;
  if (item.promotion_status === "top") return 2;
  return 3;
};

const sorted = [...mockListings].sort((a, b) => {
  const prioA = getListingPriority(a);
  const prioB = getListingPriority(b);
  if (prioA !== prioB) return prioA - prioB;
  return new Date(b.created_at) - new Date(a.created_at);
});

console.log("=== ТЕСТ СОРТИРОВКИ ОБЪЯВЛЕНИЙ ===");
sorted.forEach((item, index) => {
  console.log(`${index + 1}. [Приоритет ${getListingPriority(item)}] ${item.title} (promotion_status: ${item.promotion_status}, is_urgent: ${item.is_urgent})`);
});
