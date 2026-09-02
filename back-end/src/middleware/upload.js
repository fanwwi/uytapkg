import multer from "multer";
import path from "path";

const HEIC_MIME = new Set(["image/heic", "image/heif"]);

/** Расширение файла по MIME или originalname */
export const getImageExtension = (file) => {
  const fromMime = {
    "image/jpeg": "jpg",
    "image/jpg": "jpg",
    "image/png": "png",
    "image/webp": "webp",
    "image/gif": "gif",
    "application/pdf": "pdf",
  };
  if (fromMime[file.mimetype]) return fromMime[file.mimetype];
  const ext = path.extname(file.originalname || "").replace(".", "").toLowerCase();
  return ext || "jpg";
};

const createImageFilter = (allowedMime, unsupportedMessage) => (req, file, cb) => {
  if (HEIC_MIME.has(file.mimetype)) {
    return cb(
      new Error(
        "Формат HEIC не поддерживается. Сконвертируйте фото в JPEG или PNG на устройстве."
      ),
      false
    );
  }
  if (!allowedMime.has(file.mimetype)) {
    return cb(new Error(unsupportedMessage), false);
  }
  cb(null, true);
};

const storage = multer.memoryStorage();

/** POST /api/auth/avatar — поле `avatar`, до 5 МБ, JPEG/PNG/WebP/GIF */
const AVATAR_MIME = new Set([
  "image/jpeg",
  "image/jpg",
  "image/png",
  "image/webp",
  "image/gif",
]);

export const uploadAvatar = multer({
  storage,
  fileFilter: createImageFilter(
    AVATAR_MIME,
    "Допустимы только изображения: JPEG, PNG, WebP, GIF"
  ),
  limits: { fileSize: 5 * 1024 * 1024 },
}).single("avatar");

/** POST /api/upload — поле `file`, до 8 МБ, JPEG/PNG/WebP */
const UPLOAD_MIME = new Set([
  "image/jpeg",
  "image/jpg",
  "image/png",
  "image/webp",
]);

export const uploadImageFile = multer({
  storage,
  fileFilter: createImageFilter(
    UPLOAD_MIME,
    "Допустимы только изображения: JPEG, PNG, WebP"
  ),
  limits: { fileSize: 8 * 1024 * 1024 },
}).single("file");

/** POST /api/auth/verify-documents — поле `document`, до 10 МБ, PDF/JPEG/PNG/WebP */
const VERIFICATION_DOC_MIME = new Set([
  "application/pdf",
  "image/jpeg",
  "image/jpg",
  "image/png",
  "image/webp",
]);

export const uploadVerificationDocument = multer({
  storage,
  fileFilter: createImageFilter(
    VERIFICATION_DOC_MIME,
    "Допустимы только файлы PDF, JPEG, PNG или WebP"
  ),
  limits: { fileSize: 10 * 1024 * 1024 },
}).single("document");

/** POST /api/admin/banners/upload-image — поле `image`, до 5 МБ, JPEG/PNG/WebP */
const BANNER_IMAGE_MIME = new Set([
  "image/jpeg",
  "image/jpg",
  "image/png",
  "image/webp",
]);

export const uploadBannerImage = multer({
  storage,
  fileFilter: createImageFilter(
    BANNER_IMAGE_MIME,
    "Допустимы только изображения: JPEG, PNG, WebP"
  ),
  limits: { fileSize: 5 * 1024 * 1024 },
}).single("image");
