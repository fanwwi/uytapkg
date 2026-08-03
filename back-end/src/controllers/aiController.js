import dotenv from "dotenv";
dotenv.config();

// =======================================================
// Умный Поиск и Генерация Описания с Gemini AI
// =======================================================

export const aiSearch = async (req, res) => {
  try {
    const { prompt } = req.body;

    if (!prompt || !prompt.trim()) {
      return res.status(400).json({ success: false, message: "Введите текстовый или голосовой запрос" });
    }

    const apiKey = process.env.GEMINI_API_KEY;

    // Если есть реальный ключ Gemini API — делаем запрос к нейросети
    if (apiKey) {
      try {
        const response = await fetch(
          `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`,
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              contents: [
                {
                  parts: [
                    {
                      text: `Вывлеки из текста параметры поиска недвижимости в JSON формате (только чисто валидный JSON без markdown):
{
  "region": "Бишкек" или "Иссык-Кульская область" или null,
  "district": "район или улица или null",
  "propertyType": "apartment" | "house" | "land" | "commercial" | "garage" | null,
  "dealType": "sale" | "rent" | null,
  "rooms": число или null,
  "maxPrice": число или null,
  "currency": "KGS" или "USD"
}
Текст запроса: "${prompt}"`,
                    },
                  ],
                },
              ],
            }),
          }
        );

        const data = await response.json();
        const rawText = data?.candidates?.[0]?.content?.parts?.[0]?.text;

        if (rawText) {
          const cleanJson = rawText.replace(/```json|```/g, "").trim();
          const parsed = JSON.parse(cleanJson);
          return res.json({
            success: true,
            filters: parsed,
            source: "gemini-api",
          });
        }
      } catch (geminiError) {
        console.warn("Gemini API call warning, fallback to rule parser:", geminiError.message);
      }
    }

    // Резервный локальный разборщик (если ключа нет или API временно недоступно)
    const lower = prompt.toLowerCase();
    const fallbackFilters = {
      region: lower.includes("иссык") || lower.includes("чолпон") ? "Иссык-Кульская область" : "Бишкек",
      district: lower.includes("акунк") ? "Ахунбаева" : lower.includes("центр") ? "Центр" : null,
      propertyType: lower.includes("дом") ? "house" : lower.includes("участок") ? "land" : "apartment",
      dealType: lower.includes("аренд") || lower.includes("снять") ? "rent" : "sale",
      rooms: lower.includes("двушк") || lower.includes("2") ? 2 : lower.includes("трешк") || lower.includes("3") ? 3 : 1,
      maxPrice: lower.includes("40") ? 40000 : lower.includes("300") ? 300000 : null,
      currency: lower.includes("$") || lower.includes("доллар") ? "USD" : "KGS",
    };

    return res.json({
      success: true,
      filters: fallbackFilters,
      source: "local-parser",
    });
  } catch (error) {
    console.error("AI Search Controller Error:", error);
    return res.status(500).json({ success: false, message: "Ошибка обработки AI запроса" });
  }
};

export const aiGenerateDescription = async (req, res) => {
  try {
    const { details } = req.body;
    const apiKey = process.env.GEMINI_API_KEY;

    if (apiKey) {
      try {
        const response = await fetch(
          `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`,
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              contents: [
                {
                  parts: [
                    {
                      text: `На основе кратких характеристик создай продающее описание недвижимости на русском и кыргызском языках. Верни в формате JSON {"ru": "...", "kg": "..."}.
Характеристики: ${details}`,
                    },
                  ],
                },
              ],
            }),
          }
        );

        const data = await response.json();
        const rawText = data?.candidates?.[0]?.content?.parts?.[0]?.text;
        if (rawText) {
          const cleanJson = rawText.replace(/```json|```/g, "").trim();
          const parsed = JSON.parse(cleanJson);
          return res.json({ success: true, generatedText: parsed });
        }
      } catch (err) {
        console.warn("Gemini description error:", err.message);
      }
    }

    return res.json({
      success: true,
      generatedText: {
        ru: `Отличный объект недвижимости. ${details || ""}`,
        kg: `Кыймылсыз мүлк объектиси. ${details || ""}`,
      },
    });
  } catch (error) {
    console.error("AI Generate Error:", error);
    return res.status(500).json({ success: false, message: "Ошибка генерации описания" });
  }
};
