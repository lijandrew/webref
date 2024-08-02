import React from "react";
import useStore from "@/useStore";
import RefImage from "@/RefImage/RefImage";
import styles from "./Canvas.module.css";

export default function Canvas() {
  const refMap = useStore((state) => state.refMap);
  const clearSelection = useStore((state) => state.clearSelection);
  const contextMenuShown = useStore((state) => state.contextMenuShown);
  const showContextMenu = useStore((state) => state.showContextMenu);
  const hideContextMenu = useStore((state) => state.hideContextMenu);

  // Handle mousedown on the canvas (more configurable than click)
  function handleMouseDown(e: React.MouseEvent) {
    if (e.button == 2) return; // Right mouse button is only for context menu
    if (contextMenuShown) {
      hideContextMenu();
    }
    // Ignore if shift key is pressed (for multi-select)
    if (e.shiftKey) return;
    clearSelection();
  }

  // Handle right-clicking on the canvas
  function handleContextMenu(e: React.MouseEvent) {
    e.preventDefault();
    showContextMenu(e.clientX, e.clientY);
  }

  // Create list of RefImage components, saving the last selected one to put on top
  function getRefImageComponents() {
    const components = [];
    for (const url of Array.from(refMap.keys())) {
      components.push(<RefImage key={url} url={url} />);
    }
    return components;
  }

  return (
    <div
      className={styles.Canvas}
      onMouseDown={handleMouseDown}
      onContextMenu={handleContextMenu}
    >
      {getRefImageComponents()}
    </div>
  );
}
