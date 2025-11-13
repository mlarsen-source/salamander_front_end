import { useGlobalStore } from "@/app/store/useGlobalStore";

export default function VideoList() {
  // get videoArray from GlobalStore
  const videoArray = useGlobalStore((state) => state.videoArray);

  const videos = videoArray.map((video) => {
    return (
      <li key={video}>
        <a href="/preview"> {video} </a>
      </li>
    );
  });

  return (
    <section>
      <h3>This is the VideoList Component</h3>
      <ul>{videos}</ul>
    </section>
  );
}
