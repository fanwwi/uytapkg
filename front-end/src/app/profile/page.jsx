"use client";

import { useEffect, useState } from "react";
import { getMe, getMyListings, getFavorites } from "@/utils/api";

import PersonalProfile from "./components/personalProfile/PersonalProfile";
import RealtorProfile from "./components/realtorProfile/RealtorProfile";
import AgencyProfile from "./components/agencyProfile/AgencyProfile";
import DeveloperProfile from "./components/developerProfile/DeveloperProfile";

export default function ProfilePage() {
  const [user, setUser] = useState(null);
  const [adsCount, setAdsCount] = useState(0);
  const [favoritesCount, setFavoritesCount] = useState(0);

  useEffect(() => {
    const loadUser = () => {
      const savedUser = JSON.parse(localStorage.getItem("uytap_user") || "null");
      console.log("PROFILE USER:", savedUser);
      setUser(savedUser);
    };

    loadUser();

    const token = localStorage.getItem("uytap_token");
    if (token) {
      getMe(token)
        .then((freshUser) => {
          if (freshUser && freshUser.id) {
            localStorage.setItem("uytap_user", JSON.stringify(freshUser));
            setUser(freshUser);
          }
        })
        .catch((err) => console.error("Error refreshing profile user data:", err));

      getMyListings(token)
        .then((res) => {
          if (res.success && res.data) {
            setAdsCount(res.data.length);
          }
        })
        .catch((err) => console.error("Error loading listings count:", err));

      getFavorites(token)
        .then((res) => {
          if (res.success && res.data) {
            setFavoritesCount(res.data.length);
          }
        })
        .catch((err) => console.error("Error loading favorites count:", err));
    }

    window.addEventListener("uytap:user-updated", loadUser);
    return () => {
      window.removeEventListener("uytap:user-updated", loadUser);
    };
  }, []);

  if (!user) {
    return <div>Загрузка...</div>;
  }

  switch (user.accountType) {
    case "realtor":
      return <RealtorProfile user={user} adsCount={adsCount} favoritesCount={favoritesCount} />;

    case "agency":
      return <AgencyProfile user={user} adsCount={adsCount} favoritesCount={favoritesCount} />;

    case "developer":
      return <DeveloperProfile user={user} adsCount={adsCount} favoritesCount={favoritesCount} />;

    case "personal":

    default:
      return <PersonalProfile user={user} adsCount={adsCount} favoritesCount={favoritesCount} />;
  }
}
