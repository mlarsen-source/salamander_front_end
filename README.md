# Salamander Frontend

A Next.js frontend for the Centroid Finder Video Processing application. The frontend lets users select a video to process, preview a thumbnail, sample a target color, set a threshold, submit a processing job, and analyze CSV results returned by the backend.

---

## Table of Contents

1. [Overview](#overview)
2. [Features](#features)
3. [Tech Stack](#tech-stack)
4. [Key Pages](#key-pages)
5. [Project Structure](#project-structure)
6. [Key Components](#key-components)
7. [Global State](#global-state)
8. [How It Works](#how-it-works)
9. [Running the App](#running-the-app)
10. [Troubleshooting](#troubleshooting)

---

## Overview

This frontend provides an interactive workflow for tracking an object's centroid in videos and analyzing the results in zone-based layouts. The frontend pairs with a separate backend that performs thumbnail extraction, video processing, binarization, centroid extraction, and CSV export.

---

## Features

- Browse available videos and processed results fetched from the backend
- Hover to sample pixels from the thumbnail and click to lock a `targetColor` value
- Adjust a detection `threshold` and preview a binarized image with computed centroid
- Submit processing jobs and monitor them via a job ID/status
- Analyze returned CSV results in three layouts: 3 vertical zones, 3 horizontal zones, or a 4-zone grid
- Visual and numeric feedback for each zone (frame count, duration, and percent of total)

---

## Tech Stack

- Next.js 16 (App Router)
- React 19
- Zustand for global state

---

## Key Pages

- `/` — Home page that lists available videos and results and allows navigation to preview or results pages
- `/preview` — Thumbnail preview, color picking, threshold selection, job submission
- `/processing` — Polls for job status and shows progress
- `/results` — Shows parsed CSV data and zone analytics

---

## Project Structure

```
app/
├── components/
│   ├── AnalysisCard.jsx
│   ├── ColorPicker.jsx
│   ├── HomeButton.jsx
│   ├── Info.jsx
│   ├── List.jsx
│   ├── OptionCard.jsx
│   ├── ThresholdSelector.jsx
|   └── VideoProcessor.jsx
├── preview/page.jsx      # Video selection & configuration
├── processing/page.jsx   # Processing status page
├── results/page.jsx      # Analysis & visualization UI
├── store/useGlobalStore.jsx
└── page.jsx              # Home page (videos + results navigation)
```

---

## Key Components

| Component               | Purpose                                                                            |
| ----------------------- | ---------------------------------------------------------------------------------- |
| `List.jsx`              | Fetches videos & results and lists files for selection                             |
| `ColorPicker.jsx`       | Displays thumbnail; hover to sample pixel color, click to set `targetColor`        |
| `ThresholdSelector.jsx` | Binarizes thumbnail with `targetColor` and `threshold`, draws centroid overlay     |
| `VideoProcessor.jsx`    | Starts a processing job (POST `/process/:video?targetColor=<hex>&threshold=<int>`) |
| `OptionCard.jsx`        | Shows zone overlay for layouts (vertical/horizontal/grid) on results page          |
| `AnalysisCard.jsx`      | Shows per-zone frames, duration (seconds), and percentages                         |
| `ResultsTable.jsx`      | Renders CSV rows as a table (time, x, y)                                           |
| `HomeButton.jsx`        | Simple navigation back to home                                                     |

---

## Global State

Global state is located in `app/store/useGlobalStore.jsx`. Important values:

- `videoArray` - array of video files available for processing
- `csvArray` - array of csv files that have been previously processed
- `jobId` - unique job identifier used to poll backend job status
- `selectedVideo`- video filename selected by user
- `selectedCsv` - csv filename selected by the user
- `thumbnail` - blob URL loaded for the selected video
- `targetColor` - 6-digit hex color without `#` (e.g. `FF00AA`)
- `threshold` - integer value used by the binarizer
- `videoWidth` - pixel width of video used for analysis
- `videoHeight`- pixel height of video used for analysis,

Setters exist for each of these variables and the store contains default values for local testing.

---

## How It Works

1. Navigate Home and choose a video (or a CSV result) from the `List`.
2. When a video is selected, the app requests `/thumbnail/:video` and displays it as a preview.
3. Hover on the thumbnail to preview a pixel's color; click to set the `targetColor`.
4. Use the `ThresholdSelector` to adjust the threshold and preview the binarized image and the centroid of the largest component.
5. Click `Process` to call `POST /process/:video` with `targetColor` and `threshold` query parameters; backend returns `{ jobId }`.
6. `/processing` polls for job completion. When finished, results appear under `GET /api/results` and the CSV itself is available via `GET /api/csv/:filename`.
7. `/results` reads, parses, and computes zone analytics (counts, duration, and percentage) using the loaded rows and the video dimensions.

---

## Running the App

### Prerequisites

- Node.js (v18+ recommended)
- A backend server (the Salamander backend) that exposes the endpoints used by the frontend

### Install

```bash
npm install
```

### Development Server

Run the dev server:

```bash
npm run dev -p 3001
```

By default Next.js runs on port **3000**. Because the frontend currently makes absolute fetches to `http://localhost:3000`, it’s easiest for local development to ensure the frontend is running on a different port (e.g., `3001`).

---

## Troubleshooting

**Thumbnail missing**

- Ensure the backend `/thumbnail/:video` endpoint is reachable and returns a binary image (the frontend expects an image blob).

**No files listed**

- Check that `GET /api/videos` and `GET /api/results` return JSON arrays of strings (video and csv file names).

**Processing fails / job does not start**

- Ensure POST `/process/:video` accepts `targetColor` and `threshold` query params and returns `{ jobId: string }`.

**CORS or network issues**

- If the frontend and backend are on different ports, configure CORS on the backend or set a proxy during development.

**Incorrect analysis**

- Confirm CSV rows are in the proper `(time, x, y)` format and that `videoWidth` and `videoHeight` values match the video dimensions used for coordinates.

---
