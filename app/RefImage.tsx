import React, { useRef } from "react";
import styles from "./RefImage.module.css";
import { Rnd } from "react-rnd";
import useStore from "./useStore";

type Props = {
  url: string;
};

export default function RefImage({ url }: Props) {
  const selectedUrl = useStore((state) => state.selectedUrl);
  const setSelectedUrl = useStore((state) => state.setSelectedUrl);
  const showContextMenu = useStore((state) => state.showContextMenu);
  const hideContextMenu = useStore((state) => state.hideContextMenu);
  const setRef = useStore((state) => state.setRef);
  const rnd = useRef<Rnd | null>(null);
  const img = useRef<HTMLImageElement | null>(null);
  const refData = useStore((state) => state.refMap.get(url));

  // Sync the position and size of the image with the store
  function syncRef() {
    if (!rnd.current || !refData) return;
    const { x, y } = rnd.current.getDraggablePosition();
    const { width, height } = rnd.current.resizable.size;
    setRef(url, {
      x,
      y,
      width,
      height,
    });
  }

  function handleMouseDown(e: MouseEvent) {
    e.stopPropagation(); // Prevent dragging from propagating to Canvas
    hideContextMenu();
    setSelectedUrl(url);
  }

  function handleContextMenu(e: MouseEvent) {
    // Aka handle right-click
    // TODO: Show different options than the canvas context menu (e.g. only show delete when right-clicking on an image)
    e.preventDefault();
    e.stopPropagation();
    showContextMenu(e.clientX, e.clientY);
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
      onDragStop={syncRef}
      onResizeStop={syncRef}
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
          className={`${styles.innerImg} ${selectedUrl == url ? styles.selected : ""}`}
          alt=""
        />
        {selectedUrl == url && (
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
