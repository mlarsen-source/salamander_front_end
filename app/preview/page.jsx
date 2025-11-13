"use client";

import HomeButton from "@/app/components/HomeButton";
import VideoList from "@/app/components/VideoList";
import VideoProcessor from "@/app/components/VideoProcessor";

export default function PreviewPage() {
  return (
    <main>
      <h1>This is the Preview Page</h1>
      <VideoProcessor />
      <VideoList />
      <HomeButton />
    </main>
  );
}
