/*
Splash.tsx

Component for the splash screen, shown when no reference images are loaded.
Prompts the user to drag and drop images or click the browse button to add reference images.
*/

import React from "react";
import useStore from "@/useStore";
import styles from "./Splash.module.css";

export default function UploadButton() {
  const refMap = useStore((state) => state.refMap);
  const addRef = useStore((state) => state.addRef);
  const selectUrl = useStore((state) => state.selectUrl);
  const clearSelection = useStore((state) => state.clearSelection);
  const mouseX = useStore((state) => state.mouseX);
  const mouseY = useStore((state) => state.mouseY);

  // Creates new RefImages and selects them all.
  function handleChange(e: React.ChangeEvent<HTMLInputElement>): void {
    clearSelection();
    const files = Array.from(e.target.files || []);
    for (const file of files) {
      console.log("Opening image file");
      const url = URL.createObjectURL(file); // Create URL referencing file
      addRef(url, mouseX, mouseY);
      selectUrl(url);
    }
    e.target.value = ""; // Clear input value after adding the references
  }

  return (
    <label
      className={styles.Splash}
      style={{ display: refMap.size === 0 ? "block" : "none" }}
    >
      <input
        style={{ display: "none" }}
        onChange={handleChange}
        type="file"
        multiple
        accept="image/*"
      />
      <div className={styles.text}>
        Drag and drop images
        <br />
        from files or other websites
        <br />
        or
      </div>
      <div className={styles.button}>Browse</div>
    </label>
  );
}
