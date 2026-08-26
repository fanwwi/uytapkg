"use client";

import { useEffect, useRef, useState } from "react";
import { Mic, MicOff, Sparkles, Search, Loader2 } from "lucide-react";

import styles from "./SmartSearch.module.css";

const SAFE_MAX_TEXT_LENGTH = 2000;

export default function SmartSearch({ form, updateForm, onNext }) {
  const [text, setText] = useState("");
  const [isListening, setIsListening] = useState(false);
  const [isSearching, setIsSearching] = useState(false);
  const [error, setError] = useState("");

  const recognitionRef = useRef(null);

  useEffect(() => {
    if (typeof window === "undefined") return;

    const SpeechRecognition =
      window.SpeechRecognition || window.webkitSpeechRecognition;

    if (!SpeechRecognition) {
      return;
    }

    const recognition = new SpeechRecognition();

    recognition.lang = "ru-RU";
    recognition.continuous = false;
    recognition.interimResults = true;

    recognition.onstart = () => {
      setIsListening(true);
      setError("");
    };

    recognition.onresult = (event) => {
      let transcript = "";

      for (let i = event.resultIndex; i < event.results.length; i++) {
        transcript += event.results[i][0].transcript;
      }

      setText(transcript);
    };

    recognition.onerror = (event) => {
      console.error("Speech recognition error:", event);

      setIsListening(false);

      if (event.error === "not-allowed") {
        setError("Разрешите доступ к микрофону в настройках браузера.");
      } else {
        setError("Не удалось распознать голос.");
      }
    };

    recognition.onend = () => {
      setIsListening(false);
    };

    recognitionRef.current = recognition;

    return () => {
      recognition.stop();
    };
  }, []);

  function toggleVoice() {
    if (!recognitionRef.current) {
      setError("Ваш браузер не поддерживает голосовой ввод.");
      return;
    }

    if (isListening) {
      recognitionRef.current.stop();
      setIsListening(false);
      return;
    }

    setError("");
    recognitionRef.current.start();
  }

  async function handleSearch() {
    const trimmedText = text.trim();

    if (!trimmedText) {
      setError("Опишите, какую недвижимость вы ищете.");
      return;
    }

    if (trimmedText.length > SAFE_MAX_TEXT_LENGTH) {
      setError("Запрос слишком длинный. Сократите его до 2000 символов.");
      return;
    }

    try {
      setIsSearching(true);
      setError("");

      const response = await fetch("/api/smart-search", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          query: trimmedText,
        }),
      });

      const data = await response.json().catch(() => ({}));

      if (!response.ok || !data?.success) {
        throw new Error(data?.message || "Smart search failed");
      }

      if (data.filters && typeof data.filters === "object") {
        const categoryMapping = {
          apartment: "Квартира",
          house: "Дом",
          land: "Участок",
          commercial: "Коммерция",
          room: "Комнаты",
          garage: "Паркинг/гараж"
        };

        const dealTypeMapping = {
          sale: "Продажа",
          rent: "Сниму в аренду"
        };

        const regionMapping = {
          "Бишкек": "BISHKEK",
          "Иссык-Кульская область": "ISSYK_KUL",
          "Иссык-Куль": "ISSYK_KUL",
          "Чуйская область": "CHUY",
          "Ошская область": "OSH",
          "Джалал-Абадская область": "JALAL_ABAD",
          "Баткенская область": "BATKEN",
          "Нарынская область": "NARYN",
          "Таласская область": "TALAS"
        };

        const mapped = {};
        const f = data.filters;
        if (f.region) {
          const mappedReg = regionMapping[f.region] || f.region;
          mapped.region = mappedReg;
          if (mappedReg === "ISSYK_KUL") {
            mapped.city = "Иссык-Куль";
          } else if (mappedReg === "BISHKEK") {
            mapped.city = "Бишкек";
          } else if (mappedReg === "OSH") {
            mapped.city = "Ош";
          }
        }
        if (f.city) {
          mapped.city = f.city;
        }
        if (f.district) mapped.district = f.district;
        if (f.propertyType) {
          mapped.category = categoryMapping[f.propertyType] || "";
        }
        if (f.dealType) {
          mapped.dealType = dealTypeMapping[f.dealType] || "";
        }
        if (f.maxPrice) mapped.priceTo = String(f.maxPrice);
        if (f.rooms) mapped.rooms = Number(f.rooms) >= 4 ? "4+" : String(f.rooms);

        const cleanMapped = Object.fromEntries(
          Object.entries(mapped).filter(([, value]) => value !== null && value !== undefined && value !== "")
        );

        updateForm(cleanMapped);
        setError("");
        onNext?.();
      } else {
        setError("AI не вернул подходящие параметры поиска.");
      }
    } catch (err) {
      console.error("Smart search error:", err);
      setError(err instanceof Error ? err.message : "Не удалось выполнить умный поиск. Попробуйте ещё раз.");
    } finally {
      setIsSearching(false);
    }
  }

  return (
    <div className={styles.smartSearch}>
      <div className={styles.header}>
        <div className={styles.icon}>
          <Sparkles size={22} />
        </div>

        <div>
          <span className={styles.badge}>AI SEARCH</span>

          <h1>Опишите, что вы ищете</h1>

          <p>
            Можно написать или рассказать своими словами. AI сам определит
            нужные параметры.
          </p>
        </div>
      </div>

      <div className={styles.searchBox}>
        <textarea
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder={
            "Например: «Ищу двухкомнатную квартиру в Бишкеке до 80 тысяч долларов, площадью от 50 до 80 м², с ремонтом и парковкой»"
          }
          rows={5}
        />

        <button
          type="button"
          className={`${styles.voiceButton} ${
            isListening ? styles.listening : ""
          }`}
          onClick={toggleVoice}
          aria-label={isListening ? "Остановить запись" : "Голосовой ввод"}
        >
          {isListening ? <MicOff size={21} /> : <Mic size={21} />}
        </button>
      </div>

      {isListening && (
        <div className={styles.listeningStatus}>
          <span className={styles.pulse} />

          <span>Слушаю... Говорите, что вы ищете</span>
        </div>
      )}

      {error && <div className={styles.error}>{error}</div>}

      <button
        type="button"
        className={styles.searchButton}
        disabled={isSearching || !text.trim()}
        onClick={handleSearch}
      >
        {isSearching ? (
          <>
            <Loader2 size={19} className={styles.spinner} />
            Анализирую запрос...
          </>
        ) : (
          <>
            <Search size={19} />
            Найти подходящие объявления
          </>
        )}
      </button>

      <div className={styles.examples}>
        <span>Например:</span>

        <button
          type="button"
          onClick={() =>
            setText(
              "Ищу 2-комнатную квартиру в Бишкеке до 80000 долларов, площадью от 50 до 80 квадратных метров, с хорошим ремонтом",
            )
          }
        >
          Квартира в Бишкеке
        </button>

        <button
          type="button"
          onClick={() =>
            setText(
              "Нужен частный дом в Бишкеке или рядом, до 150000 долларов, минимум 4 комнаты, с отоплением и водой",
            )
          }
        >
          Частный дом
        </button>
      </div>
    </div>
  );
}
