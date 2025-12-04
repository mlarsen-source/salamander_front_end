"use client";

import { useGlobalStore } from "@/app/store/useGlobalStore";
import { useEffect, useRef } from "react";

export function useThumbnailLoader() {
  const selectedVideo = useGlobalStore((state) => state.selectedVideo);
  const setThumbnail = useGlobalStore((state) => state.setThumbnail);
  const setVideoWidth = useGlobalStore((state) => state.setVideoWidth);
  const setVideoHeight = useGlobalStore((state) => state.setVideoHeight);

  const currentUrlRef = useRef(null);

  useEffect(() => {
    if (!selectedVideo) return;

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
          if (currentUrlRef.current && currentUrlRef.current !== url) {
            URL.revokeObjectURL(currentUrlRef.current);
          }

          currentUrlRef.current = url;
          setThumbnail(url);
          setVideoWidth(img.naturalWidth);
          setVideoHeight(img.naturalHeight);
        };

        img.onerror = () => {
          console.error("Image failed to load:", url);
          URL.revokeObjectURL(url);
        };
      } catch (err) {
        console.error("Error loading thumbnail:", err);
      }
    }

    loadThumbnail();

    return () => {};
  }, [selectedVideo, setThumbnail, setVideoWidth, setVideoHeight]);
}
