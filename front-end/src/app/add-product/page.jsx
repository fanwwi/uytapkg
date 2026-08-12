"use client";

import { useState } from "react";

import { createListing } from "@/utils/api";

import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import StepProgress from "./components/StepProgress/StepProgress";
import StepLocation from "./components/StepLocation/StepLocation";
import StepDeal from "./components/StepDeal/StepDeal";
import StepCategory from "./components/StepCategory/StepCategory";
import StepAddress from "./components/StepAddress/StepAddress";
import StepListingType from "./components/StepListingType/StepListingType";

import styles from "./AddProduct.module.css";

const initialForm = {
  country: "",
  region: "",
  city: "",

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
};

export default function AddProductPage() {
  const [step, setStep] = useState(1);
  const [form, setForm] = useState(initialForm);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitMessage, setSubmitMessage] = useState("");

  const totalSteps = 5;

  function updateForm(values) {
    setForm((prev) => ({
      ...prev,
      ...values,
    }));
  }

  function nextStep() {
    setStep((prev) => Math.min(prev + 1, totalSteps));
  }

  function prevStep() {
    setStep((prev) => Math.max(prev - 1, 1));
  }

  async function submitProduct() {
    setIsSubmitting(true);
    setSubmitMessage("");

    try {
      const token = localStorage.getItem("uytap_token");
      if (!token) {
        throw new Error("Сначала войдите в аккаунт");
      }

      const derivedPrice = Number(form.priceFrom || form.priceTo || 100000);
      const derivedTitle = `${form.dealType === "sale" ? "Продажа" : "Аренда"} ${form.category || "недвижимости"}`.trim();
      const derivedDescription = `Объявление для ${form.city || form.region || "региона"}. Адрес: ${form.address || "не указан"}`;

      const payload = {
        title: derivedTitle,
        description: derivedDescription,
        propertyType: form.category || "apartment",
        dealType: form.dealType || "sale",
        rentPeriod: form.rentalPeriod || null,
        region: form.region || "bishkek",
        city: form.city || "Бишкек",
        district: form.region || null,
        microdistrict: null,
        address: form.address || null,
        price: derivedPrice,
        currency: "KGS",
        area: Number(form.areaFrom || form.areaTo || 0) || null,
        rooms: null,
        floor: null,
        totalFloors: null,
        isResort: false,
        resortFilters: {},
        features: {},
        photos: [],
      };

      const result = await createListing(token, payload);
      setSubmitMessage(result.message || "Объявление успешно опубликовано");
      setForm(initialForm);
      setStep(1);
    } catch (error) {
      setSubmitMessage(error.message || "Не удалось опубликовать объявление");
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <main className={styles.page}>
      <div className={styles.container}>
        <Link href="/" className={styles.homeButton}>
          <ArrowLeft size={17} />
          <span>На главную</span>
        </Link>
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
            />
          )}

          {step === 4 && (
            <StepAddress
              form={form}
              updateForm={updateForm}
              onNext={nextStep}
              onBack={prevStep}
            />
          )}

          {step === 5 && (
            <StepListingType
              form={form}
              updateForm={updateForm}
              onBack={prevStep}
              onSubmit={submitProduct}
              isSubmitting={isSubmitting}
            />
          )}

          {submitMessage ? (
            <p style={{ marginTop: 16, color: submitMessage.includes("успешно") ? "#1f9d5b" : "#c0392b" }}>
              {submitMessage}
            </p>
          ) : null}
        </div>
      </div>
    </main>
  );
}
