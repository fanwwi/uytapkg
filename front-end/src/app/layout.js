import NavigationLoader from "@/components/ui/navigationLoader/NavigationLoader";
import "./globals.css";

export default function RootLayout({ children }) {
  return (
    <html lang="ru" data-scroll-behavior="smooth">
      <body>
        <NavigationLoader />

        {children}
      </body>
    </html>
  );
}
