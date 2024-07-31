"use client";

import Canvas from "./Canvas";
import UploadButton from "./UploadButton";
import ContextMenu from "./ContextMenu";
import Debug from "./Debug";
import Drop from "./Drop";

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
