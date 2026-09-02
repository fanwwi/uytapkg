import { uploadPublicImageToStorage } from "../utils/storage.js";
import { applyWatermark } from "../utils/watermark.js";

/**
 * POST /api/upload — публичная загрузка фото/логотипа.
 * Поле формы: `file`. Возвращает публичный URL для avatarUrl в register / PUT /me.
 *
 * Без водяного знака — используется, например, для логотипов ЖК и аватаров.
 * Для фото объявлений используется uploadListingPhoto ниже.
 */
export const uploadImage = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: "Файл не передан. Ожидается поле формы `file`.",
      });
    }

    const { publicUrl } = await uploadPublicImageToStorage(req.file);

    return res.json({
      success: true,
      url: publicUrl,
    });
  } catch (error) {
    console.error("Upload Image Error:", error);
    return res.status(500).json({
      success: false,
      message: error.message || "Ошибка сервера при загрузке файла",
    });
  }
};

/**
 * POST /api/upload/listing-photo — загрузка фото объявления.
 * Поле формы: `file`. Перед сохранением всегда накладывает водяной знак
 * (лого UyTap) — это отдельный от uploadImage эндпоинт специально для
 * того, чтобы наложение нельзя было обойти клиентским флагом: тип
 * загрузки определяется тем, какой URL вызван, а не телом запроса.
 */
export const uploadListingPhoto = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: "Файл не передан. Ожидается поле формы `file`.",
      });
    }

    let watermarkedBuffer;
    try {
      watermarkedBuffer = await applyWatermark(req.file.buffer, req.file.mimetype);
    } catch (watermarkError) {
      console.error("Apply Watermark Error:", watermarkError);
      return res.status(400).json({
        success: false,
        message: "Не удалось обработать изображение. Файл повреждён или имеет неподдерживаемый формат.",
      });
    }

    const { publicUrl } = await uploadPublicImageToStorage({
      ...req.file,
      buffer: watermarkedBuffer,
    });

    return res.json({
      success: true,
      url: publicUrl,
    });
  } catch (error) {
    console.error("Upload Listing Photo Error:", error);
    return res.status(500).json({
      success: false,
      message: error.message || "Ошибка сервера при загрузке файла",
    });
  }
};
