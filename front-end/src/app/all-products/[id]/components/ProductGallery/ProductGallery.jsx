"use client";

import Image from "next/image";
import {
  ChevronLeft,
  ChevronRight,
  Heart,
  Sparkles,
  Flame,
} from "lucide-react";

import styles from "./ProductGallery.module.css";

export default function ProductGallery({
  product,
  images,
  currentImage,
  setCurrentImage,
  isFavorite,
  isFavoriteLoading,
  onFavoriteToggle,
}) {
  const nextImage = () => {
    if (!images.length) return;

    setCurrentImage((prev) => (prev === images.length - 1 ? 0 : prev + 1));
  };

  const previousImage = () => {
    if (!images.length) return;

    setCurrentImage((prev) => (prev === 0 ? images.length - 1 : prev - 1));
  };

  const currentImageSrc = images[currentImage] || images[0];

  return (
    <div className={styles.gallery}>
      <div className={styles.mainImage}>
        <Image
          src={currentImageSrc}
          alt={product.title || "Объект недвижимости"}
          fill
          priority
          sizes="(max-width: 900px) 100vw, 65vw"
        />

        <div className={styles.imageOverlay} />

        {/* BADGES */}

        <div className={styles.badges}>
          {product.status === "vip" && (
            <span className={`${styles.badge} ${styles.vip}`}>
              <Sparkles size={14} />
              VIP
            </span>
          )}

          {product.status === "urgent" && (
            <span className={`${styles.badge} ${styles.urgent}`}>
              <Flame size={14} />
              Срочно
            </span>
          )}

          {product.type && (
            <span className={styles.categoryBadge}>{product.type}</span>
          )}
        </div>

        {/* FAVORITE */}

        <button
          type="button"
          className={`${styles.favorite} ${
            isFavorite ? styles.favoriteActive : ""
          }`}
          onClick={onFavoriteToggle}
          disabled={isFavoriteLoading}
          aria-label={
            isFavorite ? "Удалить из избранного" : "Добавить в избранное"
          }
        >
          <Heart size={23} fill={isFavorite ? "currentColor" : "none"} />
        </button>

        {/* ARROWS */}

        {images.length > 1 && (
          <>
            <button
              type="button"
              className={`${styles.galleryArrow} ${styles.left}`}
              onClick={previousImage}
              aria-label="Предыдущее фото"
            >
              <ChevronLeft />
            </button>

            <button
              type="button"
              className={`${styles.galleryArrow} ${styles.right}`}
              onClick={nextImage}
              aria-label="Следующее фото"
            >
              <ChevronRight />
            </button>
          </>
        )}

        {/* COUNTER */}

        <div className={styles.imageCounter}>
          {currentImage + 1} / {images.length}
        </div>
      </div>

      {/* THUMBNAILS */}

      {images.length > 1 && (
        <>
          <div className={styles.thumbnails}>
            {images.map((image, index) => (
              <button
                key={`${image}-${index}`}
                type="button"
                className={`${styles.thumbnail} ${
                  index === currentImage ? styles.thumbnailActive : ""
                }`}
                onClick={() => setCurrentImage(index)}
              >
                <Image
                  src={image}
                  alt={`Фото ${index + 1}`}
                  fill
                  sizes="100px"
                />
              </button>
            ))}
          </div>

          <div className={styles.dots}>
            {images.map((_, index) => (
              <button
                key={index}
                type="button"
                className={`${styles.dot} ${
                  index === currentImage ? styles.dotActive : ""
                }`}
                onClick={() => setCurrentImage(index)}
                aria-label={`Фото ${index + 1}`}
              />
            ))}
          </div>
        </>
      )}
    </div>
  );
}
