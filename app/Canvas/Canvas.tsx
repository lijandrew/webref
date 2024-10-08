/*
Canvas.tsx

On each render, creates a RefImage component for each image in refMap.
Handles mouse events for selection, context menu, and panning cursor style.
Sets up anvaka/panzoom to enable panning and zooming of the transformWrapper
and stores a reference to the panzoom instance in the store for use elsewhere.
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
  const selectUrl = useStore((state) => state.selectUrl);
  const contextMenuShown = useStore((state) => state.contextMenuShown);
  const showContextMenu = useStore((state) => state.showContextMenu);
  const hideContextMenu = useStore((state) => state.hideContextMenu);
  const setScale = useStore((state) => state.setScale);
  const setPanZoomInstance = useStore((state) => state.setPanZoomInstance);
  const getWorldPosition = useStore((state) => state.getWorldPosition);
  const canvas = useRef<HTMLDivElement>(null);
  const transformWrapper = useRef<HTMLDivElement>(null);
  const leftMouseDown = useRef(false);
  const [selecting, setSelecting] = useState(false);
  const [selectionStart, setSelectionStart] = useState({ x: 0, y: 0 });
  const [selectionEnd, setSelectionEnd] = useState({ x: 0, y: 0 });
  // Only for setting panning cursor style. Actual panning and zooming is handled by anvaka/panzoom
  const [panning, setPanning] = useState(false);

  function handleMouseDown(e: React.MouseEvent) {
    if (e.button === 0) {
      // LMB
      if (contextMenuShown) {
        hideContextMenu();
      }
      leftMouseDown.current = true;
      // Clear selection if not shift
      if (!e.shiftKey) {
        clearSelection();
      }
    } else if (e.button === 1) {
      // MMB
      setPanning(true);
    }
  }

  function handleMouseUp(e: React.MouseEvent) {
    if (e.button === 0) {
      // LMB release, end selection and calculate selected images
      setSelecting(false);
      leftMouseDown.current = false;
    } else if (e.button === 1) {
      // MMB
      setPanning(false);
    }
  }

  function handleMouseMove(e: React.MouseEvent) {
    if (leftMouseDown.current && !selecting) {
      // Only set "selecting" state after mouse has moved to differentiate from click
      setSelecting(true);
      setSelectionStart({ x: e.clientX, y: e.clientY });
      setSelectionEnd({ x: e.clientX, y: e.clientY });
    }
    if (selecting) {
      setSelectionEnd({ x: e.clientX, y: e.clientY });
      selectImagesInSelection(e.shiftKey);
    }
  }

  // Select images that are within the selection box, taking into account zoom and pan (converts screen coordinates to world coordinates)
  function selectImagesInSelection(shiftKey: boolean) {
    if (!shiftKey) {
      clearSelection();
    }
    // Start and end are in screen coordinates, convert to world coordinates
    const { x: x0, y: y0 } = getWorldPosition(
      selectionStart.x,
      selectionStart.y,
    );
    const { x: x1, y: y1 } = getWorldPosition(selectionEnd.x, selectionEnd.y);
    const x = Math.min(x0, x1);
    const y = Math.min(y0, y1);
    const width = Math.abs(x1 - x0); // Width and height must be calculated using converted coordinates to account for zoom
    const height = Math.abs(y1 - y0);
    for (const url of Array.from(refMap.keys())) {
      const refData = refMap.get(url);
      if (!refData) continue;
      if (
        refData.x + refData.width > x &&
        refData.x < x + width &&
        Number(refData.y) + Number(refData.height) > y &&
        refData.y < y + height
      ) {
        selectUrl(url, false); // Do not move selected images to top when drag selecting
      }
    }
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

  // This useEffect is for setting up panzoom
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
    setPanZoomInstance(panZoomInstance);
  }, [setScale, setPanZoomInstance]);

  return (
    <div
      ref={canvas}
      className={styles.Canvas}
      onMouseDown={handleMouseDown}
      onMouseUp={handleMouseUp}
      onMouseMove={handleMouseMove}
      onContextMenu={handleContextMenu}
    >
      <div ref={transformWrapper} className={styles.transformWrapper}>
        {createRefImageComponents()}
        <Splash />
        <Selection />
        {/* Splash and Selection need to scale and pan too, so they are also in transformWrapper */}
      </div>
      <div
        className={styles.selectionBox}
        style={{
          display: selecting ? "block" : "none",
          left: Math.min(selectionStart.x, selectionEnd.x),
          top: Math.min(selectionStart.y, selectionEnd.y),
          width: Math.abs(selectionEnd.x - selectionStart.x),
          height: Math.abs(selectionEnd.y - selectionStart.y),
        }}
      />
      <div
        // Covers the canvas with a transparent div to prevent child elements from receiving mouse events during certain operations
        className={styles.cover}
        style={{
          display: panning || selecting ? "block" : "none",
          cursor: panning ? "grabbing" : "crosshair",
        }}
      />
    </div>
  );
}
