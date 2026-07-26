"use client";

import { useState } from "react";

import {
  Pencil,
  Building2,
  Phone,
  MessageCircle,
  Globe,
  MapPin,
  Home,
  Heart,
  CreditCard,
  LogOut,
  Landmark,
  Users,
} from "lucide-react";

import styles from "./DeveloperProfile.module.css";

import DeveloperEditModal from "./developerEdit/DeveloperEditModal";

export default function DeveloperProfile() {
  const [edit, setEdit] = useState(false);

  return (
    <main className={styles.page}>
      <section className={styles.card}>
        <div className={styles.header}>
          <div className={styles.logo}>
            <Building2 />
          </div>

          <div className={styles.info}>
            <div className={styles.badge}>Застройщик</div>

            <h1>Nova Build Group</h1>

            <p className={styles.company}>
              <Landmark />
              Строительная компания
            </p>

            <p className={styles.description}>
              Строим современные жилые комплексы в Бишкеке. Более 10 лет создаем
              комфортное жилье для семей.
            </p>
          </div>

          <button className={styles.edit} onClick={() => setEdit(true)}>
            <Pencil />
          </button>
        </div>

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
            <Globe />
            novabuild.kg
          </div>

          <div>
            <MapPin />
            Бишкек
          </div>
        </div>
      </section>

      <section className={styles.stats}>
        <div>
          <strong>15</strong>

          <span>ЖК построено</span>
        </div>

        <div>
          <strong>3200+</strong>

          <span>квартир продано</span>
        </div>

        <div>
          <strong>10 лет</strong>

          <span>опыта</span>
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

      {edit && <DeveloperEditModal close={() => setEdit(false)} />}
    </main>
  );
}
