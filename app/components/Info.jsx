import styles from "./Info.module.css";

export default function Info() {
  return (
    <section className={styles.section}>
      <img
        className={styles.img}
        src="./salamander-info.webp"
        alt=""
      />
      <div>
        <h3>Welcome to the Salamander Centroid Finder</h3>
        <p>
          This tool allows you to process and analyze salamander movement in
          videos by tracking the centroid of a target color. Follow these steps
          to analyze your video:
        </p>
        <ol>
          <li>
            Select a video from the available list to load a thumbnail preview
          </li>
          <li>
            Sample the target color by hovering over the thumbnail and clicking
            to lock in the salamander's color
          </li>
          <li>
            Adjust the detection threshold to preview the binarized image and
            computed centroid
          </li>
          <li>Click "Process" to submit the processing job</li>
          <li>
            Analyze the results using zone-based layouts to see where the
            salamander spent time, with detailed metrics including frame counts,
            duration, and percentages for each zone
          </li>
        </ol>
      </div>
    </section>
  );
}
