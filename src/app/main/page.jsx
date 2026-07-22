import Header from "@/components/Header/Header";
import styles from "./MainPage.module.css";
import Hero from "@/pageComponents/hero/Hero";
import SearchPage from "@/pageComponents/searchPage/Properties";

export default function MainPage() {
  return (
    <div className={styles.container}>
      <Header />
      <Hero />
      <SearchPage />
    </div>
  );
}
