"use client";

import { useThumbnailLoader } from "@/app/hooks/useThumbnailLoader";
import { useGlobalStore } from "@/app/store/useGlobalStore";
import { useEffect, useRef, useState } from "react";
import styles from "./ColorPicker.module.css";

export default function ColorPicker() {
  useThumbnailLoader();

  const thumbnail = useGlobalStore((state) => state.thumbnail);
  const setTargetColor = useGlobalStore((state) => state.setTargetColor);

  const [hoverColorHex, setHoverColorHex] = useState(null);
  const [hoverColorRGB, setHoverColorRGB] = useState(null);
  const [isLocked, setIsLocked] = useState(false);
  const DEFAULT_COLOR = "000000";

  const imgRef = useRef(null);
  const canvasRef = useRef(null);

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

  function rgbToHex(r, g, b) {
    return (
      "#" +
      [r, g, b]
        .map((v) => v.toString(16).padStart(2, "0"))
        .join("")
        .toUpperCase()
    );
  }

  function handleHover(e) {
    if (isLocked) return;

    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    const rect = e.target.getBoundingClientRect();

    const displayX = e.clientX - rect.left;
    const displayY = e.clientY - rect.top;

    const scaleX = canvas.width / rect.width;
    const scaleY = canvas.height / rect.height;

    const x = Math.floor(displayX * scaleX);
    const y = Math.floor(displayY * scaleY);

    const pixel = ctx.getImageData(x, y, 1, 1).data;

    setHoverColorHex(rgbToHex(pixel[0], pixel[1], pixel[2]));
    setHoverColorRGB(`rgb(${pixel[0]}, ${pixel[1]}, ${pixel[2]})`);
  }

  function handleClick() {
    if (!hoverColorHex) return;
    const clean = hoverColorHex.replace("#", "");
    setTargetColor(clean);
    setIsLocked(true);
  }

  function resetPicker() {
    setIsLocked(false);
    setTargetColor(DEFAULT_COLOR);
    setHoverColorHex(null);
    setHoverColorRGB(null);
  }

  return (
    <div className={styles.root}>
      <h2 className={styles.title}>Color Picker</h2>

      <img
        ref={imgRef}
        src={thumbnail}
        alt="thumbnail"
        className={styles.image}
        onMouseMove={handleHover}
        onClick={handleClick}
      />

      {thumbnail && (
        <>
          <div className={styles.indicatorRow}>
            <div
              className={styles.indicatorBox}
              style={{ backgroundColor: hoverColorHex || `#${DEFAULT_COLOR}` }}
            />
            <div className={styles.indicatorText}>
              {hoverColorHex || `#${DEFAULT_COLOR}`}
              <br />
              {hoverColorRGB || ""}
            </div>

            {isLocked ? (
              <button
                className={styles.resetButton}
                onClick={resetPicker}>
                Reset
              </button>
            ) : (
              <span> Click image to select Color</span>
            )}
          </div>

          <canvas
            ref={canvasRef}
            className={styles.hiddenCanvas}
          />
        </>
      )}

      {!thumbnail && <p>No thumbnail loaded</p>}
    </div>
  );
}
