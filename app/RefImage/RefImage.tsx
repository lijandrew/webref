/*
Left mouse button logic based on testing in PureRef.
Specifically referring to when cursor is on a RefImage.

mouseDown - "solo select if unselected"
  with shift:
    ignore
  on unselected
    solo select
  on selected
    nothing (don't interfere with drag)

mouseUp after click - "shift toggle select, else solo select"
  with shift
    toggle select
  on unselected
    impossible bc mouseDown will first select it
  on selected
    solo select

mouseUp after drag
  nothing for now until we implement selection box
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

  // See comment at top of file for mouse event logic
  function handleMouseDown(e: MouseEvent) {
    e.stopPropagation(); // Prevent propagating to Canvas
    if (e.button == 2) return; // Right mouse button is only for context menu
    if (contextMenuShown) {
      hideContextMenu();
    }
    lastMouseDownX.current = e.clientX;
    lastMouseDownY.current = e.clientY;
    if (e.shiftKey) return;
    if (!selectedUrls.has(url)) {
      clearSelection();
      selectUrl(url);
    }
  }

  // See comment at top of file for mouse event logic
  function handleMouseUp(e: React.MouseEvent) {
    e.stopPropagation(); // Prevent propagating to Rnd and Canvas
    if (e.button == 2) return; // Right mouse button is only for context menu
    // We are only concerned with mouseUp after a click, not drag
    if (
      e.clientX === lastMouseDownX.current &&
      e.clientY === lastMouseDownY.current
    ) {
      if (e.shiftKey) {
        if (selectedUrls.has(url)) {
          unselectUrl(url);
        } else {
          selectUrl(url);
        }
      } else {
        clearSelection();
        selectUrl(url);
      }
    }
  }

  function handleContextMenu(e: MouseEvent) {
    // TODO: Show different options than the canvas context menu (e.g. only show delete when right-clicking on an image)
    e.preventDefault();
    e.stopPropagation();
    showContextMenu(e.clientX, e.clientY);
  }

  function handleDrag(e: DraggableEvent, data: DraggableData) {
    for (const targetUrl of Array.from(selectedUrls)) {
      const refData = refMap.get(targetUrl);
      if (!refData) continue;
      refData.x += data.deltaX; // Move all selected images by same amount
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

  // On load, update store using img's numerical height to overwrite "auto"
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
      // Set position and size to stay in sync with store
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
