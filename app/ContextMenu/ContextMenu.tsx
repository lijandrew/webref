import React, { useCallback, useEffect, useState } from "react";
import useRefStore from "@/stores/useRefStore";
import useSelectionStore from "@/stores/useSelectionStore";
import useContextMenuStore from "@/stores/useContextMenuStore";
import ContextMenuButton from "@/ContextMenuButton/ContextMenuButton";
import styles from "./ContextMenu.module.css";

export default function ContextMenu() {
  const addRef = useRefStore((state) => state.addRef);
  const delRef = useRefStore((state) => state.delRef);
  const selectedUrl = useSelectionStore((state) => state.selectedUrl);
  const setSelectedUrl = useSelectionStore((state) => state.setSelectedUrl);
  const contextMenuX = useContextMenuStore((state) => state.contextMenuX);
  const contextMenuY = useContextMenuStore((state) => state.contextMenuY);
  const contextMenuShown = useContextMenuStore(
    (state) => state.contextMenuShown,
  );
  const hideContextMenu = useContextMenuStore((state) => state.hideContextMenu);
  const [isMac, setIsMac] = useState(false);

  // useCallback caches function so it won't be recreated each render. Needed for useEffect.
  const handleDelete = useCallback(() => {
    if (!selectedUrl) return;
    delRef(selectedUrl);
    setSelectedUrl("");
    hideContextMenu();
  }, [delRef, selectedUrl, setSelectedUrl, hideContextMenu]);

  const handlePaste = useCallback(async () => {
    try {
      const clipboardItems = await navigator.clipboard.read();
      for (const clipboardItem of clipboardItems) {
        const imageTypes = clipboardItem.types.filter((type) =>
          type.startsWith("image/"),
        );
        for (const imageType of imageTypes) {
          const blob = await clipboardItem.getType(imageType);
          const url = URL.createObjectURL(blob);
          addRef(url);
        }
      }
    } catch (err: unknown) {
      console.error(err); // Catches error when user denies clipboard access.
    }
    hideContextMenu();
  }, [addRef, hideContextMenu]);

  // Block right-click on context menu and treat as left-click. Doesn't work in Safari.
  function handleContextMenu(e: React.MouseEvent) {
    e.preventDefault();
    e.stopPropagation();
    (e.target as HTMLButtonElement).click();
  }

  useEffect(() => {
    // Detect if user is on Mac to display correct shortcuts.
    if (navigator.userAgent.includes("Mac")) {
      setIsMac(true);
    }
    // Handle keyboard shortcuts.
    function handleKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape" && contextMenuShown) {
        hideContextMenu();
      } else if (e.key === "Delete" || e.key == "Backspace") {
        handleDelete();
      }
    }
    document.addEventListener("keydown", handleKeyDown);
    document.addEventListener("paste", handlePaste); // Paste event is not a keyboard event.
    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      document.removeEventListener("paste", handlePaste);
    };
  }, [contextMenuShown, handleDelete, handlePaste, hideContextMenu]);

  return (
    <div
      className={styles.ContextMenu}
      onContextMenu={handleContextMenu}
      style={{
        display: contextMenuShown ? "block" : "none",
        transform: `translate(${contextMenuX}px, ${contextMenuY}px)`,
      }}
    >
      <ContextMenuButton
        label="Delete"
        shortcut="Del"
        disabled={!selectedUrl}
        onClick={handleDelete}
      />
      {/* Chrome will ask and save clipboard permission, but Firefox and Safari will prompt each time. */}
      <ContextMenuButton
        label="Paste"
        shortcut={isMac ? "⌘V" : "^V"}
        disabled={false}
        onClick={handlePaste}
      />
    </div>
  );
}
