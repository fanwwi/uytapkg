import Header from "@/components/Header/Header";
import styles from "./MainPage.module.css";
import Hero from "@/pageComponents/hero/Hero";
import SearchPage from "@/pageComponents/searchPage/Properties";
import AdBanner from "@/pageComponents/addBanner/AdBanner";
import Footer from "@/pageComponents/footer/Footer";

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
