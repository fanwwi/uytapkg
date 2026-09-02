import { readFileSync } from "fs";
import path from "path";
import { fileURLToPath } from "url";
import sharp from "sharp";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const LOGO_PATH = path.join(__dirname, "..", "assets", "watermark-logo.png");

// Логотип на белом... нет, на прозрачном фоне (alpha=0 за пределами
// иконки/текста) — читаем один раз и держим в памяти, накладываем на
// каждое фото при загрузке.
const logoBuffer = readFileSync(LOGO_PATH);

const WATERMARK_OPACITY = 0.55;
// Ширина водяного знака — доля от ширины фотографии.
const WATERMARK_WIDTH_RATIO = 0.22;
const WATERMARK_MIN_WIDTH = 60;
const WATERMARK_MAX_WIDTH = 420;
// Отступ от края — доля от ширины фотографии.
const MARGIN_RATIO = 0.03;

let cachedLogoWidth = null;
// Кэш готового полупрозрачного PNG водяного знака по ширине в пикселях —
// на одно объявление обычно загружают несколько фото одинакового размера
// (или близкого), это экономит повторный ресайз/пересчёт альфы.
const resizedLogoCache = new Map();

async function getResizedLogo(targetWidth) {
  if (resizedLogoCache.has(targetWidth)) {
    return resizedLogoCache.get(targetWidth);
  }

  const { data, info } = await sharp(logoBuffer)
    .resize({ width: targetWidth })
    .ensureAlpha()
    .raw()
    .toBuffer({ resolveWithObject: true });

  // Снижаем непрозрачность: линейно уменьшаем альфа-канал вместо того,
  // чтобы накладывать полностью непрозрачный логотип — так водяной знак
  // не перекрывает фото объявления целиком.
  for (let i = 3; i < data.length; i += 4) {
    data[i] = Math.round(data[i] * WATERMARK_OPACITY);
  }

  const png = await sharp(data, {
    raw: { width: info.width, height: info.height, channels: 4 },
  })
    .png()
    .toBuffer();

  const result = { png, width: info.width, height: info.height };

  // Кэш маленький и ограниченный (ширины водяного знака укладываются в
  // WATERMARK_MIN_WIDTH..WATERMARK_MAX_WIDTH), но на всякий случай не даём
  // ему расти бесконечно при очень разных размерах фото.
  if (resizedLogoCache.size > 50) resizedLogoCache.clear();
  resizedLogoCache.set(targetWidth, result);

  return result;
}

/**
 * Накладывает полупрозрачный водяной знак (лого UyTap) в правый нижний
 * угол изображения. Возвращает новый буфер — исходный не изменяется.
 *
 * mimetype используется, чтобы сохранить исходный формат на выходе
 * (jpeg/png/webp); всё остальное трактуем как jpeg.
 */
export async function applyWatermark(buffer, mimetype) {
  // limitInputPixels — защита от decompression-bomb (маленький файл,
  // распаковывающийся в гигантское изображение и съедающий память/CPU).
  // .rotate() без аргументов — авто-поворот по EXIF-тегу ориентации
  // (важно для фото с телефона: иначе водяной знак окажется не в том
  // углу после того, как браузер/клиент повернёт изображение).
  const image = sharp(buffer, { limitInputPixels: 50_000_000 }).rotate();
  const metadata = await image.metadata();

  const width = metadata.width || 0;
  const height = metadata.height || 0;

  // Слишком маленькое изображение — пропускаем водяной знак, чтобы не
  // получить нечитаемое пятно поверх миниатюры.
  if (width < 200 || height < 200) {
    return buffer;
  }

  const targetWidth = Math.round(
    Math.min(
      WATERMARK_MAX_WIDTH,
      Math.max(WATERMARK_MIN_WIDTH, width * WATERMARK_WIDTH_RATIO)
    )
  );

  const logo = await getResizedLogo(targetWidth);
  const margin = Math.round(width * MARGIN_RATIO);

  const left = Math.max(0, width - logo.width - margin);
  const top = Math.max(0, height - logo.height - margin);

  let pipeline = image.composite([{ input: logo.png, left, top }]);

  if (mimetype === "image/png") {
    pipeline = pipeline.png();
  } else if (mimetype === "image/webp") {
    pipeline = pipeline.webp({ quality: 90 });
  } else {
    pipeline = pipeline.jpeg({ quality: 90 });
  }

  return pipeline.toBuffer();
}

// Проверка ширины лого на всякий случай (не блокирует запуск, только для
// отладки — если ассет вдруг заменят на битый файл).
export async function warmUpWatermark() {
  if (cachedLogoWidth !== null) return cachedLogoWidth;
  const meta = await sharp(logoBuffer).metadata();
  cachedLogoWidth = meta.width;
  return cachedLogoWidth;
}
