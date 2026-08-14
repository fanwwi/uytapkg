"use client";

import AgencyPublicProfile from "./AgencyPublicProfile/AgencyPublicProfile";
import DeveloperPublicProfile from "./DeveloperPublicProfile/DeveloperPublicProfile";
import PersonalPublicProfile from "./PersonalPublicProfile/PersonalPublicProfile";
import RealtorPublicProfile from "./RealtorPublicProfile/RealtorPublicProfile";

const profiles = {
  1: {
    id: "1",
    type: "agency",
    isVerified: true,

    phone: "+996 555 123 456",
    email: "test@uytap.kg",

    profile: {
      company_name: "UYTap",
      first_name: "Фарангиз",
      last_name: "Анваржанова",

      about:
        "UYTap — современное агентство недвижимости. Помогаем находить и продавать недвижимость в Кыргызстане.",

      office_address: "Бишкек",
      website: "uytap.kg",

      avatar_url: "/assets/AgencyImage.png",

      ads_count: 10,
      favorites_count: 5,
      properties_count: 8,

      ads: [
        {
          id: "101",
          title: "Просторная 3-комнатная квартира",
          address: "Бишкек, центр",
          price: 8500000,
          image_url: "/assets/AgencyImage.png",
        },
        {
          id: "102",
          title: "Современный дом",
          address: "Бишкек, Аламедин",
          price: 12500000,
          image_url: "/assets/AgencyImage.png",
        },
      ],
    },
  },

  2: {
    id: "2",
    type: "developer",
    isVerified: true,

    phone: "+996 700 111 222",
    email: "megabuild@example.com",

    profile: {
      company_name: "Mega Build",
      first_name: "Айбек",
      last_name: "Садыков",

      about:
        "Mega Build — строительная компания, занимающаяся строительством современных жилых комплексов.",

      office_address: "Бишкек",
      website: "megabuild.kg",

      avatar_url: "/assets/DeveloperImage.png",

      ads_count: 15,
      favorites_count: 12,
      properties_count: 20,

      ads: [],
    },
  },

  3: {
    id: "3",
    type: "realtor",
    isVerified: true,

    phone: "+996 555 333 444",
    email: "alina@example.com",

    profile: {
      first_name: "Алина",
      last_name: "Иванова",

      about:
        "Помогаю клиентам покупать, продавать и арендовать недвижимость в Бишкеке.",

      office_address: "Бишкек",

      avatar_url: "/assets/RealtorImage.png",

      ads_count: 7,
      favorites_count: 4,
      properties_count: 7,

      ads: [],
    },
  },

  4: {
    id: "4",
    type: "personal",
    isVerified: false,

    phone: "+996 555 777 888",
    email: "nurbek@example.com",

    profile: {
      first_name: "Нурбек",
      last_name: "Абдрахманов",

      about:
        "Собственник недвижимости. Здесь размещена информация о моих объектах.",

      office_address: "Бишкек",

      avatar_url: "/assets/PersonalImage.png",

      ads_count: 2,
      favorites_count: 1,
      properties_count: 2,

      ads: [],
    },
  },
};

export default function PublicProfile({ profileId }) {
  const id = String(profileId);

  const user = profiles[id];

  if (!user) {
    return (
      <main>
        <h1>Профиль не найден</h1>
      </main>
    );
  }

  const commonProps = {
    profile: user,
    user,
    isOwnProfile: false,
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
          <h1>Неизвестный тип профиля</h1>
        </main>
      );
  }
}
