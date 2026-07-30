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

  return (
    <section className={styles.wrapper}>
      <div className={styles.card}>
        <SearchMode mode={mode} setMode={setMode} />

        {mode === "smart" ? (
          <SmartSearchVoice />
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

            <SearchActions />
          </>
        )}
      </div>
    </section>
  );
}
