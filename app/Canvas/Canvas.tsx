import React from "react";
import useRefStore from "@/stores/useRefStore";
import useContextMenuStore from "@/stores/useContextMenuStore";
import useSelectionStore from "@/stores/useSelectionStore";
import RefImage from "@/RefImage/RefImage";
import styles from "./Canvas.module.css";

export default function Canvas() {
  const refMap = useRefStore((state) => state.refMap);
  const setSelectedUrl = useSelectionStore((state) => state.setSelectedUrl);
  const showContextMenu = useContextMenuStore((state) => state.showContextMenu);
  const hideContextMenu = useContextMenuStore((state) => state.hideContextMenu);

  function handleMouseDown() {
    // Clear selection and hide context menu when clicking on the canvas
    setSelectedUrl("");
    hideContextMenu();
  }

  function handleContextMenu(e: React.MouseEvent) {
    // Show context menu when right-clicking on the canvas
    e.preventDefault();
    showContextMenu(e.clientX, e.clientY);
  }

  return (
    <div
      className={styles.Canvas}
      onMouseDown={handleMouseDown}
      onContextMenu={handleContextMenu}
    >
      {Array.from(refMap.keys()).map((url) => (
        <RefImage key={url} url={url} />
      ))}
    </div>
  );
}
