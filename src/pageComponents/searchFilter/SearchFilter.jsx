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
  // PARKING / GARAGE
  // ======================

  const [parkingType, setParkingType] = useState("Любой");

  const [security, setSecurity] = useState("Любая");

  const [parkingAreaFrom, setParkingAreaFrom] = useState("");
  const [parkingAreaTo, setParkingAreaTo] = useState("");

  const [ceilingHeight, setCeilingHeight] = useState("");

  const [parkingKind, setParkingKind] = useState("Любой");

  const [material, setMaterial] = useState("Любой");

  const [gateType, setGateType] = useState("Любой");

  const [hasGate, setHasGate] = useState("Любые");

  const [camera, setCamera] = useState("Любое");

  const [inspectionPit, setInspectionPit] = useState("Любая");

  const [electricityParking, setElectricityParking] = useState("Любое");

  const [cellar, setCellar] = useState("Любой");

  const [truckAccess, setTruckAccess] = useState("Любой");

  // ======================
  // COMMON MAIN
  // ======================

  const [location, setLocation] = useState("Любая");

  const [priceFrom, setPriceFrom] = useState("");
  const [priceTo, setPriceTo] = useState("");

  // ======================
  // COMMERCIAL
  // ======================

  const [commercialType, setCommercialType] = useState("Любой");

  const [technicalParams, setTechnicalParams] = useState("Любые");

  const [firstLine, setFirstLine] = useState("Любая");

  const [separateEntrance, setSeparateEntrance] = useState("Любой");

  const [rentalBusiness, setRentalBusiness] = useState("Любой");

  const [includedCost, setIncludedCost] = useState("Любое");

  const [paymentTerms, setPaymentTerms] = useState("Любые");

  const [commercialTypeAdvanced, setCommercialTypeAdvanced] = useState("Любой");

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

  const [roomLocation, setRoomLocation] = useState("Любое");

  const [totalRooms, setTotalRooms] = useState("Любое");

  const [privateBathroom, setPrivateBathroom] = useState("Любой");

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
          commercialType={commercialType}
          setCommercialType={setCommercialType}
          parkingAreaFrom={parkingAreaFrom}
          parkingAreaTo={parkingAreaTo}
          ceilingHeight={ceilingHeight}
          setCeilingHeight={setCeilingHeight}
          parkingKind={parkingKind}
          setParkingKind={setParkingKind}
          material={material}
          setMaterial={setMaterial}
          gateType={gateType}
          setGateType={setGateType}
          hasGate={hasGate}
          setHasGate={setHasGate}
          camera={camera}
          setCamera={setCamera}
          inspectionPit={inspectionPit}
          setInspectionPit={setInspectionPit}
          electricityParking={electricityParking}
          setElectricityParking={setElectricityParking}
          cellar={cellar}
          setCellar={setCellar}
          truckAccess={truckAccess}
          setTruckAccess={setTruckAccess}
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
