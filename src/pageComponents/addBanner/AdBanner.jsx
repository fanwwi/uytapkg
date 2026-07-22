"use client";

import styles from "./AdBanner.module.css";

export default function AdBanner() {
  return (
    <section className={styles.banner}>
      <img
        src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTE4sIwg3IOpWZ6oRI3eLm0VdqWkbha3VGACBWN7reJuuUQmDJSQ0HRjSVe&s=10"
        alt="Реклама"
        className={styles.image}
      />

      <span className={styles.label}>Реклама</span>
    </section>
  );
}
