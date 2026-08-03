"use client";

import { useState } from "react";
import { Mic, Sparkles, Search, Loader2 } from "lucide-react";
import { aiSearchQuery } from "@/utils/api";

import styles from "./SmartSearch.module.css";

export default function SmartSearchVoice({ onAiParsed }) {
  const [text, setText] = useState("");
  const [listening, setListening] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleAiSearch = async (queryText) => {
    const textToSearch = queryText || text;
    if (!textToSearch.trim()) return;

    setLoading(true);
    try {
      const result = await aiSearchQuery(textToSearch);
      if (result.success && onAiParsed) {
        onAiParsed(result.filters);
      }
    } catch (err) {
      console.error("AI Search Error:", err);
    } finally {
      setLoading(false);
    }
  };

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
      handleAiSearch(result);
    };

    recognition.start();
  };

  return (
    <div className={styles.wrapper}>
      <div className={styles.header}>
        <Sparkles />
        <span>Умный поиск (AI)</span>
      </div>

      <div className={styles.searchBox}>
        <input
          value={text}
          onChange={(e) => setText(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleAiSearch()}
          placeholder="Например: хочу дом до 300 000$ с ремонтом"
        />

        <button
          className={listening ? styles.listening : ""}
          onClick={startVoice}
          title="Голосовой поиск"
        >
          <Mic />
        </button>

        <button
          style={{ background: "#4f46e5", color: "#fff", padding: "8px 14px", borderRadius: "10px", border: "none", cursor: "pointer" }}
          onClick={() => handleAiSearch()}
          disabled={loading}
        >
          {loading ? <Loader2 className="animate-spin" size={18} /> : <Search size={18} />}
        </button>
      </div>

      <p>Опишите что ищете — AI подберёт параметры автоматически</p>
    </div>
  );
}
