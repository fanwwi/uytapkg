"use client";

import { useEffect, useState } from "react";

import PersonalProfile from "./components/personalProfile/PersonalProfile";
import RealtorProfile from "./components/realtorProfile/RealtorProfile";
import AgencyProfile from "./components/agencyProfile/AgencyProfile";
import DeveloperProfile from "./components/developerProfile/DeveloperProfile";

export default function ProfilePage() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const loadUser = () => {
      const savedUser = JSON.parse(localStorage.getItem("uytap_user") || "null");
      console.log("PROFILE USER:", savedUser);
      setUser(savedUser);
    };

    loadUser();

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
      return <RealtorProfile user={user} />;

    case "agency":
      return <AgencyProfile user={user} />;

    case "developer":
      return <DeveloperProfile user={user} />;

    case "personal":

    default:
      return <PersonalProfile user={user} />;
  }
}
