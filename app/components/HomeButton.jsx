"use client";

import { useRouter } from "next/navigation";
import styles from "./HomeButton.module.css";

export default function HomeButton() {
  const router = useRouter();

  return <button className={styles.button} onClick={() => router.push("/")}>Home</button>;
}
