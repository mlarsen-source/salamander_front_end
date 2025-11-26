"use client";

import Info from "@/app/components/Info";
import List from "@/app/components/List";
import { useGlobalStore } from "@/app/store/useGlobalStore";
import styles from "./page.module.css";

export default function HomePage() {
  const setVideoArray = useGlobalStore((state) => state.setVideoArray);
  const setCsvArray = useGlobalStore((state) => state.setCsvArray);

  

  return (
    <section className={styles.page}>
      <h1 className={styles.headline}>This is the Home Page</h1>
      <Info />
      <List
        title="Videos"
      />
      <List
        title="Results"
      />
    </section>
  );
}
