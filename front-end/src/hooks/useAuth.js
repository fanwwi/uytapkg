"use client";

import { useEffect, useState } from "react";

export default function useAuth() {
  const [user, setUser] = useState(null);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    const stored = localStorage.getItem("uytap_user");
    const token = document.cookie.includes("uytap_token");

    if (stored && token) {
      setUser(JSON.parse(stored));
    }

    setLoaded(true);
  }, []);

  return {
    user,
    isAuth: !!user,
    loaded,
  };
}
