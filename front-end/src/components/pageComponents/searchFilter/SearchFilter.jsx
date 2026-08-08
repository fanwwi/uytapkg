"use client";

import { useState } from "react";

import styles from "./SearchFilter.module.css";

import SearchMode from "./components/searchMode/SearchMode";
import DealSwitcher from "./components/dealSwitcher/DealSwitcher";
import Categories from "./components/categories/Categories";
import MainFilters from "./components/mainFilters/MainFilters";
import AdvancedFilters from "./components/advancedFilters/AdvancedFilters";
import SearchActions from "./components/searchActions/SearchActions";
import SmartSearchVoice from "../smartSearch/SmartSearch";
import { getListings } from "@/utils/api";

export default function SearchFilter() {
  const [mode, setMode] = useState("normal");

  const [category, setCategory] = useState("Квартиры");

  const [deal, setDeal] = useState("buy");

  const [urgent, setUrgent] = useState(false);

  const [vip, setVip] = useState(false);

  // MAIN FILTERS

  const [location, setLocation] = useState("Любая");

  const [priceFrom, setPriceFrom] = useState("");

  const [priceTo, setPriceTo] = useState("");

  const [areaFrom, setAreaFrom] = useState("");

  const [areaTo, setAreaTo] = useState("");

  const [type, setType] = useState("Любой");

  const [rooms, setRooms] = useState("Любой");

  const [commercialType, setCommercialType] = useState("Любой");

  const [parkingType, setParkingType] = useState("Любой");

  const [security, setSecurity] = useState("Любая");

  const [landAreaFrom, setLandAreaFrom] = useState("");

  const [landAreaTo, setLandAreaTo] = useState("");

  const [purpose, setPurpose] = useState("Любое");

  const [fence, setFence] = useState("Любой");

  // ADVANCED

  const [floor, setFloor] = useState("Любой");

  const [condition, setCondition] = useState("Любое");

  const [walls, setWalls] = useState("Любые");

  const [heating, setHeating] = useState("Любое");

  const [documents, setDocuments] = useState("Любые");

  const [offerType, setOfferType] = useState("Любой");

  const [furniture, setFurniture] = useState("Любая");

  const [comfort, setComfort] = useState("Любые");

  // RENT

  const [rentPeriod, setRentPeriod] = useState("Любой");

  // LOCATION

  const [country, setCountry] = useState("Кыргызстан");

  const [region, setRegion] = useState("");

  const [district, setDistrict] = useState("");

  const [searchResults, setSearchResults] = useState([]);
  const [searchLoading, setSearchLoading] = useState(false);
  const [searchError, setSearchError] = useState("");

  const categoryToPropertyType = {
    Квартиры: "apartment",
    Дома: "house",
    Участки: "land",
    Комнаты: "room",
    Коммерция: "commercial",
    "Паркинг / Гараж": "garage",
  };

  const propertyTypeToCategory = {
    apartment: "Квартиры",
    house: "Дома",
    land: "Участки",
    room: "Комнаты",
    commercial: "Коммерция",
    garage: "Паркинг / Гараж",
  };

  const normalizeRooms = (value) => {
    if (!value || value === "Любой") return null;
    const number = Number(value);
    return Number.isFinite(number) ? number : null;
  };

  const buildSearchParams = (overrides = {}) => {
    const resultCategory = overrides.category ?? category;
    const resultDeal = overrides.deal ?? deal;
    const resultRegion = overrides.region ?? region;
    const resultDistrict = overrides.district ?? district;
    const resultMinPrice = overrides.priceFrom ?? priceFrom;
    const resultMaxPrice = overrides.priceTo ?? priceTo;
    const resultRooms = overrides.rooms ?? rooms;

    const params = {};

    if (resultRegion && resultRegion !== "Любая") params.region = resultRegion;
    if (resultDistrict) params.district = resultDistrict;
    if (categoryToPropertyType[resultCategory]) params.propertyType = categoryToPropertyType[resultCategory];
    if (resultDeal) params.dealType = resultDeal === "buy" ? "sale" : resultDeal;
    if (resultMinPrice) params.minPrice = resultMinPrice;
    if (resultMaxPrice) params.maxPrice = resultMaxPrice;

    const normalizedRooms = normalizeRooms(resultRooms);
    if (normalizedRooms) params.rooms = normalizedRooms;

    return params;
  };

  const handleSearch = async () => {
    setSearchError("");
    setSearchLoading(true);

    try {
      const params = buildSearchParams();
      const data = await getListings(params);

      if (!data?.success) {
        setSearchError(data?.message || "Не удалось получить результаты поиска");
        setSearchResults([]);
      } else {
        setSearchResults(data.data || []);
      }
    } catch (error) {
      setSearchError(error.message || "Ошибка сети при поиске");
      setSearchResults([]);
    } finally {
      setSearchLoading(false);
    }
  };

  const handleReset = () => {
    setCategory("Квартиры");
    setDeal("buy");
    setUrgent(false);
    setVip(false);
    setLocation("Любая");
    setPriceFrom("");
    setPriceTo("");
    setAreaFrom("");
    setAreaTo("");
    setType("Любой");
    setRooms("Любой");
    setCommercialType("Любой");
    setParkingType("Любой");
    setSecurity("Любая");
    setLandAreaFrom("");
    setLandAreaTo("");
    setPurpose("Любое");
    setFence("Любой");
    setFloor("Любой");
    setCondition("Любое");
    setWalls("Любые");
    setHeating("Любое");
    setDocuments("Любые");
    setOfferType("Любой");
    setFurniture("Любая");
    setComfort("Любые");
    setRentPeriod("Любой");
    setRegion("");
    setDistrict("");
    setSearchResults([]);
    setSearchError("");
  };

  const handleAiParsed = async (filters) => {
    if (!filters || typeof filters !== "object") return;

    if (filters.region !== undefined) setRegion(filters.region || "");
    if (filters.district !== undefined) setDistrict(filters.district || "");
    if (filters.propertyType !== undefined) {
      setCategory(propertyTypeToCategory[filters.propertyType] || "Квартиры");
    }
    if (filters.dealType !== undefined) {
      setDeal(filters.dealType === "sale" ? "buy" : filters.dealType === "rent" ? "rent" : "buy");
    }
    if (filters.maxPrice !== undefined) setPriceTo(filters.maxPrice?.toString() || "");
    if (filters.rooms !== undefined) setRooms(filters.rooms?.toString() || "Любой");

    const params = buildSearchParams({
      region: filters.region ?? region,
      district: filters.district ?? district,
      category: propertyTypeToCategory[filters.propertyType] || category,
      deal: filters.dealType ?? deal,
      priceTo: filters.maxPrice ?? priceTo,
      rooms: filters.rooms ?? rooms,
    });

    setSearchLoading(true);
    try {
      const data = await getListings(params);
      if (!data?.success) {
        setSearchError(data?.message || "Не удалось получить результаты AI поиска");
        setSearchResults([]);
      } else {
        setSearchResults(data.data || []);
      }
    } catch (error) {
      setSearchError(error.message || "Ошибка сети при AI поиске");
      setSearchResults([]);
    } finally {
      setSearchLoading(false);
    }
  };

  return (
    <section className={styles.wrapper}>
      <div className={styles.card}>
        <SearchMode mode={mode} setMode={setMode} />

        {mode === "smart" ? (
          <SmartSearchVoice onAiParsed={handleAiParsed} />
        ) : (
          <>
            <DealSwitcher deal={deal} setDeal={setDeal} />

            <Categories
              category={category}
              setCategory={setCategory}
              urgent={urgent}
              setUrgent={setUrgent}
              vip={vip}
              setVip={setVip}
            />

            <MainFilters
              category={category}
              location={location}
              setLocation={setLocation}
              priceFrom={priceFrom}
              setPriceFrom={setPriceFrom}
              priceTo={priceTo}
              setPriceTo={setPriceTo}
              areaFrom={areaFrom}
              setAreaFrom={setAreaFrom}
              areaTo={areaTo}
              setAreaTo={setAreaTo}
              type={type}
              setType={setType}
              rooms={rooms}
              setRooms={setRooms}
              commercialType={commercialType}
              setCommercialType={setCommercialType}
              parkingType={parkingType}
              setParkingType={setParkingType}
              security={security}
              setSecurity={setSecurity}
              landAreaFrom={landAreaFrom}
              setLandAreaFrom={setLandAreaFrom}
              landAreaTo={landAreaTo}
              setLandAreaTo={setLandAreaTo}
              purpose={purpose}
              setPurpose={setPurpose}
              fence={fence}
              setFence={setFence}
              country={country}
              setCountry={setCountry}
              region={region}
              setRegion={setRegion}
              district={district}
              setDistrict={setDistrict}
            />

            <AdvancedFilters
              category={category}
              deal={deal}
              floor={floor}
              setFloor={setFloor}
              condition={condition}
              setCondition={setCondition}
              walls={walls}
              setWalls={setWalls}
              heating={heating}
              setHeating={setHeating}
              documents={documents}
              setDocuments={setDocuments}
              offerType={offerType}
              setOfferType={setOfferType}
              furniture={furniture}
              setFurniture={setFurniture}
              comfort={comfort}
              setComfort={setComfort}
              rentPeriod={rentPeriod}
              setRentPeriod={setRentPeriod}
            />

            <SearchActions onSearch={handleSearch} onReset={handleReset} />
          </>
        )}
      </div>
    </section>
  );
}
