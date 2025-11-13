"use client";

import { useRouter } from "next/navigation";

export default function HomeButton() {
  const router = useRouter();

  return <button onClick={() => router.push("/")}>Home</button>;
}
