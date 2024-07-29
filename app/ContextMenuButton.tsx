import React from "react";
import styles from "./ContextMenuButton.module.css";

interface ContextMenuButtonProps {
  label: string;
  shortcut?: string;
  disabled: boolean;
  onClick: () => void;
}

function ContextMenuButton({
  label,
  shortcut,
  disabled,
  onClick,
}: ContextMenuButtonProps) {
  return (
    <button
      className={`${styles.ContextMenuButton} ${disabled ? styles.disabled : ""}`}
      onClick={onClick}
    >
      <span>{label}</span>
      <span className={styles.shortcut}>{shortcut}</span>
    </button>
  );
}

export default ContextMenuButton;
