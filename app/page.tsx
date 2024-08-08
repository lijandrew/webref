"use client";

import Canvas from "@/Canvas/Canvas";
import ContextMenu from "@/ContextMenu/ContextMenu";
import Drop from "@/Drop/Drop";
import Debug from "@/Debug/Debug";

export default function Home() {
  return (
    <div>
      <Canvas />
      <ContextMenu />
      <Drop />
      <Debug />
    </div>
  );
}
