import useRefStore from "@/stores/useRefStore";
import useSelectionStore from "@/stores/useSelectionStore";
import styles from "./Debug.module.css";

export default function Debug() {
  const refMap = useRefStore((state) => state.refMap);
  const selectedUrl = useSelectionStore((state) => state.selectedUrl);

  return (
    <div className={styles.Debug}>
      <button
        onClick={() => {
          console.log(refMap);
          console.log(selectedUrl);
        }}
      >
        Log refMap
      </button>
    </div>
  );
}
