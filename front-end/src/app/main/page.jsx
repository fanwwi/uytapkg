import Header from "@/components/pageComponents/header/Header";
import styles from "./MainPage.module.css";
import Hero from "@/components/pageComponents/hero/Hero";
import SearchPage from "@/components/pageComponents/searchPage/SearchPage";
import AdBanner from "@/components/pageComponents/addBanner/AdBanner";
import Footer from "@/components/pageComponents/footer/Footer";

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
