import React, { useCallback, useState, useEffect } from "react";
import { useDropzone } from "react-dropzone";
import useStore from "./useStore";
import styles from "./Drop.module.css";

export default function Drop() {
  const addRef = useStore((state) => state.addRef);
  const [show, setShow] = useState(false);
  const onDrop = useCallback(
    (acceptedFiles: File[]) => {
      for (const file of acceptedFiles) {
        const url = URL.createObjectURL(file);
        addRef(url);
      }
      setShow(false); // Hide dropzone after files are dropped
    },
    [addRef],
  );
  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { "image/*": [] }, // Only accept image files
  });

  useEffect(() => {
    function handleDragEnter() {
      setShow(true); // Show dropzone only when files are dragged over window to not block pointer events when not needed.
    }
    document.addEventListener("dragenter", handleDragEnter);
    return () => {
      document.removeEventListener("dragenter", handleDragEnter);
    };
  });

  if (!show) {
    return null;
  }
  return (
    <div className={styles.Drop} {...getRootProps()}>
      <input {...getInputProps()} />
      {isDragActive ? (
        <p>Drop the files here ...</p>
      ) : (
        <p>Drag 'n' drop some files here, or click to select files</p>
      )}
    </div>
  );
}
