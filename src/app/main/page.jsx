import Header from "@/components/Header/Header";
import styles from "./MainPage.module.css";
import Hero from "@/pageComponents/hero/Hero";
import SearchFilter from "@/pageComponents/searchFilter/SearchFilter";

export default function MainPage() {
  return (
    <div className={styles.container}>
      <Header />
      <Hero />
      <SearchFilter />
    </div>
  );
}
