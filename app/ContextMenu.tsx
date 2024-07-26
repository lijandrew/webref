import React from "react";
import useStore from "./useStore";
import styles from "./ContextMenu.module.css";

export default function ContextMenu() {
  const setSelectedUrl = useStore((state) => state.setSelectedUrl);
  const delRef = useStore((state) => state.delRef);
  const selectedUrl = useStore((state) => state.selectedUrl);
  const contextMenuX = useStore((state) => state.contextMenuX);
  const contextMenuY = useStore((state) => state.contextMenuY);
  const contextMenuShown = useStore((state) => state.contextMenuShown);
  const hideContextMenu = useStore((state) => state.hideContextMenu);

  // TODO: move context menu buttons into their own components
  function handleDelete() {
    // Delete the RefImage with the selected URL, clear selected URL, and hide context menu
    delRef(selectedUrl);
    setSelectedUrl("");
    hideContextMenu();
  }

  return (
    <div
      className={styles.ContextMenu}
      style={{
        display: contextMenuShown ? "block" : "none",
        transform: `translate(${contextMenuX}px, ${contextMenuY}px)`,
      }}
    >
      <button
        className={selectedUrl == "" ? styles.disabled : ""}
        onClick={handleDelete}
      >
        Delete
      </button>
    </div>
  );
}
