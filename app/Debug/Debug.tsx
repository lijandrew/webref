import useRefStore from "@/stores/useRefStore";
import useSelectionStore from "@/stores/useSelectionStore";
import styles from "./Debug.module.css";

export default function Debug() {
  const refMap = useRefStore((state) => state.refMap);
  const selectedUrls = useSelectionStore((state) => state.selectedUrls);

  return (
    <div className={styles.Debug}>
      <button
        onClick={() => {
          console.log(refMap);
        }}
      >
        Log refMap
      </button>
      <button
        onClick={() => {
          console.log(selectedUrls);
        }}
      >
        Log selectedUrls
      </button>
    </div>
  );
}
