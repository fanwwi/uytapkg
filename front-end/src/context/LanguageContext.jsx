"use client";

import { createContext, useContext, useEffect, useState } from "react";

import ru from "@/translations/ru";
import ky from "@/translations/ky";

const LanguageContext = createContext(null);

const translations = {
  ru,
  ky,
};

const DEFAULT_LANGUAGE = "ru";
const STORAGE_KEY = "uytap_language";

export default function LanguageProvider({ children }) {
  const [language, setLanguage] = useState(DEFAULT_LANGUAGE);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    const savedLanguage = localStorage.getItem(STORAGE_KEY);

    if (savedLanguage === "ru" || savedLanguage === "ky") {
      setLanguage(savedLanguage);
    }

    setMounted(true);
  }, []);

  useEffect(() => {
    if (!mounted) return;

    localStorage.setItem(STORAGE_KEY, language);

    window.dispatchEvent(
      new CustomEvent("uytap:language-changed", {
        detail: language,
      }),
    );
  }, [language, mounted]);

  const changeLanguage = (newLanguage) => {
    if (!translations[newLanguage]) return;

    setLanguage(newLanguage);
  };

  const t = (key) => {
    const keys = key.split(".");

    let value = translations[language];

    for (const part of keys) {
      value = value?.[part];
    }

    if (value === undefined) {
      value = translations.ru;

      for (const part of keys) {
        value = value?.[part];
      }
    }

    return value ?? key;
  };

  return (
    <LanguageContext.Provider
      value={{
        language,
        changeLanguage,
        t,
        isRussian: language === "ru",
        isKyrgyz: language === "ky",
      }}
    >
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);

  if (!context) {
    throw new Error("useLanguage must be used inside LanguageProvider");
  }

  return context;
}
