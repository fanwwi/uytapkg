import { ArrowUpRight } from "lucide-react";

import styles from "./StatCard.module.css";

export default function StatCard({ title, value, change, icon: Icon }) {
  return (
    <div className={styles.card}>
      <div className={styles.top}>
        <div className={styles.icon}>
          <Icon />
        </div>

        <ArrowUpRight />
      </div>

      <span className={styles.title}>{title}</span>

      <div className={styles.bottom}>
        <strong>{value}</strong>
        <span>{change}</span>
      </div>
    </div>
  );
}
