"use client";

import { useState } from "react";
import { Mic, Sparkles } from "lucide-react";

import styles from "./SmartSearch.module.css";

export default function SmartSearchVoice() {
  const [text, setText] = useState("");
  const [listening, setListening] = useState(false);

  const startVoice = () => {
    const SpeechRecognition =
      window.SpeechRecognition || window.webkitSpeechRecognition;

    if (!SpeechRecognition) {
      alert("Ваш браузер не поддерживает голосовой ввод");
      return;
    }

    const recognition = new SpeechRecognition();

    recognition.lang = "ru-RU";

    recognition.continuous = false;

    recognition.interimResults = false;

    recognition.onstart = () => {
      setListening(true);
    };

    recognition.onend = () => {
      setListening(false);
    };

    recognition.onresult = (event) => {
      const result = event.results[0][0].transcript;

      setText(result);

      console.log("AI SEARCH REQUEST:", result);
    };

    recognition.start();
  };

  return (
    <div className={styles.wrapper}>
      <div className={styles.header}>
        <Sparkles />

        <span>Умный поиск</span>
      </div>

      <div className={styles.searchBox}>
        <input
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="
          Например: хочу дом до 300 000$ с ремонтом
          "
        />

        <button
          className={listening ? styles.listening : ""}
          onClick={startVoice}
        >
          <Mic />
        </button>
      </div>

      <p>Опишите что ищете — AI подберёт параметры автоматически</p>
    </div>
  );
}
