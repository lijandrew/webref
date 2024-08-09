/*
Canvas.tsx

On each render, creates a RefImage component for each image in refMap.
Uses anvaka/panzoom to enable panning and zooming of the transformWrapper.
Handles mouse events for selection, context menu, and panning cursor style.
*/

import React, { useState, useRef, useEffect } from "react";
import useStore from "@/useStore";
import RefImage from "@/RefImage/RefImage";
import Splash from "@/Splash/Splash";
import Selection from "@/Selection/Selection";
import styles from "./Canvas.module.css";
import createPanZoom, { PanZoom } from "panzoom";

export default function Canvas() {
  const refMap = useStore((state) => state.refMap);
  const clearSelection = useStore((state) => state.clearSelection);
  const contextMenuShown = useStore((state) => state.contextMenuShown);
  const showContextMenu = useStore((state) => state.showContextMenu);
  const hideContextMenu = useStore((state) => state.hideContextMenu);
  const setScale = useStore((state) => state.setScale);
  const canvas = useRef<HTMLDivElement>(null);
  const transformWrapper = useRef<HTMLDivElement>(null);
  // Only for setting panning cursor style. Actual panning and zooming is handled by anvaka/panzoom
  const [panning, setPanning] = useState(false);

  function handleMouseDown(e: React.MouseEvent) {
    // Handles left and middle mouse down on canvas
    if (e.button === 0) {
      if (contextMenuShown) {
        hideContextMenu();
      }
      // Ignore if shift key is pressed (for multi-select forgiveness)
      if (e.shiftKey) return;
      clearSelection();
    } else if (e.button === 1) {
      setPanning(true);
    }
  }

  function handleMiddleUp(e: React.MouseEvent) {
    if (e.button !== 1) return;
    setPanning(false);
  }

  function handleContextMenu(e: React.MouseEvent) {
    e.preventDefault();
    showContextMenu(e.clientX, e.clientY);
  }

  function createRefImageComponents() {
    const components = [];
    for (const url of Array.from(refMap.keys())) {
      components.push(<RefImage key={url} url={url} />);
    }
    return components;
  }

  useEffect(() => {
    // anvaka/panzoom
    // Apply to transformWrapper instead of canvas directly.
    // This keeps canvas fullscreen and clickable for context menu and deselect.
    // Rnd still works when OOB of transformWrapper, effectively allowing for infinite canvas.
    const panZoomInstance = createPanZoom(transformWrapper.current!, {
      zoomDoubleClickSpeed: 1, // Disable double click zoom
      smoothScroll: false, // Disable smoothing
      beforeMouseDown: function (e) {
        // Only pan on middle mouse button
        const shouldIgnore = e.button !== 1;
        return shouldIgnore;
      },
      filterKey: () => true, // Disable default keyboard interaction
      zoomSpeed: 0.2,
    });
    panZoomInstance.on("zoom", (e: PanZoom) => {
      setScale(e.getTransform().scale); // Update scale in store so Rnds compensate for zoom
    });
  }, [setScale]);

  return (
    <div
      ref={canvas}
      className={styles.Canvas}
      onMouseDown={handleMouseDown}
      onMouseUp={handleMiddleUp}
      onContextMenu={handleContextMenu}
    >
      <div ref={transformWrapper} className={styles.transformWrapper}>
        {createRefImageComponents()}
        <Splash />
        <Selection />
        {/* Splash and Selection need to scale and pan too, so they are also in transformWrapper */}
      </div>
      <div
        // When panning, cover page with fixed transparent div to prevent other elements from changing the pointer style
        className={styles.panCover}
        style={{
          display: panning ? "block" : "none",
        }}
      />
    </div>
  );
}
