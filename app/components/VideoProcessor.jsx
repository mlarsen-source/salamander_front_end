"use client";
import ColorPicker from "@/app/components/ColorPicker";
import ThresholdSelector from "@/app/components/ThresholdSelector";
import { useGlobalStore } from "@/app/store/useGlobalStore";
import { useRouter } from "next/navigation";

export default function VideoProcessor() {
  const selectedVideo = useGlobalStore((state) => state.selectedVideo);
  const setJobId = useGlobalStore((state) => state.setJobId);

  const targetColor = useGlobalStore((state) => state.targetColor);
  const threshold = useGlobalStore((state) => state.threshold);
  const router = useRouter();
  async function startProcess() {
    try {
      const res = await fetch(
        `http://localhost:3000/process/${selectedVideo}?targetColor=${targetColor}&threshold=${threshold}`,
        {
          method: "POST",
        }
      );

      if (!res.ok) {
        console.error("Server returned error:", res.status);
        return;
      }

      const data = await res.json();

      // set JobId in global store
      setJobId(data.jobId);

      // send to processing page
      router.push("/processing");

      console.log("Job started:", data.jobId);
    } catch (err) {
      console.error("Error processing video:", err);
    }
  }

  return (
    <div style={{ marginBottom: "20px" }}>
      <h2>Preview</h2>
      <ColorPicker />
      <ThresholdSelector />
      <button onClick={startProcess}>Process</button>
    </div>
  );
}
