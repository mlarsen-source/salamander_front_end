import { useGlobalStore, setVideoArray } from "@/app/store/useGlobalStore";
import { useState, useEffect } from "react";

export default function List({ title }) {
  const setVideoArray = useGlobalStore((state) => state.setVideoArray);
  const setCsvArray = useGlobalStore((state) => state.setCsvArray);
  const type = title.toLowerCase();
  

  useEffect(() => {
    async function fetchData() {
      try {
        const res = await fetch(`http://localhost:3000/api/${type}`);
        const data = await res.json();

        if (!res.ok) {
          console.log("Error fetching data");
          return;
        }
        console.log(data);
        if (type == 'videos') setVideoArray(data);
        if (type == 'results') setCsvArray(data);
      
      } catch {}
    }

    fetchData();
  }, []);

  const videoList = useGlobalStore((state) => state.videoArray);
  const csvList = useGlobalStore((state) => state.csvArray);

  const fileNames = type == "videos" ? videoList : csvList;
  const route = type == "videos" ? '/preview' : '/results'

  const fileList = fileNames.map((fileName) => {
    return (
      <li key={fileName}>
        <a href={route} onClick={() => handleSelected(type)}> {fileName} </a>
      </li>
    );
  });

  return (
    <section>
      <h3>This is the {title} Component</h3>
      <ul>{fileList}</ul>
    </section>
  );
}
