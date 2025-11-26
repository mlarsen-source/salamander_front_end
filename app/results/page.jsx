"use client";

import HomeButton from "@/app/components/HomeButton";
import ResultsTable from "@/app/components/ResultsTable";
import { useGlobalStore } from "@/app/store/useGlobalStore";
import { useEffect, useState } from "react";
import styles from "./page.module.css";

export default function ResultsPage() {
  const selectedCsv = useGlobalStore((state) => state.selectedCsv);
  const title = selectedCsv ? selectedCsv.slice(0, -4) : "";
  const [rows, setRows] = useState([]);
  const [csvText, setCsvText] = useState("");
  const [error, setError] = useState("");

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
          .map((line) => line.split(","));

        setRows(parsed);
      } catch (err) {
        setError("Error loading CSV.");
      }
    }

    loadCsv();
  }, [selectedCsv]);

  const downloadUrl = csvText
    ? URL.createObjectURL(new Blob([csvText], { type: "text/csv" }))
    : null;

  if (!selectedCsv) {
    return (
      <div className={styles.wrap}>
        <p>No CSV selected.</p>
        <HomeButton />
      </div>
    );
  }

  return (
    <div className={styles.wrap}>
      <div className={styles.titleContainer}>
        {downloadUrl && (
          <h2>
            <a href={downloadUrl} download={selectedCsv}>
              {selectedCsv}
            </a>
          </h2>
        )}
        <HomeButton />
      </div>
      <ResultsTable rows={rows} />
      {error && <p className={styles.error}>{error}</p>}
    </div>
  );
}
