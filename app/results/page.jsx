"use client";

import HomeButton from "@/app/components/HomeButton";
import ResultsTable from "@/app/components/ResultsTable";
import { useGlobalStore } from "@/app/store/useGlobalStore";
import { useEffect, useState } from "react";

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

  if (!selectedCsv) return <p>No CSV selected.</p>;

  return (
    <div>
      <h1>This is the Results Page</h1>
      <h2>Results for: {title}</h2>
      <ResultsTable rows={rows} />
      {downloadUrl && (
        <a
          href={downloadUrl}
          download={selectedCsv}>
          {selectedCsv}
        </a>
      )}
      {error && <p>{error}</p>}
      <HomeButton />
    </div>
  );
}
