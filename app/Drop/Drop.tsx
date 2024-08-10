/*
Drop.tsx

An animated, fullscreen dropzone that accepts image files and URLs.
Uses strategies like:
- Only showing when files are dragged over window to not block pointer events when not needed
- Comparing dragenter and dragleave targets to prevent hiding dropzone when dragging over children
*/

import React, { useState, useEffect, useRef } from "react";
import useStore from "@/useStore";
import styles from "./Drop.module.css";

export default function Drop() {
  const addRef = useStore((state) => state.addRef);
  const clearSelection = useStore((state) => state.clearSelection);
  const selectUrl = useStore((state) => state.selectUrl);
  const mouseX = useStore((state) => state.mouseX);
  const mouseY = useStore((state) => state.mouseY);
  const [show, setShow] = useState(false);
  const eventTarget = useRef<EventTarget | null>(null);

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
      eventTarget.current = e.target;
      setShow(true);
    }
    // Hide dropzone when files are dragged out of window (i.e. cancel upload).
    function handleDragLeave(e: DragEvent) {
      e.preventDefault();
      if (!eventTarget.current || e.target === eventTarget.current) {
        // Only hide dropzone if the dragleave event is from the same target as dragenter
        // to prevent hiding dropzone when dragging over children such as RefImages.
        setShow(false);
      }
    }
    // Handle files dropped in window.
    function handleDrop(e: DragEvent) {
      e.preventDefault(); // Prevent browser from opening file.
      clearSelection();
      if (!e.dataTransfer) return;
      // I think e.dataTransfer.files is more reliable than e.dataTransfer.items.
      for (const file of Array.from(e.dataTransfer.files)) {
        if (file.type.startsWith("image/")) {
          console.log("Dropping image file");
          const url = URL.createObjectURL(file);
          addRef(url, mouseX, mouseY);
          selectUrl(url);
        }
      }
      // Experimental: accept drag and drop image link from another browser window.
      // https://stackoverflow.com/questions/11972963/accept-drag-drop-of-image-from-another-browser-window
      const url = e.dataTransfer.getData("URL");
      const imageExtensions = [".jpg", ".jpeg", ".png", ".gif", ".webp"];
      for (const ext of imageExtensions) {
        if (url.endsWith(ext)) {
          console.log("Dropping image URL");
          addRef(url, mouseX, mouseY);
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
  }, [addRef, clearSelection, selectUrl]);

  if (!show) {
    return null;
  }
  console.log("drop render");
  return (
    <div className={styles.Drop}>
      <div className={styles.cards}>
        <div className={styles.card1} />
        <div className={styles.card2} />
        <div className={styles.card3} />
        <div className={styles.card4} />
        <div className={styles.card5} />
      </div>
    </div>
  );
}
