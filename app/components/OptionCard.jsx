import { useGlobalStore } from "@/app/store/useGlobalStore";
import Image from "next/image";

export default function OptionCard({
  type,
  isSelected,
  onClick,
  thumbnailSrc,
}) {
  const videoWidth = useGlobalStore((state) => state.videoWidth);
  const videoHeight = useGlobalStore((state) => state.videoHeight);

  const baseWidth = 275;
  const aspectRatio =
    videoWidth && videoHeight ? videoHeight / videoWidth : 0.72;
  const displayHeight = Math.floor(baseWidth * aspectRatio);

  let overlays = null;

  // ---------- VERTICAL ZONES ----------
  if (type === "vertical") {
    overlays = (
      <>
        <div
          style={{
            position: "absolute",
            top: 0,
            left: "33.33%",
            height: "100%",
            borderLeft: "2px solid darkgreen",
          }}
        />
        <div
          style={{
            position: "absolute",
            top: 0,
            left: "66.66%",
            height: "100%",
            borderLeft: "2px solid darkgreen",
          }}
        />
      </>
    );
  }

  // ---------- HORIZONTAL ZONES ----------
  if (type === "horizontal") {
    overlays = (
      <>
        <div
          style={{
            position: "absolute",
            top: "33.33%",
            left: 0,
            width: "100%",
            borderTop: "2px solid darkgreen",
          }}
        />
        <div
          style={{
            position: "absolute",
            top: "66.66%",
            left: 0,
            width: "100%",
            borderTop: "2px solid darkgreen",
          }}
        />
      </>
    );
  }

  // ---------- GRID ZONES ----------
  if (type === "grid") {
    overlays = (
      <>
        <div
          style={{
            position: "absolute",
            top: 0,
            left: "50%",
            height: "100%",
            borderLeft: "2px solid darkgreen",
          }}
        />
        <div
          style={{
            position: "absolute",
            top: "50%",
            left: 0,
            width: "100%",
            borderTop: "2px solid darkgreen",
          }}
        />
      </>
    );
  }

  return (
    <div
      onClick={onClick}
      style={{
        cursor: "pointer",
        width: baseWidth,
      }}>
      {/* IMAGE FRAME */}
      <div
        style={{
          position: "relative",
          width: baseWidth,
          height: displayHeight,
          border: `2px solid ${isSelected ? "blue" : "darkgreen"}`,
          overflow: "hidden",
        }}>
        {/* ---- LABEL AT TOP ---- */}
        <div
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            background: "rgba(0,0,0,0.6)",
            color: "white",
            textAlign: "center",
            padding: "4px 2px",
            zIndex: 3,
            fontSize: "0.85rem",
          }}>
          {type === "vertical" && "3 Vertical Zones"}
          {type === "horizontal" && "3 Horizontal Zones"}
          {type === "grid" && "4 Equal Zones"}
        </div>

        {/* ---- IMAGE ---- */}
        {thumbnailSrc ? (
          <Image
            src={thumbnailSrc}
            alt="Thumbnail"
            width={baseWidth}
            height={displayHeight}
            style={{ objectFit: "cover", zIndex: 1 }}
          />
        ) : (
          <div
            style={{ width: "100%", height: "100%", background: "#e5e5e5" }}
          />
        )}

        {/* ---- OVERLAY LINES ---- */}
        <div
          style={{
            position: "absolute",
            inset: 0,
            pointerEvents: "none",
            background: "transparent",
            zIndex: 2,
          }}>
          {overlays}
        </div>
      </div>
    </div>
  );
}
