"use client";

import Canvas from "./Canvas";
import UploadButton from "./UploadButton";
import ContextMenu from "./ContextMenu";
import Debug from "./Debug";

export default function Home() {
  return (
    <main>
      <Canvas />
      <UploadButton />
      <ContextMenu />
      <Debug />
    </main>
  );
}
