"use client";

import { useState } from "react";

import {
  Building2,
  Pencil,
  Phone,
  MessageCircle,
  Globe,
  MapPin,
  Home,
  Heart,
  CreditCard,
  LogOut,
} from "lucide-react";

import styles from "./AgencyProfile.module.css";

import AgencyEditModal from "./agencyEdit/AgencyEditModal";

export default function AgencyProfile() {
  const [openEdit, setOpenEdit] = useState(false);

  return (
    <main className={styles.wrapper}>
      <section className={styles.profileCard}>
        <div className={styles.logo}>
          <Building2 />
        </div>

        <div className={styles.info}>
          <div className={styles.titleRow}>
            <h1>Elite House KG</h1>

            <span>Агентство</span>
          </div>

          <p className={styles.description}>
            Профессиональное агентство недвижимости. Продажа квартир, домов и
            коммерческих объектов в Бишкеке и Иссык-Куле.
          </p>

          <div className={styles.contacts}>
            <div>
              <Phone />
              +996 555 555 555
            </div>

            <div>
              <MessageCircle />
              WhatsApp
            </div>

            <div>
              <MapPin />
              Бишкек, центр
            </div>

            <div>
              <Globe />
              elitehouse.kg
            </div>
          </div>
        </div>

        <button className={styles.edit} onClick={() => setOpenEdit(true)}>
          <Pencil />
        </button>
      </section>

      <section className={styles.stats}>
        <div>
          <strong>35</strong>

          <span>объявлений</span>
        </div>

        <div>
          <strong>240</strong>

          <span>избранных</span>
        </div>

        <div>
          <strong>PRO</strong>

          <span>тариф</span>
        </div>
      </section>

      <section className={styles.menu}>
        <a href="/profile/ads">
          <Home />
          Мои объявления
        </a>

        <a href="/profile/favorites">
          <Heart />
          Избранное
        </a>

        <a>
          <CreditCard />
          Мой тариф
        </a>

        <button>
          <LogOut />
          Выйти
        </button>
      </section>

      {openEdit && <AgencyEditModal close={() => setOpenEdit(false)} />}
    </main>
  );
}
