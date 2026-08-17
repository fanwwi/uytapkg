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
  country: "",
  region: "",
  city: "",
  settlement: "",
  district: "",

  dealType: "",
  rentalPeriod: "",

  category: "",

  priceFrom: "",
  priceTo: "",

  areaFrom: "",
  areaTo: "",

  address: "",
  latitude: null,
  longitude: null,

  listingType: "",

  searchMode: "normal",
};

export default function SearchFilter({ onSearch }) {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [form, setForm] = useState(initialForm);
  const [isSearching, setIsSearching] = useState(false);

  const totalSteps = 5;

  function updateForm(values) {
    setForm((prev) => ({
      ...prev,
      ...values,
    }));
  }

  function selectSearchMode(mode) {
    updateForm({
      searchMode: mode,
    });
  }

  const nextStep = () => {
    setStep((prev) => Math.min(prev + 1, totalSteps));
  };

  const prevStep = () => {
    setStep((prev) => Math.max(prev - 1, 1));
  };

  function handleSmartSearch(values) {
    const merged = { ...form, ...values };
    updateForm(merged);

    const params = new URLSearchParams();
    Object.entries(merged).forEach(([key, value]) => {
      if (value !== "" && value !== null && value !== undefined) {
        params.set(key, String(value));
      }
    });

    router.push(`/all-products?${params.toString()}`);
  }

  function submitSearch(searchData) {
    const finalForm = searchData || form;
    setIsSearching(true);

    if (onSearch) {
      onSearch(finalForm);
    }

    const params = new URLSearchParams();
    Object.entries(finalForm).forEach(([key, value]) => {
      if (value !== "" && value !== null && value !== undefined) {
        params.set(key, String(value));
      }
    });

    router.push(`/all-products?${params.toString()}`);
  }

  return (
    <main className={styles.page}>
      <div className={styles.container}>
        {/* SEARCH MODE */}
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

        {/* SMART SEARCH */}
        {form.searchMode === "smart" ? (
          <SmartSearch
            form={form}
            updateForm={handleSmartSearch}
            onNext={nextStep}
          />
        ) : (
          <>
            <StepProgress currentStep={step} totalSteps={totalSteps} />

            <div className={styles.card}>
              {step === 1 && (
                <StepLocation
                  form={form}
                  updateForm={updateForm}
                  onNext={nextStep}
                />
              )}

              {step === 2 && (
                <StepDeal
                  form={form}
                  updateForm={updateForm}
                  onNext={nextStep}
                  onBack={prevStep}
                />
              )}

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

              {step === 4 && (
                <div style={{ padding: 24 }}>
                  <button type="button" onClick={submitSearch} style={{ padding: "12px 20px", borderRadius: 10, cursor: "pointer" }}>
                    Показать результаты
                  </button>
                </div>
              )}
            </div>
          </>
        )}
      </div>
    </main>
  );
}
