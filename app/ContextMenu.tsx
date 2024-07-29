import React, { useCallback, useEffect, useState } from "react";
import useStore from "./useStore";
import styles from "./ContextMenu.module.css";
import ContextMenuButton from "./ContextMenuButton";

export default function ContextMenu() {
  const addRef = useStore((state) => state.addRef);
  const delRef = useStore((state) => state.delRef);
  const selectedUrl = useStore((state) => state.selectedUrl);
  const setSelectedUrl = useStore((state) => state.setSelectedUrl);
  const contextMenuX = useStore((state) => state.contextMenuX);
  const contextMenuY = useStore((state) => state.contextMenuY);
  const contextMenuShown = useStore((state) => state.contextMenuShown);
  const hideContextMenu = useStore((state) => state.hideContextMenu);
  const [isMac, setIsMac] = useState(false);

  const handleDelete = useCallback(() => {
    // useCallback caches function so it won't be recreated each render. Needed for useEffect.
    delRef(selectedUrl);
    setSelectedUrl("");
    hideContextMenu();
  }, [delRef, selectedUrl, setSelectedUrl, hideContextMenu]);

  const handlePaste = useCallback(async () => {
    // useCallback caches function so it won't be recreated each render. Needed for useEffect.
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
      console.error(err);
    }
    hideContextMenu();
  }, [addRef, hideContextMenu]);

  // TODO: We should request clipboard access instead of having the user click Paste twice.
  // Potential solution: https://web.dev/async-clipboard/#security_and_permissions
  function handleContextMenu(e: React.MouseEvent) {
    // Prevent right-click default behavior on the context menu
    e.preventDefault();
    e.stopPropagation();
    (e.target as HTMLButtonElement).click(); // Doesn't work in Safari
  }

  useEffect(() => {
    if (navigator.userAgent.includes("Mac")) {
      setIsMac(true);
    }
    document.onpaste = handlePaste;
    document.onkeydown = (e) => {
      if (e.key === "Delete" || e.key === "Backspace") {
        handleDelete();
      }
    };
    return () => {
      document.onpaste = null;
      document.onkeydown = null;
    };
  }, [handleDelete, handlePaste]);

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
