"use client";

import Canvas from "@/Canvas/Canvas";
import Splash from "@/Splash/Splash";
import Selection from "@/Selection/Selection";
import ContextMenu from "@/ContextMenu/ContextMenu";
import Drop from "@/Drop/Drop";
import Debug from "@/Debug/Debug";

console.log = function () {}; // Comment to enable logging

export default function Home() {
  return (
    <main>
      <Canvas />
      <Splash />
      <Selection />
      <ContextMenu />
      <Drop />
      <Debug />
    </main>
  );
}
