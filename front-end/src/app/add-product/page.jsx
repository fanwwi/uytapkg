"use client";

import { useState } from "react";

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

  function submitProduct() {
    console.log("READY TO SEND TO BACKEND:", form);

    // Пока backend не готов.
    // Потом здесь будет:
    //
    // await createListing(form);

    alert("Объявление готово к отправке!");
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
            />
          )}
        </div>
      </div>
    </main>
  );
}
