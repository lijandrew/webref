/*
ContextMenu.tsx

Contains and renders the context menu, which is built from ContextMenuButton components.
Handles all of the operations a user can perform (e.g. delete, paste, select all, open).
Also binds the relevant keyboard shortcuts.
*/

import React, { useCallback, useEffect, useState } from "react";
import useStore from "@/useStore";
import ContextMenuButton from "@/ContextMenuButton/ContextMenuButton";
import styles from "./ContextMenu.module.css";

export default function ContextMenu() {
  const refMap = useStore((state) => state.refMap);
  const addRef = useStore((state) => state.addRef);
  const delRef = useStore((state) => state.delRef);
  const selectedUrls = useStore((state) => state.selectedUrls);
  const selectUrl = useStore((state) => state.selectUrl);
  const clearSelection = useStore((state) => state.clearSelection);
  const contextMenuX = useStore((state) => state.contextMenuX);
  const contextMenuY = useStore((state) => state.contextMenuY);
  const contextMenuShown = useStore((state) => state.contextMenuShown);
  const hideContextMenu = useStore((state) => state.hideContextMenu);
  const [isMac, setIsMac] = useState(false);

  // Handle deleting images.
  const handleDelete = useCallback(() => {
    if (selectedUrls.size == 0) {
      return;
    }
    for (const url of Array.from(selectedUrls)) {
      delRef(url);
    }
    clearSelection();
    hideContextMenu();
  }, [delRef, hideContextMenu, clearSelection, selectedUrls]);

  // Handle pasting images from clipboard.
  const handlePaste = useCallback(async () => {
    try {
      clearSelection(); // Clear selection before pasting because we want to select the new ones.
      const clipboardItems = await navigator.clipboard.read();
      for (const clipboardItem of clipboardItems) {
        const imageTypes = clipboardItem.types.filter((type) =>
          type.startsWith("image/"),
        );
        for (const imageType of imageTypes) {
          const blob = await clipboardItem.getType(imageType);
          const url = URL.createObjectURL(blob);
          addRef(url); // Add image to canvas.
          selectUrl(url, true); // Add image to selection.
        }
      }
    } catch (err: unknown) {
      console.error(err); // Catches error when user denies clipboard access.
    }
    if (contextMenuShown) {
      hideContextMenu();
    }
  }, [contextMenuShown, clearSelection, addRef, selectUrl, hideContextMenu]);

  // Block right-click on context menu and treat as left-click. Doesn't work in Safari.
  function handleContextMenu(e: React.MouseEvent) {
    e.preventDefault();
    e.stopPropagation();
    (e.target as HTMLButtonElement).click();
  }

  const handleSelectAll = useCallback(() => {
    for (const url of Array.from(refMap.keys())) {
      selectUrl(url, false);
    }
  }, [refMap, selectUrl]);

  function handleOpen() {
    const fileInput = document.querySelector(
      "input[type=file]",
    ) as HTMLInputElement;
    fileInput?.click();
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
      } else if (e.ctrlKey || e.metaKey) {
        // Ctrl/Cmd shortcuts
        if (e.key === "a") {
          e.preventDefault();
          handleSelectAll();
        } else if (e.key === "o") {
          e.preventDefault();
          handleOpen();
        }
      }
    }
    document.addEventListener("keydown", handleKeyDown);
    document.addEventListener("paste", handlePaste); // Paste event is not a keyboard event.
    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      document.removeEventListener("paste", handlePaste);
    };
  }, [
    contextMenuShown,
    handleDelete,
    handlePaste,
    handleSelectAll,
    hideContextMenu,
  ]);

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
        disabled={selectedUrls.size == 0}
        onClick={handleDelete}
      />
      {/* Chrome will ask and save clipboard permission, but Firefox and Safari will prompt each time. */}
      <ContextMenuButton
        label="Paste"
        shortcut={isMac ? "⌘V" : "^V"}
        disabled={false}
        onClick={handlePaste}
      />
      {/* For some reason the select all doesn't make the Selection.tsx render the box */}
      <ContextMenuButton
        label="Select all"
        shortcut={isMac ? "⌘A" : "^A"}
        disabled={false}
        onClick={handleSelectAll}
      />
      <ContextMenuButton
        label="Open"
        shortcut={isMac ? "⌘O" : "^O"}
        disabled={false}
        onClick={handleOpen}
      />
    </div>
  );
}
