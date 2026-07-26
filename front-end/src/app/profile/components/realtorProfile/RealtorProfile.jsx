"use client";

import { useState } from "react";

import {
  Pencil,
  Phone,
  MessageCircle,
  Globe,
  MapPin,
  Heart,
  Home,
  CreditCard,
  LogOut,
  Building2,
  User,
} from "lucide-react";

import styles from "./RealtorProfile.module.css";

import RealtorEditModal from "./realtorEdit/RealtorEditModal";

export default function RealtorProfile() {
  const [edit, setEdit] = useState(false);

  return (
    <main className={styles.page}>
      <section className={styles.profileCard}>
        <div className={styles.top}>
          <div className={styles.logo}>
            <User />
          </div>

          <div className={styles.info}>
            <div className={styles.badge}>Риэлтор</div>

            <h1>Айбек Нурбеков</h1>

            <p className={styles.company}>
              <Building2 />
              Elite House Realty
            </p>

            <p className={styles.description}>
              Помогаю найти недвижимость в Бишкеке и Иссык-Куле. Более 5 лет
              опыта работы.
            </p>
          </div>

          <button className={styles.edit} onClick={() => setEdit(true)}>
            <Pencil />
          </button>
        </div>

        <div className={styles.contacts}>
          <div>
            <Phone />
            <span>+996 555 555 555</span>
          </div>

          <div>
            <MessageCircle />
            <span>WhatsApp</span>
          </div>

          <div>
            <Globe />
            <span>elitehouse.kg</span>
          </div>

          <div>
            <MapPin />
            <span>Бишкек</span>
          </div>
        </div>
      </section>

      <section className={styles.stats}>
        <div>
          <strong>120</strong>

          <span>объявлений</span>
        </div>

        <div>
          <strong>540</strong>

          <span>клиентов</span>
        </div>

        <div>
          <strong>5 лет</strong>

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

      {edit && <RealtorEditModal close={() => setEdit(false)} />}
    </main>
  );
}
