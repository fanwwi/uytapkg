"use client";

import { useState } from "react";

import { CalendarDays } from "lucide-react";

import styles from "./IssykKulFilter.module.css";

import SearchMode from "./components/searchMode/SearchMode";
import DealSwitcher from "./components/dealSwitcher/DealSwitcher";
import Categories from "./components/categories/Categories";

import HouseFilters from "./filters/HouseFilters";
import CottageFilters from "./filters/CottageFilters";
import GuestHouseFilters from "./filters/GuestHouseFilters";
import LandFilters from "./filters/LandFilters";
import CommercialFilters from "./filters/CommercialFilters";

import CustomSelect from "../../../components/ui/customSelect/CustomSelect";
import SmartSearchVoice from "@/components/pageComponents/searchPage/smartSearch/SmartSearch";

export default function IssykKulFilter() {
  const [mode, setMode] = useState("normal");

  const [deal, setDeal] = useState("buy");

  const [category, setCategory] = useState("house");

  const [urgent, setUrgent] = useState(false);

  const [vip, setVip] = useState(false);

  const [rentPeriod, setRentPeriod] = useState("Любой");

  return (
    <section className={styles.wrapper}>
      <div className={styles.card}>
        {/* Обычный / умный поиск */}

        <SearchMode mode={mode} setMode={setMode} />

        {mode === "smart" ? (
          <SmartSearchVoice />
        ) : (
          <>
            {/* Купить / снять */}

            <DealSwitcher deal={deal} setDeal={setDeal} />

            {/* Категории */}

            <Categories
              category={category}
              setCategory={setCategory}
              urgent={urgent}
              setUrgent={setUrgent}
              vip={vip}
              setVip={setVip}
            />

            {/* Категорийные фильтры */}

            <div className={styles.filters}>
              {category === "house" && <HouseFilters />}

              {category === "cottage" && <CottageFilters />}

              {category === "guest" && <GuestHouseFilters />}

              {category === "land" && <LandFilters />}

              {category === "commercial" && <CommercialFilters />}
            </div>

            {/* Период аренды ТОЛЬКО снизу */}

            {deal === "rent" && (
              <div className={styles.rentPeriod}>
                <CustomSelect
                  icon={CalendarDays}
                  title="Период аренды"
                  value={rentPeriod}
                  setValue={setRentPeriod}
                  options={[
                    "Любой",
                    "По часам",
                    "Посуточно",
                    "Понедельно",
                    "Помесячно",
                    "На сезон",
                    "Долгосрочно",
                  ]}
                />
              </div>
            )}

            <button className={styles.searchBtn}>Найти недвижимость</button>
          </>
        )}
      </div>
    </section>
  );
}
