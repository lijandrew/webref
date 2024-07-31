// I feel like could easily be turned into a easy "fullscreen dropzone" niche npm package.
import React, { useState, useEffect } from "react";
import useRefStore from "@/stores/useRefStore";
import useSelectionStore from "@/stores/useSelectionStore";
import styles from "./Drop.module.css";

export default function Drop() {
  const addRef = useRefStore((state) => state.addRef);
  const clearSelection = useSelectionStore((state) => state.clearSelection);
  const selectUrl = useSelectionStore((state) => state.selectUrl);
  const [show, setShow] = useState(false);
  useEffect(() => {
    function handleDragStart(e: DragEvent) {
      e.preventDefault();
    }
    function handleDragEnd(e: DragEvent) {
      e.preventDefault();
    }
    function handleDragOver(e: DragEvent) {
      e.preventDefault();
    }
    function handleDrag(e: DragEvent) {
      e.preventDefault();
    }
    // Show dropzone only when files are dragged over window to not block pointer events when not needed.
    function handleDragEnter(e: DragEvent) {
      e.preventDefault();
      setShow(true);
    }
    // Hide dropzone when files are dragged out of window (i.e. cancel upload).
    function handleDragLeave(e: DragEvent) {
      e.preventDefault();
      setShow(false);
    }
    // Handle files dropped in window.
    function handleDrop(e: DragEvent) {
      e.preventDefault(); // Prevent browser from opening file.
      clearSelection();
      if (!e.dataTransfer) return;
      // I think e.dataTransfer.files is more reliable than e.dataTransfer.items.
      for (const file of Array.from(e.dataTransfer.files)) {
        if (file.type.startsWith("image/")) {
          console.log("Dropping file", file);
          const url = URL.createObjectURL(file);
          addRef(url);
          selectUrl(url);
        }
      }
      // Experimental: accept drag and drop image link from another browser window.
      // https://stackoverflow.com/questions/11972963/accept-drag-drop-of-image-from-another-browser-window
      const url = e.dataTransfer.getData("URL");
      const imageExtensions = [".jpg", ".jpeg", ".png", ".gif", ".webp"];
      for (const ext of imageExtensions) {
        if (url.endsWith(ext)) {
          console.log("Dropping URL", url);
          addRef(url);
          selectUrl(url);
          break;
        }
      }
      setShow(false); // Hide dropzone after files are dropped.
    }
    // Prevent default needs to be on ALL drag/drop events to prevent browser from opening file.
    document.addEventListener("dragstart", handleDragStart);
    document.addEventListener("dragend", handleDragEnd);
    document.addEventListener("dragover", handleDragOver);
    document.addEventListener("drag", handleDrag);
    document.addEventListener("dragenter", handleDragEnter);
    document.addEventListener("dragleave", handleDragLeave);
    document.addEventListener("drop", handleDrop);
    return () => {
      document.removeEventListener("dragstart", handleDragStart);
      document.removeEventListener("dragend", handleDragEnd);
      document.removeEventListener("dragover", handleDragOver);
      document.removeEventListener("drag", handleDrag);
      document.removeEventListener("dragenter", handleDragEnter);
      document.removeEventListener("dragleave", handleDragLeave);
      document.removeEventListener("drop", handleDrop);
    };
  });

  if (!show) {
    return null;
  }
  return (
    <div className={styles.Drop}>
      <div className={styles.box1} />
      <div className={styles.box2} />
      <div className={styles.box3} />
    </div>
  );
}
