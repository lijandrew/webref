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
  const delRef = useStore((state) => state.delRef);

  const rnd = useRef<Rnd | null>(null);
  const x = useRef(0);
  const y = useRef(0);
  const width = useRef(0);

  function handleContextMenu(e: React.MouseEvent) {
    // Temporary delete functionality on right-click
    e.preventDefault();
    e.stopPropagation();
    URL.revokeObjectURL(url);
    delRef(url);
  }

  function handleDragStop() {
    // Surface x, y from Rnd
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

  return (
    <Rnd
      ref={rnd}
      lockAspectRatio={true}
      onDragStop={handleDragStop}
      onResizeStop={handleResizeStop}
      onContextMenu={handleContextMenu}
      default={{
        x: defaultX,
        y: defaultY,
        width: defaultWidth,
        height: "auto",
      }}
    >
      <div className={styles.RefImage}>
        <img draggable="false" src={url} />
      </div>
    </Rnd>
  );
}
