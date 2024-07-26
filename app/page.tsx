"use client";

import Canvas from "./Canvas";
import UploadButton from "./UploadButton";
import ContextMenu from "./ContextMenu";

export default function Home() {
  return (
    <main>
      <Canvas />
      <UploadButton />
      <ContextMenu />
    </main>
  );
}
