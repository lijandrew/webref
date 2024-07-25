"use client";

import React, { useState } from "react";
import UploadButton from "./UploadButton";
import Canvas from "./Canvas";

// Maps file object url to RefImage component. Url as key allows for component to search and delete itself.
export type RefMap = Map<string, React.JSX.Element>;
export type SetRefMap = (refMap: RefMap) => void;

export default function Home() {
  const [refMap, setRefMap] = useState<RefMap>(new Map());
  return (
    <main>
      <UploadButton refMap={refMap} setRefMap={setRefMap} />
      <Canvas refMap={refMap} setRefMap={setRefMap} />
    </main>
  );
}
