import React, { useRef } from "react";
import styles from "./RefImage.module.css";
import { Rnd } from "react-rnd";

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
  const rnd = useRef<Rnd | null>(null);
  const x = useRef(0);
  const y = useRef(0);
  const width = useRef(0);
  const handleDragStop = () => {
    // Surface x, y from Rnd
    if (!rnd.current) return;
    const coord = rnd.current.getDraggablePosition();
    x.current = coord.x;
    y.current = coord.y;
  };
  const handleResizeStop = () => {
    // Surface width from Rnd (height not needed b/c lockAspectRatio)
    if (!rnd.current) return;
    width.current = Number(rnd.current.resizable.state.width);
  };
  return (
    <Rnd
      ref={rnd}
      lockAspectRatio={true}
      onDragStop={handleDragStop}
      onResizeStop={handleResizeStop}
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
