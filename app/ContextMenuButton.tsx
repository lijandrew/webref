import React from "react";
import styles from "./ContextMenuButton.module.css";

interface ContextMenuButtonProps {
  label: string;
  disabled: boolean;
  onClick: () => void;
}

function ContextMenuButton({
  label,
  disabled,
  onClick,
}: ContextMenuButtonProps) {
  return (
    <button
      className={`${styles.ContextMenuButton} ${disabled ? "disabled" : ""}`}
      onClick={onClick}
    >
      {label}
    </button>
  );
}

export default ContextMenuButton;
