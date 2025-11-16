"use client";

import HomeButton from "@/app/components/HomeButton";
import List from "@/app/components/List";
import VideoProcessor from "@/app/components/VideoProcessor";

export default function PreviewPage() {
  return (
    <main>
      <h1>This is the Preview Page</h1>
      <VideoProcessor />
      <List
        title="Videos"
      />
      <HomeButton />
    </main>
  );
}
