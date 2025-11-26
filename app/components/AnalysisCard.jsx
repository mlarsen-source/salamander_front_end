"use client";

export default function AnalysisCard({ data, layout }) {
  if (!data) return null;

  const getZoneName = (index) => {
    if (layout === "vertical") {
      return ["Left Zone", "Center Zone", "Right Zone"][index];
    }

    if (layout === "horizontal") {
      return ["Top Zone", "Middle Zone", "Bottom Zone"][index];
    }

    // 4-zone grid
    return [
      "Top-Left Zone",
      "Top-Right Zone",
      "Bottom-Left Zone",
      "Bottom-Right Zone",
    ][index];
  };

  const getTitle = () => {
    if (layout === "vertical") return "Vertical Zone Analysis";
    if (layout === "horizontal") return "Horizontal Zone Analysis";
    return "Grid Zone Analysis";
  };

  return (
    <div style={{ marginTop: "24px" }}>
      <h3>{getTitle()}</h3>

      {data.map((zone, idx) => (
        <div
          key={idx}
          style={{
            border: "1px solid gray",
            padding: "8px",
            margin: "8px 0",
            borderRadius: "4px",
          }}>
          <h4>{getZoneName(idx)}</h4>
          <p>Frames: {zone.count}</p>
          <p>Time: {zone.duration.toFixed(2)}s</p>
          <p>Percentage: {zone.percentage.toFixed(1)}%</p>
        </div>
      ))}
    </div>
  );
}
