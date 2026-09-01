import { randomUUID } from "crypto";
import { supabase } from "../config/db.js";
import { getImageExtension } from "../middleware/upload.js";

/** Имя публичного бакета в Supabase Storage (создать вручную в Dashboard). */
export const AVATARS_BUCKET = "avatars";

/**
 * Извлекает путь объекта внутри бакета из публичного URL Supabase Storage.
 */
export const extractStoragePath = (publicUrl, bucket = AVATARS_BUCKET) => {
  if (!publicUrl || typeof publicUrl !== "string") return null;
  const marker = `/object/public/${bucket}/`;
  const idx = publicUrl.indexOf(marker);
  if (idx === -1) return null;
  return publicUrl.slice(idx + marker.length).split("?")[0];
};

/**
 * Загружает буфер файла в бакет и возвращает публичный URL.
 */
export const uploadImageToStorage = async (objectPath, file) => {
  const { error } = await supabase.storage.from(AVATARS_BUCKET).upload(objectPath, file.buffer, {
    contentType: file.mimetype,
    upsert: false,
    cacheControl: "3600",
  });

  if (error) {
    throw new Error(error.message || "Не удалось загрузить файл в хранилище");
  }

  const { data } = supabase.storage.from(AVATARS_BUCKET).getPublicUrl(objectPath);
  return { publicUrl: data.publicUrl, objectPath };
};

/** Аватар авторизованного пользователя: `{userId}/{timestamp}.{ext}` */
export const uploadAvatarToStorage = async (userId, file) => {
  const ext = getImageExtension(file);
  const objectPath = `${userId}/${Date.now()}.${ext}`;
  return uploadImageToStorage(objectPath, file);
};

/** Публичная загрузка (регистрация и т.п.): `uploads/{uuid}.{ext}` */
export const uploadPublicImageToStorage = async (file) => {
  const ext = getImageExtension(file);
  const objectPath = `uploads/${randomUUID()}.${ext}`;
  return uploadImageToStorage(objectPath, file);
};

/**
 * Удаляет файл из Storage, если URL принадлежит нашему бакету.
 */
export const removeImageFromStorage = async (imageUrl) => {
  const objectPath = extractStoragePath(imageUrl);
  if (!objectPath) return;

  const { error } = await supabase.storage.from(AVATARS_BUCKET).remove([objectPath]);
  if (error) {
    console.warn("Не удалось удалить файл из Storage:", error.message);
  }
};

/**
 * Приватный бакет для документов верификации застройщиков (паспорта,
 * регистрационные документы и т.п.). Создать вручную в Supabase Dashboard
 * БЕЗ публичного доступа — в отличие от `avatars`, файлы отсюда должны
 * открываться только через подписанные ссылки (createSignedUrl).
 */
export const VERIFICATION_DOCS_BUCKET = "verification-docs";

/** Загружает документ верификации в приватный бакет: `{userId}/{uuid}.{ext}` */
export const uploadVerificationDocumentToStorage = async (userId, file) => {
  const ext = getImageExtension(file);
  const objectPath = `${userId}/${randomUUID()}.${ext}`;

  const { error } = await supabase.storage
    .from(VERIFICATION_DOCS_BUCKET)
    .upload(objectPath, file.buffer, {
      contentType: file.mimetype,
      upsert: false,
      cacheControl: "3600",
    });

  if (error) {
    throw new Error(error.message || "Не удалось загрузить документ в хранилище");
  }

  return { objectPath };
};

/** Подписанная временная ссылка для просмотра документа верификации (владелец/админ). */
export const getVerificationDocumentSignedUrl = async (objectPath, expiresInSeconds = 600) => {
  if (!objectPath || typeof objectPath !== "string") return null;

  const { data, error } = await supabase.storage
    .from(VERIFICATION_DOCS_BUCKET)
    .createSignedUrl(objectPath, expiresInSeconds);

  if (error) {
    console.warn("Не удалось создать подписанную ссылку на документ верификации:", error.message);
    return null;
  }

  return data?.signedUrl || null;
};

/** Удаляет документ верификации из приватного бакета по пути объекта. */
export const removeVerificationDocumentFromStorage = async (objectPath) => {
  if (!objectPath || typeof objectPath !== "string") return;

  const { error } = await supabase.storage.from(VERIFICATION_DOCS_BUCKET).remove([objectPath]);
  if (error) {
    console.warn("Не удалось удалить документ верификации из Storage:", error.message);
  }
};
