"use client";

import { Home, Search, X } from "lucide-react";

import { useEffect, useMemo, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";

import {
  getListings,
  getFavorites,
  addFavorite,
  removeFavorite,
} from "@/utils/api";

import { mapListingData } from "@/utils/mapListingData";

import ListingCardBlack from "@/components/ui/ListingCardBlack/ListingCardBlack";

import CommonFilters from "./components/CommonFilters/CommonFilters";

import ApartmentFilters from "./components/ApartmentFilters/ApartmentFilters";
import HouseFilters from "./components/HouseFilters/HouseFilters";
import CottageFilters from "./components/CottageFilters/CottageFilters";
import LandFilters from "./components/LandFilters/LandFilters";
import RoomFilters from "./components/RoomFilters/RoomFilters";
import CommercialFilters from "./components/CommercialFilters/CommercialFilters";
import ParkingFilters from "./components/ParkingFilters/ParkingFilters";

import SearchModeSlider from "./components/SearchModeSlider/SearchModeSlider";
import SmartSearch from "./components/SmartSearch/SmartSearch";

import styles from "./AllProducts.module.css";

/* =========================================================
   CATEGORIES
========================================================= */

const categories = [
  {
    value: "apartment",
    label: "Квартиры",
  },
  {
    value: "house",
    label: "Дома",
  },
  {
    value: "cottage",
    label: "Коттеджи",
  },
  {
    value: "land",
    label: "Участки",
  },
  {
    value: "room",
    label: "Комнаты",
  },
  {
    value: "commercial",
    label: "Коммерция",
  },
  {
    value: "parking",
    label: "Паркинг / гараж",
  },
];

const deals = [
  {
    value: "sale",
    label: "Продажа",
  },
  {
    value: "rent",
    label: "Аренда",
  },
];

/* =========================================================
   CATEGORY COMPONENTS
========================================================= */

const categoryComponents = {
  apartment: ApartmentFilters,
  house: HouseFilters,
  cottage: CottageFilters,
  land: LandFilters,
  room: RoomFilters,
  commercial: CommercialFilters,
  parking: ParkingFilters,
};

const categoryLabels = {
  apartment: "Квартиры",
  house: "Дома",
  cottage: "Коттеджи",
  land: "Участки",
  room: "Комнаты",
  commercial: "Коммерция",
  parking: "Паркинг / гараж",
};

/* =========================================================
   API MAPS
========================================================= */

const categoryApiMap = {
  apartment: "Квартира",
  house: "Дом",
  cottage: "Коттедж",
  land: "Участок",
  room: "Комнаты",
  commercial: "Коммерция",
  parking: "Паркинг/гараж",
};

const dealApiMap = {
  sale: "Продажа",
  rent: "Сниму в аренду",
};

/* =========================================================
   DEFAULT FILTERS
========================================================= */

const DEFAULT_FILTERS = {
  propertyType: "apartment",
  dealType: "sale",

  city: "Все",
  region: "",
  country: "",
  district: "",

  currency: "USD",

  priceFrom: "",
  priceTo: "",

  areaFrom: "",
  areaTo: "",

  rooms: "Все",

  beachDistanceFrom: "",
  beachDistanceTo: "",

  amenities: [],
  communications: [],
  technicalParameters: [],
};

/* =========================================================
   HELPERS
========================================================= */

const featureKeys = [
  "series",
  "floor",
  "condition",
  "walls",
  "heating",
  "documents",
  "furniture",
  "offerType",

  "houseType",
  "floors",
  "sewerage",
  "water",
  "electricity",

  "purpose",
  "fence",
  "location",
  "terrain",

  "roomsInApartment",
  "privateBathroom",

  "premisesType",
  "firstLine",
  "separateEntrance",
  "rentalBusiness",

  "ceilingHeight",
  "parkingType",
  "material",
  "security",
  "gates",
  "inspectionPit",
  "basement",
  "truckAccess",
  "gateType",
];

const arrayFilterKeys = ["amenities", "communications", "technicalParameters"];

const ignoredUrlKeys = [
  "propertyType",
  "category",
  "dealType",
  "city",
  "settlement",
  "region",
  "country",
  "district",
  "currency",
  "priceFrom",
  "priceTo",
  "areaFrom",
  "areaTo",
  "rooms",
  "beachDistanceFrom",
  "beachDistanceTo",
  "amenities",
  "communications",
  "technicalParameters",
];

/* =========================================================
   ISSYK-KUL HELPERS
========================================================= */

/**
 * Все известные населённые пункты Иссык-Кульской области.
 *
 * Проверка нужна для случаев, когда API передаёт город,
 * но region ещё не выбран/не передан в URL.
 */

const ISSYK_KUL_CITIES = [
  "каракол",
  "чолпон-ата",
  "чолпоната",
  "бостери",
  "тамчы",
  "чон-сары-ой",
  "чон сары ой",
  "чоң-сары-ой",
  "сары-ой",
  "сары ой",
  "боконбаево",
  "барскоон",
  "барскоон",
  "тамга",
  "каджи-сай",
  "каджисай",
  "тосор",
  "ананьево",
  "пристань-пржевальск",
  "рыбачье",
  "балыкчы",
  "иссык-куль",
  "иссыккуль",
  "семеновка",
  "семеновское",
  "григорьевка",
  "курменты",
  "каракуль",
  "дархан",
  "тюп",
  "кызыл-суу",
  "покровка",
];

/**
 * Нормализация строки для географии.
 */
function normalizeLocationValue(value) {
  return String(value || "")
    .trim()
    .toLowerCase()
    .replace(/ё/g, "е")
    .replace(/[_-]+/g, " ")
    .replace(/\s+/g, " ");
}

/**
 * Проверяет, является ли значение Иссык-Кулем.
 *
 * Поддерживаются:
 * - ISSYK_KUL
 * - ISSYK-KUL
 * - ISSYK KUL
 * - Иссык-Куль
 * - Иссык-Кульская область
 * - Иссыккуль
 * и т.д.
 */
function isIssykKulValue(value) {
  const normalized = normalizeLocationValue(value);

  if (!normalized) {
    return false;
  }

  /* API CODE */

  if (
    normalized === "issyk kul" ||
    normalized === "issyk kul oblast" ||
    normalized === "issyk kul region" ||
    normalized.includes("issyk kul")
  ) {
    return true;
  }

  /* RUSSIAN */

  if (normalized.includes("иссык куль") || normalized.includes("иссыккуль")) {
    return true;
  }

  return false;
}

/**
 * Главная проверка выбранной локации.
 *
 * ВАЖНО:
 * Не зависит от propertyType.
 *
 * Поэтому:
 * apartment + Каракол -> true
 * house + Каракол -> true
 * cottage + Бостери -> true
 * land + Чолпон-Ата -> true
 * commercial + Тамчы -> true
 * parking + Балыкчы -> true
 */
function isIssykKulLocation(filters) {
  const city = normalizeLocationValue(filters?.city);
  const region = normalizeLocationValue(filters?.region);
  const country = normalizeLocationValue(filters?.country);
  const district = normalizeLocationValue(filters?.district);

  /* REGION */

  if (isIssykKulValue(region)) {
    return true;
  }

  /* CITY / SETTLEMENT */

  if (isIssykKulValue(city)) {
    return true;
  }

  /* KNOWN ISSYK-KUL CITIES */

  if (
    city &&
    ISSYK_KUL_CITIES.some((name) => {
      const normalizedName = normalizeLocationValue(name);

      return (
        city === normalizedName ||
        city.includes(normalizedName) ||
        normalizedName.includes(city)
      );
    })
  ) {
    return true;
  }

  /* DISTRICT */

  if (isIssykKulValue(district)) {
    return true;
  }

  /* COUNTRY */

  if (isIssykKulValue(country)) {
    return true;
  }

  return false;
}

/**
 * Проверка самого объявления.
 *
 * Используется дополнительно для фильтра расстояния,
 * чтобы любой объект Иссык-Куля мог иметь beachDistance.
 */
function isIssykKulListing(item) {
  const values = [
    item?.city,
    item?.region,
    item?.district,
    item?.location,
    item?.address,
    item?.country,

    item?.rawCity,
    item?.rawRegion,
    item?.rawDistrict,

    item?.location?.city,
    item?.location?.region,
  ]
    .filter(Boolean)
    .map(normalizeLocationValue);

  return values.some((value) => {
    if (isIssykKulValue(value)) {
      return true;
    }

    return ISSYK_KUL_CITIES.some((city) => {
      const normalizedCity = normalizeLocationValue(city);

      return value === normalizedCity || value.includes(normalizedCity);
    });
  });
}

/* =========================================================
   CATEGORY NORMALIZER
========================================================= */

function normalizePropertyType(value) {
  if (!value) {
    return "apartment";
  }

  if (categoryComponents[value]) {
    return value;
  }

  const found = Object.keys(categoryApiMap).find(
    (key) =>
      String(categoryApiMap[key]).toLowerCase() === String(value).toLowerCase(),
  );

  return found || "apartment";
}

/* =========================================================
   DEAL NORMALIZER
========================================================= */

function normalizeDealType(value) {
  if (!value) {
    return "sale";
  }

  if (value === "Продажа") {
    return "sale";
  }

  if (value === "Сниму в аренду") {
    return "rent";
  }

  return value === "rent" ? "rent" : "sale";
}

/* =========================================================
   COMPONENT
========================================================= */

export default function AllProducts() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [searchMode, setSearchMode] = useState("filters");

  const [filters, setFilters] = useState(DEFAULT_FILTERS);

  const [listingsList, setListingsList] = useState([]);

  const [favIds, setFavIds] = useState(new Set());

  const [loading, setLoading] = useState(true);

  const [error, setError] = useState("");

  /* =======================================================
     URL → FILTERS
  ======================================================= */

  useEffect(() => {
    const propertyType = normalizePropertyType(
      searchParams.get("propertyType") || searchParams.get("category"),
    );

    const dealType = normalizeDealType(searchParams.get("dealType"));

    const nextFilters = {
      ...DEFAULT_FILTERS,

      propertyType,

      dealType,

      city: searchParams.get("city") || searchParams.get("settlement") || "Все",

      region: searchParams.get("region") || "",

      country: searchParams.get("country") || "",

      district: searchParams.get("district") || "",

      currency: searchParams.get("currency") || "USD",

      priceFrom: searchParams.get("priceFrom") || "",

      priceTo: searchParams.get("priceTo") || "",

      areaFrom: searchParams.get("areaFrom") || "",

      areaTo: searchParams.get("areaTo") || "",

      rooms: searchParams.get("rooms") || "Все",

      beachDistanceFrom: searchParams.get("beachDistanceFrom") || "",

      beachDistanceTo: searchParams.get("beachDistanceTo") || "",

      amenities:
        searchParams.get("amenities")?.split(",").filter(Boolean) || [],

      communications:
        searchParams.get("communications")?.split(",").filter(Boolean) || [],

      technicalParameters:
        searchParams.get("technicalParameters")?.split(",").filter(Boolean) ||
        [],
    };

    for (const [key, value] of searchParams.entries()) {
      if (ignoredUrlKeys.includes(key)) {
        continue;
      }

      if (!value) {
        continue;
      }

      nextFilters[key] = value;
    }

    setFilters(nextFilters);
  }, [searchParams]);

  /* =======================================================
     UPDATE FILTER
  ======================================================= */

  function updateFilter(key, value) {
    setFilters((prev) => ({
      ...prev,
      [key]: value,
    }));
  }

  /* =======================================================
     UPDATE URL
  ======================================================= */

  function updateUrl(nextFilters) {
    const params = new URLSearchParams();

    if (nextFilters.propertyType) {
      params.set("propertyType", nextFilters.propertyType);
    }

    if (nextFilters.dealType) {
      params.set("dealType", nextFilters.dealType);
    }

    if (nextFilters.city && nextFilters.city !== "Все") {
      params.set("city", nextFilters.city);
    }

    if (nextFilters.region) {
      params.set("region", nextFilters.region);
    }

    if (nextFilters.country) {
      params.set("country", nextFilters.country);
    }

    if (nextFilters.district) {
      params.set("district", nextFilters.district);
    }

    if (nextFilters.currency) {
      params.set("currency", nextFilters.currency);
    }

    const simpleKeys = [
      "priceFrom",
      "priceTo",
      "areaFrom",
      "areaTo",
      "rooms",

      "beachDistanceFrom",
      "beachDistanceTo",

      ...featureKeys,
    ];

    for (const key of simpleKeys) {
      const value = nextFilters[key];

      if (
        value &&
        value !== "Все" &&
        value !== "Любой" &&
        value !== "Любая" &&
        value !== "Любые" &&
        value !== "Любое"
      ) {
        params.set(key, String(value));
      }
    }

    for (const key of arrayFilterKeys) {
      const value = nextFilters[key];

      if (Array.isArray(value) && value.length > 0) {
        params.set(key, value.join(","));
      }
    }

    const query = params.toString();

    router.replace(query ? `/all-products?${query}` : "/all-products", {
      scroll: false,
    });
  }

  /* =======================================================
     SMART SEARCH
  ======================================================= */

  async function handleSmartSearch(data) {
    if (!data) {
      return;
    }

    const parsed = data.filters || data;

    const next = {
      ...filters,
    };

    /* =======================================================
     PROPERTY TYPE
  ======================================================= */

    if (parsed.propertyType) {
      next.propertyType = normalizePropertyType(parsed.propertyType);
    }

    /* =======================================================
     DEAL
  ======================================================= */

    if (parsed.dealType) {
      next.dealType = normalizeDealType(parsed.dealType);
    }

    /* =======================================================
     LOCATION
  ======================================================= */

    if (parsed.region) {
      next.region = parsed.region;
    }

    if (parsed.city) {
      next.city = parsed.city;
    }

    if (parsed.country) {
      next.country = parsed.country;
    }

    if (parsed.district) {
      next.district = parsed.district;
    }

    /*
     * Иссык-Куль всегда приводим
     * к единому состоянию.
     */

    const cityText = String(next.city || "").toLowerCase();
    const regionText = String(next.region || "").toLowerCase();

    const isIssykKul =
      regionText === "issyk_kul" ||
      (cityText.includes("иссык") && cityText.includes("куль"));

    if (isIssykKul) {
      next.region = "ISSYK_KUL";
      next.city = "Иссык-Куль";
    }

    /* =======================================================
     PRICE
  ======================================================= */

    if (parsed.priceFrom !== undefined && parsed.priceFrom !== null) {
      next.priceFrom = String(parsed.priceFrom);
    }

    if (parsed.priceTo !== undefined && parsed.priceTo !== null) {
      next.priceTo = String(parsed.priceTo);
    }

    /*
     * На случай если API вернул minPrice/maxPrice.
     */

    if (parsed.minPrice !== undefined && parsed.minPrice !== null) {
      next.priceFrom = String(parsed.minPrice);
    }

    if (parsed.maxPrice !== undefined && parsed.maxPrice !== null) {
      next.priceTo = String(parsed.maxPrice);
    }

    /* =======================================================
     AREA
  ======================================================= */

    if (parsed.areaFrom !== undefined && parsed.areaFrom !== null) {
      next.areaFrom = String(parsed.areaFrom);
    }

    if (parsed.areaTo !== undefined && parsed.areaTo !== null) {
      next.areaTo = String(parsed.areaTo);
    }

    if (parsed.minArea !== undefined && parsed.minArea !== null) {
      next.areaFrom = String(parsed.minArea);
    }

    if (parsed.maxArea !== undefined && parsed.maxArea !== null) {
      next.areaTo = String(parsed.maxArea);
    }

    /* =======================================================
     ROOMS
  ======================================================= */

    if (parsed.rooms !== undefined && parsed.rooms !== null) {
      const rooms = Number(parsed.rooms);

      if (!Number.isNaN(rooms)) {
        next.rooms = rooms >= 4 ? "4+" : String(rooms);
      } else {
        next.rooms = String(parsed.rooms);
      }
    }

    /* =======================================================
     BEACH
  ======================================================= */

    if (
      parsed.beachDistanceFrom !== undefined &&
      parsed.beachDistanceFrom !== null
    ) {
      next.beachDistanceFrom = String(parsed.beachDistanceFrom);
    }

    if (
      parsed.beachDistanceTo !== undefined &&
      parsed.beachDistanceTo !== null
    ) {
      next.beachDistanceTo = String(parsed.beachDistanceTo);
    }

    /* =======================================================
     FEATURES
  ======================================================= */

    for (const key of featureKeys) {
      if (
        parsed[key] !== undefined &&
        parsed[key] !== null &&
        parsed[key] !== ""
      ) {
        next[key] = parsed[key];
      }
    }

    /* =======================================================
     ARRAYS
  ======================================================= */

    for (const key of arrayFilterKeys) {
      if (parsed[key] !== undefined && parsed[key] !== null) {
        next[key] = Array.isArray(parsed[key]) ? parsed[key] : [parsed[key]];
      }
    }

    console.log("SMART SEARCH RESULT:", next);

    setFilters(next);

    updateUrl(next);
  }

  /* =======================================================
     LOAD LISTINGS
  ======================================================= */

  useEffect(() => {
    let cancelled = false;

    async function loadData() {
      try {
        setLoading(true);
        setError("");

        const token =
          typeof window !== "undefined"
            ? localStorage.getItem("uytap_token")
            : null;

        const [listingsResponse, favoritesResponse] = await Promise.all([
          getListings({
            page: 1,
            limit: 500,
          }),

          token ? getFavorites(token) : Promise.resolve(null),
        ]);

        if (cancelled) {
          return;
        }

        if (!listingsResponse?.success) {
          throw new Error(
            listingsResponse?.message || "Не удалось загрузить объявления",
          );
        }

        setListingsList(
          Array.isArray(listingsResponse.data) ? listingsResponse.data : [],
        );

        if (
          favoritesResponse?.success &&
          Array.isArray(favoritesResponse.data)
        ) {
          setFavIds(
            new Set(favoritesResponse.data.map((item) => String(item.id))),
          );
        } else {
          setFavIds(new Set());
        }
      } catch (err) {
        console.error(err);

        if (!cancelled) {
          setError(err?.message || "Ошибка соединения с сервером");

          setListingsList([]);
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    }

    loadData();

    return () => {
      cancelled = true;
    };
  }, []);

  /* =======================================================
     MAP LISTINGS
  ======================================================= */

  const mappedListings = useMemo(() => {
    return listingsList
      .map((item) => {
        try {
          return mapListingData(item);
        } catch (err) {
          console.error("Ошибка mapListingData:", err);

          return null;
        }
      })
      .filter(Boolean);
  }, [listingsList]);

  /* =======================================================
     FAVORITES
  ======================================================= */

  async function handleFavoriteClick(item) {
    const token =
      typeof window !== "undefined"
        ? localStorage.getItem("uytap_token")
        : null;

    if (!token) {
      router.push("/login");
      return;
    }

    const id = String(item.id);

    const isFavorite = favIds.has(id);

    try {
      if (isFavorite) {
        const response = await removeFavorite(token, id);

        if (response?.success) {
          setFavIds((prev) => {
            const next = new Set(prev);

            next.delete(id);

            return next;
          });
        }
      } else {
        const response = await addFavorite(token, id);

        if (response?.success) {
          setFavIds((prev) => {
            const next = new Set(prev);

            next.add(id);

            return next;
          });
        }
      }
    } catch (err) {
      console.error("Favorite error:", err);
    }
  }

  /* =======================================================
     FILTER LISTINGS
  ======================================================= */

  const filteredListings = useMemo(() => {
    return (
      mappedListings
        .filter((item) => {
          /* ---------------------------------------------
           CATEGORY
        --------------------------------------------- */

          const selectedType = categoryApiMap[filters.propertyType];

          const itemType = String(item.type || "")
            .trim()
            .toLowerCase();

          const matchesCategory =
            !selectedType || itemType === selectedType.toLowerCase();

          /* ---------------------------------------------
           DEAL
        --------------------------------------------- */

          const selectedDeal = dealApiMap[filters.dealType];

          const itemDeal = String(item.dealType || "")
            .trim()
            .toLowerCase();

          const matchesDeal =
            !selectedDeal || itemDeal === selectedDeal.toLowerCase();

          /* ---------------------------------------------
           CITY / LOCATION
        --------------------------------------------- */

          const matchesCity = (() => {
            if (!filters.city || filters.city === "Все") {
              return true;
            }

            const selected = normalizeLocationValue(filters.city);

            const values = [
              item.location,
              item.city,
              item.region,
              item.address,
              item.country,
              item.district,
            ]
              .filter(Boolean)
              .map(normalizeLocationValue);

            /* ИССЫК-КУЛЬ */

            if (
              isIssykKulValue(selected) ||
              ISSYK_KUL_CITIES.some(
                (city) =>
                  selected === normalizeLocationValue(city) ||
                  selected.includes(normalizeLocationValue(city)),
              )
            ) {
              return values.some((value) => {
                if (isIssykKulValue(value)) {
                  return true;
                }

                return ISSYK_KUL_CITIES.some((city) => {
                  const normalizedCity = normalizeLocationValue(city);

                  return (
                    value === normalizedCity || value.includes(normalizedCity)
                  );
                });
              });
            }

            /* ТУРЦИЯ */

            if (selected === "турция") {
              return values.some(
                (value) =>
                  value.includes("турци") ||
                  value.includes("turkey") ||
                  value.includes("алань") ||
                  value.includes("антал") ||
                  value.includes("стамбул") ||
                  value.includes("мерсин") ||
                  value.includes("измир"),
              );
            }

            return values.some((value) => value.includes(selected));
          })();

          /* ---------------------------------------------
           ROOMS
        --------------------------------------------- */

          const matchesRooms = (() => {
            if (!filters.rooms || filters.rooms === "Все") {
              return true;
            }

            const itemRooms = Number(item.rooms);

            if (filters.rooms === "4+") {
              return itemRooms >= 4;
            }

            return itemRooms === Number(filters.rooms);
          })();

          /* ---------------------------------------------
           PRICE
        --------------------------------------------- */

          const matchesPrice = (() => {
            const price = Number(item.rawPrice);

            const min = filters.priceFrom ? Number(filters.priceFrom) : null;

            const max = filters.priceTo ? Number(filters.priceTo) : null;

            if (min !== null && !Number.isNaN(min) && price < min) {
              return false;
            }

            if (max !== null && !Number.isNaN(max) && price > max) {
              return false;
            }

            return true;
          })();

          /* ---------------------------------------------
           AREA
        --------------------------------------------- */

          const matchesArea = (() => {
            const area = Number(item.rawArea);

            const min = filters.areaFrom ? Number(filters.areaFrom) : null;

            const max = filters.areaTo ? Number(filters.areaTo) : null;

            if (min !== null && !Number.isNaN(min) && area < min) {
              return false;
            }

            if (max !== null && !Number.isNaN(max) && area > max) {
              return false;
            }

            return true;
          })();

          /* ---------------------------------------------
           BEACH DISTANCE
        --------------------------------------------- */

          const matchesBeach = (() => {
            /**
             * Фильтр не выбран.
             */
            if (!filters.beachDistanceFrom && !filters.beachDistanceTo) {
              return true;
            }

            /**
             * Расстояние может лежать
             * в разных местах объекта.
             */
            const rawDistance =
              item.beachDistanceFrom ??
              item.beachDistance ??
              item.beach_distance ??
              item.distanceToBeach ??
              item.distance_to_beach ??
              item.features?.beachDistance ??
              item.features?.beach_distance ??
              item.features?.distanceToBeach ??
              item.features?.distance_to_beach;

            const distance = Number(rawDistance);

            /**
             * Если расстояние отсутствует,
             * не убираем объявление из выдачи.
             */
            if (
              rawDistance === undefined ||
              rawDistance === null ||
              rawDistance === ""
            ) {
              return true;
            }

            if (Number.isNaN(distance)) {
              return true;
            }

            const min = filters.beachDistanceFrom
              ? Number(filters.beachDistanceFrom)
              : null;

            const max = filters.beachDistanceTo
              ? Number(filters.beachDistanceTo)
              : null;

            if (min !== null && !Number.isNaN(min) && distance < min) {
              return false;
            }

            if (max !== null && !Number.isNaN(max) && distance > max) {
              return false;
            }

            return true;
          })();

          /* ---------------------------------------------
           CATEGORY FEATURES
        --------------------------------------------- */

          for (const key of featureKeys) {
            const selected = filters[key];

            if (
              !selected ||
              selected === "Любой" ||
              selected === "Любая" ||
              selected === "Любые" ||
              selected === "Любое"
            ) {
              continue;
            }

            const itemValue = item[key] ?? item.features?.[key];

            if (itemValue === undefined || itemValue === null) {
              return false;
            }

            if (
              !String(itemValue)
                .toLowerCase()
                .includes(String(selected).toLowerCase())
            ) {
              return false;
            }
          }

          /* ---------------------------------------------
           ARRAY FEATURES
        --------------------------------------------- */

          const matchesArrayFilter = (key) => {
            const selected = filters[key];

            if (!Array.isArray(selected) || selected.length === 0) {
              return true;
            }

            const itemValue = item[key] ?? item.features?.[key];

            if (!Array.isArray(itemValue)) {
              return false;
            }

            const normalized = itemValue.map((value) =>
              String(value).toLowerCase(),
            );

            return selected.every((value) =>
              normalized.includes(String(value).toLowerCase()),
            );
          };

          /* ---------------------------------------------
           FINAL
        --------------------------------------------- */

          return (
            matchesCategory &&
            matchesDeal &&
            matchesCity &&
            matchesRooms &&
            matchesPrice &&
            matchesArea &&
            matchesBeach &&
            matchesArrayFilter("amenities") &&
            matchesArrayFilter("communications") &&
            matchesArrayFilter("technicalParameters")
          );
        })

        /* -----------------------------------------------
         PRIORITY
      ----------------------------------------------- */

        .sort((a, b) => {
          const priority = {
            vip: 0,
            urgent: 1,
            top: 2,
            regular: 3,
          };

          return (priority[a.status] ?? 3) - (priority[b.status] ?? 3);
        })
    );
  }, [mappedListings, filters]);

  /* =======================================================
     CATEGORY FILTER COMPONENT
  ======================================================= */

  const CategoryFilters =
    categoryComponents[filters.propertyType] || ApartmentFilters;

  /* =======================================================
     ISSYK-KUL STATE
  ======================================================= */

  /**
   * Расстояние до пляжа доступно
   * для ЛЮБОГО типа недвижимости,
   * если выбрана локация Иссык-Куль.
   *
   * apartment -> true
   * house -> true
   * cottage -> true
   * land -> true
   * room -> true
   * commercial -> true
   * parking -> true
   */
  const showBeachDistance = useMemo(() => {
    return isIssykKulLocation(filters);
  }, [filters.city, filters.region, filters.country, filters.district]);

  /* =======================================================
     RESET
  ======================================================= */

  function resetFilters() {
    setFilters(DEFAULT_FILTERS);

    router.replace("/all-products", {
      scroll: false,
    });
  }

  /* =======================================================
     HAS FILTERS
  ======================================================= */

  const hasFilters =
    filters.propertyType !== "apartment" ||
    filters.dealType !== "sale" ||
    filters.city !== "Все" ||
    Boolean(filters.priceFrom) ||
    Boolean(filters.priceTo) ||
    Boolean(filters.areaFrom) ||
    Boolean(filters.areaTo) ||
    Boolean(filters.beachDistanceFrom) ||
    Boolean(filters.beachDistanceTo) ||
    Object.entries(filters).some(
      ([key, value]) =>
        ![
          "propertyType",
          "dealType",
          "city",
          "currency",
          "priceFrom",
          "priceTo",
          "areaFrom",
          "areaTo",
          "beachDistanceFrom",
          "beachDistanceTo",
        ].includes(key) &&
        value &&
        (Array.isArray(value) ? value.length > 0 : true),
    );

  /* =======================================================
     RENDER
  ======================================================= */

  return (
    <main className={styles.page}>
      <div className={styles.glow} />

      {/* =================================================
          HEADER
      ================================================= */}

      <header className={styles.header}>
        <div className={styles.headerTop}>
          <button
            type="button"
            className={styles.homeButton}
            onClick={() => router.push("/")}
          >
            <Home size={17} />
            На главную
          </button>

          <div className={styles.badge}>
            <span />
            Все объявления
          </div>
        </div>

        <h1>
          Найдите свою
          <span> недвижимость</span>
        </h1>

        <p>
          Используйте точные фильтры или просто расскажите умному поиску, что
          именно вы ищете.
        </p>
      </header>

      <div className={styles.container}>
        {/* =================================================
            SEARCH MODE
        ================================================= */}

        <SearchModeSlider value={searchMode} onChange={setSearchMode} />

        {/* =================================================
            SMART SEARCH
        ================================================= */}

        {searchMode === "smart" && (
          <SmartSearch onFiltersDetected={handleSmartSearch} />
        )}

        {/* =================================================
            FILTER SEARCH
        ================================================= */}

        {searchMode === "filters" && (
          <section id="filters" className={styles.filters}>
            <div className={styles.filterHeader}>
              <div>
                <span>ФИЛЬТРЫ</span>

                <h2>Настройте поиск</h2>
              </div>

              {hasFilters && (
                <button
                  type="button"
                  className={styles.reset}
                  onClick={resetFilters}
                >
                  <X size={14} />
                  Сбросить
                </button>
              )}
            </div>

            {/* =================================================
                PROPERTY TYPE
            ================================================= */}

            <div className={styles.section}>
              <label>Тип недвижимости</label>

              <div className={styles.categoryList}>
                {categories.map((category) => {
                  const active = filters.propertyType === category.value;

                  return (
                    <button
                      key={category.value}
                      type="button"
                      className={active ? styles.categoryActive : ""}
                      onClick={() =>
                        updateFilter("propertyType", category.value)
                      }
                    >
                      {category.label}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* =================================================
                DEAL
            ================================================= */}

            <div className={styles.section}>
              <label>Тип сделки</label>

              <div className={styles.dealList}>
                {deals.map((deal) => (
                  <button
                    key={deal.value}
                    type="button"
                    className={
                      filters.dealType === deal.value ? styles.dealActive : ""
                    }
                    onClick={() => updateFilter("dealType", deal.value)}
                  >
                    {deal.label}
                  </button>
                ))}
              </div>
            </div>

            {/* =================================================
                COMMON FILTERS
            ================================================= */}

            <div className={styles.section}>
              <label>Основные параметры</label>

              <CommonFilters
                filters={filters}
                updateFilter={updateFilter}
                showBeachDistance={showBeachDistance}
              />
            </div>

            {/* =================================================
                CATEGORY FILTERS
            ================================================= */}

            <div className={styles.categoryFilters}>
              <div className={styles.categoryTitle}>
                <div>
                  <span>ХАРАКТЕРИСТИКИ</span>

                  <h3>{categoryLabels[filters.propertyType]}</h3>
                </div>
              </div>

              <CategoryFilters filters={filters} updateFilter={updateFilter} />
            </div>

            {/* =================================================
                APPLY
            ================================================= */}

            <button
              type="button"
              className={styles.apply}
              onClick={() => updateUrl(filters)}
            >
              <Search size={17} />
              Показать объявления
            </button>
          </section>
        )}

        {/* =================================================
            RESULTS HEADER
        ================================================= */}

        <div className={styles.resultsHeader}>
          <div>
            <span>РЕЗУЛЬТАТЫ ПОИСКА</span>

            <strong>{loading ? "..." : filteredListings.length}</strong>

            <small>объявлений</small>
          </div>
        </div>

        {/* =================================================
            LOADING
        ================================================= */}

        {loading && (
          <div className={styles.loading}>
            <div />
            Загружаем объявления...
          </div>
        )}

        {/* =================================================
            ERROR
        ================================================= */}

        {!loading && error && <div className={styles.error}>{error}</div>}

        {/* =================================================
            RESULTS
        ================================================= */}

        {!loading &&
          !error &&
          (filteredListings.length > 0 ? (
            <section className={styles.grid}>
              {filteredListings.map((item) => (
                <ListingCardBlack
                  key={item.id}
                  item={item}
                  isFavorite={favIds.has(String(item.id))}
                  onFavoriteClick={handleFavoriteClick}
                />
              ))}
            </section>
          ) : (
            <div className={styles.empty}>
              <div className={styles.emptyIcon}>
                <Search size={27} />
              </div>

              <h2>Ничего не найдено</h2>

              <p>Попробуйте изменить параметры поиска.</p>

              {hasFilters && (
                <button type="button" onClick={resetFilters}>
                  Сбросить фильтры
                </button>
              )}
            </div>
          ))}
      </div>
    </main>
  );
}
