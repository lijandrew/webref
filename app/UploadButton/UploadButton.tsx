import React from "react";
import useRefStore from "@/stores/useRefStore";
import useSelectionStore from "@/stores/useSelectionStore";
import styles from "./UploadButton.module.css";

export default function UploadButton() {
  const addRef = useRefStore((state) => state.addRef);
  const selectUrl = useSelectionStore((state) => state.selectUrl);
  const clearSelection = useSelectionStore((state) => state.clearSelection);

  // Creates new RefImages and selects them all.
  function handleChange(e: React.ChangeEvent<HTMLInputElement>): void {
    clearSelection();
    const files = Array.from(e.target.files || []);
    for (const file of files) {
      console.log("Uploading file", file);
      const url = URL.createObjectURL(file); // Create URL referencing file
      addRef(url);
      selectUrl(url);
    }
    e.target.value = ""; // Clear input value after adding the references
  }

  return (
    <input
      className={styles.UploadButton}
      onChange={handleChange}
      type="file"
      multiple
      accept="image/*"
    />
  );
}
