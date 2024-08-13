/*
RefImage.tsx

Component for a single reference image, draggable and resizable via react-rnd.
Pulls x, y, width, and height from the store on each render.
Pushes x, y, width, and height to the store on each drag or resize.

Uses specific mouseDown/mouseUp logic for intuitive select/deselect/drag:

mouseDown - "solo select if unselected"
  with shift:
    ignore (don't interfere with todo selection box)
  on selected
    ignore (don't interfere with drag)
  on unselected
    solo select

mouseUp after click - "shift toggle select, else solo select"
  with shift
    toggle select
  on selected
    solo select (to solo select something in a group selection) (technically re-performs mouseDown's "on unselected", but that's fine)
  on unselected
    solo select (technically impossible since mouseDown ensures mouseUp's target is selected)

mouseUp after drag
  nothing for now until we implement selection box
*/

import React, { useRef } from "react";
import { Rnd } from "react-rnd";
import useStore from "@/useStore";
import styles from "./RefImage.module.css";
import type { DraggableEvent } from "react-draggable";
import type { DraggableData } from "react-rnd";

type RefImageProps = {
  url: string;
};

export default function RefImage({ url }: RefImageProps) {
  const refMap = useStore((state) => state.refMap);
  const setRef = useStore((state) => state.setRef);
  const selectedUrls = useStore((state) => state.selectedUrls);
  const selectUrl = useStore((state) => state.selectUrl);
  const unselectUrl = useStore((state) => state.unselectUrl);
  const clearSelection = useStore((state) => state.clearSelection);
  const contextMenuShown = useStore((state) => state.contextMenuShown);
  const hideContextMenu = useStore((state) => state.hideContextMenu);
  const refData = useStore((state) => state.refMap.get(url));
  const refImageRnd = useRef<Rnd | null>(null);
  const img = useRef<HTMLImageElement | null>(null);
  const lastMouseDownX = useRef<number | null>(null);
  const lastMouseDownY = useRef<number | null>(null);
  const scale = useStore((state) => state.scale);

  // See comment at top of file for mouse event logic
  function handleMouseDown(e: MouseEvent) {
    e.stopPropagation(); // Prevent propagating to Canvas
    if (e.button !== 0) return;
    if (contextMenuShown) {
      hideContextMenu();
    }
    lastMouseDownX.current = e.clientX;
    lastMouseDownY.current = e.clientY;
    if (e.shiftKey) return;
    if (!selectedUrls.has(url)) {
      clearSelection();
      selectUrl(url, true);
    }
  }

  // See comment at top of file for mouse event logic
  function handleMouseUp(e: React.MouseEvent) {
    e.stopPropagation(); // Prevent propagating to Canvas
    if (e.button !== 0) return;
    if (
      e.clientX === lastMouseDownX.current &&
      e.clientY === lastMouseDownY.current
    ) {
      // We are only concerned with mouseUp after a click, not drag
      if (e.shiftKey) {
        if (selectedUrls.has(url)) {
          unselectUrl(url);
        } else {
          selectUrl(url, true);
        }
      } else {
        clearSelection();
        selectUrl(url, true);
      }
    }
  }

  // Push delta to all selected images
  function handleDrag(e: DraggableEvent, data: DraggableData) {
    for (const targetUrl of Array.from(selectedUrls)) {
      // Move all selected images by same amount
      const refData = refMap.get(targetUrl);
      if (!refData) continue;
      refData.x += data.deltaX;
      refData.y += data.deltaY;
      setRef(targetUrl, refData);
    }
  }

  // Push new size to store (also need to push new position for some reason)
  // TODO: Multi-selection resize?
  function handleResize() {
    if (!refImageRnd.current || !refData) return;
    const { x, y } = refImageRnd.current.getDraggablePosition();
    const { width, height } = refImageRnd.current.resizable.size;
    refData.x = x;
    refData.y = y;
    refData.width = width;
    refData.height = height;
    setRef(url, refData);
  }

  // On load, update store using img's numerical height to overwrite "auto" + shift half width and height back in order to center
  function handleImgLoad() {
    if (!img.current || !refData) return;
    setRef(url, {
      x: refData.x - img.current.width / 2,
      y: refData.y - img.current.height / 2,
      width: img.current.width,
      height: img.current.height,
    });
  }

  if (!refData) return null;
  return (
    <Rnd
      // Pull position and size from store at render to respond to indirect updates via the store.
      position={{ x: refData.x, y: refData.y }}
      size={{ width: refData.width, height: refData.height }}
      ref={refImageRnd}
      lockAspectRatio={true}
      onMouseDown={handleMouseDown}
      onDrag={handleDrag}
      onResize={handleResize}
      enableResizing={selectedUrls.has(url)}
      scale={scale}
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
        {selectedUrls.has(url) && (
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
