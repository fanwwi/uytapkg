import styles from "./MainPage.module.css";
import Hero from "@/pageComponents/hero/Hero";
import AdBanner from "@/pageComponents/addBanner/AdBanner";
import Footer from "@/pageComponents/footer/Footer";
import Header from "@/pageComponents/header/Header";
import SearchPage from "@/pageComponents/searchPage/SearchPage";

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
