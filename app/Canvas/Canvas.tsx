import React from "react";
import useRefStore from "@/stores/useRefStore";
import useContextMenuStore from "@/stores/useContextMenuStore";
import useSelectionStore from "@/stores/useSelectionStore";
import RefImage from "@/RefImage/RefImage";
import styles from "./Canvas.module.css";

export default function Canvas() {
  const refMap = useRefStore((state) => state.refMap);
  const selectedUrl = useSelectionStore((state) => state.selectedUrl);
  const setSelectedUrl = useSelectionStore((state) => state.setSelectedUrl);
  const contextMenuShown = useContextMenuStore(
    (state) => state.contextMenuShown,
  );
  const showContextMenu = useContextMenuStore((state) => state.showContextMenu);
  const hideContextMenu = useContextMenuStore((state) => state.hideContextMenu);

  // Clear selection and hide context menu when clicking on the canvas
  function handleMouseDown() {
    if (selectedUrl) {
      setSelectedUrl("");
    }
    if (contextMenuShown) {
      hideContextMenu();
    }
  }

  // Show context menu when right-clicking on the canvas
  function handleContextMenu(e: React.MouseEvent) {
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
