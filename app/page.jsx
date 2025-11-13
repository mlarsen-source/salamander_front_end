"use client";

import CsvList from "@/app/components/CsvList";
import Info from "@/app/components/Info";
import VideoList from "@/app/components/VideoList";
import { useGlobalStore } from "@/app/store/useGlobalStore";
import List from '@/app/components/List'

export default function HomePage() {
  const setVideoArray = useGlobalStore((state) => state.setVideoArray);
  const setCsvArray = useGlobalStore((state) => state.setCsvArray);
  const setSelectedVideo = useGlobalStore((state) => state.setSelectedVideo);
  const setSelectedCsv = useGlobalStore((state) => state.setSelectedCsv);

  // To Do:

  // Get/Set Videos List:
  // useEffect
  // get videoArray from API fetch
  // const videoArray = fetch
  // set videosArray state in GlobalStore
  // setVideoArray(videoArray);

  // Get/Set CSV List:
  // useEffect / Async
  // create controller in server that returns a list of all csv files in results volume
  // browser can only fetch via HTTP, it cannot access volumes directly
  // get csvArray from API fetch
  // set csvArray in GlobalStore
  // setCsvArray(csvArray);

  // Get/Set Selected Video:
  // get selected video file name from onClick
  // set selected video state in GlobalStore
  // setSelectedVideo(selectedVideo);
  // render processing page

  // Get/Set Selected CSV:
  // get selected csv file name from onClick
  // set selected csv state in GlobalStore
  // setSelectedCsv(selectedCsv);
  // render results page

  function setSelected(selected, type) {
    
  }

  return (
    <main>
      <h1>This is the Home Page</h1>
      <Info />
      <List title='Videos' handleSelected={setSelected}/>
      {/* <List title='Results' handleSelected={setSelected}/> */}
    </main>
  );
}
