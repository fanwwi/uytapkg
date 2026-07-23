"use client";

import { useState } from "react";

import styles from "./SearchFilter.module.css";

import SearchMode from "./components/searchMode/SearchMode";
import DealSwitcher from "./components/dealSwitcher/DealSwitcher";
import Categories from "./components/categories/Categories";
import MainFilters from "./components/mainFilters/MainFilters";
import AdvancedFilters from "./components/advancedFilters/AdvancedFilters";
import SearchActions from "./components/searchActions/SearchActions";

export default function SearchFilter() {
  const [mode, setMode] = useState("normal");

  const [category, setCategory] = useState("Квартиры");

  const [deal, setDeal] = useState("buy");

  const [advanced, setAdvanced] = useState(false);

  // ======================
  // COMMON MAIN
  // ======================

  const [location, setLocation] = useState("Любая");

  const [priceFrom, setPriceFrom] = useState("");
  const [priceTo, setPriceTo] = useState("");

  // ======================
  // APARTMENT
  // ======================

  const [type, setType] = useState("Любой");

  const [rooms, setRooms] = useState("Любой");

  const [areaFrom, setAreaFrom] = useState("");
  const [areaTo, setAreaTo] = useState("");

  const [floor, setFloor] = useState("Любой");

  const [condition, setCondition] = useState("Любое");

  const [walls, setWalls] = useState("Любые");

  const [heating, setHeating] = useState("Любое");

  const [furniture, setFurniture] = useState("Любая");

  const [comfort, setComfort] = useState("Любые");

  // ======================
  // HOUSE
  // ======================

  const [houseType, setHouseType] = useState("Любой");

  const [sewage, setSewage] = useState("Любая");

  const [water, setWater] = useState("Любая");

  const [electricity, setElectricity] = useState("Любое");

  // ======================
  // LAND
  // ======================

  const [landAreaFrom, setLandAreaFrom] = useState("");

  const [landAreaTo, setLandAreaTo] = useState("");

  const [purpose, setPurpose] = useState("Любое");

  const [fence, setFence] = useState("Любой");

  const [landLocation, setLandLocation] = useState("Любое");

  const [relief, setRelief] = useState("Любой");

  const [communications, setCommunications] = useState("Любые");

  // ======================
  // COMMON ADVANCED
  // ======================

  const [documents, setDocuments] = useState("Любые");

  const [offerType, setOfferType] = useState("Любой");

  // RENT

  const [rentPeriod, setRentPeriod] = useState("Любой");

  return (
    <section className={styles.wrapper}>
      <div className={styles.card}>
        <SearchMode mode={mode} setMode={setMode} />

        <DealSwitcher deal={deal} setDeal={setDeal} />

        <Categories category={category} setCategory={setCategory} />

        <MainFilters
          category={category}
          location={location}
          setLocation={setLocation}
          type={type}
          setType={setType}
          rooms={rooms}
          setRooms={setRooms}
          priceFrom={priceFrom}
          setPriceFrom={setPriceFrom}
          priceTo={priceTo}
          setPriceTo={setPriceTo}
          areaFrom={areaFrom}
          setAreaFrom={setAreaFrom}
          areaTo={areaTo}
          setAreaTo={setAreaTo}
          landAreaFrom={landAreaFrom}
          setLandAreaFrom={setLandAreaFrom}
          landAreaTo={landAreaTo}
          setLandAreaTo={setLandAreaTo}
          purpose={purpose}
          setPurpose={setPurpose}
          fence={fence}
          setFence={setFence}
        />

        <AdvancedFilters
          category={category}
          deal={deal}
          advanced={advanced}
          setAdvanced={setAdvanced}
          // apartment

          floor={floor}
          setFloor={setFloor}
          condition={condition}
          setCondition={setCondition}
          walls={walls}
          setWalls={setWalls}
          heating={heating}
          setHeating={setHeating}
          furniture={furniture}
          setFurniture={setFurniture}
          comfort={comfort}
          setComfort={setComfort}
          // common

          documents={documents}
          setDocuments={setDocuments}
          offerType={offerType}
          setOfferType={setOfferType}
          // rent

          rentPeriod={rentPeriod}
          setRentPeriod={setRentPeriod}
          // house

          houseType={houseType}
          setHouseType={setHouseType}
          sewage={sewage}
          setSewage={setSewage}
          water={water}
          setWater={setWater}
          electricity={electricity}
          setElectricity={setElectricity}
          // land

          landLocation={landLocation}
          setLandLocation={setLandLocation}
          relief={relief}
          setRelief={setRelief}
          communications={communications}
          setCommunications={setCommunications}
        />

        <SearchActions />
      </div>
    </section>
  );
}
