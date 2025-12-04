"use client";

import HomeButton from "@/app/components/HomeButton";
import List from "@/app/components/List";
import VideoProcessor from "@/app/components/VideoProcessor";
import styles from "./page.module.css";
import { useGlobalStore } from "../store/useGlobalStore";

export default function PreviewPage() {
  const selectedVideo = useGlobalStore((state) => state.selectedVideo);
  const displayTitle = selectedVideo
    ? selectedVideo
    : "Select a video for processing";
  return (
    <section className={styles.page}>
      <div className={styles.titleDiv}>
        <h1 className={styles.headline}>{displayTitle}</h1>
        <HomeButton />
      </div>
      <VideoProcessor />
      <List title="Videos" isPreview={true} />
    </section>
  );
}
