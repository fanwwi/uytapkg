import NavigationLoader from "@/components/ui/navigationLoader/NavigationLoader";
import "./globals.css";

export default function RootLayout({ children }) {
  return (
    <html lang="ru">
      <body>
        <NavigationLoader />

        {children}
      </body>
    </html>
  );
}
