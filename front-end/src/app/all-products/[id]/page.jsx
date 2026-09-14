"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { Home, ArrowLeft } from "lucide-react";

import {
  getListingById,
  getFavorites,
  addFavorite,
  removeFavorite,
} from "@/utils/api";

import { mapListingDetail } from "@/utils/mapListingData";

import ProductGallery from "./components/ProductGallery/ProductGallery";
import ProductSummary from "./components/ProductSummary/ProductSummary";
import ProductInfo from "./components/ProductInfo/ProductInfo";

import styles from "./ProductDetails.module.css";

export default function ProductDetails() {
  const router = useRouter();
  const { id } = useParams();

  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [currentImage, setCurrentImage] = useState(0);

  const [isFavorite, setIsFavorite] = useState(false);
  const [isFavoriteLoading, setIsFavoriteLoading] = useState(false);

  /*
   * ========================================================
   * LOAD PRODUCT
   * ========================================================
   */

  useEffect(() => {
    if (!id) return;

    let mounted = true;

    setLoading(true);
    setError(null);

    getListingById(id)
      .then((res) => {
        if (!mounted) return;

        if (res.success && res.data) {
          setProduct(mapListingDetail(res.data));
        } else {
          setError(res.message || "Объявление не найдено");
        }
      })
      .catch((err) => {
        console.error("Fetch listing details error:", err);

        if (mounted) {
          setError("Ошибка при загрузке данных объявления");
        }
      })
      .finally(() => {
        if (mounted) {
          setLoading(false);
        }
      });

    const token = localStorage.getItem("uytap_token");

    if (!token) {
      return () => {
        mounted = false;
      };
    }

    getFavorites(token)
      .then((res) => {
        if (!mounted) return;

        if (res.success && Array.isArray(res.data)) {
          const favorite = res.data.some(
            (listing) => String(listing.id) === String(id),
          );

          setIsFavorite(favorite);
        }
      })
      .catch((err) => {
        console.error("Error fetching favorites:", err);
      });

    return () => {
      mounted = false;
    };
  }, [id]);

  /*
   * ========================================================
   * FAVORITE
   * ========================================================
   */

  const handleFavoriteToggle = async () => {
    const token = localStorage.getItem("uytap_token");

    if (!token) {
      router.push("/login");
      return;
    }

    if (isFavoriteLoading) return;

    setIsFavoriteLoading(true);

    try {
      if (isFavorite) {
        const res = await removeFavorite(token, id);

        if (res.success) {
          setIsFavorite(false);
        }
      } else {
        const res = await addFavorite(token, id);

        if (res.success) {
          setIsFavorite(true);
        }
      }
    } catch (err) {
      console.error("Error toggling favorite:", err);
    } finally {
      setIsFavoriteLoading(false);
    }
  };

  /*
   * ========================================================
   * LOADING
   * ========================================================
   */

  if (loading) {
    return (
      <main className={styles.page}>
        <div className={styles.loadingState}>
          <div className={styles.loadingSpinner} />

          <h2>Загрузка объявления...</h2>

          <p>Получаем информацию об объекте</p>
        </div>
      </main>
    );
  }

  /*
   * ========================================================
   * ERROR
   * ========================================================
   */

  if (error || !product) {
    return (
      <main className={styles.page}>
        <div className={styles.errorState}>
          <div className={styles.errorIcon}>
            <Home size={28} />
          </div>

          <h2>Объявление не найдено</h2>

          <p>{error || "Не удалось загрузить данные."}</p>

          <button
            type="button"
            className={styles.primaryButton}
            onClick={() => router.push("/all-products")}
          >
            <ArrowLeft size={18} />
            Вернуться к объявлениям
          </button>
        </div>
      </main>
    );
  }

  /*
   * ========================================================
   * IMAGES
   * ========================================================
   */

  const images =
    Array.isArray(product.images) && product.images.length > 0
      ? product.images
      : [
          "https://images.unsplash.com/photo-1564013799919-ab600027ffc6?q=80&w=1200",
        ];

  return (
    <main className={styles.page}>
      <div className={styles.container}>
        {/* BACK */}

        <button
          type="button"
          className={styles.back}
          onClick={() => router.push("/all-products")}
        >
          <ArrowLeft size={18} />
          Вернуться к объявлениям
        </button>

        {/* TOP */}

        <section className={styles.top}>
          <ProductGallery
            product={product}
            images={images}
            currentImage={currentImage}
            setCurrentImage={setCurrentImage}
            isFavorite={isFavorite}
            isFavoriteLoading={isFavoriteLoading}
            onFavoriteToggle={handleFavoriteToggle}
          />

          <ProductSummary product={product} />
        </section>

        {/* INFO */}

        <ProductInfo product={product} router={router} />
      </div>
    </main>
  );
}
