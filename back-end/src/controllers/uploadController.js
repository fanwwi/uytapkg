import { uploadPublicImageToStorage } from "../utils/storage.js";

/**
 * POST /api/upload — публичная загрузка фото/логотипа.
 * Поле формы: `file`. Возвращает публичный URL для avatarUrl в register / PUT /me.
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
