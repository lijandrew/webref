import React, { useEffect, useRef } from "react";
import useSelectionStore from "@/stores/useSelectionStore";
import useRefStore from "@/stores/useRefStore";
import styles from "./Selection.module.css";
import { Rnd } from "react-rnd";

export default function Selection() {
  const refMap = useRefStore((state) => state.refMap);
  const selectedUrls = useSelectionStore((state) => state.selectedUrls);
  const selectionRnd = useRef<Rnd | null>(null);

  // Update the selection box position and size. Must be after render so that selectionRnd is non-null.
  useEffect(() => {
    if (selectedUrls.size === 0) return;
    let xMin = Infinity;
    let yMin = Infinity;
    let xMax = -Infinity;
    let yMax = -Infinity;
    for (const url of Array.from(selectedUrls)) {
      const refData = refMap.get(url);
      if (!refData) continue;
      const { x, y, width, height } = refData;
      xMin = Math.min(x, xMin);
      yMin = Math.min(y, yMin);
      xMax = Math.max(x + width, xMax);
      yMax = Math.max(y + Number(height), yMax);
    }
    if (selectionRnd.current) {
      selectionRnd.current.updatePosition({ x: xMin, y: yMin });
      selectionRnd.current.updateSize({
        width: xMax - xMin,
        height: yMax - yMin,
      });
    }
  });

  return (
    // Disable resizing for now
    // TODO: resize all selected images on drag by setting their resize anchor point to the corner of the Selection Rnd.
    <Rnd
      style={{ display: selectedUrls.size === 0 ? "none" : "block" }}
      className={styles.Selection}
      ref={selectionRnd}
      lockAspectRatio={true}
      enableResizing={false}
      disableDragging={true}
    />
  );
}
