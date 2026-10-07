import MainPage from "./main/page";

export const metadata = {
  title: "UyTap — Сервис поиска недвижимости в Кыргызстане",
  description:
    "Современный сервис поиска квартир, домов, участков и новостроек в Бишкеке и на Иссык-Куле. Умный поиск с AI.",
  keywords: [
    "недвижимость Бишкек",
    "купить квартиру",
    "UyTap",
    "новостройки Бишкек",
    "аренда жилья",
  ],
  openGraph: {
    title: "UyTap — Сервис поиска недвижимости в Кыргызстане",
    description: "Найдите дом или квартиру своей мечты в пару кликов.",
    url: "https://uytap.kg",
    siteName: "UyTap",
    images: [
      {
        url: "/assets/logo.png",
        width: 1200,
        height: 630,
        alt: "UyTap.kg",
      },
    ],
    locale: "ru_RU",
    type: "website",
  },
};

export default function Home() {
  return <MainPage />;
}
