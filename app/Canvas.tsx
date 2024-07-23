"use client";

import React, { useRef } from "react";
import type { ImageMap, Metadata } from "./page";
import RefImage from "./RefImage";
import styles from "./Canvas.module.css";

interface Props {
  imageMap: ImageMap;
  setImageMap: (imageMap: ImageMap) => void;
}

export default function Canvas({ imageMap, setImageMap }: Props) {
  const getImgs = () => {
    const imgs = [];
    for (const [url, metadata] of Array.from(imageMap.entries())) {
      imgs.push(<RefImage url={url} />);
    }
    return imgs;
  };
  return <div className={styles.canvas}>{getImgs()}</div>;
}
