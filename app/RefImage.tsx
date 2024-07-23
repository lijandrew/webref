"use client";
import React, { useEffect, useRef, useState } from "react";
import styles from "./RefImage.module.css";
import { Rnd } from "react-rnd";

interface ImageProps {
  url: string;
}

export default function RefImage({ url }: ImageProps) {
  const handleContextMenu = (e: React.MouseEvent) => {
    console.log("context");
  };
  return (
    <Rnd lockAspectRatio={true}>
      <img draggable="false" src={url} />
    </Rnd>
  );
}
