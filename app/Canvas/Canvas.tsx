import React from "react";
import useRefStore from "@/stores/useRefStore";
import useContextMenuStore from "@/stores/useContextMenuStore";
import useSelectionStore from "@/stores/useSelectionStore";
import RefImage from "@/RefImage/RefImage";
import styles from "./Canvas.module.css";

export default function Canvas() {
  const refMap = useRefStore((state) => state.refMap);
  const clearSelection = useSelectionStore((state) => state.clearSelection);
  const contextMenuShown = useContextMenuStore(
    (state) => state.contextMenuShown,
  );
  const showContextMenu = useContextMenuStore((state) => state.showContextMenu);
  const hideContextMenu = useContextMenuStore((state) => state.hideContextMenu);

  // Handle clicking on the canvas
  function handleMouseDown(e: React.MouseEvent) {
    // Right mouse button is handled by context menu.
    if (e.button == 2) return;
    // Clear selection unless shift held
    if (!e.shiftKey) {
      clearSelection();
    }
    // Hide context menu
    if (contextMenuShown) {
      hideContextMenu();
    }
  }

  // Handle right-clicking on the canvas
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
