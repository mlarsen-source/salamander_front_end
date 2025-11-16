"use client";

import Info from "@/app/components/Info";
import List from "@/app/components/List";
import { useGlobalStore } from "@/app/store/useGlobalStore";

export default function HomePage() {
  const setVideoArray = useGlobalStore((state) => state.setVideoArray);
  const setCsvArray = useGlobalStore((state) => state.setCsvArray);

  

  return (
    <main>
      <h1>This is the Home Page</h1>
      <Info />
      <List
        title="Videos"
      />
      <List
        title="Results"
      />
    </main>
  );
}
