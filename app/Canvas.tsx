import React, { useRef } from "react";
import type { RefMap, SetRefMap } from "./page";
import styles from "./Canvas.module.css";

type Props = {
  refMap: RefMap;
  setRefMap: SetRefMap;
};

export default function Canvas({ refMap, setRefMap }: Props) {
  return <div className={styles.canvas}> {Array.from(refMap.values())} </div>;
}
