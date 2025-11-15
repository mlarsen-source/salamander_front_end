"use client";

import { useGlobalStore } from "@/app/store/useGlobalStore";
import Image from "next/image";
import { useEffect } from "react";

export default function ColorPicker() {
  const selectedVideo = useGlobalStore((state) => state.selectedVideo);
  const thumbnail = useGlobalStore((state) => state.thumbnail);
  const setThumbnail = useGlobalStore((state) => state.setThumbnail);

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

        // turn blob into object URL
        const url = URL.createObjectURL(blob);

        // save to global store
        setThumbnail(url);
      } catch (err) {
        console.error("Error fetching thumbnail:", err);
      }
    }

    loadThumbnail();
  }, [selectedVideo, setThumbnail]);

  return (
    <div style={{ marginBottom: "20px" }}>
      <h2>This is the ColorPicker Component</h2>

      {thumbnail ? (
        <Image
          src={thumbnail}
          alt="thumbnail"
          width="300"
          height="300"
          style={{
            border: "2px solid #000000ff",
            cursor: "crosshair",
          }}
          // Add onHover Color Picking Logic here later
        />
      ) : (
        <p>No thumbnail loaded</p>
      )}
    </div>
  );
}
