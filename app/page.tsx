"use client";

import { useState } from "react";
import UploadButton from "./UploadButton";
import Canvas from "./Canvas";

// Describes position and scale of an image
export type Metadata = {
  x: number;
  y: number;
  scale: number;
};

// Maps <file url> to <Metadata object describing position and scale>
export type ImageMap = Map<string, Metadata>;

export default function Home() {
  const [imageMap, setImageMap] = useState<ImageMap>(new Map());
  return (
    <main>
      <UploadButton imageMap={imageMap} setImageMap={setImageMap} />
      <Canvas imageMap={imageMap} setImageMap={setImageMap} />
    </main>
  );
}
