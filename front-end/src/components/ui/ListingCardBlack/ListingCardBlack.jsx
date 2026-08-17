import Image from "next/image";
import { useRouter } from "next/navigation";
import { MapPin, Heart, Crown, Zap } from "lucide-react";
import styles from "./ListingCardBlack.module.css";

export default function ListingCardBlack({ item, isFavorite, onFavoriteClick }) {
  const router = useRouter();

  return (
    <article
      className={styles.card}
      onClick={() => router.push(`/all-products/${item.id}`)}
    >
      {/* IMAGE */}
      <div className={styles.image}>
        <Image
          src={item.image}
          fill
          alt={item.title}
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 400px"
        />

        {/* BADGES */}
        <div className={styles.badges}>
          {item.status === "vip" && (
            <span className={`${styles.status} ${styles.vip}`}>
              <Crown />
              VIP
            </span>
          )}

          {item.status === "urgent" && (
            <span className={`${styles.status} ${styles.urgent}`}>
              <Zap />
              Срочно
            </span>
          )}

          <span className={styles.type}>{item.type}</span>
        </div>

        {/* FAVORITE */}
        <button
          type="button"
          className={styles.favorite}
          onClick={(e) => {
            e.stopPropagation();
            if (onFavoriteClick) onFavoriteClick(item);
          }}
        >
          <Heart fill={isFavorite ? "currentColor" : "none"} />
        </button>
      </div>

      {/* CONTENT */}
      <div className={styles.content}>
        <h2>{item.title}</h2>

        <div className={styles.location}>
          <MapPin />
          <span>{item.location}</span>
        </div>

        <div className={styles.details}>
          {item.rooms && (
            <span>
              {item.rooms} {item.rooms === 1 ? "комната" : "комнат"}
            </span>
          )}

          {item.area && <span>{item.area}</span>}
        </div>

        {/* BOTTOM */}
        <div className={styles.bottom}>
          <strong>{item.price}</strong>

          <button
            type="button"
            className={styles.more}
            onClick={(e) => {
              e.stopPropagation();
              router.push(`/all-products/${item.id}`);
            }}
          >
            Подробнее
          </button>
        </div>
      </div>
    </article>
  );
}
