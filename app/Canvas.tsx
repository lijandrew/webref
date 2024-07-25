import React from "react";
import useStore from "./useStore";
import styles from "./Canvas.module.css";
import { Rnd } from "react-rnd";

export default function Canvas() {
  const refMap = useStore((state) => state.refMap);
  return <Rnd className={styles.Canvas}> {Array.from(refMap.values())} </Rnd>;
}
