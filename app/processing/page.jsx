"use client";

import { useGlobalStore } from "@/app/store/useGlobalStore";
import { useState, useEffect, useRef } from "react";

export default function ProcessingPage() {
  const jobId = useGlobalStore((state) => state.jobId);
  const [processing, setProcessing] = useState(true);
  const [error, setError] = useState(false);
  const controllerRef = useRef(null);


  // need to add logic to loop api fetch status using jobId until jobId == "done"
  useEffect(() => {
    if (!jobId) return;

    let cancelled = false;
    const POLL_INTERVAL_MS = 2000;
    let timeoutId;

    // reset state per new job
    setProcessing(true);
    setError(false);

    async function poll() {
      if (cancelled) return;

      // cancel any in-flight request before starting a new one
      if (controllerRef.current) controllerRef.current.abort();
      controllerRef.current = new AbortController();

      try {
        const res = await fetch(`http://localhost:3000/process/${jobId}/status`, {
          signal: controllerRef.current.signal,
        });
        const data = await res.json();

        if (!res.ok) {
          throw new Error("Error fetching status");
        }

        if (cancelled) return;

        if (data.status === "error") {
          setError(true);
          setProcessing(false);
          return; // stop polling
        }

        if (data.status !== "processing") {
          setProcessing(false);
          return; // stop polling on success/done
        }
      } catch (err) {
        if (cancelled) return;
        // Log and continue polling; could add backoff here if desired
        console.log("Polling error:", err?.message || err);
        setError(true);
        setProcessing(false);
        cancelled = true;

      } finally {
        if (!cancelled) {
          timeoutId = setTimeout(poll, POLL_INTERVAL_MS);
        }
      }
    }

    poll();

    return () => {
      cancelled = true;
      if (controllerRef.current) controllerRef.current.abort();
      if (timeoutId) clearTimeout(timeoutId);
    };
  }, [jobId]);

  if (processing) return <div>Processing...</div>;
  if (error) return <div>Error...</div>;
  return <div>Success...</div>;
}
