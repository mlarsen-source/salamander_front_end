"use client";

import { useGlobalStore } from "@/app/store/useGlobalStore";
import { useEffect, useRef, useState } from "react";

export default function ColorPicker() {
  // Zustand state
  const selectedVideo = useGlobalStore((state) => state.selectedVideo);
  const thumbnail = useGlobalStore((state) => state.thumbnail);
  const setThumbnail = useGlobalStore((state) => state.setThumbnail);
  const setTargetColor = useGlobalStore((state) => state.setTargetColor);

  // UI state
  const [hoverColorHex, setHoverColorHex] = useState(null);
  const [hoverColorRGB, setHoverColorRGB] = useState(null);
  const [isLocked, setIsLocked] = useState(false);

  // DEFAULT SYSTEM COLOR
  const DEFAULT_COLOR = "00000";

  // Refs
  const imgRef = useRef(null);
  const canvasRef = useRef(null);

  // Load thumbnail when video changes
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
        setThumbnail(url);

        // Reset picking and restore default color
        setIsLocked(false);
        setTargetColor(DEFAULT_COLOR);
      } catch (err) {
        console.error("Error fetching thumbnail:", err);
      }
    }

    loadThumbnail();
  }, [selectedVideo, setThumbnail, setTargetColor]);

  // Draw image to canvas for pixel sampling
  useEffect(() => {
    if (!thumbnail || !imgRef.current || !canvasRef.current) return;

    const img = imgRef.current;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");

    const draw = () => {
      canvas.width = img.naturalWidth || img.width;
      canvas.height = img.naturalHeight || img.height;
      ctx.drawImage(img, 0, 0);
    };

    img.complete ? draw() : (img.onload = draw);
  }, [thumbnail]);

  // Helpers
  function rgbToHex(r, g, b) {
    return (
      "#" +
      [r, g, b]
        .map((v) => v.toString(16).padStart(2, "0"))
        .join("")
        .toUpperCase()
    );
  }

  // Hover sampling (disabled if locked)
  function handleHover(e) {
    if (isLocked) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    const rect = e.target.getBoundingClientRect();

    const displayX = e.clientX - rect.left;
    const displayY = e.clientY - rect.top;

    const scaleX = canvas.width / rect.width;
    const scaleY = canvas.height / rect.height;

    const x = Math.floor(displayX * scaleX);
    const y = Math.floor(displayY * scaleY);

    const pixel = ctx.getImageData(x, y, 1, 1).data;

    const rgb = `rgb(${pixel[0]}, ${pixel[1]}, ${pixel[2]})`;
    const hex = rgbToHex(pixel[0], pixel[1], pixel[2]);

    setHoverColorRGB(rgb);
    setHoverColorHex(hex);
  }

  // Click locks selection, stores in Zustand
  function handleClick() {
    if (!hoverColorHex) return;
    const cleanHex = hoverColorHex.replace("#", "");
    setTargetColor(cleanHex);
    setIsLocked(true);
  }

  // Reset to default, unlock picking mode
  function resetPicker() {
    setIsLocked(false);
    setTargetColor(DEFAULT_COLOR);
    setHoverColorHex(null);
    setHoverColorRGB(null);
  }

  return (
    <div style={{ marginBottom: "20px" }}>
      <h2>Color Picker</h2>

      {thumbnail && (
        <>
          {/* Color Indicator */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "12px",
              marginBottom: "10px",
            }}>
            <div
              style={{
                width: "50px",
                height: "50px",
                border: "2px solid #000",
                backgroundColor: hoverColorHex || `#${DEFAULT_COLOR}`,
              }}
            />
            <div style={{ fontWeight: "bold", minWidth: "130px" }}>
              {hoverColorHex || `#${DEFAULT_COLOR}`}
              <br />
              {hoverColorRGB || ""}
            </div>

            {isLocked ? (
              <button onClick={resetPicker}>Reset</button>
            ) : (
              <span> Click image to select Color</span>
            )}
          </div>

          {/* Canvas + Image */}
          <canvas
            ref={canvasRef}
            style={{ display: "none" }}
          />

          <img
            ref={imgRef}
            src={thumbnail}
            alt="thumbnail"
            style={{
              maxWidth: "300px",
              border: "2px solid black",
              cursor: "crosshair",
            }}
            onMouseMove={handleHover}
            onClick={handleClick}
          />
        </>
      )}

      {!thumbnail && <p>No thumbnail loaded</p>}
    </div>
  );
}
