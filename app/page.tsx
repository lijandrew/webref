"use client";

import Canvas from "@/Canvas/Canvas";
import UploadButton from "@/UploadButton/UploadButton";
import ContextMenu from "@/ContextMenu/ContextMenu";
import Drop from "@/Drop/Drop";
import Debug from "@/Debug/Debug";

export default function Home() {
  return (
    <main>
      <Canvas />
      <UploadButton />
      <ContextMenu />
      <Drop />
      <Debug />
    </main>
  );
}
