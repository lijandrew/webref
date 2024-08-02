import React from "react";
import useStore from "@/useStore";
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
  const hideContextMenu = useStore((state) => state.hideContextMenu);
  function handleClick() {
    onClick();
    hideContextMenu();
  }
  return (
    <button
      className={`${styles.ContextMenuButton} ${disabled ? styles.disabled : ""}`}
      onClick={handleClick}
    >
      <span>{label}</span>
      <span className={styles.shortcut}>{shortcut}</span>
    </button>
  );
}

export default ContextMenuButton;
