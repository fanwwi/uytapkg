"use client";

import { useEffect, useState } from "react";
import { getMe } from "@/utils/api";

export default function useAuth() {
  const [user, setUser] = useState(null);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    const loadUser = async () => {
      try {
        const stored = localStorage.getItem("uytap_user");
        const token = localStorage.getItem("uytap_token") || null;

        if (!token) {
          setUser(null);
          setLoaded(true);
          return;
        }

        const currentUser = await getMe(token);
        setUser(currentUser);

        if (stored) {
          localStorage.setItem("uytap_user", JSON.stringify(currentUser));
        }
      } catch (error) {
        console.error("Auth check failed:", error);
        localStorage.removeItem("uytap_token");
        localStorage.removeItem("uytap_user");
        document.cookie = "uytap_token=; path=/; max-age=0";
        setUser(null);
      } finally {
        setLoaded(true);
      }
    };

    loadUser();

    // Listen for manual user updates dispatched from the app
    const handleUserUpdated = async (e) => {
      try {
        const token = localStorage.getItem("uytap_token");
        if (!token) return;
        const fresh = await getMe(token);
        setUser(fresh);
        localStorage.setItem("uytap_user", JSON.stringify(fresh));
      } catch (err) {
        console.error("Failed to refresh user after event:", err);
      }
    };

    window.addEventListener("uytap:user-updated", handleUserUpdated);

    return () => {
      window.removeEventListener("uytap:user-updated", handleUserUpdated);
    };
  }, []);

  return {
    user,
    isAuth: !!user,
    loaded,
  };
}
