import Header from "@/components/Header/Header";
import styles from "./MainPage.module.css";
import Hero from "@/pageComponents/hero/Hero";
import SearchFilter from "@/pageComponents/searchFilter/SearchFilter";
import SearchPageHero from "@/pageComponents/searchPage/SearchPage";

export default function MainPage() {
  return (
    <div className={styles.container}>
      <Header />
      <Hero />
      <SearchPageHero />
    </div>
  );
}
