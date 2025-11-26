"use client";

import { useGlobalStore } from "@/app/store/useGlobalStore";
import { useEffect } from "react";

export function useThumbnailLoader() {
  const selectedVideo = useGlobalStore((state) => state.selectedVideo);
  const thumbnail = useGlobalStore((state) => state.thumbnail);
  const setThumbnail = useGlobalStore((state) => state.setThumbnail);
  const setVideoWidth = useGlobalStore((state) => state.setVideoWidth);
  const setVideoHeight = useGlobalStore((state) => state.setVideoHeight);

  useEffect(() => {
    if (!selectedVideo || thumbnail) return;

    async function loadThumbnail() {
      try {
        const res = await fetch(
          `http://localhost:3000/thumbnail/${selectedVideo}`
        );

        if (!res.ok) {
          console.error("Failed to load thumbnail");
          return;
        }

        const blob = await res.blob();
        const url = URL.createObjectURL(blob);

        const img = new Image();
        img.src = url;
        img.onload = () => {
          setThumbnail(url);
          setVideoWidth(img.naturalWidth);
          setVideoHeight(img.naturalHeight);
        };
      } catch (err) {
        console.error("Error loading thumbnail:", err);
      }
    }

    loadThumbnail();
  }, [selectedVideo, thumbnail, setThumbnail, setVideoWidth, setVideoHeight]);
}
