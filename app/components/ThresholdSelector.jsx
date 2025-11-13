"use client";

import { useGlobalStore } from "@/app/store/useGlobalStore";

export default function ThresholdSelector() {
  const thumbnail = useGlobalStore((state) => state.thumbnail);

  // add logic to convert thumbnail image to binarized black/white image on chnage of slider

  return (
    <section>
      <h2>This is the ThresholdSelector Component</h2>
      {thumbnail ? (
        <img
          src={thumbnail}
          alt="thumbnail"
          style={{
            maxWidth: "300px",
            border: "2px solid #000000ff",
          }}
        />
      ) : (
        <p>No thumbnail loaded</p>
      )}
    </section>
  );
}
