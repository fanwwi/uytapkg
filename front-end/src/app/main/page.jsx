import styles from "./MainPage.module.css";
import Hero from "@/components/pageComponents/hero/Hero";
import AdBanner from "@/components/pageComponents/addBanner/AdBanner";
import Footer from "@/components/pageComponents/footer/Footer";
import Header from "@/components/pageComponents/header/Header";
import SearchPage from "@/components/pageComponents/searchPage/SearchPage";

export default function MainPage() {
  return (
    <div className={styles.container}>
      <Header />
      <Hero />
      <SearchPage />
      <AdBanner />
      <Footer />
    </div>
  );
}
