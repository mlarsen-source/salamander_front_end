"use client";

import { useGlobalStore } from "@/app/store/useGlobalStore";

export default function ProcessingPage() {
  const jobId = useGlobalStore((state) => state.jobId);

  // need to add logic to loop api fetch status using jobId until jobId == "done"

  return (
    <main>
      <h1>This is the Processing Page</h1>
      <p>
        Do we want a separate error page or should we just update this page
        dynamically success / failure?
      </p>
      <p>JobSuccess Component / JobFailed Component?</p>
    </main>
  );
}
