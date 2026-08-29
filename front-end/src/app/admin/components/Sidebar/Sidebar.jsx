"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Building2,
  Users,
  CreditCard,
  Image,
  Scale,
  LogOut,
  Home,
  Camera,
} from "lucide-react";

import styles from "./Sidebar.module.css";

const navigation = [
  {
    title: "Dashboard",
    href: "/admin",
    icon: LayoutDashboard,
  },
  {
    title: "Застройщики",
    href: "/admin/developers",
    icon: Building2,
  },
  {
    title: "Оплаты",
    href: "/admin/payments",
    icon: CreditCard,
  },
  {
    title: "Баннеры",
    href: "/admin/banners",
    icon: Image,
  },
  {
    title: "Instagram",
    href: "/admin/instagram",
    icon: Camera,
  },
  {
    title: "Юристы",
    href: "/admin/lawyers",
    icon: Scale,
  },
];

export default function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className={styles.sidebar}>
      <div className={styles.logo}>
        <div className={styles.logoMark}>U</div>

        <div>
          <strong>UYTap</strong>
          <span>ADMIN PANEL</span>
        </div>
      </div>

      <nav className={styles.nav}>
        <span className={styles.label}>УПРАВЛЕНИЕ</span>

        {navigation.map((item) => {
          const Icon = item.icon;

          const active =
            item.href === "/admin"
              ? pathname === "/admin"
              : pathname.startsWith(item.href);

          return (
            <Link
              key={item.href}
              href={item.href}
              className={`${styles.link} ${active ? styles.active : ""}`}
            >
              <Icon />
              <span>{item.title}</span>
            </Link>
          );
        })}
      </nav>

      <div className={styles.bottom}>
        <Link href="/" className={styles.home}>
          <Home />
          Сайт
        </Link>

        <button className={styles.logout}>
          <LogOut />
          Выйти
        </button>
      </div>
    </aside>
  );
}
