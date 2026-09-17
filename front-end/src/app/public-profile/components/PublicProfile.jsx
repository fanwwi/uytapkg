"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import AgencyPublicProfile from "./AgencyPublicProfile/AgencyPublicProfile";
import DeveloperPublicProfile from "./DeveloperPublicProfile/DeveloperPublicProfile";
import PersonalPublicProfile from "./PersonalPublicProfile/PersonalPublicProfile";
import RealtorPublicProfile from "./RealtorPublicProfile/RealtorPublicProfile";
import {
  getUserPublicProfile,
  getFavorites,
  addFavorite,
  removeFavorite,
} from "@/utils/api";
import { useLanguage } from "@/context/LanguageContext";

export default function PublicProfile({ profileId }) {
  const { t } = useLanguage();

  const id = String(profileId);
  const router = useRouter();

  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [favIds, setFavIds] = useState(new Set());

  // Load profile data
  useEffect(() => {
    if (!id) return;

    setLoading(true);
    setError("");

    getUserPublicProfile(id)
      .then((res) => {
        if (res.success && res.user) {
          const userData = res.user;

          // Ensure lists are accessible in profile sub-objects for compatibility
          if (userData.profile) {
            userData.profile.complexes = userData.complexes || [];
            userData.profile.ads = userData.ads || [];
          }

          setUser(userData);
        } else {
          throw new Error(t("publicProfile.errors.load"));
        }
      })
      .catch((err) => {
        console.error("Error loading public profile:", err);
        setError(err.message || t("publicProfile.errors.fetch"));
      })
      .finally(() => {
        setLoading(false);
      });
  }, [id, t]);

  // Load user favorites
  useEffect(() => {
    const token = localStorage.getItem("uytap_token");
    if (!token) return;

    getFavorites(token)
      .then((res) => {
        if (res.success && res.data) {
          setFavIds(new Set(res.data.map((l) => l.id)));
        }
      })
      .catch((err) => console.error("Error loading favs:", err));
  }, []);

  const handleFavoriteClick = async (clickedItem) => {
    const token = localStorage.getItem("uytap_token");

    if (!token) {
      router.push("/login");
      return;
    }

    const isFav = favIds.has(clickedItem.id);

    try {
      if (isFav) {
        const res = await removeFavorite(token, clickedItem.id);

        if (res.success) {
          setFavIds((prev) => {
            const next = new Set(prev);
            next.delete(clickedItem.id);
            return next;
          });
        }
      } else {
        const res = await addFavorite(token, clickedItem.id);

        if (res.success) {
          setFavIds((prev) => {
            const next = new Set(prev);
            next.add(clickedItem.id);
            return next;
          });
        }
      }
    } catch (err) {
      console.error("Favorite toggle error in public profile:", err);
    }
  };

  if (loading) {
    return (
      <main
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          minHeight: "60vh",
          color: "#666",
        }}
      >
        <div>{t("publicProfile.loading")}</div>
      </main>
    );
  }

  if (error || !user) {
    return (
      <main
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          minHeight: "60vh",
          color: "#e53e3e",
          flexDirection: "column",
          gap: "10px",
        }}
      >
        <h1>{t("publicProfile.notFound.title")}</h1>

        <p>{error || t("publicProfile.notFound.description")}</p>

        <a
          href="/"
          style={{
            color: "#3182ce",
            textDecoration: "underline",
          }}
        >
          {t("publicProfile.notFound.home")}
        </a>
      </main>
    );
  }

  const commonProps = {
    profile: user,
    user,
    isOwnProfile: false,
    favIds,
    onFavoriteClick: handleFavoriteClick,
  };

  switch (user.type) {
    case "agency":
      return <AgencyPublicProfile {...commonProps} />;

    case "developer":
      return <DeveloperPublicProfile {...commonProps} />;

    case "realtor":
      return <RealtorPublicProfile {...commonProps} />;

    case "personal":
      return <PersonalPublicProfile {...commonProps} />;

    default:
      return (
        <main>
          <h1>{t("publicProfile.unknownType")}</h1>
        </main>
      );
  }
}
