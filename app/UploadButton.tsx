"use client";
import React from "react";
import type { ImageMap, Metadata } from "./page";

interface Props {
  imageMap: ImageMap;
  setImageMap: (imageMap: ImageMap) => void;
}

export default function UploadButton({ imageMap, setImageMap }: Props) {
  function handleChange(e: React.ChangeEvent<HTMLInputElement>): void {
    const files = Array.from(e.target.files || []);
    const newImageMap = new Map(imageMap); // Shallow copy bc state is immutable
    for (const file of files) {
      const url = URL.createObjectURL(file); // Creates url referencing the file to use as img src
      const metadata: Metadata = {
        // Default initial position and scale
        x: 0,
        y: 0,
        scale: 1,
      };
      newImageMap.set(url, metadata);
    }
    setImageMap(newImageMap);
  }
  return (
    <input
      onChange={handleChange}
      type="file"
      multiple
      accept=".png,.jpg,.jpeg"
    />
  );
}
