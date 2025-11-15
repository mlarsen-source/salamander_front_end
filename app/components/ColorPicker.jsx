"use client";

import { useGlobalStore } from "@/app/store/useGlobalStore";
import { useEffect, useRef, useState } from "react";

export default function ColorPicker() {
  const selectedVideo = useGlobalStore((state) => state.selectedVideo);
  const thumbnail = useGlobalStore((state) => state.thumbnail);
  const setThumbnail = useGlobalStore((state) => state.setThumbnail);
  const setTargetColor = useGlobalStore((state) => state.setTargetColor);

  const imgRef = useRef(null);
  const canvasRef = useRef(null);

  const [hoverColorHex, setHoverColorHex] = useState(null);
  const [hoverColorRGB, setHoverColorRGB] = useState(null);

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
      } catch (err) {
        console.error("Error fetching thumbnail:", err);
      }
    }

    loadThumbnail();
  }, [selectedVideo, setThumbnail]);

  // draw image to canvas for pixel reading
  useEffect(() => {
    if (!thumbnail || !imgRef.current || !canvasRef.current) return;

    const img = imgRef.current;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");

    // if image already loaded (cached), onload may not fire, so guard both
    const draw = () => {
      canvas.width = img.naturalWidth || img.width;
      canvas.height = img.naturalHeight || img.height;
      ctx.drawImage(img, 0, 0);
    };

    if (img.complete) {
      draw();
    } else {
      img.onload = draw;
    }
  }, [thumbnail]);

  function rgbToHex(r, g, b) {
    return (
      "#" +
      [r, g, b]
        .map((val) => val.toString(16).padStart(2, "0"))
        .join("")
        .toUpperCase()
    );
  }

  function handleHover(e) {
    if (!canvasRef.current || !imgRef.current) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const rect = e.currentTarget.getBoundingClientRect();

    // position within displayed image
    const displayX = e.clientX - rect.left;
    const displayY = e.clientY - rect.top;

    // scale from displayed size -> canvas size
    const scaleX = canvas.width / rect.width;
    const scaleY = canvas.height / rect.height;

    const x = Math.floor(displayX * scaleX);
    const y = Math.floor(displayY * scaleY);

    if (x < 0 || y < 0 || x >= canvas.width || y >= canvas.height) return;

    const pixel = ctx.getImageData(x, y, 1, 1).data;

    const rgb = `rgb(${pixel[0]}, ${pixel[1]}, ${pixel[2]})`;
    const hex = rgbToHex(pixel[0], pixel[1], pixel[2]);

    setHoverColorRGB(rgb);
    setHoverColorHex(hex);
  }

  function handleClick() {
    if (!hoverColorHex) return;
    console.log("Saved picked color:", hoverColorHex);
    setTargetColor(hoverColorHex.replace("#", "")); // store without '#'
  }

  return (
    <div style={{ marginBottom: "20px" }}>
      <h2>This is the ColorPicker Component</h2>

      {thumbnail && (
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "10px",
            marginBottom: "10px",
          }}>
          <div
            style={{
              width: "50px",
              height: "50px",
              border: "2px solid #000",
              backgroundColor: hoverColorHex || "transparent",
            }}
          />
          <div style={{ fontWeight: "bold", minWidth: "120px" }}>
            {hoverColorHex || "--"}
            <br />
            {hoverColorRGB || ""}
          </div>
        </div>
      )}

      {thumbnail ? (
        <>
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
              border: "2px solid #000000ff",
              cursor: "crosshair",
              display: "block",
            }}
            onMouseMove={handleHover}
            onClick={handleClick}
          />
        </>
      ) : (
        <p>No thumbnail loaded</p>
      )}
    </div>
  );
}
