import React, { useRef } from "react";
import styles from "./RefImage.module.css";
import { Rnd } from "react-rnd";
import useStore from "./useStore";

type Props = {
  url: string;
  defaultX: number;
  defaultY: number;
  defaultWidth: number | string;
};

export default function RefImage({
  url,
  defaultX,
  defaultY,
  defaultWidth,
}: Props) {
  const selectedUrl = useStore((state) => state.selectedUrl);
  const setSelectedUrl = useStore((state) => state.setSelectedUrl);
  const showContextMenu = useStore((state) => state.showContextMenu);

  const rnd = useRef<Rnd | null>(null);
  const x = useRef(0);
  const y = useRef(0);
  const width = useRef(0);

  function handleDragStop() {
    // Surface position from Rnd
    if (!rnd.current) return;
    const coord = rnd.current.getDraggablePosition();
    x.current = coord.x;
    y.current = coord.y;
  }

  function handleResizeStop() {
    // Surface width from Rnd (height not needed b/c lockAspectRatio)
    if (!rnd.current) return;
    width.current = Number(rnd.current.resizable.state.width);
  }

  function handleMouseDown(e: MouseEvent) {
    e.stopPropagation(); // Prevent dragging from propagating to <Canvas />
    setSelectedUrl(url);
  }

  function handleContextMenu(e: MouseEvent) {
    // Show context menu when right-clicking on the image
    // TODO: Show different options than the canvas context menu
    e.preventDefault();
    e.stopPropagation();
    showContextMenu(e.clientX, e.clientY);
  }

  return (
    <Rnd
      ref={rnd}
      lockAspectRatio={true}
      onDragStop={handleDragStop}
      onResizeStop={handleResizeStop}
      onMouseDown={handleMouseDown}
      onContextMenu={handleContextMenu}
      default={{
        x: defaultX,
        y: defaultY,
        width: defaultWidth,
        height: "auto",
      }}
    >
      <div className={styles.RefImage}>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          draggable="false"
          src={url}
          className={`${styles.innerImg} ${selectedUrl == url ? styles.selected : ""}`}
          alt=""
        />
      </div>
    </Rnd>
  );
}
