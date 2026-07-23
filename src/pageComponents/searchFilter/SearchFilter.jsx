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

  // квартира / дом фильтры

  const [floor, setFloor] = useState("Любой");

  const [condition, setCondition] = useState("Любое");

  const [walls, setWalls] = useState("Любые");

  const [heating, setHeating] = useState("Любое");

  const [documents, setDocuments] = useState("Любые");

  const [furniture, setFurniture] = useState("Любая");

  const [comfort, setComfort] = useState("Любые");

  const [offerType, setOfferType] = useState("Любой");

  // аренда

  const [rentPeriod, setRentPeriod] = useState("Любой");

  // дома

  const [houseType, setHouseType] = useState("Любой");

  const [sewage, setSewage] = useState("Любая");

  const [water, setWater] = useState("Любая");

  const [electricity, setElectricity] = useState("Любое");

  // участок

  const [landFrom, setLandFrom] = useState("");

  const [landTo, setLandTo] = useState("");

  return (
    <section className={styles.wrapper}>
      <div className={styles.card}>
        <SearchMode mode={mode} setMode={setMode} />

        <DealSwitcher deal={deal} setDeal={setDeal} />

        <Categories category={category} setCategory={setCategory} />

        <MainFilters category={category} />

        <AdvancedFilters
          category={category}
          deal={deal}
          advanced={advanced}
          setAdvanced={setAdvanced}
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
          furniture={furniture}
          setFurniture={setFurniture}
          comfort={comfort}
          setComfort={setComfort}
          offerType={offerType}
          setOfferType={setOfferType}
          rentPeriod={rentPeriod}
          setRentPeriod={setRentPeriod}
          houseType={houseType}
          setHouseType={setHouseType}
          sewage={sewage}
          setSewage={setSewage}
          water={water}
          setWater={setWater}
          electricity={electricity}
          setElectricity={setElectricity}
          landFrom={landFrom}
          setLandFrom={setLandFrom}
          landTo={landTo}
          setLandTo={setLandTo}
        />

        <SearchActions />
      </div>
    </section>
  );
}
