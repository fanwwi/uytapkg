"use client";

import PersonalProfile from "./components/personalProfile/PersonalProfile";
import RealtorProfile from "./components/realtorProfile/RealtorProfile";
import AgencyProfile from "./components/agencyProfile/AgencyProfile";
import DeveloperProfile from "./components/developerProfile/DeveloperProfile";

import styles from "./Profile.module.css";

const user = {
  accountType: "PERSONAL",
};

export default function ProfilePage() {
  const renderProfile = () => {
    switch (user.accountType) {
      case "PERSONAL":
        return <PersonalProfile />;

      case "REALTOR":
        return <RealtorProfile />;

      case "AGENCY":
        return <AgencyProfile />;

      case "DEVELOPER":
        return <DeveloperProfile />;

      default:
        return null;
    }
  };

  return <main className={styles.page}>{renderProfile()}</main>;
}
