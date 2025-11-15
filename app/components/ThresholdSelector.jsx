"use client";

import { useGlobalStore } from "@/app/store/useGlobalStore";
import { useEffect, useRef, useState } from "react";

export default function ThresholdSelector() {
  const thumbnail = useGlobalStore((state) => state.thumbnail);
  const targetColor = useGlobalStore((state) => state.targetColor);
  const threshold = useGlobalStore((state) => state.threshold);
  const setThreshold = useGlobalStore((state) => state.setThreshold);

  const canvasRef = useRef(null);
  const [bwImage, setBwImage] = useState(null);

  function hexToRGB(hex) {
    const clean = hex.replace("#", "");
    return {
      r: parseInt(clean.substring(0, 2), 16),
      g: parseInt(clean.substring(2, 4), 16),
      b: parseInt(clean.substring(4, 6), 16),
    };
  }

  function colorDistance(rgb1, rgb2) {
    const dx = rgb1.r - rgb2.r;
    const dy = rgb1.g - rgb2.g;
    const dz = rgb1.b - rgb2.b;
    return Math.sqrt(dx * dx + dy * dy + dz * dz);
  }

  function generateBWImage() {
    const img = new Image();
    img.src = thumbnail;
    img.crossOrigin = "anonymous";

    img.onload = () => {
      const canvas = canvasRef.current;
      const ctx = canvas.getContext("2d");

      canvas.width = img.width;
      canvas.height = img.height;

      ctx.drawImage(img, 0, 0);
      const frame = ctx.getImageData(0, 0, canvas.width, canvas.height);
      const pixels = frame.data;

      const target = hexToRGB(targetColor);

      for (let i = 0; i < pixels.length; i += 4) {
        const r = pixels[i];
        const g = pixels[i + 1];
        const b = pixels[i + 2];

        const dist = colorDistance({ r, g, b }, target);

        if (dist <= threshold) {
          // white pixel
          pixels[i] = 255;
          pixels[i + 1] = 255;
          pixels[i + 2] = 255;
        } else {
          // black pixel
          pixels[i] = 0;
          pixels[i + 1] = 0;
          pixels[i + 2] = 0;
        }
      }

      ctx.putImageData(frame, 0, 0);
      const bwUrl = canvas.toDataURL();
      setBwImage(bwUrl);
    };
  }

  useEffect(() => {
    if (!thumbnail) return;
    generateBWImage();
  }, [thumbnail, threshold, targetColor]);

  function colorDistance(rgb1, rgb2) {
    const dx = rgb1.r - rgb2.r;
    const dy = rgb1.g - rgb2.g;
    const dz = rgb1.b - rgb2.b;
    return Math.sqrt(dx * dx + dy * dy + dz * dz);
  }

  return (
    <section>
      <h2>Threshold Selector</h2>

      {!thumbnail && <p>No thumbnail loaded</p>}

      {thumbnail && (
        <>
          <label>Threshold: {threshold}</label>
          <input
            type="range"
            min="0"
            max="255"
            value={threshold}
            onChange={(e) => setThreshold(Number(e.target.value))}
            style={{ width: "300px", display: "block", marginBottom: "12px" }}
          />

          <h4>Preview (Binarized)</h4>
          <canvas
            ref={canvasRef}
            style={{ display: "none" }}
          />

          {bwImage && (
            <img
              src={bwImage}
              alt="binarized"
              style={{
                maxWidth: "300px",
                border: "2px solid black",
              }}
            />
          )}
        </>
      )}
    </section>
  );
}
