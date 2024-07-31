import React from "react";
import useRefStore from "@/stores/useRefStore";
import styles from "./UploadButton.module.css";

export default function UploadButton() {
  const addRef = useRefStore((state) => state.addRef);

  // Creates new RefImages, assumes no previously saved position or width.
  function handleChange(e: React.ChangeEvent<HTMLInputElement>): void {
    const files = Array.from(e.target.files || []);
    for (const file of files) {
      const url = URL.createObjectURL(file); // Create URL referencing file
      addRef(url);
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