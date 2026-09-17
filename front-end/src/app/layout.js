import { Noto_Sans } from "next/font/google"; // 👈 Импортируем шрифт из Google Fonts
import NavigationLoader from "@/components/ui/navigationLoader/NavigationLoader";
import LanguageProvider from "../context/LanguageContext";

import "./globals.css";

// Настраиваем шрифт с поддержкой кыргызских букв и жирных весов
const notoSans = Noto_Sans({
  subsets: ["cyrillic", "cyrillic-ext"],
  weight: ["400", "500", "700", "900"],
  subsets: ["cyrillic", "cyrillic-ext"],
  display: "swap",
});

export default function RootLayout({ children }) {
  return (
    <html
      lang="ru"
      data-scroll-behavior="smooth"
      className={notoSans.className}
    >
      <body>
        <LanguageProvider>
          <NavigationLoader />

          {children}
        </LanguageProvider>
      </body>
    </html>
  );
}
