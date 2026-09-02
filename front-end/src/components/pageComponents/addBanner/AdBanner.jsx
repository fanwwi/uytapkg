"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

import styles from "./AdBanner.module.css";
import { getBanners } from "@/utils/api";

const ROTATE_INTERVAL_MS = 6000;

export default function AdBanner() {
  const [banners, setBanners] = useState([]);
  const [activeIndex, setActiveIndex] = useState(0);

  useEffect(() => {
    let cancelled = false;

    getBanners()
      .then((data) => {
        if (!cancelled) setBanners(data);
      })
      .catch((err) => {
        console.error("Ошибка загрузки баннеров:", err);
      });

    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    if (banners.length < 2) return undefined;

    const timer = setInterval(() => {
      setActiveIndex((prev) => (prev + 1) % banners.length);
    }, ROTATE_INTERVAL_MS);

    return () => clearInterval(timer);
  }, [banners.length]);

  if (banners.length === 0) return null;

  const banner = banners[activeIndex % banners.length];

  const image = (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={banner.imageUrl}
      alt={banner.title}
      className={styles.image}
      style={{
        objectPosition: `${banner.imagePositionX ?? 50}% ${banner.imagePositionY ?? 50}%`,
      }}
    />
  );

  const isInternalLink = banner.link && banner.link.startsWith("/");

  return (
    <section className={styles.banner}>
      {banner.link ? (
        isInternalLink ? (
          <Link href={banner.link} aria-label={banner.title}>
            {image}
          </Link>
        ) : (
          <a
            href={banner.link}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={banner.title}
          >
            {image}
          </a>
        )
      ) : (
        image
      )}

      <span className={styles.label}>Реклама</span>

      {banners.length > 1 && (
        <div className={styles.dots}>
          {banners.map((item, index) => (
            <button
              key={item.id}
              type="button"
              className={index === activeIndex ? styles.dotActive : styles.dot}
              aria-label={`Показать баннер ${index + 1}`}
              onClick={() => setActiveIndex(index)}
            />
          ))}
        </div>
      )}
    </section>
  );
}
