"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

import { getMe, getMyListings, getFavorites } from "@/utils/api";

import { getToken, getStoredUser, saveUser, clearAuth } from "@/utils/auth";

import PersonalProfile from "./components/personalProfile/PersonalProfile";
import RealtorProfile from "./components/realtorProfile/RealtorProfile";
import AgencyProfile from "./components/agencyProfile/AgencyProfile";
import DeveloperProfile from "./components/developerProfile/DeveloperProfile";
import LoadingScreen from "@/components/ui/loadingScreen/LoadingScreen";

export default function ProfilePage() {
  const router = useRouter();

  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  const [adsCount, setAdsCount] = useState(0);
  const [favoritesCount, setFavoritesCount] = useState(0);

  useEffect(() => {
    let mounted = true;

    const loadUser = async () => {
      /*
      |--------------------------------------------------------------------------
      | TOKEN
      |--------------------------------------------------------------------------
      */

      const token = getToken();

      /*
       * Если токена нет —
       * пользователь НЕ авторизован.
       *
       * Даже если старый uytap_user остался.
       */

      if (!token) {
        clearAuth();

        router.replace("/auth-required");

        return;
      }

      /*
      |--------------------------------------------------------------------------
      | CACHE
      |--------------------------------------------------------------------------
      */

      /*
       * Старого пользователя можно использовать
       * только при наличии токена.
       *
       * Это позволяет профилю появиться быстрее,
       * но затем он будет обновлен через getMe().
       */

      const cachedUser = getStoredUser();

      if (cachedUser && mounted) {
        setUser(cachedUser);
      }

      /*
      |--------------------------------------------------------------------------
      | ACTUAL USER
      |--------------------------------------------------------------------------
      */

      try {
        const freshUser = await getMe(token);

        /*
         * Backend не подтвердил пользователя.
         */
        if (!freshUser || !freshUser.id) {
          throw new Error("Пользователь не найден");
        }

        if (!mounted) return;

        /*
         * Обновляем cache
         */
        saveUser(freshUser);

        /*
         * Обновляем profile
         */
        setUser(freshUser);

        /*
        |--------------------------------------------------------------------------
        | LISTINGS
        |--------------------------------------------------------------------------
        */

        getMyListings(token)
          .then((response) => {
            if (!mounted) return;

            if (response?.success && Array.isArray(response.data)) {
              setAdsCount(response.data.length);
            }
          })
          .catch((error) => {
            console.error("Ошибка загрузки объявлений:", error);
          });

        /*
        |--------------------------------------------------------------------------
        | FAVORITES
        |--------------------------------------------------------------------------
        */

        getFavorites(token)
          .then((response) => {
            if (!mounted) return;

            if (response?.success && Array.isArray(response.data)) {
              setFavoritesCount(response.data.length);
            }
          })
          .catch((error) => {
            console.error("Ошибка загрузки избранного:", error);
          });
      } catch (error) {
        console.error("Ошибка проверки пользователя:", error);

        /*
         * Token больше невалидный.
         *
         * Полностью удаляем auth.
         */
        clearAuth();

        if (!mounted) return;

        setUser(null);

        router.replace("/auth-required");
      } finally {
        if (mounted) {
          setIsLoading(false);
        }
      }
    };

    loadUser();

    /*
    |--------------------------------------------------------------------------
    | AUTH CHANGED
    |--------------------------------------------------------------------------
    */

    const handleAuthChanged = () => {
      loadUser();
    };

    window.addEventListener("uytap:auth-changed", handleAuthChanged);

    return () => {
      mounted = false;

      window.removeEventListener("uytap:auth-changed", handleAuthChanged);
    };
  }, [router]);

  /*
  |--------------------------------------------------------------------------
  | LOADING
  |--------------------------------------------------------------------------
  */

  if (isLoading) {
    return <LoadingScreen />;
  }

  /*
  |--------------------------------------------------------------------------
  | NO USER
  |--------------------------------------------------------------------------
  */

  if (!user) {
    return null;
  }

  /*
  |--------------------------------------------------------------------------
  | PROFILE TYPE
  |--------------------------------------------------------------------------
  */

  switch (user.accountType) {
    case "realtor":
      return (
        <RealtorProfile
          user={user}
          adsCount={adsCount}
          favoritesCount={favoritesCount}
        />
      );

    case "agency":
      return (
        <AgencyProfile
          user={user}
          adsCount={adsCount}
          favoritesCount={favoritesCount}
        />
      );

    case "developer":
      return (
        <DeveloperProfile
          user={user}
          adsCount={adsCount}
          favoritesCount={favoritesCount}
        />
      );

    case "personal":
    default:
      return (
        <PersonalProfile
          user={user}
          adsCount={adsCount}
          favoritesCount={favoritesCount}
        />
      );
  }
}
