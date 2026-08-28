"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Search, Sparkles } from "lucide-react";

import styles from "./SearchFilter.module.css";

import StepLocation from "./components/StepLocation/StepLocation";
import StepDeal from "./components/StepDeal/StepDeal";
import StepCategory from "./components/StepCategory/StepCategory";
import StepProgress from "./components/StepProgress/StepProgress";
import SmartSearch from "./components/SmartSearch/SmartSearch";

const initialForm = {
  /* =========================
     LOCATION
  ========================= */

  country: "",
  region: "",
  city: "",
  settlement: "",
  district: "",

  address: "",
  latitude: null,
  longitude: null,

  /* =========================
     DEAL
  ========================= */

  dealType: "",
  rentalPeriod: "",

  /* =========================
     CATEGORY
  ========================= */

  category: "",

  /* =========================
     PRICE
  ========================= */

  priceFrom: "",
  priceTo: "",

  /* =========================
     AREA
  ========================= */

  areaFrom: "",
  areaTo: "",

  /* =========================
     CATEGORY PARAMETERS
  ========================= */

  series: "",
  rooms: "",
  floor: "",
  condition: "",
  walls: "",
  heating: "",
  documents: "",
  furniture: "",
  amenities: [],
  offerType: "",

  houseType: "",
  floors: "",
  sewerage: "",
  water: "",
  electricity: "",

  purpose: "",
  fence: "",
  location: "",
  terrain: "",
  communications: "",

  roomsInApartment: "",
  privateBathroom: "",

  premisesType: "",
  technicalParameters: "",
  firstLine: "",
  separateEntrance: "",
  rentalBusiness: "",

  ceilingHeight: "",
  parkingType: "",
  material: "",
  security: "",
  gates: "",
  inspectionPit: "",
  basement: "",
  truckAccess: "",
  gateType: "",

  /* =========================
     ISSYK-KUL
  ========================= */

  beachDistanceFrom: "",
  beachDistanceTo: "",

  /* =========================
     OTHER
  ========================= */

  listingType: "",

  searchMode: "normal",
};

export default function SearchFilter({ onSearch }) {
  const router = useRouter();

  const [step, setStep] = useState(1);
  const [form, setForm] = useState(initialForm);
  const [isSearching, setIsSearching] = useState(false);

  const totalSteps = 3;

  /* =========================================================
     UPDATE FORM
  ========================================================= */

  function updateForm(values) {
    setForm((prev) => ({
      ...prev,
      ...values,
    }));
  }

  /* =========================================================
     SEARCH MODE
  ========================================================= */

  function selectSearchMode(mode) {
    updateForm({
      searchMode: mode,
    });
  }

  /* =========================================================
     STEPS
  ========================================================= */

  function nextStep() {
    setStep((prev) => Math.min(prev + 1, totalSteps));
  }

  function prevStep() {
    setStep((prev) => Math.max(prev - 1, 1));
  }

  /* =========================================================
     BUILD SEARCH PARAMS
  ========================================================= */

  function buildSearchParams(data) {
    const params = new URLSearchParams();

    Object.entries(data).forEach(([key, value]) => {
      if (
        value !== "" &&
        value !== null &&
        value !== undefined &&
        (!Array.isArray(value) || value.length > 0)
      ) {
        params.set(key, Array.isArray(value) ? value.join(",") : String(value));
      }
    });

    return params;
  }

  /* =========================================================
     SMART SEARCH
  ========================================================= */

  function handleSmartSearch(values) {
    const merged = {
      ...form,
      ...values,
      searchMode: "smart",
    };

    updateForm(merged);

    const params = buildSearchParams(merged);

    router.push(`/all-products?${params.toString()}`);
  }

  /* =========================================================
     NORMAL SEARCH
  ========================================================= */

  function submitSearch(searchData) {
    const finalForm = {
      ...form,
      ...(searchData || {}),
      searchMode: "normal",
    };

    setIsSearching(true);

    updateForm(finalForm);

    if (onSearch) {
      onSearch(finalForm);
    }

    const params = buildSearchParams(finalForm);

    router.push(`/all-products?${params.toString()}`);
  }

  /* =========================================================
     RENDER
  ========================================================= */

  return (
    <main className={styles.page}>
      <div className={styles.container}>
        {/* =====================================================
            SEARCH MODE
        ===================================================== */}

        <div className={styles.searchMode}>
          <div className={styles.searchModeSwitch}>
            <div
              className={`${styles.searchModeSlider} ${
                form.searchMode === "smart" ? styles.searchModeSliderSmart : ""
              }`}
            />

            <button
              type="button"
              className={`${styles.searchModeTab} ${
                form.searchMode === "normal" ? styles.searchModeTabActive : ""
              }`}
              onClick={() => selectSearchMode("normal")}
            >
              <Search size={16} />
              <span>Обычный поиск</span>
            </button>

            <button
              type="button"
              className={`${styles.searchModeTab} ${
                form.searchMode === "smart" ? styles.searchModeTabActive : ""
              }`}
              onClick={() => selectSearchMode("smart")}
            >
              <Sparkles size={16} />
              <span>Умный поиск</span>
            </button>
          </div>
        </div>

        {/* =====================================================
            SMART SEARCH
        ===================================================== */}

        {form.searchMode === "smart" ? (
          <SmartSearch
            form={form}
            updateForm={handleSmartSearch}
            onNext={nextStep}
          />
        ) : (
          <>
            {/* =================================================
                PROGRESS
            ================================================= */}

            <StepProgress currentStep={step} totalSteps={totalSteps} />

            <div className={styles.card}>
              {/* ===============================================
                  STEP 1 — LOCATION
              =============================================== */}

              {step === 1 && (
                <StepLocation
                  form={form}
                  updateForm={updateForm}
                  onNext={nextStep}
                />
              )}

              {/* ===============================================
                  STEP 2 — DEAL
              =============================================== */}

              {step === 2 && (
                <StepDeal
                  form={form}
                  updateForm={updateForm}
                  onNext={nextStep}
                  onBack={prevStep}
                />
              )}

              {/* ===============================================
                  STEP 3 — CATEGORY + SEARCH
              =============================================== */}

              {step === 3 && (
                <StepCategory
                  form={form}
                  updateForm={updateForm}
                  onNext={nextStep}
                  onBack={prevStep}
                  onSubmit={submitSearch}
                  isLoading={isSearching}
                />
              )}
            </div>
          </>
        )}
      </div>
    </main>
  );
}
