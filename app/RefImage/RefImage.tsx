/*
left mouse button logic
selection size <= 1:
  no shift:
    - mouseDown: select image only
    - mouseUp after click: nothing
    - drag: move image
    - mouseUp after drag: nothing
  shift:
    - mouseDown: nothing
    - mouseUp after click: toggle select image
    - drag: selection box
    - mouseUp after drag: nothing / end selection box
selection size > 1:
  no shift:
    - mouseDown: nothing
    - mouseUp after click: select image Only
    - drag: move all selected images
    - mouseUp after drag: nothing
  shift:
    - mouseDown: nothing
    - mouseUp after click: toggle select image
    - drag: move all selected images in locked axis
    - mouseUp after drag: nothing
*/
import React, { useRef } from "react";
import { Rnd } from "react-rnd";
import useRefStore from "@/stores/useRefStore";
import useSelectionStore from "@/stores/useSelectionStore";
import useContextMenuStore from "@/stores/useContextMenuStore";
import styles from "./RefImage.module.css";
import type { DraggableEvent } from "react-draggable";
import type { DraggableData } from "react-rnd";

type RefImageProps = {
  url: string;
};

export default function RefImage({ url }: RefImageProps) {
  const refMap = useRefStore((state) => state.refMap);
  const setRef = useRefStore((state) => state.setRef);
  const selectedUrls = useSelectionStore((state) => state.selectedUrls);
  const selectUrl = useSelectionStore((state) => state.selectUrl);
  const unselectUrl = useSelectionStore((state) => state.unselectUrl);
  const clearSelection = useSelectionStore((state) => state.clearSelection);
  const contextMenuShown = useContextMenuStore(
    (state) => state.contextMenuShown,
  );
  const showContextMenu = useContextMenuStore((state) => state.showContextMenu);
  const hideContextMenu = useContextMenuStore((state) => state.hideContextMenu);
  const refData = useRefStore((state) => state.refMap.get(url));
  const rnd = useRef<Rnd | null>(null);
  const img = useRef<HTMLImageElement | null>(null);
  const lastMouseDownX = useRef<number | null>(null);
  const lastMouseDownY = useRef<number | null>(null);

  // Sync the position and size of the image with the store
  function syncToStore() {
    if (!rnd.current || !refData) return;
    const { x, y } = rnd.current.getDraggablePosition();
    const { width, height } = rnd.current.resizable.size;
    // Only update store if there are changes to prevent infinite loop
    if (
      refData.x === x &&
      refData.y === y &&
      refData.width === width &&
      refData.height === height
    )
      return;
    setRef(url, {
      x,
      y,
      width,
      height,
    });
  }

  // Modify selection and hide context menu when clicking on RefImage
  // Use mouseDown instead of click to prevent deselection when dragging multiple images (click is triggered after mouseUp after drag)
  function handleMouseDown(e: MouseEvent) {
    e.stopPropagation(); // Prevent propagating to Canvas
    // Right mouse button is handled by context menu.
    if (e.button == 2) return;
    lastMouseDownX.current = e.clientX;
    lastMouseDownY.current = e.clientY;
    if (contextMenuShown) {
      hideContextMenu();
    }
  }

  // Do selection stuff ONLY on mouseUp so that we can check if it was a click or a drag.
  function handleMouseUp(e: React.MouseEvent) {
    e.stopPropagation(); // Prevent propagating to Rnd and Canvas
    // Right mouse button is handled by context menu.
    if (e.button == 2) return;
    if (
      e.clientX === lastMouseDownX.current &&
      e.clientY === lastMouseDownY.current
    ) {
      // This was a "click" (mouseDown and mouseUp at the same position).
      if (e.shiftKey) {
        // Toggle selection if shift held
        if (selectedUrls.has(url)) {
          unselectUrl(url);
        } else {
          selectUrl(url);
        }
      } else {
        clearSelection();
        selectUrl(url);
      }
    } else {
      // This was a drag (mouseDown and mouseUp at different positions)
    }
  }

  function handleContextMenu(e: MouseEvent) {
    // Aka handle right-click
    // TODO: Show different options than the canvas context menu (e.g. only show delete when right-clicking on an image)
    e.preventDefault();
    e.stopPropagation();
    showContextMenu(e.clientX, e.clientY);
  }

  // Also move all selected images by the same delta when dragging one
  function handleDrag(e: DraggableEvent, data: DraggableData) {
    // Move all the selected images
    for (const targetUrl of Array.from(selectedUrls)) {
      // if (targetUrl == url) continue;
      const refData = refMap.get(targetUrl);
      if (!refData) continue;
      refData.x += data.deltaX;
      refData.y += data.deltaY;
      setRef(targetUrl, refData);
    }
  }

  function handleDragStop() {
    syncToStore();
  }

  function handleResizeStop() {
    syncToStore();
  }

  // Force component to calculate its numerical height (instead of "auto") and sync it up to the store
  function handleImgLoad() {
    if (!img.current || !rnd.current || !refData) return;
    rnd.current.updateSize({
      width: img.current.width,
      height: img.current.height,
    });
    syncToStore();
  }

  if (!refData) return null;
  return (
    <Rnd
      // Set position and size directly instead of default to re-render on store change
      // (e.g. after indirect manipulation as part of a selection)
      position={{ x: refData.x, y: refData.y }}
      size={{ width: refData.width, height: refData.height }}
      ref={rnd}
      lockAspectRatio={true}
      onMouseDown={handleMouseDown}
      onDrag={handleDrag}
      onDragStop={handleDragStop}
      onResizeStop={handleResizeStop}
      onContextMenu={handleContextMenu}
    >
      {/* onMouseUp not supported by react-rnd so putting it in the inner div */}
      <div onMouseUp={handleMouseUp} className={styles.RefImage}>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          ref={img}
          onLoad={handleImgLoad}
          draggable="false"
          src={url}
          // Show outline when selected...
          className={`${styles.innerImg} ${selectedUrls.has(url) ? styles.selected : ""}`}
          alt=""
        />
        {/* ...but show handles only when only image selected */}
        {selectedUrls.has(url) && selectedUrls.size === 1 && (
          <React.Fragment>
            <div className={`${styles.handle} ${styles.handle1}`} />
            <div className={`${styles.handle} ${styles.handle2}`} />
            <div className={`${styles.handle} ${styles.handle3}`} />
            <div className={`${styles.handle} ${styles.handle4}`} />
            <div className={`${styles.smallHandle} ${styles.smallHandle1}`} />
            <div className={`${styles.smallHandle} ${styles.smallHandle2}`} />
            <div className={`${styles.smallHandle} ${styles.smallHandle3}`} />
            <div className={`${styles.smallHandle} ${styles.smallHandle4}`} />
          </React.Fragment>
        )}
      </div>
    </Rnd>
  );
}
