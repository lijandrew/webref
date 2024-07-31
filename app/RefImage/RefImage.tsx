import React, { useRef } from "react";
import { Rnd } from "react-rnd";
import useRefStore from "@/stores/useRefStore";
import useSelectionStore from "@/stores/useSelectionStore";
import useContextMenuStore from "@/stores/useContextMenuStore";
import styles from "./RefImage.module.css";
import type { RndDragEvent } from "react-rnd";

type Props = {
  url: string;
};

export default function RefImage({ url }: Props) {
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

  // Sync the position and size of the image with the store
  function syncRef() {
    if (!rnd.current || !refData) return;
    const { x, y } = rnd.current.getDraggablePosition();
    const { width, height } = rnd.current.resizable.size;
    // Only update store if there are changes
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
    e.stopPropagation(); // Prevent mousedown from propagating to Canvas
    // Right mouse button is handled by context menu.
    if (e.button == 2) return;
    if (e.shiftKey) {
      // Toggle selection if shift held
      if (selectedUrls.has(url)) {
        unselectUrl(url);
      } else {
        selectUrl(url);
      }
    } else {
      // Select only this if shift not held
      clearSelection();
      selectUrl(url);
    }
    if (contextMenuShown) {
      hideContextMenu();
    }
  }

  function handleContextMenu(e: MouseEvent) {
    // Aka handle right-click
    // TODO: Show different options than the canvas context menu (e.g. only show delete when right-clicking on an image)
    e.preventDefault();
    e.stopPropagation();
    showContextMenu(e.clientX, e.clientY);
  }

  function handleDrag(e: RndDragEvent) {
    console.log("drag", e);
  }

  function handleDragStop(e: RndDragEvent) {
    syncRef();
  }

  function handleResizeStop(e: MouseEvent | TouchEvent) {
    syncRef();
  }

  // Update component and store's RefData on image load to overwrite "auto" height with numerical height
  function handleImgLoad() {
    if (!img.current || !rnd.current || !refData) return;
    rnd.current.updateSize({
      width: img.current.width,
      height: img.current.height,
    });
    syncRef();
  }

  if (!refData) return null;
  return (
    <Rnd
      ref={rnd}
      lockAspectRatio={true}
      onDrag={handleDrag}
      onDragStop={handleDragStop}
      onResizeStop={handleResizeStop}
      onMouseDown={handleMouseDown}
      onContextMenu={handleContextMenu}
      default={{
        x: refData.x,
        y: refData.y,
        width: refData.width,
        height: refData.height,
      }}
    >
      <div className={styles.RefImage}>
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
