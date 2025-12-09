"use client";

import AnalysisCard from "@/app/components/AnalysisCard";
import HomeButton from "@/app/components/HomeButton";
import List from "@/app/components/List";
import OptionCard from "@/app/components/OptionCard";
import { useThumbnailLoader } from "@/app/hooks/useThumbnailLoader";
import { useGlobalStore } from "@/app/store/useGlobalStore";
import { useEffect, useState } from "react";
import styles from "./page.module.css";

export default function ResultsPage() {
  useThumbnailLoader();

  const selectedCsv = useGlobalStore((state) => state.selectedCsv);
  const selectedVideo = useGlobalStore((state) => state.selectedVideo);
  const setSelectedVideo = useGlobalStore((state) => state.setSelectedVideo);

  const [rows, setRows] = useState([]);
  const [csvText, setCsvText] = useState("");
  const [error, setError] = useState("");
  const thumbnail = useGlobalStore((state) => state.thumbnail);
  const videoWidth = useGlobalStore((state) => state.videoWidth);
  const videoHeight = useGlobalStore((state) => state.videoHeight);
  const [analysisData, setAnalysisData] = useState(null);
  const [showList, setShowList] = useState(true); // DEFAULT SHOW LIST

  useEffect(() => {
    if (!selectedCsv) return;

    if (!selectedVideo) {
      const videoName = selectedCsv.slice(0, -4);
      setSelectedVideo(videoName);
    }
  }, [selectedCsv, selectedVideo, setSelectedVideo]);

  useEffect(() => {
    if (!selectedCsv) return;

    async function loadCsv() {
      try {
        const res = await fetch(`http://localhost:3000/api/csv/${selectedCsv}`);
        if (!res.ok) {
          setError("Failed to load CSV.");
          return;
        }

        const text = await res.text();
        setCsvText(text);

        const parsed = text
          .trim()
          .split("\n")
          .map((line) => line.split(","))
          .map(([t, x, y]) => [parseFloat(t), parseFloat(x), parseFloat(y)]);

        setRows(parsed);
      } catch (err) {
        console.error(err);
        setError("Error loading CSV.");
      }
    }

    loadCsv();
  }, [selectedCsv]);

  // -------- ZONE ANALYSIS --------
  const analyzeZones = (layout) => {
    if (!rows.length || !videoWidth || !videoHeight) return;

    const zones = Array(layout === "grid" ? 4 : 3)
      .fill(null)
      .map(() => ({ count: 0, duration: 0, percentage: 0 }));

    const durations = [];
    for (let i = 0; i < rows.length; i++) {
      if (i < rows.length - 1) {
        durations.push(rows[i + 1][0] - rows[i][0]);
      } else {
        const avg =
          durations.reduce((sum, v) => sum + v, 0) / durations.length || 0.033;
        durations.push(avg);
      }
    }

    rows.forEach(([_, x, y], i) => {
      let index = 0;

      if (layout === "vertical") {
        index = x < videoWidth / 3 ? 0 : x < (2 * videoWidth) / 3 ? 1 : 2;
      } else if (layout === "horizontal") {
        index = y < videoHeight / 3 ? 0 : y < (2 * videoHeight) / 3 ? 1 : 2;
      } else {
        const col = x < videoWidth / 2 ? 0 : 1;
        const row = y < videoHeight / 2 ? 0 : 1;
        index = row * 2 + col;
      }

      zones[index].count++;
      zones[index].duration += durations[i];
    });

    zones.forEach((z) => {
      z.percentage = (z.count / rows.length) * 100;
    });

    setAnalysisData({ zones, layout });
    setShowList(false); // SWITCH TO ANALYSIS AFTER CALCULATION
  };

  // -------- PAGE UI --------
  return (
    <div>
      <div
        className="titleDiv"
        style={{ alignItems: "center" }}>
        <h2>
          {selectedCsv ? (
            <div>
              <a
                download={selectedCsv}
                href={URL.createObjectURL(
                  new Blob([csvText], { type: "text/csv" })
                )}>
                Download {selectedCsv}
              </a>
            </div>
          ) : (
            "No CSV Loaded"
          )}
        </h2>
        <HomeButton />
      </div>

      <h3>Select a zone layout for analysis:</h3>

      <div>
        <div
          style={{
            display: "flex",
            gap: "16px",
            flexWrap: "wrap",
            justifyContent: "space-between",
          }}>
          <OptionCard
            type="vertical"
            isSelected={analysisData?.layout === "vertical"}
            onClick={() => analyzeZones("vertical")}
            thumbnailSrc={thumbnail}
          />
          <OptionCard
            type="horizontal"
            isSelected={analysisData?.layout === "horizontal"}
            onClick={() => analyzeZones("horizontal")}
            thumbnailSrc={thumbnail}
          />
          <OptionCard
            type="grid"
            isSelected={analysisData?.layout === "grid"}
            onClick={() => analyzeZones("grid")}
            thumbnailSrc={thumbnail}
          />
        </div>
      </div>

      <div className={styles.contentContainer}>
        {showList ? (
          <List title="Results" />
        ) : (
          analysisData && (
            <AnalysisCard
              data={analysisData.zones}
              layout={analysisData.layout}
            />
          )
        )}
      </div>
      {analysisData && !showList && (
          <button className={styles.showListButton} onClick={() => setShowList(true)}>Show Results List</button>
        )}

      {error && <p style={{ color: "red" }}>{error}</p>}
    </div>
  );
}
