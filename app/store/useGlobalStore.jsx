import { create } from "zustand";

export const useGlobalStore = create((set) => ({
  // Global State Variables
  videoArray: ["testVideo1.mp4", "testVideo2.mp4", "testVideo3.mp4"],
  csvArray: ["testFile1.csv", "testFile2.csv", "testFile3.csv"],
  jobId: "123abc",
  selectedVideo: null,
  selectedCsv: null,
  thumbnail: null,
  targetColor: "530004",
  threshold: 40,

  // Global State Setters
  setVideoArray: (arr) => set({ videoArray: arr }),
  setCsvArray: (arr) => set({ csvArray: arr }),
  setJobId: (id) => set({ jobId: id }),
  setThumbnail: (img) => set({ thumbnail: img }),
  setSelectedVideo: (fileName) => set({ selectedVideo: fileName }),
  setSelectedCsv: (fileName) => set({ selectedCsv: fileName }),
  setTargetColor: (color) => set({ targetColor: color }),
  setThreshold: (value) => set({ threshold: value }),
}));
