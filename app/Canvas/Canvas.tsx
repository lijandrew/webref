/*
Canvas.tsx

Renders all the RefImage components, handles mouse events on the canvas,
and manages zoom and pan of the canvas (via the transformWrapper).
*/

import React, { useState, useRef } from "react";
import useStore from "@/useStore";
import RefImage from "@/RefImage/RefImage";
import Splash from "@/Splash/Splash";
import Selection from "@/Selection/Selection";
import styles from "./Canvas.module.css";

export default function Canvas() {
  const refMap = useStore((state) => state.refMap);
  const clearSelection = useStore((state) => state.clearSelection);
  const contextMenuShown = useStore((state) => state.contextMenuShown);
  const showContextMenu = useStore((state) => state.showContextMenu);
  const hideContextMenu = useStore((state) => state.hideContextMenu);
  const scale = useStore((state) => state.scale);
  const setScale = useStore((state) => state.setScale);
  const [panning, setPanning] = useState(false);
  const [translateX, setTranslateX] = useState(0);
  const [translateY, setTranslateY] = useState(0);
  const canvas = useRef<HTMLDivElement>(null);

  function handleMouseDown(e: React.MouseEvent) {
    // Handles left and middle mouse down on canvas
    e.preventDefault();
    if (e.button === 0) {
      if (contextMenuShown) {
        hideContextMenu();
      }
      // Ignore if shift key is pressed (for multi-select)
      if (e.shiftKey) return;
      clearSelection();
    } else if (e.button === 1) {
      // Handle middle mouse down to prep for panning
      setPanning(true);
    }
  }

  function handleMiddleUp(e: React.MouseEvent) {
    if (e.button !== 1) return;
    e.preventDefault();
    e.stopPropagation();
    setPanning(false);
  }

  function handleMiddleMove(e: React.MouseEvent) {
    if (e.button !== 1) return;
    if (!canvas.current) return;
    e.preventDefault();
    e.stopPropagation();
    setTranslateX(translateX + e.movementX);
    setTranslateY(translateY + e.movementY);
  }

  function handleWheel(e: React.WheelEvent) {
    if (!canvas.current) return;
    const direction = e.deltaY > 0 ? 1 : -1;
    const minScale = 0.1;
    const newScale = Math.max(scale - direction * 0.1, minScale);
    setScale(newScale);
    // TODO: scale around mouse position by adjusting translateX and translateY
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

  return (
    <div
      ref={canvas}
      className={styles.Canvas}
      onMouseDown={handleMouseDown}
      onMouseMove={handleMiddleMove}
      onMouseUp={handleMiddleUp}
      onWheel={handleWheel}
      onContextMenu={handleContextMenu}
    >
      <div
        /*
        Zoom and pan are applied to transformWrapper, not the canvas directly.
        This is because, luckily, when outside of the transformWrapper, 
        RefImage and Selection's Rnds still work as expected yet get affected by the transform.
        This allows the canvas to remain fullscreen for other purposes (e.g. deselecting, context menu).
        This also lets us give transformWrapper no background, effectively simulating an infinite canvas.
        */
        style={{
          transform: `translate(${translateX}px, ${translateY}px) scale(${scale})`,
        }}
        className={styles.transformWrapper}
      >
        {createRefImageComponents()}
        <Splash />
        <Selection />
      </div>
      <div
        // Covers page to block all other pointer styles when middle mouse button held
        className={styles.panCover}
        style={{
          display: panning ? "block" : "none",
        }}
      />
    </div>
  );
}
