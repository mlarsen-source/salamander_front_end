"use client";

import Info from "@/app/components/Info";
import List from "@/app/components/List";
import { useGlobalStore } from "@/app/store/useGlobalStore";

export default function HomePage() {
  const setVideoArray = useGlobalStore((state) => state.setVideoArray);
  const setCsvArray = useGlobalStore((state) => state.setCsvArray);
  const setSelectedVideo = useGlobalStore((state) => state.setSelectedVideo);
  const setSelectedCsv = useGlobalStore((state) => state.setSelectedCsv);

  function setSelected(type, fileName) {
    if (type === "videos") {
      setSelectedVideo(fileName);
    } else {
      setSelectedCsv(fileName);
    }
  }

  return (
    <main>
      <h1>This is the Home Page</h1>
      <Info />
      <List
        title="Videos"
        handleSelected={setSelected}
      />
      <List
        title="Results"
        handleSelected={setSelected}
      />
    </main>
  );
}
