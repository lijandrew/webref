import React, { useRef } from "react";
import useStore from "./useStore";
import styles from "./Canvas.module.css";

export default function Canvas() {
  const refMap = useStore((state) => state.refMap);
  return <div className={styles.canvas}> {Array.from(refMap.values())} </div>;
}
