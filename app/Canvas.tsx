import React from "react";
import useStore from "./useStore";
import styles from "./Canvas.module.css";
import RefImage from "./RefImage";

export default function Canvas() {
  const refMap = useStore((state) => state.refMap);
  const setSelectedUrl = useStore((state) => state.setSelectedUrl);
  const showContextMenu = useStore((state) => state.showContextMenu);
  const hideContextMenu = useStore((state) => state.hideContextMenu);

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
