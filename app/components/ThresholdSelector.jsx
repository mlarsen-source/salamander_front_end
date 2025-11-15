"use client";

import { useGlobalStore } from "@/app/store/useGlobalStore";
import { useEffect, useRef, useState } from "react";

export default function ThresholdSelector() {
  const thumbnail = useGlobalStore((state) => state.thumbnail);
  const targetColor = useGlobalStore((state) => state.targetColor);
  const threshold = useGlobalStore((state) => state.threshold);
  const setThreshold = useGlobalStore((state) => state.setThreshold);
  console.log(threshold);

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

      // Find the largest connected white region and draw its centroid
      const width = canvas.width;
      const height = canvas.height;
      const totalPixels = width * height;

      // Build a mask of white pixels (1 for white, 0 for black)
      const whiteMask = new Uint8Array(totalPixels);
      for (let p = 0, i = 0; p < totalPixels; p++, i += 4) {
        whiteMask[p] = pixels[i] === 255 ? 1 : 0;
      }

      // Visited set for connected component search
      const visited = new Uint8Array(totalPixels);

      let maxCount = 0;
      let maxSumX = 0;
      let maxSumY = 0;

      for (let start = 0; start < totalPixels; start++) {
        if (!whiteMask[start] || visited[start]) continue;

        // DFS stack
        const stack = [start];
        visited[start] = 1;

        let count = 0;
        let sumX = 0;
        let sumY = 0;

        while (stack.length) {
          const cur = stack.pop();
          count++;
          const x = cur % width;
          const y = (cur - x) / width;
          sumX += x;
          sumY += y;

          // Explore 8-connected neighbors
          for (let dy = -1; dy <= 1; dy++) {
            for (let dx = -1; dx <= 1; dx++) {
              if (dx === 0 && dy === 0) continue;
              const nx = x + dx;
              const ny = y + dy;
              if (nx < 0 || ny < 0 || nx >= width || ny >= height) continue;
              const np = ny * width + nx;
              if (!visited[np] && whiteMask[np]) {
                visited[np] = 1;
                stack.push(np);
              }
            }
          }
        }

        if (count > maxCount) {
          maxCount = count;
          maxSumX = sumX;
          maxSumY = sumY;
        }
      }

      // Draw a red circle (diameter 15px => radius 7.5px) at the centroid
      if (maxCount > 0) {
        const cx = maxSumX / maxCount;
        const cy = maxSumY / maxCount;
        ctx.beginPath();
        ctx.arc(cx, cy, 15, 0, Math.PI * 2);
        ctx.strokeStyle = "red";
        ctx.lineWidth = 3;
        ctx.stroke();
      }

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
